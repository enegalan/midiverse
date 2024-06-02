import MainLayout from "@/Layouts/mainLayout";
import { FloatLabelInput, SearchInput } from "@/Components/Inputs";
import { AuthButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { TbHeartBroken } from "react-icons/tb";
import { BackButton } from "@/Components/Buttons";
import { TextInput } from "@/Components/Inputs";
import axios from "axios";

export default function Password({ user = null }) {
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(false);
    const [activeElement, setActiveElement] = useState('account'); // account or null
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordVerify, setPasswordVerify] = useState('')

    const [passwordError, setPasswordError] = useState('')
    const [passwordVerifyError, setPasswordVerifyError] = useState('')

    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)

    const onCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    }
    const onNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    }
    const onPasswordVerifyChange = (e) => {
        setPasswordVerify(e.target.value);
    }
    useEffect(()=>{
        onInputChangeValidate();
    }, [currentPassword, newPassword, passwordVerify])
    function onInputChangeValidate () {
        if (user['auth_type'] != 'google' && currentPassword != '' && newPassword != '' && passwordVerify != '') {
            setSaveButtonDisabled(false);
        } else {
            setSaveButtonDisabled(true);
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        // Verify if current password is valid
        const formData = new FormData();
        formData.append('password', currentPassword);
        axios.post('/user/password/verify', formData)
        .then(res => {

        })
        // Verify if new password and verify password matches
    }
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
                        <div className='px-5 flex gap-8 items-center'>
                            <BackButton onClick={handleBack} />
                            <h2 className='font-bold text-xl'>Change your password</h2>
                        </div>
                        <div className='px-5 mt-12'>
                            <form className='flex flex-col gap-7 my-2'>
                                <div>
                                    <FloatLabelInput disabled={user['auth_type'] == 'google'} type='password' className={`w-full ${user['auth_type'] == 'google' && 'bg-[var(--light-grey)] pointer-events-none'}`} id='current-password' autoComplete='current-password' text='Current password' value={currentPassword} onChange={onCurrentPasswordChange} />
                                    {passwordError && <div className="text-red-500">{passwordError}</div>}
                                    <p className='text-gray-500 mt-1'><Link href='/forgot-password' className='text-[var(--main-blue)] hover:underline'>Forgot password?</Link></p>
                                </div>
                                <div className='mt-2'>
                                    <FloatLabelInput disabled={user['auth_type'] == 'google'} type='password' className={`w-full ${user['auth_type'] == 'google' && 'bg-[var(--light-grey)] pointer-events-none'}`} id='password-change' autoComplete='new-password' text='New password' value={newPassword} onChange={onNewPasswordChange} />
                                    {passwordVerifyError && <div className="text-red-500">{passwordVerifyError}</div>}
                                </div>
                                <div className='mt-2'>
                                    <FloatLabelInput disabled={user['auth_type'] == 'google'} type='password' className={`w-full ${user['auth_type'] == 'google' && 'bg-[var(--light-grey)] pointer-events-none'}`} id='password-verify-change' autoComplete='new-password' text='Verify password' value={passwordVerify} onChange={onPasswordVerifyChange} />
                                    {passwordVerifyError && <div className="text-red-500">{passwordVerifyError}</div>}
                                </div>
                                <div>
                                    <AuthButton disabled={saveButtonDisabled} className={`${saveButtonDisabled && 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default'} select-none text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleSave} text='Save' />
                                </div>
                            </form>
                        </div>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
