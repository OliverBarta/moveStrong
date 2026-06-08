import './About.css'

function About() {
    return (
        <>
            <div style={{ padding: '20px' }} className='centeredArea'>

                <h1>About this project</h1>
                <p>
                Falls are the leading cause of injury-related hospitalization for older Canadians — and most of them are preventable. Exercise works. The barrier is finding the right program.
                </p>
                <h2>The problem</h2>
                <p>Most physicians know that strength and balance training prevents falls — but they rarely refer patients to community programs. Why? Because keeping track of what's available, where, for whom, and at what cost is genuinely difficult.</p>
                <p>Meanwhile, excellent free and low-cost programs exist across Ontario — at the YMCA, through VON SMART, Community Support Connections, Ontario Health (North), and from Registered Kinesiologists in private practice. They just aren't easy to find in one place.</p>
                <h2>What we're building</h2>
                <p>ActiveAging Ontario is a curated, searchable directory of exercise programs for middle-aged and older adults across the province. Filter by your city, your goals, your health conditions, your budget, and your accessibility needs — and see programs side by side with the information you actually need.</p>
                <p></p>
                <h2>For three audiences</h2>
                <div className='whiteBoxArea'>
                    <div className='whiteBox'>
                        <h3>Older adults</h3>
                        <p>Find a program that fits your life.</p>
                    </div>
                    <div className='whiteBox'>
                        <h3>Clinicians</h3>
                        <p>Refer with confidence.</p>
                    </div>
                    <div className='whiteBox'>
                        <h3>Caregivers</h3>
                        <p>Help someone you love stay active.</p>
                    </div>
                </div>
                <h2>A note on accuracy</h2>
                <p>We do our best to keep listings current, but program details (schedules, fees, instructors) change. Always confirm directly with the organization before registering. If you spot something out of date, let us know.</p>

            </div>
        </>
    )
}

export default About