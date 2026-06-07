import './TopBar.css'
import { Link } from 'react-router-dom';
import icon from './assets/moveStrongIcon.png'
import { useState } from 'react';

function TopBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className='topBar'>
                <Link to="/moveStrong/" className='link' onClick={() => setIsOpen(false)}>
                    <img src={icon} className='iconImg'></img>
                    <div className='title'>Active Aging Ontario</div>
                </Link>
                <div className='otherPagesBox'>
                    <Link to="/moveStrong/about" className='link2' onClick={() => setIsOpen(false)}>about</Link>
                    <Link to="/moveStrong/resources" className='link2' onClick={() => setIsOpen(false)}>resources</Link>
                    <Link to="/moveStrong/findprograms" className='link2' onClick={() => setIsOpen(false)}>find programs</Link>
                    <Link to="/moveStrong/forproviders" className='link2' onClick={() => setIsOpen(false)}>for providers</Link>
                </div>
                <button className='dropDown' onClick={toggleMenu}>{isOpen ? '-' : '<'}</button>
                
            </div>
            {isOpen && (
                <div className='droppedDown'>
                    <Link to="/moveStrong/about" className='link3' onClick={() => setIsOpen(false)}>about</Link>
                    <Link to="/moveStrong/resources" className='link3' onClick={() => setIsOpen(false)}>resources</Link>
                    <Link to="/moveStrong/findprograms" className='link3' onClick={() => setIsOpen(false)}>find programs</Link>
                    <Link to="/moveStrong/forproviders" className='link3' onClick={() => setIsOpen(false)}>for providers</Link>
                </div>
            )}
        </>
    )
}

export default TopBar