import { useEffect, useState } from "react";

export default function ExploreNavbar({ refExploreSection = null, getExploreSection = () => {} }) {
    const buttonStyle = 'flex flex-col w-1/2 items-center hover:bg-gray-200 transition';

    const [defaultExploreSection, setDefaultExploreSection] = useState(refExploreSection ? refExploreSection : localStorage.getItem('explore_default_section') ? localStorage.getItem('explore_default_section') : 'top')

    useEffect(() => {
        const defaultSection = refExploreSection ? refExploreSection : localStorage.getItem('explore_default_section');
        if (!defaultSection) {
            localStorage.setItem('explore_default_section', 'top');
            getExploreSection('top')
            setDefaultExploreSection('top')
        } else {
            setDefaultExploreSection(defaultSection);
            getExploreSection(defaultSection);
        }
    }, [refExploreSection]);

    const handleButtonClick = (e) => {
        const sectionRef = e.target.getAttribute('data-ref');
        localStorage.setItem('explore_default_section', sectionRef);
        getExploreSection(sectionRef);
        setDefaultExploreSection(sectionRef);
    };
    return (
        <>
            <nav className='sticky flex items-center top-0 w-full backdrop-blur-md border-b border-gray-200/50'>
                <div className='bg-white/85 flex items-center w-full'>
                    <button data-ref='top' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultExploreSection === 'top' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Top</span>
                        <div className={`${defaultExploreSection === 'top' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-14 px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                    <button data-ref='concerts' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultExploreSection === 'concerts' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Concerts</span>
                        <div className={`${defaultExploreSection === 'concerts' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-[5rem] px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                    <button data-ref='people' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultExploreSection === 'people' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>People</span>
                        <div className={`${defaultExploreSection === 'people' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-[3.5rem] px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                    <button data-ref='groups' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultExploreSection === 'groups' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Groups</span>
                        <div className={`${defaultExploreSection === 'groups' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-[4rem] px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                </div>
            </nav>
        </>
    );
}