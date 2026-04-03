import { RxHamburgerMenu } from 'react-icons/rx'

export default function Nav({ isOpen, setOpen }) {
    return (
        <nav className='top-nav'>
            <div>
                <button className='hamburger icon' onClick={() => setOpen(!isOpen)}>
                    <RxHamburgerMenu size={24} />
                </button>
            </div>
            <div className="flex-row">
                <h1>Spotify</h1>
            </div>
        </nav>
    )
}