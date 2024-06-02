import { useEffect, useState } from "react";
import { BackButton } from "../../../Buttons";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/react";


export default function FollowsTopNavbar({ type = '', group = null, getFollowsSection = () => {} }) {
    const buttonStyle = 'flex flex-col w-1/2 items-center hover:bg-gray-200 transition';

    const [defaultExploreSection, setDefaultFollowsSection] = useState(type)

    useEffect(() => {
        getFollowsSection(type)
        setDefaultFollowsSection(type)
    }, []);

    const handleButtonClick = (e) => {
        const sectionRef = e.target.getAttribute('data-ref');
        getFollowsSection(sectionRef);
        setDefaultFollowsSection(sectionRef);
    };

    return (
        <>
            <nav className='sticky flex items-center top-0 z-50 w-full backdrop-blur-md border-b border-r'>
                <div className='bg-white/25 flex flex-col gap-6 items-center w-full pt-1'>
                    <div className='flex gap-6 w-full px-1'>
                        <BackButton />
                        <div className='flex flex-col cursor-pointer'>
                            <h2 className='text-lg font-bold'>{group.name}</h2>
                        </div>
                    </div>
                    <div className='w-full flex'>
                        <Link href={`/g/${group.name}/followers`} data-ref='followers' className={`${buttonStyle}`} onClick={handleButtonClick}>
                            <span className={`${defaultExploreSection === 'followers' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Followers</span>
                            <div className={`${defaultExploreSection === 'followers' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-14 px-1 py-[0.12rem] mb-[1px]`}></div>
                        </Link>
                        <Link href={`/g/${group.name}/members`} data-ref='members' className={`${buttonStyle}`} onClick={handleButtonClick}>
                            <span className={`${defaultExploreSection === 'members' ? 'font-black' : 'text-gray-500'} pointer-events-none pt-3 pb-2`}>Members</span>
                            <div className={`${defaultExploreSection === 'members' ? 'bg-[var(--main-blue)]' : 'bg-none'} pointer-events-none rounded-full w-14 px-1 py-[0.12rem] mb-[1px]`}></div>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}