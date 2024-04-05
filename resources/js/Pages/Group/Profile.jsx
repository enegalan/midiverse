import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import ProfileTopNavbar from "@/Components/Navbars/Profile/Group/ProfileTopNavbar";
import ProfileBottomNavbar from "@/Components/Navbars/Profile/Group/ProfileBottomNavbar";
import { AuthButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "@inertiajs/react";
import MidiCard from "@/Components/Cards/MidiCard";
import ConcertCard from "@/Components/Cards/ConcertCard";

export default function Profile({ auth_user = null, group = null }) {
    var isAuthUserProfile = false;
    isAuthUserProfile = auth_user.is_group_user_member;
    var groupInitial = group.name[0].toUpperCase();
    const dateTime = new Date(group.created_at)
    const dateLocale = 'en-US'; // TODO: set to 'default' for production
    const month = dateTime.toLocaleString(dateLocale, { month: 'long' });
    const year = dateTime.getFullYear();
    const joined = month + ' ' + year;
    const [profileSection, setProfileSection] = useState(localStorage.getItem('group_profile_default_section') ? localStorage.getItem('group_profile_default_section') : 'midi');
    const getProfileSection = (sectionRef) => {
        setProfileSection(sectionRef);
    }
    const renderGroupMidis = () => {
        if (group.midis.length === 0) return;
        return group.midis.map((midi) => <MidiCard group={group} midi={midi} />);
    };
    const renderGroupConcerts = () => {
        if (group.concerts.length === 0) return;
        return group.concerts.map((concert) => <ConcertCard concert={concert} group={group} />);
    }
    return (
        <>
            <MainLayout user={auth_user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
                    <ProfileTopNavbar group={group} />
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <div id="profile-header">
                                <div className={`min-h-[200px] w-full ${group.banner === null ? 'bg-[var(--hover-lightblue)]' : ''}`} id="banner">
                                    {group.banner !== null ? (<img src={group.banner} alt="Banner" />) : (<></>)}
                                </div>
                                <div className={`-mt-[50px] lg:-mt-[75px] ml-5`} id="avatar">
                                    <div className='min-h-[6rem] xl:min-h-[9rem] border-4 border-white rounded-full w-fit flex justify-center items-center'>
                                        <img className='rounded-full h-auto w-24 lg:w-36' src={group.logo !== null ? group.logo : groupInitial} alt="Avatar" />
                                    </div>
                                </div>
                            </div>
                            <div id="profile-content" className='flex flex-col relative'>
                                <div className='mx-4 absolute -top-8 right-0 lg:-top-14'>
                                    {isAuthUserProfile ? (
                                        <AuthButton className='bg-[var(--white)] hover:bg-[var(--hover-light)] text-black border' text="Edit profile" />
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <IconButton className='text-2xl' >
                                                <AiOutlineMessage />
                                            </IconButton>
                                            <FollowButton group={group} userFollow={false} groupFollow={true} className='text-md bg-[var(--dark)] hover:bg-[var(--hover-black)] text-white border' />
                                        </div>
                                    )}
                                </div>
                                <div className='mx-4 mt-5'>
                                    <h1 className='text-xl font-bold'>{group.name}</h1>
                                </div>
                                <div className='mx-4 mt-3'>
                                    <div className='flex items-center gap-1 text-[var(--grey)]'>
                                        <IoCalendarOutline />
                                        <span className='text-sm'>Created {joined}</span>
                                    </div>
                                </div>
                                <div className='mx-4 flex gap-5 mb-8 mt-2'>
                                    <Link href={`/g/${group.name}/followers`} className='text-sm hover:underline'>
                                        <span className='font-bold'>{group.followers.length}</span>
                                        <span className='text-[var(--grey)]'> Followers</span>
                                    </Link>
                                    <Link href={`/g/${group.name}/members`} className='text-sm hover:underline'>
                                        <span className='font-bold'>{group.members.length}</span>
                                        <span className='text-[var(--grey)]'> Members</span>
                                    </Link>
                                </div>
                                <ProfileBottomNavbar getProfileSection={getProfileSection} />
                                <section id="profile-sections">
                                    {profileSection === 'midi' ? (
                                        <section>
                                            {renderGroupMidis()}
                                        </section>
                                    ) : profileSection === 'concerts' ? (
                                        <section>
                                            {renderGroupConcerts()}
                                        </section>
                                    ) : (<></>)
                                    }
                                </section>
                            </div>
                        </div>
                    </section>

                </div>
                <RightNavbar>
                    <SearchInput placeholder="Search" />
                    <MyGroups groups={auth_user.groups} />
                </RightNavbar>
            </MainLayout>
        </>
    );
}
