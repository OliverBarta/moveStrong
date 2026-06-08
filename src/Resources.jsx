import './Resources.css'
import programData from '/Users/oliver/moveStrong/programs.json'

function Resources() {

    const healthLineCount = programData.filter(item => item.healthlineurl.includes("healthline")).length;

    return (
        <>
            <div style={{ padding: '20px' }} className='centeredArea'>
                <h1>Resources</h1>
            </div>
            <div className='whiteBoxArea'>
                <div className='whiteBox'>
                    <div className='topRow'>
                        <h2>Health line</h2>
                        <h3 style={{marginLeft: 'auto'}}>Programs pulled: {healthLineCount}</h3>
                    </div>
                    <p>A comprehensive, trusted directory connecting Ontario residents to local health and community services. Use it to easily find everything from home care support and medical clinics to specialized senior wellness programs and workshops right in your neighborhood.</p>
                    <p></p>
                    <a href="https://www.wwhealthline.ca/" target="_blank">https://www.wwhealthline.ca/</a>
                </div>
                
            </div>
            
        </>
    )
}

export default Resources