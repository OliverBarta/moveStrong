const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function extractField($, label) {
    let result = '';
    $('li').each((_, el) => {
        const text = $(el).text();
        const idx = text.indexOf(label);
        if (idx !== -1) {
            result = text.slice(idx + label.length).trim();
            return false;
        }
    });
    return result;
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

        // ✅ Parse total result count on first page to calculate page count
        if (totalPages === null) {
            const summaryText = $('body').text();
            const match = summaryText.match(/of about ([\d,]+) for/);
            if (match) {
                const total = parseInt(match[1].replace(',', ''), 10);
                totalPages = Math.ceil(total / 10);
                console.log(`🔢 Found ~${total} results across ${totalPages} pages\n`);
            }
        }

        // Collect English links from this page
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

        // ✅ Stop when we've hit the last page
        if (totalPages !== null && page >= totalPages - 1) break;

        // ✅ Safety: also stop if no links found on a page (avoids infinite loop)
        if (found === 0 && page > 0) {
            console.log('   ↳ No new links found, stopping pagination.');
            break;
        }

        page++;
        await delay(300); // be polite to the server between page fetches
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
    const description = extractField($$, 'Service Description:');
    const cost        = extractField($$, 'Fees:');
    const eligibility = extractField($$, 'Eligibility / Target Population:');
    const phone       = extractField($$, 'Phone:');
    const address     = extractField($$, 'Address:');

    if (!programName) return null;

    return {
        id: `hl-waterloo-${index}`,
        programName,
        organizationName: orgName || programName,
        city: 'Waterloo Region',
        address: address.replace(/\s+/g, ' '),
        description: description.replace(/\s+/g, ' '),
        eligibility: eligibility.replace(/\s+/g, ' '),
        cost: cost.toLowerCase().includes('free') ? 'Free' : (cost || 'Check Listing'),
        phone: phone || 'N/A',
        website: url
    };
}

async function scrapeDeepHealthline() {
    try {
        // Phase 1: collect all links across all pages
        const linkArray = await getAllLinks('Exercise');
        console.log(`\n🔗 ${linkArray.length} unique program links collected. Starting detail scrape...\n`);

        const compiledPrograms = [];

        // Phase 2: scrape each detail page
        for (let i = 0; i < linkArray.length; i++) {
            const url = linkArray[i];
            process.stdout.write(`[${i + 1}/${linkArray.length}] ${url} ... `);

            try {
                const program = await scrapeProgram(url, i);
                if (program) {
                    compiledPrograms.push(program);
                    process.stdout.write(`✅ ${program.programName}\n`);
                } else {
                    process.stdout.write(`⚠️ No name found, skipped\n`);
                }
            } catch (err) {
                process.stdout.write(`❌ ${err.message}\n`);
            }

            // ✅ Write a checkpoint every 25 programs so you don't lose data if it crashes
            if ((i + 1) % 25 === 0) {
                fs.writeFileSync('programs_waterloo_checkpoint.json', JSON.stringify(compiledPrograms, null, 2));
                console.log(`   💾 Checkpoint saved (${compiledPrograms.length} so far)`);
            }

            await delay(400);
        }

        // Final write
        if (compiledPrograms.length > 0) {
            fs.writeFileSync('programs_waterloo.json', JSON.stringify(compiledPrograms, null, 2), 'utf-8');
            console.log(`\n💾 Written to programs_waterloo.json`);
            console.log(`🎉 Total programs scraped: ${compiledPrograms.length}`);
        } else {
            console.log('❌ 0 programs scraped.');
        }

    } catch (error) {
        console.error(`❌ Fatal error: ${error.message}`);
    }
}

scrapeDeepHealthline();