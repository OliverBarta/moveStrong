
import './TopBar.css'
import icon from './assets/moveStrongIcon.png'

function TopBar() {

    return (
        <>
            <div className='topBar'>
                <img src={icon} className='iconImg'></img>
                <div className='title'>Active Aging Ontario</div>
            </div>
        </>
    )
}

export default TopBar