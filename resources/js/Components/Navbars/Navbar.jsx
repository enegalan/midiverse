import logoBlack from "../../../../public/logoBlack.svg";

/* Icons */
import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";

import { GoSearch } from "react-icons/go";

import { IoMusicalNotesOutline } from "react-icons/io5";
import { IoMusicalNotes } from "react-icons/io5";

import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";

import { AiOutlineMessage } from "react-icons/ai";
import { AiFillMessage } from "react-icons/ai";

import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";

import { FaRegUser } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

import { HiOutlineUserGroup } from "react-icons/hi2";
import { HiUserGroup } from "react-icons/hi2";

import { MdOutlinePiano } from "react-icons/md";

import { BsThreeDots } from "react-icons/bs";

import { useEffect, useState } from "react";

import { Link } from "@inertiajs/react";

import { Avatar } from "primereact/avatar";

import { logout, getUserInitials } from "@/Functions";

import { BadgeProvider, NotificationBadge } from "../Badges";

const Navbar = ({
    user = null,
    className = "",
}) => {
    var isAdmin = false;

    if (user && user.hasOwnProperty('roles')) isAdmin = user.roles.some(role => role.name === 'admin');

    var userInitials = getUserInitials(user);

    const [webRef, setWebRef] = useState('home');

    const iconWidth = '26.5px';

    const onLinkClick = (e) => {
        var dataRef = e.target.getAttribute('data-ref');
        if (dataRef !== null) setWebRef(dataRef);
        localStorage.setItem('web-ref', dataRef);
    }

    const [isLogoutModal, setIsLogoutModal] = useState(false);

    const toggleLogoutModal = () => {
        setIsLogoutModal(!isLogoutModal);
    }

    // Close all dropdowns when click on outside a dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdownElements = document.querySelectorAll(".dropdown");
            let outsideClick = true;
            for (let dropdown of dropdownElements) {
                if (dropdown.contains(event.target)) {
                    outsideClick = false;
                }
            }
            if (outsideClick) {
                setIsLogoutModal(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLogoutModal]);

    var notificationLink =
        <BadgeProvider>
            <NotificationBadge value={user.unread_notifications} />
            <IoMdNotificationsOutline className={`text-[${iconWidth}]`} />
        </BadgeProvider>;

    var notificationActiveLink =
        <BadgeProvider>
            <NotificationBadge value={user.unread_notifications} />
            <IoMdNotifications className={`text-[${iconWidth}]`} />
        </BadgeProvider>;

    const menuLinks = [
        {
            title: 'Home',
            href: '/',
            id: 'home',
            ref: 'home',
            icon: <GoHome className={`text-[${iconWidth}]`} />,
            activeIcon: <GoHomeFill className={`text-[${iconWidth}]`} />,
        },
        {
            title: 'Explore',
            href: '/explore',
            id: 'explore',
            ref: 'explore',
            icon: <GoSearch className={`text-[${iconWidth}]`} />,
            activeIcon: <GoSearch className={`text-[${iconWidth}] stroke-1`} />,
        },
        {
            title: 'Concerts',
            href: '/concerts',
            id: 'concerts',
            ref: 'concerts',
            icon: <IoMusicalNotesOutline className={`text-[${iconWidth}]`} />,
            activeIcon: <IoMusicalNotes className={`text-[${iconWidth}]`} />,
        },
        {
            title: 'Groups',
            href: '/groups',
            id: 'groups',
            ref: 'groups',
            icon: <HiOutlineUserGroup className={`text-[26px] ml-[2px]`} />,
            activeIcon: <HiUserGroup className={`text-[26px] ml-[2px]`} />,
        },
        {
            title: 'Notifications',
            href: '/notifications',
            id: 'notifications',
            ref: 'notifications',
            icon: notificationLink,
            activeIcon: notificationActiveLink,
        },
        {
            title: 'Messages',
            href: '/messages',
            id: 'messages',
            ref: 'messages',
            icon: <AiOutlineMessage className={`text-[${iconWidth}]`} />,
            activeIcon: <AiFillMessage className={`text-[${iconWidth}]`} />,
        },
        {
            title: 'Bookmarks',
            href: '/bookmarks',
            id: 'bookmarks',
            ref: 'bookmarks',
            icon: <FaRegBookmark className={`text-[23px] ml-[2px]`} />,
            activeIcon: <FaBookmark className={`text-[23px] ml-[2px]`} />,
        },
        {
            title: 'Profile',
            href: '/u/' + user.username,
            id: 'profile',
            ref: 'profile',
            icon: <FaRegUser className={`text-[22px] ml-[2px]`} />,
            activeIcon: <FaUser className={`text-[22px] ml-[2px]`} />,
        },
    ];

    const mobileMainLinks = [
        {
            title: 'Home',
            href: '/',
            id: 'm-home',
            ref: 'home',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Explore',
            href: '/',
            id: 'm-explore',
            ref: 'explore',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Notifications',
            href: '/notifications',
            id: 'm-notifications',
            ref: 'notifications',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Messages',
            href: '/messages',
            id: 'm-messages',
            ref: 'messages',
            icon: '',
            activeIcon: '',
        },
    ];
    const handleLogout = () => {
        logout();
    }
    useEffect(() => {
        const ref = window.location.pathname.split('/')[1];
        setWebRef(ref)
        localStorage.setItem('web-ref', ref);
    }, []);
    return (
        <>
            <header
                className={`min-w-[118px] xl:min-w-[350px] items-baseline xl:items-end flex flex-col flex-wrap py-4 px-10 h-full justify-between text-black left-0 z-30 bg-white transition ease-in-out duration-500 ` + className}
            >
                <div className="fixed">
                    <div className="xl:pl-[1.35rem] pl-[0.3rem] flex flex-col flex-1 gap-5 items-start">
                        {/* Logo */}
                        <Link
                            onClick={onLinkClick}
                            href='/home'
                            data-ref='home'
                            className="text-4xl mb-4 font-bold justify-center flex gap-8 xl:self-start self-center"
                        >
                            <img className="w-10 pointer-events-none" src={logoBlack} alt="Logo" />
                        </Link>
                    </div>
                    <div className="flex-1 justify-center flex">
                        {/* Menu links */}
                        <ul className="justify-center flex flex-col xl:[&>li]:px-4 xl:gap-2">
                            {menuLinks.map((link) => (
                                <li data-ref={link.ref} className="transition rounded-full self-center hover:bg-[var(--hover-light)] w-full" key={link.id}>
                                    <Link
                                        onClick={onLinkClick}
                                        href={link.href}
                                        data-ref={link.ref}
                                        className="px-3 py-3 text-lg flex items-center justify-center xl:justify-start xl:items-center gap-3"
                                    >
                                        <div className='pointer-events-none'>
                                            {webRef === link.ref ? link.activeIcon : link.icon}
                                        </div>
                                        <span data-ref={link.ref} className={`hidden xl:block ${webRef === link.ref ? 'font-bold' : ''}`}>{link.title}</span>
                                    </Link>
                                </li>
                            ))}
                            <a
                                onClick={onLinkClick}
                                data-ref='playground'
                                href={route('playground')}
                                className={`my-1 text-center rounded-full xl:px-16 self-center block p-4 text-lg border-2 border-[var(--blue)] transition hover:bg-[var(--main-blue)] hover:text-white ${webRef === 'playground' ? 'bg-[var(--blue)] text-white' : 'bg-transparent text-[var(--blue)]'}`}
                            >
                                <MdOutlinePiano className="text-2xl block xl:hidden" />
                                <span className="hidden xl:block font-bold">Playground</span>
                            </a>
                        </ul>
                    </div>
                    <div className="absolute mt-24 xl:mt-1 flex-1 flex justify-center items-center">
                        {user.avatar ? (
                            <span onClick={toggleLogoutModal} className='px-2 py-2 flex gap-3 justify-center items-center transition rounded-full cursor-pointer hover:bg-[var(--hover-light)] w-full"'>
                                <Avatar image={user.avatar} size="large" shape="circle" />
                                {/* <img src={'https://lh3.googleusercontent.com/a/ACg8ocLHGmAZcqZaiWkBKYTc5PM7K6kVberb2KrzSLFMfBB_agI=s96-c'} alt="User avatar" /> */}
                                <div className='hidden xl:flex flex-col'>
                                    <span className='font-bold whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px]'>{user.name} {user.lastname ?? ''}</span>
                                    <span className='text-sm text-[var(--grey)]'>@{user.username}</span>
                                </div>
                                <div className='hidden xl:flex pr-2'>
                                    <BsThreeDots />
                                </div>
                            </span>
                        ) : (
                            <span onClick={toggleLogoutModal} className='px-2 py-2 flex justify-center items-center transition rounded-full cursor-pointer hover:bg-[var(--hover-light)] w-full"'>
                                <Avatar label={userInitials} size="large" shape="circle" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
                            </span>
                        )}
                        {isLogoutModal && (
                            <section className='dropdown absolute top-12 left-0'>
                                <div className='absolute -top-40 left-4 min-w-[150px] bg-white rounded-lg shadow py-2'>
                                    <div className='flex flex-col gap-2'>
                                        <Link href='/settings' className='font-bold px-4 py-2 hover:bg-[var(--hover-light)]'>Settings</Link>
                                        <Link onClick={handleLogout} className='font-bold px-4 py-2 hover:bg-[var(--hover-light)]'>Log out</Link>
                                    </div>
                                </div>
                                <div className="absolute top-[-3.5rem] left-6 w-5 flex justify-center overflow-hidden">
                                    <div className="shadow h-3 w-3 bg-white -rotate-45 transform origin-top-left"></div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};
Navbar.propTypes = {

};

export default Navbar;
