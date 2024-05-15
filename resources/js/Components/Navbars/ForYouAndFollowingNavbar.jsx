import { useEffect, useState } from "react";

export default function ForYouAndFollowingNavbar({ getHomeSectionStatus = () => {} }) {
    const buttonStyle = 'flex flex-col w-1/2 items-center hover:bg-gray-200 transition';

    const [isForYouActive, setForYouActive] = useState(true);

    useEffect(() => {
        const defaultSection = localStorage.getItem('home_default_section');
        if (!defaultSection) {
            localStorage.setItem('home_default_section', 'for_you');
            getHomeSectionStatus('for_you')
        } else {
            if (defaultSection === 'for_you') {
                setForYouActive(true);
                getHomeSectionStatus('for_you');
            } else if (defaultSection === 'following') {
                setForYouActive(false);
                getHomeSectionStatus('following');
            }
        }
    }, []);

    const handleForYouClick = () => {
        setForYouActive(true);
        localStorage.setItem('home_default_section', 'for_you');
        getHomeSectionStatus('for_you');
    };

    const handleFollowingClick = () => {
        setForYouActive(false);
        localStorage.setItem('home_default_section', 'following');
        getHomeSectionStatus('following');
    };

    return (
        <nav className='sticky flex items-center top-0 w-full backdrop-blur-md border-b border-gray-200/50'>
            <div className='bg-white/85 flex items-center w-full'>
                <button className={`${buttonStyle}`} onClick={handleForYouClick}>
                    <span className={`${isForYouActive ? 'font-black' : 'text-gray-500'} pt-3 pb-2`}>For you</span>
                    <div className={`${isForYouActive ? 'bg-[var(--main-blue)]' : 'bg-none'} rounded-full w-14 px-1 py-[0.12rem] mb-[1px]`}></div>
                </button>
                <button className={`${buttonStyle}`} onClick={handleFollowingClick}>
                    <span className={`${!isForYouActive ? 'font-black' : 'text-gray-500'} pt-3 pb-2`}>Following</span>
                    <div className={`${!isForYouActive ? 'bg-[var(--main-blue)]' : 'bg-none'} rounded-full w-[4.5rem] px-1 py-[0.12rem] mb-[1px]`}></div>
                </button>
            </div>
        </nav>
    );
}
