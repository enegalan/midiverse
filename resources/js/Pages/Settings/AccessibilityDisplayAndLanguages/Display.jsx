import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import { AuthButton, BackButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { TbHeartBroken } from "react-icons/tb";
import PeopleCard from "@/Components/Cards/PeopleCard";
import { Checkbox } from "@/Components/Buttons";
import { InputSwitch } from 'primereact/inputswitch';
import { Slider } from 'primereact/slider';
import { ColorOptions, BackgroundOptions } from "@/Components/Buttons";

export default function Display({ user = null }) {
    // TODO: useStates should get their states with user preferences, not with static boolean values.
    const [fontSize, setFontSize] = useState(50);
    const colorOptions = [
        {
            'value' : 'var(--main-blue)',
            'hover' : 'var(--hover-blue)',
        },
        {
            'value' : 'var(--red)',
            'hover' : 'var(--hover-red)',
        },
        {
            'value' : 'var(--pink)',
            'hover' : 'var(--hover-pink)',
        },
        {
            'value' : 'var(--purple)',
            'hover' : 'var(--hover-purple)',
        },
        {
            'value' : 'var(--orange)',
            'hover' : 'var(--hover-orange)',
        },
        {
            'value' : 'var(--green)',
            'hover' : 'var(--hover-green)',
        },
    ];
    const backgroundOptions = [
        {
            'name' : 'Default',
            'value' : 'white',
            'textColor' : 'black',
        },
        {
            'name' : 'Dark',
            'value' : 'var(--dark)',
            'textColor' : 'var(--white)',
        },
        {
            'name' : 'Lights out',
            'value' : 'var(--oled)',
            'textColor' : 'var(--light-grey)',
        },
    ];
    const handleFontSizeSlider = (e) => {
        setFontSize(e.value);
    }
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <SettingsNavbar activeLink='account' />
                        </div>
                    </section>
                </div>
                <RightNavbar width='625px' rightBorder={true} setPaddingX={false} minWidth='700px'>
                    <div className='h-screen'>
                        <div className='px-5 flex gap-8 mb-2 items-center'>
                            <BackButton />
                            <h2 className='font-bold text-xl'>Display</h2>
                        </div>
                        <div className='px-8 mt-6'>
                            <p className='text-[var(--grey)] text-sm'>Manage your font size, color, and background. These settings affect all the MiDiverse accounts on this browser.</p>
                        </div>
                        <div className='mt-12 flex flex-col gap-2'>
                            <div className='border-t px-8 py-4'>
                                <h2 className='font-bold text-xl'>Font size</h2>
                                <div className='flex justify-between gap-3 mt-6 items-center w-full'>
                                    <span className='text-xs'>Aa</span>
                                    <Slider className='w-full' value={fontSize} onChange={handleFontSizeSlider} step={25} />
                                    <span className='text-lg'>Aa</span>
                                </div>
                            </div>
                            <div className='border-t px-8 py-4'>
                                <h2 className='font-bold text-xl'>Color</h2>
                                <div className='flex gap-3 mt-6'>
                                    <ColorOptions colors={colorOptions} />
                                </div>
                            </div>
                            <div className='border-t px-8 py-4'>
                                <h2 className='font-bold text-xl'>Background</h2>
                                <div className='flex flex-col gap-3 mt-6'>
                                    <BackgroundOptions backgrounds={backgroundOptions} />
                                </div>
                            </div>
                        </div>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
