import { useEffect, useState } from "react";
import GroupCard from "@/Components/Cards/GroupCard";
import { Link } from "@inertiajs/react";
import { AuthButton } from "@/Components/Buttons";
import { IconButton } from "@/Components/Buttons";
import { FaPlus } from "react-icons/fa6";
import { openModal } from "@/Functions";
import CreateGroup from "@/Pages/Modals/Group/CreateGroup";

export default function MyGroups({ groups = null }) {
    const handleCreateGroup = (e) => {
        e.preventDefault();
        openModal('create-group-modal', <CreateGroup />)
    }
    return (
        <>
            <article className='rounded-lg py-3 flex flex-col items-center top-0 z-50 w-full backdrop-blur-md bg-[var(--hover-light)]'>
                <h3 className='px-4 pb-2 font-bold text-lg self-start'>My groups</h3>
                <div className='flex flex-col gap-1 divide-y items-center w-full'>
                    {groups.length > 0 ? (
                        <div className='w-full flex flex-col gap-3'>
                            <IconButton onClick={handleCreateGroup} className='flex mx-2 bg-white/50 hover:bg-[var(--hover-light)] justify-center items-center gap-1 px-3'>
                                <FaPlus />
                                <span>Create</span>
                            </IconButton>
                            {groups.map((group, index) => {
                                return (
                                    <Link href={`/g/${group.name}`} className={`w-full transition duration-300 hover:bg-[var(--hover-light)]`} key={index}>
                                        <GroupCard disableFollowButton={true} group={group} />
                                    </Link>
                                );
                            })}
                        </div>
                    )
                        : (
                            <div className='flex flex-col gap-2 px-4'>
                                <p>Create your first group and share your music.</p>
                                <IconButton onClick={handleCreateGroup} className='flex items-center gap-1 px-3 hover:bg-[var(--hover-light)]'>
                                    <FaPlus />
                                    <span>Create</span>
                                </IconButton>
                            </div>
                        )
                    }
                </div>
            </article>
        </>
    );
}