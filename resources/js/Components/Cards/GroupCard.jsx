import { FollowButton } from "@/Components/Buttons";

export default function GroupCard({ group = {} }) {
    return (
        <article className='flex p-3 gap-4 justify-start' id={group.id} key={group.id}>
            <div>
                <img className='w-56 min-w-16 rounded-full' src={group.logo} alt={`${group.name} avatar`} />
            </div>
            <div className='flex flex-col w-full gap-6'>
                <div className="flex flex-row justify-between">
                    <div className='flex flex-col items-start'>
                        <span className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[160px] font-bold hover:underline hover:cursor-pointer'>{group.name}</span>
                    </div>
                    <div>
                        <FollowButton id={group.id} />
                    </div>
                </div>
                <div>
                    <span className="text-sm">{group.description}</span>
                </div>
            </div>
        </article>
    );
}