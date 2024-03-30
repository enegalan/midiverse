import logoWhite from "../../../public/logoWhite.svg";
import logoBlack from "../../../public/logoBlack.svg";
import Dropdown from "@/Components/Dropdown";

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

import { IoSettingsOutline } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";

import { TbPencilPlus } from "react-icons/tb";


import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Link } from "@inertiajs/react";

const Navbar = ({
    user = null,
    className = "",
}) => {
    var isAdmin = false;

    if (user && user.hasOwnProperty('roles')) isAdmin = user.roles.some(role => role.name === 'admin');

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [webRef, setWebRef] = useState(localStorage.getItem('web-ref') ? localStorage.getItem('web-ref') : 'home');

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const toggleNavbar = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const menuStyle = {
        height: isMenuOpen ? '100vh' : '0',
        overflow: isMenuOpen ? 'visible' : 'hidden',
        transition: 'height 0.3s ease-in-out',
        width: '45%',
        zIndex: 1000,
    };

    const iconWidth = '26.5px';

    const onLinkClick = (e) => {
        var dataRef = e.target.getAttribute('data-ref');
        if (dataRef !== null) setWebRef(dataRef);
        localStorage.setItem('web-ref', dataRef);
    }

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
            title: 'Notifications',
            href: '/',
            id: 'notifications',
            ref: 'notifications',
            icon: <IoMdNotificationsOutline className={`text-[${iconWidth}]`} />,
            activeIcon: <IoMdNotifications className={`text-[${iconWidth}]`} />,
        },
        {
            title: 'Messages',
            href: '/',
            id: 'messages',
            ref: 'messages',
            icon: <AiOutlineMessage className={`text-[${iconWidth}]`} />,
            activeIcon: <AiFillMessage className={`text-[${iconWidth}]`} />,
        },
        {
            title: 'Bookmarks',
            href: '/',
            id: 'bookmarks',
            ref: 'bookmarks',
            icon: <FaRegBookmark className={`text-[23px] ml-[2px]`} />,
            activeIcon: <FaBookmark className={`text-[23px] ml-[2px]`} />,
        },
        {
            title: 'Profile',
            href: '/',
            id: 'profile',
            ref: 'profile',
            icon: <FaRegUser className={`text-[22px] ml-[2px]`} />,
            activeIcon: <FaUser className={`text-[22px] ml-[2px]`} />,
        },
        {
            title: 'Settings',
            href: '/',
            id: 'settings',
            ref: 'settings',
            icon: <IoSettingsOutline className={`text-[24px] ml-[2px]`} />,
            activeIcon: <IoSettingsSharp className={`text-[24px] ml-[2px]`} />,
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
            href: '/',
            id: 'm-notifications',
            ref: 'notifications',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Messages',
            href: '/',
            id: 'm-messages',
            ref: 'messages',
            icon: '',
            activeIcon: '',
        },
    ];

    const mobileLinks = [
        {
            title: 'Profile',
            href: '/',
            id: 'm-profile',
            ref: 'profile',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Concerts',
            href: '/',
            id: 'm-concerts',
            ref: 'concerts',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Bookmarks',
            href: '/',
            id: 'm-bookmarks',
            ref: 'bookmarks',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Settings',
            href: '/',
            id: 'm-settings',
            ref: 'settings',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Log out',
            href: '/',
            id: 'm-logout',
            ref: 'logout',
            icon: '',
            activeIcon: '',
        },
    ];

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
                            className="text-4xl mb-4 font-bold justify-start flex gap-8 self-start"
                        >
                            <img className="w-10 pointer-events-none" src={logoBlack} alt="Logo" />
                        </Link>
                    </div>
                    <div className="flex-1 justify-center flex">
                        {/* Menu links */}
                        <ul className="justify-center flex flex-col xl:[&>li]:px-4 xl:gap-2">
                            {menuLinks.map((link) => (
                                <li data-ref={link.ref} className="xl:px-1 transition rounded-full self-start hover:bg-gray-300 w-full" key={link.id}>
                                    <Link
                                        onClick={onLinkClick}
                                        href={link.href}
                                        data-ref={link.ref}
                                        className="p-3 xl:p-3 text-lg flex items-center xl:items-center gap-3"
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
                                className={`my-3 text-center rounded-full xl:px-16 self-center block xl:p-4 p-4 text-lg border-2 border-[var(--blue)] transition hover:bg-[var(--main-blue)] hover:text-white ${webRef === 'playground' ? 'bg-[var(--blue)] text-white' : 'bg-transparent text-[var(--blue)]'}`}
                            >
                                <TbPencilPlus className="text-2xl block xl:hidden" />
                                <span className="hidden xl:block font-bold">Playground</span>
                            </a>
                        </ul>
                    </div>
                    <div className="hidden flex-1 lg:flex justify-end items-center xl:gap-4 gap-2">
                        {user ? (
                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md border border-slate-400">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    <div className="">
                                                        {user.avatar ? (
                                                            <img className="w-7 h-7" src={`/storage/avatars/${user.avatar}`} alt="Avatar" />
                                                        ) : (
                                                            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center content-center justify-center text-white text-xl font-bold">
                                                                {user.name[0].toUpperCase() + user.lastname[0].toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="ms-2 font-medium">{user.name}</p>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <h3 className=" ms-4 text-sm text-slate-700 mt-3">ACCOUNT</h3>
                                            <div className="flex items-center content-center justify-center mt-3 mb-3">

                                                {user.avatar ? (
                                                    <img src={`/storage/avatars/${user.avatar}`} className="w-10 h-10 ms-4" alt="Avatar" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-blue-500 ms-4 rounded-full flex items-center content-center justify-center text-white text-2xl font-bold">
                                                        {user.name[0].toUpperCase() + user.lastname[0].toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="flex flex-col overflow-hidden">
                                                    <p className="ms-4 text-slate-700 font-bold">{user.name} {user.lastname}</p>
                                                    <p className="ms-4 text-slate-700 me-4 truncate">{user.email}</p>
                                                </div>
                                            </div>

                                            <hr></hr>
                                            {isAdmin && (<Dropdown.Link className="rounded" href={''}>Admin Dashboard</Dropdown.Link>)}
                                            {isAdmin && (<hr />)}
                                            <Dropdown.Link
                                                href={''}
                                                method="post"
                                                as="button"
                                                className="rounded text-red-700"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        ) : (
                            <>
                            </>
                        )}
                    </div>

                    {isMenuOpen && (
                        <div className="lg:hidden w-full text-center" style={menuStyle}>
                            <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
                            <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-[var(--dark-gray)] border-r overflow-y-auto">
                                <div className="flex items-center mb-8">
                                    <div className="flex items-center gap-5 mr-auto text-3xl font-bold leading-none">
                                        <Link href="/">
                                            <img src={logoWhite} alt="Logo" />
                                        </Link>
                                        <span className="text-white text-4xl font-bold">
                                            miDiverse
                                        </span>
                                    </div>
                                    <button className="navbar-close" onClick={toggleNavbar}>
                                        <svg
                                            className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                                <div>
                                    {/*Menu links*/}
                                    <ul>
                                        {mobileLinks.map((link) => (
                                            <li id={link.id} className="mb-1">
                                                <Link
                                                    href={link.href}
                                                    className="block p-4 text-lg transition font-semibold text-gray-400 hover:bg-blue-50 hover:text-[--blue] rounded"
                                                >
                                                    <span>{link.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                        {isAdmin && (
                                            <li className="mb-1">
                                                <Link
                                                    className="block p-4 text-lg transition font-semibold text-gray-400 hover:bg-blue-50 hover:text-[--blue] rounded"
                                                    href={''}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};
Navbar.propTypes = {

};

export default Navbar;
