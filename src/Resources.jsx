import './Resources.css'
import programData from '/Users/oliver/moveStrong/programs.json'

function Resources() {

    const healthLineCount = programData.filter(item => item.infosourcename.includes("healthline")).length;
    const GoodLifeCount = programData.filter(item => item.infosourcename.includes("goodlife")).length;

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
                    <p>A comprehensive, trusted directory connecting Ontario residents to local health and community services. Used to easily find home care support and medical clinics to specialized senior wellness programs and workshops.</p>
                    <p></p>
                    <a href="https://www.wwhealthline.ca/" target="_blank">https://www.wwhealthline.ca/</a>
                </div>   
                <div className='whiteBox'>
                    <div className='topRow'>
                        <h2>GoodLife</h2>
                        <h3 style={{marginLeft: 'auto'}}>Programs pulled: {GoodLifeCount}</h3>
                    </div>
                    <p>A gym company that offers group exercise classes and individual coaching sessions.</p>
                    <p></p>
                    <a href="https://www.goodlifefitness.com/" target="_blank">https://www.goodlifefitness.com/</a>
                </div>   
            </div>
            
        </>
    )
}

export default Resources