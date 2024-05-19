import { useEffect, useState } from "react";
import { BackButton } from "../Buttons";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/react";

export default function PostTopNavbar() {
    return (
        <>
            <nav className='sticky flex items-center top-0 z-50 w-full backdrop-blur-md border-r'>
                <div className='bg-white/85 flex flex-col gap-6 items-center w-full pt-1'>
                    <div className='flex items-center gap-6 w-full py-1 px-1'>
                        <BackButton />
                        <h1 className='font-bold text-xl'>Post</h1>
                    </div>
                </div>
            </nav>
        </>
    );
}