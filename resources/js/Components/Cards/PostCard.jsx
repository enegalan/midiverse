import { FaRegComment } from 'react-icons/fa6';
import { IoIosHeart } from 'react-icons/io';
import { IoIosHeartEmpty } from 'react-icons/io';
import { FaBookmark } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa';
import { IoShare } from 'react-icons/io5';
import { IoShareOutline } from 'react-icons/io5';

export default function PostCard({ post = {} }) {
    const blueHovereableStyle = 'relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-blue)] hover:text-[var(--blue)]';
    const redHovereableStyle = 'relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-like-red)] hover:text-[var(--like-red)]';
    return (
        <article className='border-t flex p-3 gap-2 justify-start' key={post.id}>
            <div>
                <img className='w-10 min-w-10 rounded-full' src={post.user.avatar} alt={`${post.user.username} avatar`} />
            </div>
            <div className='flex flex-col w-full'>
                <div className='flex gap-1 items-center'>
                    <span className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] font-bold hover:underline hover:cursor-pointer'>{post.user.name + ' ' + post.user.lastname}</span>
                    <span className='text-sm text-gray-400'><label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] hover:cursor-pointer'>{'@' + post.user.username}</label><label className='hover:cursor-pointer'> · </label><label className='hover:cursor-pointer'>{post.date}</label></span>
                </div>
                <div className='flex flex-col justify-center'>
                    <span className='text-sm' style={{ overflowWrap: 'anywhere' }}>{post.content}</span>
                    <div className='flex flex-wrap gap-6 xl:gap-24 mt-5 justify-center'>
                        <div className={`flex items-center gap-1 xl:gap-2 px-3 ${blueHovereableStyle}`}>
                            <FaRegComment className='text-md' />
                            <span className='absolute -right-4'>{post.comments.length}</span>
                        </div>
                        <div className={`flex items-center gap-1 xl:gap-2 px-[0.6rem] ${redHovereableStyle}`}>
                            <IoIosHeartEmpty className='text-xl hover:cursor-pointer rounded-full' />
                            <span className='absolute -right-4'>{post.likes.length}</span>
                        </div>
                        <div className='flex items-center gap-3 xl:gap-6'>
                            <div className={`p-3 ${blueHovereableStyle}`}>
                                <FaRegBookmark className='text-md' />
                            </div>
                            <div className={`p-2 px-[0.6rem] ${blueHovereableStyle}`}>
                                <IoShareOutline className='text-xl mb-1' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}