import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import FollowsTopNavbar from "@/Components/Navbars/Profile/Group/FollowsTopNavbar";
import ProfileBottomNavbar from "@/Components/Navbars/Profile/ProfileBottomNavbar";
import { AuthButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { AiOutlineMessage } from "react-icons/ai";
import PeopleCard from "@/Components/Cards/PeopleCard";

export default function Follows({ auth_user = null, type = '', group = null }) {
    const [followsSection, setFollowsSection] = useState(type);
    const getFollowsSection = (section) => {
        setFollowsSection(section);
    }
    return (
        <>
            <MainLayout user={auth_user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
                    <FollowsTopNavbar type={type} getFollowsSection={getFollowsSection} group={group} />
                    <section className="pb-16 border-r relative flex-1">
                        <div id='followers' className="w-full h-full">
                            {followsSection === 'followers' ? (
                                <section>
                                    {group.followers && group.followers.length > 0 ? (
                                        group.followers.map((follower, index) => {
                                            return (
                                                <PeopleCard key={index} auth_user={auth_user} user={follower} />
                                            );
                                        })
                                    ) : (
                                        <div className='px-32 py-12 flex flex-col gap-2'>
                                            <h1 className='font-bold text-3xl'>No followers yet!</h1>
                                            <span className='text-[var(--grey)] text-balance'>When someone follows this group, they’ll show up here. Posting and interacting with others helps boost followers.</span>
                                        </div>
                                    )}
                                </section>
                            ) : followsSection === 'members' ? (
                                <section>
                                    {group.members && group.members.length > 0 ? (
                                        group.members.map((member, index) => {
                                            return (
                                                <PeopleCard key={index} auth_user={auth_user} user={member} />
                                            );
                                        })
                                    ) : (
                                        <></>
                                    )}
                                </section>
                            ) : (<></>)}
                        </div>
                    </section>
                </div>
                <section className="lg:min-w-[350px] px-6 py-12 ">
                    <div className="w-[260px] hidden lg:block">
                        <div className="fixed">
                            <SearchInput placeholder="Search" />
                        </div>
                    </div>
                </section>
            </MainLayout>
        </>
    );
}
