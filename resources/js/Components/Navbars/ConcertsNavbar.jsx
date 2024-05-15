import { useEffect, useState } from "react";

export default function ConcertsNavbar({ getConcertsSection = () => {} }) {
    const buttonStyle = 'flex flex-col w-1/2 items-center hover:bg-gray-200 transition';

    const [defaultConcertSection, setDefaultConcertSection] = useState(localStorage.getItem('concerts_default_section') ? localStorage.getItem('concerts_default_section') : 'new')

    useEffect(() => {
        const defaultSection = localStorage.getItem('concerts_default_section');
        if (!defaultSection) {
            localStorage.setItem('concerts_default_section', 'new');
            getConcertsSection('new')
            setDefaultConcertSection('new')
        } else {
            setDefaultConcertSection(defaultSection);
            getConcertsSection(defaultSection);
        }
    }, []);

    const handleButtonClick = (e) => {
        const sectionRef = e.target.getAttribute('data-ref');
        localStorage.setItem('concerts_default_section', sectionRef);
        getConcertsSection(sectionRef);
        setDefaultConcertSection(sectionRef);
    };
    return (
        <>
            <nav className='sticky flex items-center top-0 w-full backdrop-blur-md border-b border-gray-200/50'>
                <div className='bg-white/85 flex items-center w-full'>
                    <button data-ref='new' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultConcertSection === 'new' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>New</span>
                        <div className={`${defaultConcertSection === 'new' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-14 px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                    <button data-ref='live' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultConcertSection === 'live' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Live</span>
                        <div className={`${defaultConcertSection === 'live' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-[5rem] px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                    <button data-ref='upcoming' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultConcertSection === 'upcoming' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Upcoming</span>
                        <div className={`${defaultConcertSection === 'upcoming' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-[3.5rem] px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                </div>
            </nav>
        </>
    );
}