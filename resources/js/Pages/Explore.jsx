import { useState } from 'react';
import PeopleCard from '@/Components/PeopleCard';

import MainLayout from '@/Layouts/mainLayout';
import { SearchInput } from '@/Components/Inputs';
import Post from '@/Components/Post';
import PeopleSection from '@/Components/Sections/PeopleSection';
import ExploreNavbar from '@/Components/Navbars/ExploreNavbar';

export default function Explore({ users = [], posts = [] }) {
    const [exploreSection, setExploreSection] = useState(localStorage.getItem('explore_default_section') ? localStorage.getItem('explore_default_section') : 'top')
    users = [
        {
            id: 1,
            name: 'Eneko',
            lastname: 'Galan',
            username: 'egalan',
            description: 'Cuando veas un unicornio en el cielo avísame! Salgamos del manicomio a buscarlo y seamos felices. Business: vegetta777@vizz-agency.com',
            avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
        },
        {
            id: 2,
            name: 'Eneko2',
            lastname: 'Galan2',
            username: 'egalan2',
            description: 'Cuando veas un unicornio en el cielo avísame! Salgamos del manicomio a buscarlo y seamos felices. Business: vegetta777@vizz-agency.com',
            avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
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
        {
            id: 3,
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
        {
            id: 4,
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
    ];
    const getExploreSection = (section) => {
        setExploreSection(section);
    };
    return (
        <>
            <MainLayout headerClassName='backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50' defaultBackgroundColor='transparent' defaultTextColor='var(--main-blue)' dynamicBackground={false}>
                <section className='pb-16 border-r relative'>
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
                                    <Post key={post.id} post={post} />
                                ))}
                            </section>
                            {
                                // TODO: GroupCard
                            }
                            <section className='w-full'>

                            </section>
                            {
                                // TODO: ConcertCard
                            }
                            <section className='w-full'>

                            </section>
                        </section>

                        <section className={`${exploreSection === 'concerts' ? 'block' : 'hidden'}`} id='concerts'>

                        </section>

                        <section className={`${exploreSection === 'people' ? 'block' : 'hidden'}`} id='people'>
                            {users.map((user) => (
                                <PeopleCard user={user} />
                            ))}
                        </section>

                        <section className={`${exploreSection === 'groups' ? 'block' : 'hidden'}`} id='groups'>

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
