import { useState } from 'react';

import MainLayout from "@/Layouts/mainLayout";
import ConcertsSlider from "@/Components/Sliders/ConcertsSlider";
import FollowsPosts from "@/Components/Sections/FollowsPosts";
import RecentPosts from "@/Components/Sections/RecentPosts";
import { SearchInput } from "@/Components/Inputs";
import MyGroups from '@/Components/Navbars/Components/MyGroups';
import ForYouAndFollowingNavbar from "@/Components/Navbars/ForYouAndFollowingNavbar";
import RightNavbar from '@/Components/Navbars/RightNavbar';
import PostEditor from '@/Components/PostEditor';

export default function Index({ user = null, recent_posts = [], follows_posts = [] }) {
    const [isForYouActive, setForYouActive] = useState(true);
    const getHomeSectionStatus = (status) => {
        setForYouActive(status === 'for_you');
    };
    const sortedRecentPosts = recent_posts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });
    const sortedFollowsPosts = follows_posts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <section className="pb-16 border-r relative max-w-[800px] flex-1">
                    <div className="w-full h-full">
                        <ForYouAndFollowingNavbar getHomeSectionStatus={getHomeSectionStatus} />
                        {/* Post Editor */}
                        <div className={`${isForYouActive ? 'block' : 'hidden'}`}>
                            <PostEditor user={user} />
                        </div>
                        {/* Concerts sliders */}
                        {/* <div className={`${isForYouActive ? 'block' : 'hidden'}`}>
                            <h2 className="text-[var(--dark)] text-3xl font-bold mb-12 mt-16 text-center">Discover concerts</h2>
                            <ConcertsSlider />
                        </div> */}
                        {/* Recent Users' posts */}
                        <div className={`${isForYouActive ? 'block' : 'hidden'}`}>
                            <RecentPosts auth_user={user} posts={sortedRecentPosts} />
                        </div>
                        {/* Follows posts */}
                        <div className={`${!isForYouActive ? 'block' : 'hidden'}`}>
                            <FollowsPosts auth_user={user} posts={sortedFollowsPosts} />
                        </div>
                    </div>
                </section>
                <RightNavbar>
                    <SearchInput placeholder="Search" />
                    <MyGroups groups={user.groups} />
                </RightNavbar>
            </MainLayout>
        </>
    );
}
