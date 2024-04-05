import { useState } from 'react';

import MainLayout from '@/Layouts/mainLayout';
import { SearchInput } from '@/Components/Inputs';
import ConcertCard from '@/Components/Cards/ConcertCard';
import ConcertsNavbar from '@/Components/Navbars/ConcertsNavbar';
import RightNavbar from '@/Components/Navbars/RightNavbar';
import MyGroups from '@/Components/Navbars/Components/MyGroups';

export default function Concerts({ user = null, users = [], concerts = [] }) {
    const [concertsSection, setConcertsSection] = useState(localStorage.getItem('concerts_default_section') ? localStorage.getItem('concerts_default_section') : 'new')
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
        }, {
            id: 3,
            thumbnail: 'https://e7.pngegg.com/pngimages/313/180/png-clipart-rock-concert-music-festival-rock-music-others-stage-performance-thumbnail.png',
            title: 'Concert Three',
            live: false,
            planificated_at: '05/01 11:00',
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
    const getConcertsSection = (section) => {
        setConcertsSection(section);
    }
    return (
        <>
            <MainLayout user={user} headerClassName='backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50' defaultBackgroundColor='transparent' defaultTextColor='var(--main-blue)' dynamicBackground={false}>
                <section className='pb-16 border-r relative max-w-[800px] flex-1'>
                    <div className='px-3 py-3'>
                        <SearchInput placeholder='Search' />
                    </div>
                    <ConcertsNavbar getConcertsSection={getConcertsSection} />
                    <div className='w-full h-full'>
                        {/* New */}
                        <section className={`${concertsSection === 'new' ? 'block' : 'hidden'}`} id='new'>
                            {concerts.map((concert) => (
                                <ConcertCard key={concert.id} concert={concert} user={concert.user} />
                            ))}
                        </section>
                        {/* Live */}
                        <section className={`${concertsSection === 'live' ? 'block' : 'hidden'}`} id='live'>
                            {concerts.map((concert) => {
                                if (concert.live) return (
                                    <ConcertCard key={concert.id} concert={concert} user={concert.user} />
                                )
                            })}
                        </section>
                        {/* Upcoming */}
                        <section className={`${concertsSection === 'upcoming' ? 'block' : 'hidden'}`} id='upcoming'>
                            {concerts.map((concert) => {
                                if (!concert.live) return (
                                    <ConcertCard key={concert.id} concert={concert} user={concert.user} />
                                )
                            })}
                        </section>
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
