import MainLayout from "@/Layouts/mainLayout";
import { BackButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import PeopleCard from "@/Components/Cards/PeopleCard";
import { openModal, closeModal } from "@/Functions";
import ConfirmationDialog from "@/Pages/Modals/ConfirmationDialog";

export default function Deactivate({ user = null }) {
    const handleDeactivate = (e) => {
        e.preventDefault();
        openModal('deactivate-confirmation-dialog', <ConfirmationDialog message='Are you sure?' getStatus={handleConfirm} id='deactivate-confirmation-dialog' buttonText='Confirm'  />)
    }
    const handleConfirm = (status) => {
        if (status) {
            axios.delete('/account/deactivate')
        }
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
                        <div className='px-5 flex gap-8 mb-2'>
                            <BackButton />
                            <h2 className='font-bold text-xl'>Deactivate your account</h2>
                        </div>
                        <Link className='block transition duration-300 hover:bg-[var(--hover-light)]' href={`/u/${user.username}`}>
                            <PeopleCard user={user} disableFollowButton={true} />
                        </Link>
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
                                <li className='py-4 px-8 text-center transition duration-300 hover:cursor-pointer hover:bg-[var(--hover-red)]'>
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
