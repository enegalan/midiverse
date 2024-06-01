import { useEffect, useState } from "react";

export default function GroupsNavbar({ getGroupsSection = () => {} }) {
    const buttonStyle = 'flex flex-col w-1/2 items-center hover:bg-gray-200 transition';

    const [defaultGroupsSection, setDefaultGroupsSection] = useState(localStorage.getItem('groups_default_section') ? localStorage.getItem('groups_default_section') : 'top')

    useEffect(() => {
        const defaultSection = localStorage.getItem('groups_default_section');
        if (!defaultSection) {
            localStorage.setItem('groups_default_section', 'top');
            getGroupsSection('top')
            setDefaultGroupsSection('top')
        } else {
            setDefaultGroupsSection(defaultSection);
            getGroupsSection(defaultSection);
        }
    }, []);

    const handleButtonClick = (e) => {
        const sectionRef = e.target.getAttribute('data-ref');
        localStorage.setItem('groups_default_section', sectionRef);
        getGroupsSection(sectionRef);
        setDefaultGroupsSection(sectionRef);
    };
    return (
        <>
            <nav className='sticky flex items-center top-0 w-full backdrop-blur-md border-b border-gray-200/50'>
                <div className='bg-white/25 flex items-center w-full'>
                    <button data-ref='top' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultGroupsSection === 'top' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Top</span>
                        <div className={`${defaultGroupsSection === 'top' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-14 px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                    <button data-ref='new' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultGroupsSection === 'new' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>New</span>
                        <div className={`${defaultGroupsSection === 'new' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-[5rem] px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                    <button data-ref='my-groups' className={`${buttonStyle}`} onClick={handleButtonClick}>
                        <span className={`${defaultGroupsSection === 'my-groups' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>My Groups</span>
                        <div className={`${defaultGroupsSection === 'my-groups' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-[3.5rem] px-1 py-[0.12rem] mb-[1px]`}></div>
                    </button>
                </div>
            </nav>
        </>
    );
}