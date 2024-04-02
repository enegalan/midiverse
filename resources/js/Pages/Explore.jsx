import { useState } from 'react';
import PeopleCard from '@/Components/Cards/PeopleCard';

import MainLayout from '@/Layouts/mainLayout';
import { SearchInput } from '@/Components/Inputs';
import PostCard from '@/Components/Cards/PostCard';
import ConcertCard from '@/Components/Cards/ConcertCard';
import GroupCard from '@/Components/Cards/GroupCard';
import PeopleSection from '@/Components/Sections/PeopleSection';
import ExploreNavbar from '@/Components/Navbars/ExploreNavbar';

export default function Explore({ user = null, users = [], posts = [], concerts = [], groups = [] }) {
    const [exploreSection, setExploreSection] = useState(localStorage.getItem('explore_default_section') ? localStorage.getItem('explore_default_section') : 'top')
    users = [
        {
            id: 1,
            name: 'Eneko',
            lastname: 'Galan',
            username: 'egalan',
            description: 'Cuando veas un unicornio en el cielo avísame! Salgamos del manicomio a buscarlo y seamos felices. Business: vegetta777@vizz-agency.com',
            avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            groups: [
                {
                    name: 'Developer',
                    logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
                }, {
                    name: 'Developer2',
                    logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
                }, {
                    name: 'Developer3',
                    logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
                }
            ],
        },
        {
            id: 2,
            name: 'Eneko2',
            lastname: 'Galan2',
            username: 'egalan2',
            description: 'Cuando veas un unicornio en el cielo avísame! Salgamos del manicomio a buscarlo y seamos felices. Business: vegetta777@vizz-agency.com',
            avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            groups: [
                {
                    name: 'Developer4',
                    logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
                }, {
                    name: 'Developer5',
                    logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
                }, {
                    name: 'Developer6',
                    logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
                }
            ],
        },
    ];

    posts = [
        {
            id: 1,
            user: {
                name: 'Eneko',
                lastname: 'Galan',
                username: 'egalan',
                avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            },
            date: 'Mar 22',
            content: 'Test following content of a post. ASDASDASDASDASDASDSADASCXZXCZXCXZCXCZASFGDSKFOASKDASODKASODK',
            comments: [],
            likes: [],
            href: '',
        },
        {
            id: 2,
            user: {
                name: 'Eneko',
                lastname: 'Galan',
                username: 'egalan',
                avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            },
            date: 'Mar 22',
            content: 'Test content of a post. ASDASDASDASDASDASDSADASCXZXCZXCXZCXCZASFGDSKFOASKDASODKASODK',
            comments: [],
            likes: [],
            href: '',
        },
        // Additional posts if needed
    ];

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
    groups = [
        {
            name: 'Developer1',
            logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
            description: 'This is a default description for a default group.'
        },
        {
            name: 'Developer2',
            logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
            description: 'This is a default description for a default group.'
        },
        {
            name: 'Developer3',
            logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
            description: 'This is a default description for a default group.'
        },
        {
            name: 'Developer4',
            logo: 'https://static.vecteezy.com/system/resources/previews/006/202/823/original/group-of-eight-people-logo-in-a-circle-persons-teamwork-vector.jpg',
            description: 'This is a default description for a default group.'
        },
    ];
    const getExploreSection = (section) => {
        setExploreSection(section);
    };
    return (
        <>
            <MainLayout user={user} headerClassName='backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50' defaultBackgroundColor='transparent' defaultTextColor='var(--main-blue)' dynamicBackground={false}>
                <section className='pb-16 border-r relative max-w-[800px] flex-1'>
                    <div className='w-full h-full'>
                        <div className='px-3 py-3'>
                            <SearchInput placeholder='Search' />
                        </div>
                        {/* Explore navbar */}
                        <ExploreNavbar getExploreSection={getExploreSection} />
                        {/* Top */}
                        <section className={`${exploreSection === 'top' ? 'block' : 'hidden'}`} id='top'>
                            <section className='w-full'>
                                <h1 className='font-bold text-xl pl-3 py-2'>People</h1>
                                <PeopleSection users={users} viewAll={true} />
                            </section>
                            <section className='w-full'>
                                {posts.map((post) => (
                                    <PostCard key={post.id} post={post} />
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
                            {users.map((user) => (
                                <PeopleCard key={user.id} user={user} />
                            ))}
                        </section>

                        <section className={`${exploreSection === 'groups' ? 'block' : 'hidden'}`} id='groups'>
                            {groups.map((group) => (
                                <GroupCard group={group} />
                            ))}
                        </section>
                    </div>
                </section>
                <section className='lg:min-w-[350px] px-6 py-12 '>
                    <div className='w-[260px] hidden lg:block'>
                        <div className='fixed'>

                        </div>
                    </div>
                </section>
            </MainLayout>
        </>
    );
}
