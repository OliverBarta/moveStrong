import './FindPrograms.css'
import Results from './Results'
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function FindPrograms() {
    const [filterIsOpen, setFilterIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [cityInput, setCityInput] = useState('');
    const [priceFree, setPriceFree] = useState(true);
    const [nonFreePrice, setNonFreePrice] = useState(true);
    const [keyWord, setKeyWord] = useState('');

    const toggleFilterMenu = () => {
        setFilterIsOpen(!filterIsOpen);
    };


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const cityFromUrl = queryParams.get('city');
        
        if (cityFromUrl) {
            setCityInput(cityFromUrl);
        }
    }, [location.search]);
    
    // Checks for resized windows
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, []);

    useEffect(() => {
        document.getElementById('root').classList.add('full');
        return () => document.getElementById('root').classList.remove('full');
    }, []);

    // should only show the pop up filter screen if the screen is small and filter is open
    const shouldShowFilter = filterIsOpen && isMobile;

    return (
        <div className='outsideArea'>
            <div className='filtersArea'>
                <input type="text" placeholder="Enter city" autoComplete="off" className='searchBar'
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                />
                <h2>Keyword:</h2>
                <input type="text" placeholder="Enter keyword (e.g fall, strength)" autoComplete="off" className='searchBar'
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.target.value)}
                />
                <h2>Price: </h2>
                <div className='oneFilter'>
                    <input type='checkbox' checked={priceFree} onChange={(e) => setPriceFree(e.target.checked)}/>
                    <p>Free</p>
                </div>
                <div className='oneFilter'>
                    <input type='checkbox' checked={nonFreePrice} onChange={(e) => setNonFreePrice(e.target.checked)}/>
                    <p>Other</p>
                </div>
            </div>
            <div className='filtersAreaPop' style={{display: shouldShowFilter ? 'flex' : 'none'}}>
                <button className='applyFilters' onClick={toggleFilterMenu}>Apply Filters</button>
                <input type="text" placeholder="Enter city" autoComplete="off" className='searchBar'
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                />
                <h2>Keyword:</h2>
                <input type="text" placeholder="Enter keyword (e.g fall, strength)" autoComplete="off" className='searchBar'
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.target.value)}
                />
                
                <h2>Price: </h2>
                <div className='oneFilter'>
                    <input type='checkbox' checked={priceFree} onChange={(e) => setPriceFree(e.target.checked)}/>
                    <p>Free</p>
                </div>
                <div className='oneFilter'>
                    <input type='checkbox' checked={nonFreePrice} onChange={(e) => setNonFreePrice(e.target.checked)}/>
                    <p>Other</p>
                </div>
            </div>
            <div className='mainArea'>
                    <h1>Find Programs</h1>
                    <button className='filtersToggle' onClick={toggleFilterMenu}>Filters</button>
                    <Results cityFilter={cityInput} priceFree={priceFree} nonFreePrice={nonFreePrice} keyWord={keyWord}/>
            </div>
        </div>
    )
}

export default FindPrograms