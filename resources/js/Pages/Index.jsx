import { useEffect, useState } from 'react';

import MainLayout from "@/Layouts/mainLayout";
import ConcertsSlider from "@/Components/Sliders/ConcertsSlider";
import FollowsPosts from "@/Components/FollowsPosts";
import RecentPosts from "@/Components/RecentPosts";
import { SearchInput } from "@/Components/Inputs";
import ForYouAndFollowingNavbar from "@/Components/Navbars/ForYouAndFollowingNavbar";

export default function Index() {
    const [isForYouActive, setForYouActive] = useState(true);
    const getHomeSectionStatus = (status) => {
        setForYouActive(status === 'for_you');
    };
    return (
        <>
            <MainLayout headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <main className="border-l flex">
                    <section className="pb-16 border-r relative">
                        <div className="w-full h-full">
                            <ForYouAndFollowingNavbar getHomeSectionStatus={getHomeSectionStatus} />
                            {/* Concerts sliders */}
                            <div className={`${isForYouActive ? 'block' : 'hidden'}`}>
                                <h2 className="text-[var(--dark)] text-3xl font-bold mb-12 mt-16 text-center">Discover concerts</h2>
                                <ConcertsSlider />
                            </div>
                            {/* Recent Users' posts */}
                            <div className={`${isForYouActive ? 'block' : 'hidden'}`}>
                                <RecentPosts />
                            </div>
                            {/* Follows posts */}
                            <div className={`${!isForYouActive ? 'block' : 'hidden'}`}> 
                                <FollowsPosts />
                            </div>
                        </div>
                    </section>
                    <section className="lg:min-w-[350px] px-6 py-12 ">
                        <div className="w-[260px] hidden lg:block">
                            <div className="fixed">
                                <SearchInput placeholder="Search" />
                            </div>
                        </div>
                    </section>
                </main>
            </MainLayout>
        </>
    );
}
