const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function extractAddress($$) {
    const span = $$('#ctl00_ContentPlaceHolder1_lblAddress');
    if (!span.length) return { street: '', city: '', province: '', postalCode: '' };

    // Replace <br> tags with a newline, then grab the text
    span.find('br').replaceWith('\n');
    const lines = span.text().split('\n').map(l => l.trim()).filter(Boolean);

    // Lines come in order

    const street     = lines[lines.length-3] || '';
    const cityProv   = lines[lines.length-2] ? lines[lines.length-2].split(',') : [];
    const city       = cityProv[0]?.trim() || '';
    const province   = cityProv[1]?.trim() || '';
    const postalCode = lines[lines.length-1] || '';

    return { street, city, province, postalCode };
}

function extractDescription($$) {
    const label = $$('#ctl00_ContentPlaceHolder1_lblDescription');
    if (!label.length) return '';

    // Grab the label span AND everything after it until the next label
    const container = label.parent();
    
    // Get all content after the label span
    let text = '';
    label.nextAll().each((_, el) => {
        const node = $$(el);
        // Stop if we've hit another field label
        if ($$(el).attr('id') && $$(el).attr('id').includes('lbl') && el !== label[0]) return false;
        
        node.find('br').replaceWith('\n');
        node.find('li').each((_, li) => {
            $$(li).replaceWith(`• ${$$(li).text().trim()}\n`);
        });
        text += node.text() + '\n';
    });

    return text
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .join('\n');
}

async function getAllLinks(query) {
    const deepLinks = new Set();
    let page = 0;
    let totalPages = null;

    while (true) {
        const url = `https://www.wwhealthline.ca/search/SearchResult.aspx?q=${encodeURIComponent(query)}&f=&p=${page}`;
        console.log(`📄 Fetching page ${page + 1}${totalPages ? ' of ' + totalPages : ''}: ${url}`);

        const { data: html } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        const $ = cheerio.load(html);

        if (totalPages === null) {
            const summaryText = $('body').text();
            const match = summaryText.match(/of about ([\d,]+) for/);
            if (match) {
                const total = parseInt(match[1].replace(',', ''), 10);
                totalPages = Math.ceil(total / 10);
                console.log(`🔢 Found ~${total} results across ${totalPages} pages\n`);
            }
        }

        let found = 0;
        $('a[href*="displayService.aspx?id="]').each((_, el) => {
            let href = $(el).attr('href');
            if (!href || href.includes('lignesanteww.ca')) return;
            if (!href.startsWith('http')) {
                href = `https://www.wwhealthline.ca/${href.replace(/^\//, '')}`;
            }
            if (!deepLinks.has(href)) {
                deepLinks.add(href);
                found++;
            }
        });

        console.log(`   ↳ ${found} new links (${deepLinks.size} total so far)`);

        if (totalPages !== null && page >= totalPages - 1) break;
        if (found === 0 && page > 0) {
            console.log('   ↳ No new links found, stopping.');
            break;
        }

        page++;
        await delay(300);
    }

    return Array.from(deepLinks);
}

async function scrapeProgram(url, index) {
    const { data: detailHtml } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const $$ = cheerio.load(detailHtml);

    const rawTitle = $$('title').text().trim();
    const programName = rawTitle.replace(/ - wwhealthline\.ca$/i, '').trim();
    const orgName = $$('meta[name="organization"]').attr('content') || '';

    const { street, city, province, postalCode } = extractAddress($$);

    const description = extractDescription($$);

    const email = $$('#ctl00_ContentPlaceHolder1_lnkEmail').text().trim() || 'N/A';
    const fees = $$('#ctl00_ContentPlaceHolder1_lblFees').text().trim() || 'N/A';
    const website = $$('#ctl00_ContentPlaceHolder1_lnkUrl').attr('href') || 'N/A';
    const eligibility = $$('#ctl00_ContentPlaceHolder1_lblEligibility').text().trim() || 'N/A';
    const phone = $$('#ctl00_ContentPlaceHolder1_lblOfficePhone').text().trim() || 'N/A';
    const areaServed  = $$('#ctl00_ContentPlaceHolder1_lblAreasServed').text().trim() || 'N/A';

    if (!programName) return null;

    return {
        id: `hl-waterloo-${index}`,
        programName,
        organizationName: orgName || programName,
        street,
        city,
        province,
        postalCode,
        areaServed,
        description: description.replace(/\s+/g, ' '),
        eligibility: eligibility.replace(/\s+/g, ' '),
        fees,
        phone,
        email,
        infosourceurl: url,
        website
    };
}

async function scrapeDeepHealthline() {
    try {
        const linkArray = await getAllLinks('Exercise programs');
        console.log(`\n ${linkArray.length} unique links collected. Starting detail scrape...\n`);

        const compiledPrograms = [];

        for (let i = 0; i < linkArray.length; i++) {
            const url = linkArray[i];
            process.stdout.write(`[${i + 1}/${linkArray.length}] ${url} ... `);

            try {
                const program = await scrapeProgram(url, i);
                if (program) {
                    compiledPrograms.push(program);
                    process.stdout.write(`✅ ${program.programName} (${program.city || 'no city'})\n`);
                } else {
                    process.stdout.write(`⚠️  No name, skipped\n`);
                }
            } catch (err) {
                process.stdout.write(`❌ ${err.message}\n`);
            }

            if ((i + 1) % 25 === 0) {
                fs.writeFileSync('programs_checkpoint.json', JSON.stringify(compiledPrograms, null, 2));
                console.log(`Checkpoint: ${compiledPrograms.length} saved`);
            }

            await delay(400);
        }

        if (compiledPrograms.length > 0) {
            fs.writeFileSync('programs_waterloo.json', JSON.stringify(compiledPrograms, null, 2), 'utf-8');
            console.log(`\n Written to programs_waterloo.json`);
            console.log(`🎉 Total: ${compiledPrograms.length} programs`);
        } else {
            console.log('0 programs scraped.');
        }

    } catch (error) {
        console.error(`Fatal: ${error.message}`);
    }
}

scrapeDeepHealthline();