import { useEffect, useState } from "react";
import { BackButton } from "../../../Buttons";

export default function ProfileBottomNavbar({ getProfileSection = () => {} }) {
    const [defaultProfileSection, setDefaultProfileSection] = useState(localStorage.getItem('group_profile_default_section') ? localStorage.getItem('group_profile_default_section') : 'posts')
    const buttonStyle = 'flex flex-col w-1/2 items-center hover:bg-gray-200 transition';
    useEffect(() => {
        const defaultSection = localStorage.getItem('group_profile_default_section');
        if (!defaultSection) {
            localStorage.setItem('group_profile_default_section', 'midi');
            getProfileSection('midi')
            setDefaultProfileSection('midi')
        } else {
            setDefaultProfileSection(defaultSection);
            getProfileSection(defaultSection);
        }
    }, []);
    const handleButtonClick = (e) => {
        const sectionRef = e.target.getAttribute('data-ref');
        localStorage.setItem('group_profile_default_section', sectionRef);
        getProfileSection(sectionRef);
        setDefaultProfileSection(sectionRef);
    };
    return (
        <>
            <nav className='sticky flex items-center top-0 w-full backdrop-blur-md border-b border-gray-200/50'>
                <div className='bg-white/25 flex gap-6 items-center w-full'>
                    <button data-ref='midi' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultProfileSection === 'midi' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Midi</span>
                        <div className={`${defaultProfileSection === 'midi' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-14 px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                    <button data-ref='concerts' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultProfileSection === 'concerts' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Concerts</span>
                        <div className={`${defaultProfileSection === 'concerts' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-14 px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                </div>
            </nav>
        </>
    );
}