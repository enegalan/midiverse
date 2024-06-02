import MainLayout from "@/Layouts/mainLayout";
import { BackButton } from "@/Components/Buttons";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import { useState, useEffect } from "react";
import { InputSwitch } from 'primereact/inputswitch';
import axios from "axios";

export default function AudienceAndMedia({ user = null }) {
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(false);
    const [activeElement, setActiveElement] = useState('privacity'); // privacity or null
    const [privateAccountEnabled, setPrivateAccountEnabled] = useState(user.private);
    const handlePrivateAccount = (e) => {
        e.preventDefault();
        setPrivateAccountEnabled(!privateAccountEnabled);
        axios.post('/user/set/private')
    }
    useEffect(() => {
        localStorage.removeItem('settings_active_link');
    }, [])
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('settings_active_link', 'privacity');
        router.get('/settings/privacity');
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
                            <h2 className='font-bold text-xl'>Audience and media</h2>
                        </div>
                        <div className='px-8 mt-6'>
                            <p className='text-[var(--grey)] text-sm'>Manage what information you allow other people on MiDiverse to see.</p>
                        </div>
                        <div className='px-8 my-8' onClick={handlePrivateAccount}>
                            <div className='pointer-events-none flex justify-between items-center'>
                                <h2 className='font-bold'>Private account</h2>
                                <InputSwitch className="pointer-events-none" checked={privateAccountEnabled} onClick={handlePrivateAccount} />
                            </div>
                            <p className='text-[var(--grey)] text-sm'>With private account only your MiDiverse followers will be able to see and enjoy your posts and media.</p>
                        </div>
                        <ul className='mt-6 flex flex-col gap-8'>
                            <li className='px-8'>
                                <div className='flex items-center justify-between'>
                                    <h3 className={`font-bold text-md text-[var(--grey)] ${privateAccountEnabled && 'text-black'}`} >Protect your posts</h3>
                                </div>
                                <div>
                                    <p className={`text-sm text-[var(--grey)]`}>When selected, your posts and other account information are only visible to people who follow you.</p>
                                </div>
                            </li>
                            <li className='px-8'>
                                <div className='flex items-center justify-between'>
                                    <h3 className={`font-bold text-md text-[var(--grey)] ${privateAccountEnabled && 'text-black'}`}>Protect your media</h3>
                                </div>
                                <div>
                                    <p className='text-sm text-[var(--grey)]'>If selected, MIDIs will not be downloadable by default.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
