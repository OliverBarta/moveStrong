

import './results.css'
import programData from '/Users/oliver/moveStrong/programs.json'

function Results({ cityFilter, priceFree, nonFreePrice, keyWord }) {

    const tagKeyWords = ["Strength", "Fall", "Balance", "Aerobic", "Social", "Bone health", "Senior"];

    const cleanFeesText = (feeText) => {
        console.log(feeText);
        if (!feeText) return '';

        let numbersAndSymbols = '';
        const lowerText = feeText.toLowerCase();
        const words = lowerText.split(' ');
        let timeFrame = '';

        if (lowerText.includes('per')) {
            const perIndex = words.indexOf('per');

            if (perIndex !== -1 && words[perIndex + 1]) {
                timeFrame = " per "+ words[perIndex + 1];
            }

            if (perIndex !== 0 && words[perIndex - 1]) {
                numbersAndSymbols = words[perIndex -1];

                return `${numbersAndSymbols}${timeFrame}`;
            }
        }

        if (lowerText.includes('/')) {
            const slashIndex = words.indexOf('/');

            if (slashIndex !== -1 && words[slashIndex + 1]) {
                timeFrame = " per "+ words[slashIndex + 1];
            }

            if (slashIndex !== 0 && words[slashIndex - 1]) {
                numbersAndSymbols = words[slashIndex -1];

                return `${numbersAndSymbols}${timeFrame}`;
            }
        }

        if (lowerText.includes('\\')) {
            const slashIndexTwo = words.indexOf('\\');

            if (slashIndexTwo !== -1 && words[slashIndexTwo + 1]) {
                timeFrame = " per "+ words[slashIndexTwo + 1];
            }

            if (slashIndexTwo !== 0 && words[slashIndexTwo - 1]) {
                numbersAndSymbols = words[slashIndexTwo -1];

                return `${numbersAndSymbols}${timeFrame}`;
            }
        }

        let matches = lowerText.match(/\$\S+/g);

        if (matches && matches[0]) return matches[0];
        else return feeText;
        
    };

    const shortenDescription = (text, maxWords = 21) => {
        if (!text) return '';

        const words = text.split(' ');

        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }

        return text;
    };

    const filteredPrograms = programData.filter((item) => {

        if (cityFilter.trim() === '' && priceFree && nonFreePrice && keyWord === '') return true;
        if (!priceFree && item.fees === 'Free') {
            return false;
        }
        if (!nonFreePrice && item.fees !== 'Free') {
            return false;
        }

        if (keyWord !== '') {
            if (!item.description.toLowerCase().includes(keyWord.toLowerCase()) && !item.programName.toLowerCase().includes(keyWord.toLowerCase())) {
                return false;
            }
        }

        return item.city.toLowerCase().includes(cityFilter.toLowerCase());

    });

    
    return (
        <>
            <div className='resultsArea'>
                {filteredPrograms.length > 0 ? (
                    filteredPrograms.map((item) => (
                        <a key={item.id} href={item.website || '#'} className="programListing" style={{marginBottom: '20px'}}>
                            <h3>{item.programName}</h3>
                            <p><strong>City:</strong> {item.city}</p>
                            <p>{shortenDescription(item.description)}</p>
                            <p></p>
                            <div className='feesAndTagsArea'>
                                <p style={{marginRight: 'auto', display: item.fees.toLowerCase().includes('$') ? 'flex' : 'none'}}><strong>Price: </strong> {cleanFeesText(item.fees)}</p>
                                <div className='tagGreen' style={{display: item.fees.toLowerCase().includes('free') ? 'flex' : 'none'}}>$Free{item.fees === 'Free' ? '' : '?'}</div>
                                <div className='tagGreen' style={{display: item.fees.toLowerCase().includes('ohip') ? 'flex' : 'none'}}>$OHIP</div>
                                {tagKeyWords.map(wordK => (
                                    item.description.toLowerCase().includes(wordK.toLowerCase()) || item.programName.toLowerCase().includes(wordK.toLowerCase()) && <div id={wordK} className='tagGray'>{wordK}</div>
                                ))}
                            </div>
                        </a>
                    ))
                ) : (
                    <p className="no-results">No programs found</p>
                )}
            </div>
        </>
    )
}

export default Results