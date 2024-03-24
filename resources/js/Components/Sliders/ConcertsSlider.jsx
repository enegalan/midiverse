import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { Link } from '@inertiajs/react';

import 'swiper/css';
import 'swiper/css/free-mode';

export default function ConcertsSlider({ slides = [], maxSlides = 10}) {
    slides = [
        {
            title: 'Test Title 1 asdasdasdasdasdasdsadasdasdadasdasdasaadzsdadasda',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 2 zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 3',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },

        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },
        {
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },{
            title: 'Test Title 4',
            image: 'https://w7.pngwing.com/pngs/975/518/png-transparent-musician-concert-music-video-music-festival-others-people-stage-performance-thumbnail.png',
            href: '',
        },

    ];
    slides = slides.slice(0, maxSlides);
    return (
        <div className='max-w-[64vw] md:max-w-[76vw] lg:max-w-[53vw] xl:max-w-[44vw] 2xl:max-w-[50vw] px-1'>
            <Swiper
            spaceBetween={20}
            slidesPerView={3}
            freeMode={true}
            breakpoints={{
                1024: {
                    slidesPerView: 5,
                }
            }}
            modules={[FreeMode]}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className='relative'>
                            <Link href={slide.href}>
                                <img className='rounded-lg w-52' src={slide.image} alt={`Slide ${index}`} />
                                <span className='text-white text-sm absolute -translate-y-[25px] ml-2'>{slide.title}</span>
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
                    <SwiperSlide key='lastConcertSlide'>
                        <div className='relative'>
                            <Link className='' href={''}>
                                <div className='px-1 py-[1.68rem] rounded-lg bg-[var(--light-grey)] flex justify-center'>
                                    <span className='text-black text-sm'>View more</span>
                                </div>
                            </Link>
                        </div>
                    </SwiperSlide>
            </Swiper>
        </div>
    );
};
