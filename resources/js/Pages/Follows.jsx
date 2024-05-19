import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import FollowsTopNavbar from "@/Components/Navbars/FollowsTopNavbar";
import { useState, useEffect } from "react";
import PeopleCard from "@/Components/Cards/PeopleCard";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import MyGroups from "@/Components/Navbars/Components/MyGroups";

export default function Follows({ auth_user = null, user = null, type = '', followings = null, followers = null }) {

    const [followsSection, setFollowsSection] = useState('posts');
    const getFollowsSection = (sectionRef) => {
        setFollowsSection(sectionRef);
    }
    return (
        <>
            <MainLayout user={auth_user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
                    <FollowsTopNavbar type={type} getFollowsSection={getFollowsSection} user={user} />
                    <section className="pb-16 border-r relative flex-1">
                        {followsSection === 'followers' ? (
                            <div id='followers' className="w-full h-full">
                                {followers && followers.length > 0 ? (
                                    followers.map((follower, index) => {
                                        return (
                                            <PeopleCard key={index} auth_user={auth_user} user={follower} />
                                        );
                                    })
                                ) : (
                                    <div className='px-32 py-12 flex flex-col gap-2'>
                                        <h1 className='font-bold text-3xl'>No followers yet!</h1>
                                        <span className='text-[var(--grey)] text-balance'>When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.</span>
                                    </div>
                                )}
                            </div>
                        ) : followsSection === 'following' ? (
                            <div id='following'>
                                {followings && followings.length > 0 ? (
                                    followings.map((following, index) => {
                                        return (
                                            <PeopleCard key={index} auth_user={auth_user} className='transition hover:bg-[var(--hover-light)] hover:cursor-pointer' user={following} />
                                        );
                                    })
                                ) : (
                                    <div className='px-32 py-12 flex flex-col gap-2'>
                                        <h1 className='font-bold text-3xl'>No followings yet!</h1>
                                        <span className='text-[var(--grey)] text-balance'>Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in.</span>
                                    </div>
                                )}
                            </div>
                        ) : (<></>)}
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
