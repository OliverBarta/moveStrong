

import './results.css'
import programData from '/Users/oliver/moveStrong/programs.json'

function Results({ cityFilter, priceFree, nonFreePrice, keyWord }) {

    const tagKeyWords = ["Strength", "Fall", "Balance", "Aerobic", "Social", "Bone health", "Senior", "Recovery", "Yoga", "Mindfulness", "Cycling", "Flexibility", "Mobility","Cardio","Dance"];
    const tagKeyWords2 = ["Cancer", "Alzheimer", "Osteoarthritis"];

    const cleanFeesText = (feeText) => {

        // keeps only numbers letters and /\$
        feeText = feeText.replace(/[^a-zA-Z0-9.-\s/$]/g, '');

        if (!feeText) return '';

        const lowerText = feeText.toLowerCase();
        const words = lowerText.split(' ');
        let timeFrame = '';

        if (lowerText.includes('per')) {
            const perIndex = words.indexOf('per');

            if (perIndex !== -1 && words[perIndex + 1]) {
                timeFrame = "/"+ words[perIndex + 1];
            }

            if (perIndex !== 0 && words[perIndex - 1]) {
                for (let i = 1; perIndex - i >= 0; i++) {
                    if (words[perIndex - i].includes("$")) {
                        return `${words[perIndex - i]}${timeFrame}`;
                    }
                }
            }
        }

        if (lowerText.includes('/')) {
            const slashIndex = words.indexOf('/');

            if (slashIndex !== -1 && words[slashIndex + 1]) {
                timeFrame = "/"+ words[slashIndex + 1];
            }

            if (slashIndex !== 0 && words[slashIndex - 1]) {
                for (let i = 1; slashIndex - i >= 0; i++) {
                    if (words[slashIndex - i].includes("$")) {
                        return `${words[slashIndex - i]}${timeFrame}`;
                    }
                }
            }
        }

        if (lowerText.includes('\\')) {
            const slashIndexTwo = words.indexOf('\\');

            if (slashIndexTwo !== -1 && words[slashIndexTwo + 1]) {
                timeFrame = "/"+ words[slashIndexTwo + 1];
            }

            if (slashIndexTwo !== 0 && words[slashIndexTwo - 1]) {
                for (let i = 1; slashIndexTwo - i >= 0; i++) {
                    if (words[slashIndexTwo - i].includes("$")) {
                        return `${words[slashIndexTwo - i]}${timeFrame}`;
                    }
                }
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

        return item.location.toLowerCase().includes(cityFilter.toLowerCase());

    });

    
    return (
        <>
            <div className='resultsArea'>
                {filteredPrograms.length > 0 ? (
                    filteredPrograms.map((item) => (
                        <a key={item.id} href={item.website || '#'} className="programListing" target="_blank" style={{marginBottom: '20px'}}>
                            <div className='organization'>{item.organizationName}</div>
                            <h3>{item.programName}</h3>
                            <p>{shortenDescription(item.description)}</p>
                            {item.location && <p className='city'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                <span>{item.location}</span>
                            </p>}
                            <p></p>
                            <div className='feesAndTagsArea'>
                                <p className='tagGreen' style={{display: item.fees.toLowerCase().includes('$') ? 'flex' : 'none'}}>{cleanFeesText(item.fees)}</p>
                                <div className='tagGreen' style={{display: item.fees.toLowerCase().includes('free') ? 'flex' : 'none'}}>$Free{item.fees === 'Free' ? '' : '?'}</div>
                                <div className='tagGreen' style={{display: item.fees.toLowerCase().includes('ohip') ? 'flex' : 'none'}}>$OHIP</div>
                                {tagKeyWords.map(wordK => (
                                    item.description.toLowerCase().includes(wordK.toLowerCase()) || item.programName.toLowerCase().includes(wordK.toLowerCase()) || item.tags.toString().toLowerCase().includes(wordK.toLowerCase()) && <div id={wordK} className='tagGray'>{wordK}</div>
                                ))}
                                {tagKeyWords2.map(wordK => (
                                    item.description.toLowerCase().includes(wordK.toLowerCase()) || item.programName.toLowerCase().includes(wordK.toLowerCase()) || item.tags.toString().toLowerCase().includes(wordK.toLowerCase()) && <div id={wordK} className='tagOrange'>{wordK}</div>
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