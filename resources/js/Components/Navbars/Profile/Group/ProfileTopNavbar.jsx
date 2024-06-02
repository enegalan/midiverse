import { useEffect, useState } from "react";
import { BackButton } from "../../../Buttons";

export default function ProfileTopNavbar({ group = null }) {
    return (
        <>
            <nav className='sticky flex items-center top-0 z-50 w-full backdrop-blur-md border-b border-r border-gray-200/50'>
                <div className='bg-white/25 flex gap-6 items-center w-full'>
                    <BackButton />
                    <div className='flex flex-col cursor-pointer'>
                        <h2 className='text-lg font-bold'>{group.name}</h2>
                        <span className='text-xs text-[var(--grey)]'>{group.followers.length} followers</span>
                    </div>
                </div>
            </nav>
        </>
    );
}