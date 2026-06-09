const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

url = 'https://www.goodlifefitness.com/classes.html';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrape(url) {
    
    const { data: detailHtml } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const $ = cheerio.load(detailHtml);

    console.log($.text().trim());
}

scrape(url);