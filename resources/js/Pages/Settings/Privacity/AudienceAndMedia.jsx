import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import { AuthButton, BackButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { TbHeartBroken } from "react-icons/tb";
import PeopleCard from "@/Components/Cards/PeopleCard";
import { Checkbox } from "@/Components/Buttons";

export default function AudienceAndMedia({ user = null }) {
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <SettingsNavbar activeLink='account' />
                        </div>
                    </section>
                </div>
                <RightNavbar width='625px' rightBorder={true} setPaddingX={false} minWidth='700px'>
                    <div className='h-screen'>
                        <div className='px-5 flex gap-8 mb-2 items-center'>
                            <BackButton />
                            <h2 className='font-bold text-xl'>Audience and media</h2>
                        </div>
                        <div className='px-8 mt-6'>
                            <p className='text-[var(--grey)] text-sm'>Manage what information you allow other people on MiDiverse to see.</p>
                        </div>
                        <ul className='mt-6 flex flex-col gap-8'>
                            <li className='px-8'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='font-bold text-md'>Protect your posts</h3>
                                    <Checkbox />
                                </div>
                                <div>
                                    <p className='text-sm text-[var(--grey)]'>When selected, your posts and other account information are only visible to people who follow you.</p>
                                </div>
                            </li>
                            <li className='px-8'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='font-bold text-md'>Protect your media</h3>
                                    <Checkbox />
                                </div>
                                <div>
                                    <p className='text-sm text-[var(--grey)]'>If selected, MIDIs will not be downloadable by default.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
