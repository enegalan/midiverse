import { FollowButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function PeopleCard({ auth_user = {}, user = {}, className = '', disableFollowButton = false, redirect = true }) {
    var isAuthUser = false;
    if (auth_user['username'] == user['username'] || disableFollowButton) {
        isAuthUser = true;
    }
    const handleProfileRedirect = () => {
        router.get(`/u/${user.username}`);
    }
    return (
        <article onClick={redirect ? handleProfileRedirect : () => {}} className={`${className} flex p-3 gap-2 justify-start transition duration-300 ${redirect ? 'hover:bg-[var(--hover-light)] cursor-pointer' : ''}`} id={user.id} key={user.id}>
            <Link href={`/u/${user.username}`}>
                <img className='w-10 min-w-10 rounded-full' src={user.avatar} alt={`${user.username} avatar`} />
            </Link>
            <div className='flex flex-col w-full'>
                <div className="flex flex-row justify-between">
                    <div className='flex flex-col items-start'>
                        <Link href={`/u/${user.username}`} className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[160px] font-bold hover:underline cursor-pointer'>{user.name + ' ' + user.lastname}</Link>
                        <Link href={`/u/${user.username}`} className='text-sm text-gray-400'><label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] cursor-pointer'>{'@' + user.username}</label></Link>
                    </div>
                    <div>
                        {isAuthUser === false && (<FollowButton user={user} id={user.id} />)}
                    </div>
                </div>
                <div>
                    <span className="text-sm">{user.description}</span>
                </div>
            </div>
        </article>
    );
}