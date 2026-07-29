import './results.css'
import programData from '/Users/oliver/projects/moveStrong/programs.json'
import { useState } from 'react';

// a function that returns the description, making it shortened or expanded if they click one of the two buttons
function DescriptionItem({ item, shortenDescription, expandedIDs, setExpandedIDs }) {

    // if the description should be expanded (not be cut off after 21 words)
    const expanded = expandedIDs.includes(item.id);

    // if the description is too small for the need for the more or less buttons
    const smallDescription = item.description.split(" ").length < 21;

    return (
        <p id={item.id+"d"}>{expanded ? shortenDescription(item.description, 1000) : shortenDescription(item.description, 21)}

            {(!expanded && !smallDescription) &&
                <button className='showMoreButton' onClick={() => setExpandedIDs(expandedIDs => [...expandedIDs,item.id])}>show more</button>
            }
            {(expanded && !smallDescription) &&
                <button className='showMoreButton' onClick={() => setExpandedIDs(expandedIDs => expandedIDs.filter(id => id !== item.id))}>show less</button>
            }
        </p>
    )
}

function Results({ cityFilter, priceFree, nonFreePrice, keyWord }) {

    const tagKeyWordsGrey = ["Strength", "Fall", "Balance", "Aerobic", "Social", "Bone health", "Senior", "Recovery", "Yoga", "Mindfulness", "Cycling", "Flexibility", "Mobility","Cardio","Dance", "Low impact"];
    const tagKeyWordsOrange = ["Cancer", "Alzheimer", "Osteoarthritis","Parkinson's","Dementia","Cardiac"];
    
    const [expandedIDs, setExpandedIDs] = useState([]);

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

    const shortenDescription = (text, maxWords) => {
        if (!text) return '';

        const words = text.split(' ');

        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '... ';
        }

        return text+" ";
    };

    const filteredPrograms = programData.filter((item) => {

        const matchesKeyword = keyWord === '' ||
            item.description?.toLowerCase().includes(keyWord.toLowerCase()) || 
            item.programName?.toLowerCase().includes(keyWord.toLowerCase());

        const feesString = item.fees ? String(item.fees).toLowerCase() : "";
        const isFree = feesString.includes("free");

        if (!priceFree && isFree) return false;
        if (!nonFreePrice && !isFree) return false;
        
        const matchesCity = cityFilter.trim() === '' ||
            item.city?.toLowerCase().includes(cityFilter.toLowerCase()) || 
            item.city === "GoodLife";

        return matchesKeyword && matchesCity;

    });

    
    return (
        <>
            <div className='resultsArea'>
                {filteredPrograms.length > 0 ? (
                    filteredPrograms.map((item) => (
                        <div key={item.id} className="programListing" target="_blank" style={{marginBottom: '20px'}}>
                            <div className='organization'>{item.organizationName}</div>
                            <h3>{item.programName}</h3>
                            <DescriptionItem item={item} shortenDescription={shortenDescription} expandedIDs={expandedIDs} setExpandedIDs={setExpandedIDs}/>
                            <div className='cityAndOthersRow'>
                                {item.city && <div className='city'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    <span>{item.city}</span>
                                </div>}
                                {item.language && (
                                    <div className='language'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            {/* Rectangular comic speech bubble with a tail */}
                                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"/>
                                        </svg>
                                        <span>{item.language.replaceAll(" * ", ", ")}</span>
                                    </div>
                                )}
                                {item.website && (
                                    <div className='language'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.3.79 2.5 1.38 3.56A8.03 8.03 0 0 1 5.08 16zm2.95-8H5.08a8.03 8.03 0 0 1 3.86-3.56c-.59 1.06-1.06 2.26-1.38 3.56zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.59-1.06 1.06-2.26 1.38-3.56h2.95a8.03 8.03 0 0 1-3.86 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                                        </svg>
                                        <a href={item.website || '#'} target="_blank">Website</a>
                                    </div>
                                )}
                            </div>
                            <div className='feesAndTagsArea'>
                                <p className='tagGreen' style={{display: item.fees.toLowerCase().includes('$') ? 'flex' : 'none'}}>{cleanFeesText(item.fees)}</p>
                                <div className='tagGreen' style={{display: item.fees.toLowerCase().includes('free') ? 'flex' : 'none'}}>$Free{item.fees === 'Free' ? '' : '?'}</div>
                                <div className='tagGreen' style={{display: item.city.toLowerCase().includes('goodlife') ? 'flex' : 'none'}}>$GoodLife</div>
                                <div className='tagGreen' style={{display: item.fees.toLowerCase().includes('ohip') ? 'flex' : 'none'}}>$OHIP</div>
                                {tagKeyWordsGrey.map(wordK => (
                                    (item.description.toLowerCase().includes(wordK.toLowerCase()) || item.programName.toLowerCase().includes(wordK.toLowerCase()) || item.tags.toString().toLowerCase().includes(wordK.toLowerCase())) && <div id={wordK} className='tagGray'>{wordK}</div>
                                ))}
                                {tagKeyWordsOrange.map(wordK => (
                                    (item.description.toLowerCase().includes(wordK.toLowerCase()) || item.programName.toLowerCase().includes(wordK.toLowerCase()) || item.tags.toString().toLowerCase().includes(wordK.toLowerCase())) && <div id={wordK} className='tagOrange'>{wordK}</div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No programs found</p>
                )}
            </div>
        </>
    )
}

export default Results