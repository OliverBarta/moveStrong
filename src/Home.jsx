import './Home.css'

function Home() {
    return (
        <>
            <div className='bubbleText'>For older adults across Ontario</div>
            <h1>Find an exercise program that's right for you.</h1>
            <div style={{ padding: '20px' }} className='centeredArea'>
                <p>Search community classes, virtual coaching, and disease-specific programs — filtered by your city, your goals, and your budget.</p>
                <h1>search will go here</h1>

                

            </div>

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
        </>
    )
}

export default Home