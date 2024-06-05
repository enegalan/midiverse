import MainLayout from "@/Layouts/mainLayout";
import { BackButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import PeopleCard from "@/Components/Cards/PeopleCard";
import { openModal, closeModal } from "@/Functions";
import ConfirmationDialog from "@/Pages/Modals/ConfirmationDialog";
import { router } from "@inertiajs/react";

export default function Deactivate({ user = null }) {
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(false);
    const [activeElement, setActiveElement] = useState('account'); // account or null
    const handleDeactivate = (e) => {
        e.preventDefault();
        openModal('deactivate-confirmation-dialog', <ConfirmationDialog message='Are you sure?' getStatus={handleConfirm} id='deactivate-confirmation-dialog' buttonText='Confirm' />)
    }
    const handleConfirm = (status) => {
        if (status) {
            axios.delete('/account/deactivate')
        }
    }
    useEffect(() => {
        localStorage.removeItem('settings_active_link');
    }, [])
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('settings_active_link', 'account');
        router.get('/settings/account');
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
                        <div className='px-5 flex gap-8 mb-2'>
                            <BackButton onClick={handleBack} />
                            <h2 className='font-bold text-xl'>Deactivate your account</h2>
                        </div>
                        <div>
                            <PeopleCard user={user} disableFollowButton={true} />
                        </div>
                        <div className='px-8 mt-6'>
                            <h2 className='font-bold text-xl mb-4'>This will deactivate your account</h2>
                            <p className='text-[var(--grey)] text-sm'>You’re about to start the process of deactivating your MiDiverse account. Your display name, @username, and public profile will no longer be viewable.</p>
                            <h2 className='font-bold text-lg mt-4'>What else you should know</h2>
                        </div>
                        <ul className='mt-6'>
                            <li className='border-b py-3 text-sm text-[var(--grey)] px-8'>You can restore your MiDiverse account if it was accidentally or wrongfully deactivated for up to 30 days after deactivation.</li>
                            <li className='border-b py-3 text-sm text-[var(--grey)] px-8'>Some account information may still be available in search engines, such as Google or Bing.</li>
                            <li className='border-b py-3 text-sm text-[var(--grey)] px-8'>If you just want to change your @username, you don’t need to deactivate your account — edit it in your <Link className='text-[var(--main-blue)] hover:underline' href={`/u/${user.username}`}>profile</Link>.</li>
                            <Link onClick={handleDeactivate} className='text-[var(--red)]'>
                                <li className='py-4 px-8 text-center transition duration-300 cursor-pointer hover:bg-[var(--hover-like-red)]'>
                                    Deactivate
                                </li>
                            </Link>
                        </ul>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
