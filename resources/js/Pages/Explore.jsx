import { useState } from 'react';
import PeopleCard from '@/Components/Cards/PeopleCard';

import MainLayout from '@/Layouts/mainLayout';
import { SearchInput } from '@/Components/Inputs';
import PostCard from '@/Components/Cards/PostCard';
import ConcertCard from '@/Components/Cards/ConcertCard';
import GroupCard from '@/Components/Cards/GroupCard';
import PeopleSection from '@/Components/Sections/PeopleSection';
import ExploreNavbar from '@/Components/Navbars/ExploreNavbar';
import { Link, router } from '@inertiajs/react';
import RightNavbar from '@/Components/Navbars/RightNavbar';
import MyGroups from '@/Components/Navbars/Components/MyGroups';

export default function Explore({ auth_user = null, user = null, top_users = [], all_users = [], posts = [], concerts = [], all_groups = [] }) {
    const [exploreSection, setExploreSection] = useState(localStorage.getItem('explore_default_section') ? localStorage.getItem('explore_default_section') : 'top')

    concerts = [
        {
            id: 1,
            thumbnail: 'https://e7.pngegg.com/pngimages/313/180/png-clipart-rock-concert-music-festival-rock-music-others-stage-performance-thumbnail.png',
            title: 'Concert One',
            live: true,
            planificated_at: '03/30 21:30',
            user: {
                name: 'Eneko',
                lastname: 'Galan',
                username: 'egalan',
                avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            },
            group: {
                name: 'Developer',
                logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
            },
        },
        {
            id: 2,
            thumbnail: 'https://e7.pngegg.com/pngimages/313/180/png-clipart-rock-concert-music-festival-rock-music-others-stage-performance-thumbnail.png',
            title: 'Concert Two',
            live: false,
            planificated_at: '04/12 12:10',
            user: {
                name: 'Eneko',
                lastname: 'Galan',
                username: 'egalan',
                avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            },
            group: {
                name: 'Developer2',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/2048px-LEGO_logo.svg.png',
            },
        },
    ];
    const getExploreSection = (section) => {
        setExploreSection(section);
    };
    const handleViewAll = () => {
        setExploreSection('people')
        localStorage.setItem('explore_default_section', 'people');
    }
    const handleProfileRedirect = (user) => {
        router.get(`/u/${user.username}`);
    }
    return (
        <>
            <MainLayout user={auth_user} headerClassName='backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50' defaultBackgroundColor='transparent' defaultTextColor='var(--main-blue)' dynamicBackground={false}>
                <section className='pb-16 border-r relative max-w-[800px] flex-1'>
                    <div className='w-full h-full'>
                        <div className='px-3 py-3'>
                            <SearchInput placeholder='Search' />
                        </div>
                        {/* Explore navbar */}
                        <ExploreNavbar refExploreSection={exploreSection} getExploreSection={getExploreSection} />
                        {/* Top */}
                        <section className={`${exploreSection === 'top' ? 'block' : 'hidden'}`} id='top'>
                            <section className='w-full'>
                                <h1 className='font-bold text-xl pl-3 py-2'>People</h1>
                                <PeopleSection onClickViewAll={handleViewAll} auth_user={auth_user} users={top_users} viewAll={true} />
                            </section>
                            <section className='w-full'>
                                {posts.map((post) => (
                                    <PostCard key={post.id} auth_user={auth_user} post={post} />
                                ))}
                            </section>
                            {
                                // TODO: GroupSection
                            }
                            <section className='w-full'>

                            </section>
                            {
                                // TODO: ConcertSection
                            }
                            <section className='w-full'>

                            </section>
                        </section>

                        <section className={`${exploreSection === 'concerts' ? 'block' : 'hidden'}`} id='concerts'>
                            {concerts.map((concert) => (
                                <ConcertCard key={concert.id} concert={concert} user={concert.user} />
                            ))}
                        </section>

                        <section className={`${exploreSection === 'people' ? 'block' : 'hidden'}`} id='people'>
                            {all_users.map((user, index) => (
                                <span key={index} onClick={() => {handleProfileRedirect(user)}}>
                                    <PeopleCard className='transition duration-300 hover:bg-[var(--hover-light)]' auth_user={auth_user} key={user.id} user={user} />
                                </span>
                            ))}
                        </section>

                        <section className={`${exploreSection === 'groups' ? 'block' : 'hidden'}`} id='groups'>
                            {all_groups.map((group, index) => (
                                <Link  key={index} href={`/g/${group.name}`}>
                                    <GroupCard className='transition duration-300 hover:bg-[var(--hover-light)]' auth_user={auth_user} group={group} />
                                </Link>
                            ))}
                        </section>
                    </div>
                </section>
                <RightNavbar>
                    <MyGroups groups={auth_user.groups} />
                </RightNavbar>
            </MainLayout>
        </>
    );
}
