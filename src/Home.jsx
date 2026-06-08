import './Home.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [city, setCity] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            navigate(`/moveStrong/findprograms?city=${encodeURIComponent(city.trim())}`);
        }
    };

    return (
        <>
            <div className='bubbleText'>For older adults across Ontario</div>
            <div style={{ padding: '20px' }} className='centeredArea'>
                <h1>Find an exercise program that's right for you.</h1>
                <p>Search community classes, virtual coaching, and disease-specific programs — filtered by your city, your goals, and your budget.</p>
                <p></p>
                <form onSubmit={handleSubmit} className={`searchDivBig ${city.length > 0 ? 'active' : ''}`}>
                    <input type="text" placeholder="Enter city" autoComplete="off" className='searchBar'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button className='buttonSearch'>Search</button>
                </form>

            </div>
            <div style={{padding: '0px 20px'}}>
                <div className='whiteBoxArea'>
                    <div className='whiteBox'>
                        <h3>STEP 1</h3>
                        <h2>Tell us where you live</h2>
                        <p>Your city or town — or search Ontario-wide for virtual programs.</p>
                    </div>
                    <div className='whiteBox'>
                        <h3>STEP 2</h3>
                        <h2>Share what matters to you</h2>
                        <p>Your goals, any health conditions, language, cost, and accessibility needs.</p>
                    </div>
                    <div className='whiteBox'>
                        <h3>STEP 3</h3>
                        <h2>Find the right fit</h2>
                        <p>Compare programs side by side, with full details and contact info.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home