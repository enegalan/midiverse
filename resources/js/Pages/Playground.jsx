import { useState } from 'react';

import MainLayout from '@/Layouts/mainLayout';
import { SearchInput } from '@/Components/Inputs';
import ConcertCard from '@/Components/Cards/ConcertCard';
import ConcertsNavbar from '@/Components/Navbars/ConcertsNavbar';

export default function Playground() {
    return (
        <>
            <MainLayout headerClassName='backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50' defaultBackgroundColor='transparent' defaultTextColor='var(--main-blue)' dynamicBackground={false}>
                <section className='pb-16 border-r relative max-w-[800px] flex-1'>
                    
                </section>
                <section className='lg:min-w-[350px] px-6 py-12 '>
                    <div className='w-[260px] hidden lg:block'>
                        <div className='fixed'>
                            <SearchInput placeholder="Search" />
                        </div>
                    </div>
                </section>
            </MainLayout>
        </>
    );
}
