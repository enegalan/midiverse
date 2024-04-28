import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import { AuthButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import { BiVolumeMute } from "react-icons/bi";



export default function Privacity({ user = null }) {
    const links = [
        {
            'id': 'audience_and_media',
            'name': 'Audience and media',
            'subtitle': 'Manage what information you allow other users on MiDiverse to see.',
            'href': 'audience_and_media',
            'icon': <HiOutlineUsers />,
        },
        {
            'id': 'mute_and_block',
            'name': 'Mute and block',
            'subtitle': 'Manage the accounts that you have muted or blocked.',
            'href': 'mute_and_block',
            'icon': <BiVolumeMute/>,
        },
    ];
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <SettingsNavbar activeLink='privacity' />
                        </div>
                    </section>
                </div>
                <RightNavbar width='625px' rightBorder={true} setPaddingX={false} minWidth='700px'>
                    <div className='h-screen'>
                        <div className='px-5 flex flex-col gap-5'>
                            <h2 className='font-bold text-xl'>Privacity</h2>
                            <p className='text-[var(--grey)] text-sm'>Manage what information you see and share on MiDiverse.</p>
                        </div>
                        <ul className='mt-6'>
                            {links.map(link => {
                                return (
                                    <li key={link.id} id={link.id} className='w-full'>
                                        <Link className='flex items-center justify-between px-5 py-5 transition duration-300 hover:bg-[var(--hover-light)]' href={'/settings/privacity/' + link.href}>
                                            <div className='flex gap-4'>
                                                <div className='flex items-center text-[var(--grey)]'>
                                                    {link.icon}
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span>{link.name}</span>
                                                    <div><p className='text-[var(--grey)] text-sm'>{link.subtitle}</p></div>
                                                </div>
                                            </div>
                                            <div className='text-2xl'><MdKeyboardArrowRight /></div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
