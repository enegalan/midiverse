
import BaseModal from './BaseModal';
import { GoogleLoginButton, AuthButton } from '@/Components/Buttons';
import { FloatLabelInput } from '@/Components/Inputs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Separator from '@/Components/Separator';
import { Link } from '@inertiajs/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { closeModal, openModal, validateEmail } from '@/Functions';
import RegisterModal from './RegisterModal';
import { router } from '@inertiajs/react';

export default function LoginModal() {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [loginButtonDisabled, setLoginButtonDisabled] = useState(true)
    const [step, setStep] = useState('login') // login or password
    const onEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    }
    const onPasswordChange = (e) => {
        setPassword(e.target.value);
        setLoginButtonDisabled(true);
        if (e.target.value.length !== 0) {
            setLoginButtonDisabled(false);
        }
    }
    const handleNextButton = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Invalid email format');
        }
        axios.get('/user/email/exists/', {
            params: { email: email }
        }).then(res => {
            var userExists = res.data.status
            if (userExists == 'true') {
                goNextStep();
            } else {
                // TODO: Error toast
            }
        }).catch(error => {
            console.error(error)
        });
    }
    const goNextStep = () => {
        setStep('password');
    }
    const onAuth = () => {
        closeModal('login-modal')
    }
    const openRegisterModal = () => {
        closeModal('login-modal')
        openModal('register-modal', <RegisterModal />)
    }
    const postSuccess = () => {
        onAuth();
        router.get('/home')
    }
    const handleForgotPassword = (e) => {
        e.preventDefault();
        router.get('/forgot-password')
        closeModal('login-modal');
    }
    const handleLogin = async () => {
        const formData = new FormData();
        const user = [
            {
                'email' : email,
                'password' : password,
            }
        ];
        formData.append('user', JSON.stringify(user))
        try {
            await axios.post('/users/login', formData)
            postSuccess();
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <BaseModal id='login-modal'>
            {step === 'login' ? (
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API}>
                    <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Sign in
                        </h3>
                    </div>
                    <GoogleLoginButton onAuth={onAuth} />
                    <Separator />
                    <div className='flex flex-col'>
                        <FloatLabelInput keyfilter='email' className={`${emailError ? 'p-invalid' : ''} w-full`} id='email-login' text='Email' value={email} onChange={onEmailChange} />
                        {emailError && <div className="text-red-500">{emailError}</div>}
                        <AuthButton className={`mt-5 text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleNextButton} text='Next' />
                        <AuthButton className='mt-5 text-center border w-full bg-[var(--white)] text-black hover:bg-[var(--hover-lightblue)]' onClick={handleForgotPassword} text='Forgot password?' />
                        <div className='mt-14'>
                            <p className='text-gray-500'>Don't have an account? <Link onClick={openRegisterModal} className='text-[var(--main-blue)] hover:underline'>Sign up</Link></p>
                        </div>
                    </div>
                </GoogleOAuthProvider>
            ) : (
                // Password step
                <section>
                    <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Enter your password
                        </h3>
                    </div>
                    <div className='flex flex-col gap-7 my-2'>
                        <FloatLabelInput disabled={true} className='w-full' id='disabled-email-login' text='Email' value={email} />
                        <FloatLabelInput type='password' className='w-full' id='password-login' text='Password' value={password} onChange={onPasswordChange} />
                        <Link onClick='/forgot-password' className='w-max text-[0.7rem] -mt-6 ml-1 p-0 text-[var(--main-blue)] hover:underline'>Forgot your password?</Link>
                        <div className='flex flex-col gap-6'>
                            <AuthButton disabled={loginButtonDisabled} className={`${loginButtonDisabled ? 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default' : ''} select-none text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleLogin} text='Log in' />
                            <p className='text-gray-500'>Don't have an account? <Link onClick={openRegisterModal} className='text-[var(--main-blue)] hover:underline'>Sign up</Link></p>
                        </div>
                    </div>
                </section>
            )}
        </BaseModal>
    );
}