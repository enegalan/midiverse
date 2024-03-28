import { FollowButton } from "@/Components/Buttons";

export default function PeopleCard({ user = {} }) {
    return (
        <article className='flex p-3 gap-2 justify-start' id={user.id} key={user.id}>
            <div>
                <img className='w-10 min-w-10 rounded-full' src={user.avatar} alt={`${user.username} avatar`} />
            </div>
            <div className='flex flex-col w-full'>
                <div className="flex flex-row justify-between">
                    <div className='flex flex-col items-start'>
                        <span className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[160px] font-bold hover:underline hover:cursor-pointer'>{user.name + ' ' + user.lastname}</span>
                        <span className='text-sm text-gray-400'><label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] hover:cursor-pointer'>{'@' + user.username}</label></span>
                    </div>
                    <div>
                        <FollowButton id={user.id} />
                    </div>
                </div>
                <div>
                    <span className="text-sm">{user.description}</span>
                </div>
            </div>
        </article>
    );
}