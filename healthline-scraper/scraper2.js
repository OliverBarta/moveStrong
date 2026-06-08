const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Extract the text that follows a label like "Fees:" inside an <li>
function extractField($, label) {
    let result = '';
    $('li').each((_, el) => {
        const text = $(el).text();
        const idx = text.indexOf(label);
        if (idx !== -1) {
            result = text.slice(idx + label.length).trim();
            return false; // break
        }
    });
    return result;
}

async function scrapeDeepHealthline() {
    const mainSearchUrl = 'https://www.wwhealthline.ca/search/SearchResult.aspx?p=0&q=Exercise';
    console.log(`📡 Connecting to: ${mainSearchUrl}`);

    try {
        const { data: mainHtml } = await axios.get(mainSearchUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        const $ = cheerio.load(mainHtml);
        const deepLinks = new Set();

        $('a[href*="displayService.aspx?id="]').each((_, el) => {
            let href = $(el).attr('href');
            if (!href) return;

            // ✅ Skip French-language mirror domain entirely
            if (href.includes('lignesanteww.ca')) return;

            if (href.startsWith('http')) {
                deepLinks.add(href);
            } else {
                if (href.startsWith('/')) href = href.substring(1);
                deepLinks.add(`https://www.wwhealthline.ca/search/${href}`);
            }
        });

        const linkArray = Array.from(deepLinks);
        console.log(`🔗 Found ${linkArray.length} unique English program links.\n`);

        const compiledPrograms = [];

        for (let i = 0; i < linkArray.length; i++) {
            const url = linkArray[i];
            console.log(`[${i + 1}/${linkArray.length}] Scraping: ${url}`);

            try {
                const { data: detailHtml } = await axios.get(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                });

                const $$ = cheerio.load(detailHtml);

                // ✅ Name from <title> — strip the site suffix
                const rawTitle = $$('title').text().trim();
                const programName = rawTitle.replace(/ - wwhealthline\.ca$/i, '').trim();

                // ✅ Org name from meta tag
                const orgName = $$('meta[name="organization"]').attr('content') || '';

                // ✅ All data fields live in <li> elements with a "Label: value" pattern
                const description = extractField($$, 'Service Description:');
                const cost        = extractField($$, 'Fees:');
                const eligibility = extractField($$, 'Eligibility / Target Population:');
                const phone       = extractField($$, 'Phone:');
                const address     = extractField($$, 'Address:');

                if (programName) {
                    compiledPrograms.push({
                        id: `hl-deep-waterloo-${i}`,
                        programName,
                        organizationName: orgName || programName,
                        city: 'Waterloo Region',
                        address: address.replace(/\s+/g, ' '),
                        description: description.replace(/\s+/g, ' '),
                        eligibility: eligibility.replace(/\s+/g, ' '),
                        cost: cost.toLowerCase().includes('free') ? 'Free' : (cost || 'Check Listing'),
                        phone: phone || 'N/A',
                        website: url
                    });
                }

                await delay(400);
            } catch (err) {
                console.error(`⚠️ Failed on: ${url} — ${err.message}`);
            }
        }

        if (compiledPrograms.length > 0) {
            fs.writeFileSync('programs_waterloo.json', JSON.stringify(compiledPrograms, null, 2), 'utf-8');
            console.log(`\n💾 Written to programs_waterloo.json`);
            console.log(`🎉 Total programs: ${compiledPrograms.length}`);
        } else {
            console.log('❌ Still 0 items — check network or selector logs above.');
        }

    } catch (error) {
        console.error(`❌ Main fetch failed: ${error.message}`);
    }
}

scrapeDeepHealthline();