import { GlowButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";

export default function ConcertCard({ concert = {}, user = null, group = null, }) {
    return (
        <article className='flex flex-col p-3 gap-2 min-h-[8rem] border-b border-gray-200' id={concert.id} key={concert.id}>
            <div className='flex justify-end text-sm select-none'>
                <span className={`py-1 px-4 font-bold bg-[var(--red)] text-white rounded-full ${concert.live ? 'block' : 'hidden'}`}>{'LIVE'}</span>
                <span className={`py-1 px-4 bg-[var(--hover-black)] text-white rounded-full ${!concert.live ? 'block' : 'hidden'}`}>{concert.planificated_at}</span>
            </div>
            <div className='flex gap-2 justify-start'>
                <div className='self-center hidden md:inline-flex'>
                    <img className='rounded-lg object-cover border' src={concert.thumbnail} alt={concert.title + '_thumb'} />
                </div>
                <div className='flex md:gap-7'>
                    <div>
                        {user !== null ? (<img className='w-10 min-w-10 rounded-full' src={user.avatar} alt={`${user.username} avatar`} />) :
                        (<img className='w-10 min-w-10 rounded-full' src={group.logo} alt={`${group.name} avatar`} />)}
                    </div>
                    <div className='flex flex-col items-center justify-between'>
                        <div className="flex flex-row justify-between sm:-translate-x-[25px]">
                            <div className='flex flex-col items-start'>
                                {user !== null ? (
                                    <>
                                        <span className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[160px] font-bold hover:underline hover:cursor-pointer'>{user.name + ' ' + user.lastname}</span>
                                        <span className='text-sm text-gray-400'><label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] hover:cursor-pointer'>{'@' + user.username}</label></span>
                                    </>
                                ) : 
                                (
                                    <>
                                        <span className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[160px] font-bold hover:underline hover:cursor-pointer'>{group.name}</span>
                                    </>
                                )
                                }
                            </div>
                        </div>
                        <div className='flex flex-col -translate-x-[25px]'>
                            <Link href={''} className='text-bold text-sm text-gray-400 hover:underline'>{concert.group.name}</Link>
                            <span className='text-md'>{concert.title}</span>
                            <div className='my-3 self-center inline-flex md:hidden'>
                                <img className='rounded-lg object-cover border' src={concert.thumbnail} alt={concert.title + '_thumb'} />
                            </div>
                            <div className='w-fill flex justify-center my-3'>
                                <GlowButton value='View' backgroundColor='var(--main-blue)' />
                            </div>

                        </div>

                    </div>
                    <div className='flex items-center justify-center'>
                        <img className='min-w-[20%] sm:max-w-[12rem] rounded-full opacity-10 select-none' src={concert.group.logo} alt={`${concert.group.name} logo`} />
                    </div>
                </div>
            </div>
        </article>
    );
}