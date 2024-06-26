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

export default function Accessibility({ user = null }) {
    // TODO: useStates should get their states with user preferences, not with static boolean values.
    const [colorContrast, setColorContrast] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(false);
    const [activeElement, setActiveElement] = useState('accessibility_display_and_languages'); // accessibility_display_and_languages or null
    const handleColorContrastToggle = (e) => {
        e.preventDefault();
        setColorContrast(!colorContrast);
    }
    const handleReduceMotionToggle = (e) => {
        e.preventDefault();
        setReduceMotion(!reduceMotion);
    }
    useEffect(() => {
        localStorage.removeItem('settings_active_link');
    }, [])
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('settings_active_link', 'accessibility_display_and_languages');
        router.get('/settings/accessibility_display_and_languages');
    }
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className={`${hiddenRightNavbar ? 'flex' : 'hidden lg:flex'} flex-col w-full`} >
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <SettingsNavbar hidden={!hiddenRightNavbar} activeLink={activeElement} onClick={(e) => { setHiddenRightNavbar(!hiddenRightNavbar) }} />
                        </div>
                    </section>
                </div>
                <RightNavbar hideMobile={hiddenRightNavbar} className='w-[70%] lg:w-[40%]' rightBorder={true} setPaddingX={false} minWidth='700px'>
                    <div className='h-screen'>
                        <div className='px-5 flex gap-8 mb-2 items-center'>
                            <BackButton onClick={handleBack} />
                            <h2 className='font-bold text-xl'>Accesibility</h2>
                        </div>
                        <div className='px-8 mt-6'>
                            <p className='text-[var(--grey)] text-sm'>Manage aspects of your MiDiverse experience such as limiting color contrast and motion. These settings affect all the MiDiverse accounts on this browser.</p>
                        </div>
                        <div className='mt-2 flex flex-col gap-2'>
                            <div className='px-8 py-4'>
                                <h2 className='font-bold text-xl'>Vision</h2>
                                <div className='flex flex-col gap-3 mt-4'>
                                    <div onClick={handleColorContrastToggle} className={`flex flex-col justify-between py-2 cursor-pointer`}>
                                        <div className='flex justify-between items-center'>
                                            <span className={`text-black`}>Increase color contrast</span>
                                            <Checkbox readOnly={true} checked={colorContrast} />
                                        </div>
                                        <span className='text-sm text-[var(--grey)]'>Improves legibility by increasing the contrast between text and background colors.</span>
                                    </div>
                                </div>
                            </div>
                            <div className='px-8 py-4 border-t'>
                                <h2 className='font-bold text-xl'>Motion</h2>
                                <div className='flex flex-col gap-3 mt-4'>
                                    <div onClick={handleReduceMotionToggle} className={`flex flex-col justify-between py-2 cursor-pointer`}>
                                        <div className='flex justify-between items-center'>
                                            <span className={`text-black`}>Reduce motion</span>
                                            <Checkbox readOnly={true} checked={reduceMotion} />
                                        </div>
                                        <span className='text-sm text-[var(--grey)]'>Limits the amount of in-app animations, including live engagement counts.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
