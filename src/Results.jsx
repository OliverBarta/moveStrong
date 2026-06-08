

import './results.css'
import programData from '/Users/oliver/moveStrong/programs.json'

function Results({ cityFilter, priceFree, nonFreePrice }) {

    const shortenDescription = (text, maxWords = 21) => {
        if (!text) return '';

        const words = text.split(' ');

        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }

        return text;
    };

    const filteredPrograms = programData.filter((item) => {

        if (cityFilter.trim() === '' && priceFree && nonFreePrice) return true;
        if (!priceFree && item.fees === 'Free') {
            return false;
        }
        if (!nonFreePrice && item.fees !== 'Free') {
            return false;
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
                            <p><strong>Fees: </strong>{item.fees}</p>
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