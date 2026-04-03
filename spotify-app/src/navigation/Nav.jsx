import { useState } from 'react';

import { RxHamburgerMenu } from 'react-icons/rx'
import Navside from './Navside'

export default function Nav() {
    const [isOpen, setOpen] = useState(false);

    return (
        <nav className='top-nav'>
            <div>
                <button className='hamburger icon' onClick={() => setOpen(!isOpen)}>
                    <RxHamburgerMenu size={24} />
                </button>
                <Navside />
            </div>
            <div>
                <h1>Spotify</h1>
            </div>
        </nav>
    )
}