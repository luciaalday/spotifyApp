export default function Navside({ isOpen }) {
    return (
        <nav className={`side-nav-container ${isOpen ? 'open' : ''}`}>
            <div className='side-nav'>
                <h1>Side menu</h1>
            </div>
        </nav>
    )
}