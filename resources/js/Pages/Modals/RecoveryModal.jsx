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

export default function RecoveryModal({ email }) {
    const [step, setStep] = useState('recovery') // recovery or sent

    const handleSendRecoveryLink = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        axios.post('/user/send/recovery', formData)
        .then(data => {
            if (step == 'recovery') {
                goNextStep();
            }
        });
    }
    const goNextStep = () => {
        setStep('sent');
    }
    return (
        <BaseModal id='recovery-modal'>
            {step === 'recovery' ? (
                <>
                    <div className="flex flex-col gap-1 justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Account Recovery
                        </h3>
                        <p className='text-sm text-[var(--grey)]'>Your account is actually deactivated, but don't worry, you didn't loose it, miDiverse is waiting for you again!</p>
                    </div>
                    <div className='flex flex-col'>
                        <FloatLabelInput visualDisabled={true} keyfilter='email' className={`w-full`} id='email-recovery' text='Email' value={email} />
                        <AuthButton className={`mt-5 text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleSendRecoveryLink} text='Send recovery link' />
                    </div>
                </>
            ) : (
                // Recovery link sent step
                <section>
                    <div className="flex flex-col gap-1 justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Recovery link sent
                        </h3>
                        <p className='text-sm text-[var(--grey)]'>Your account recovery link has been sent to your email, if you didn't receive it repeat the process again to resend the link.</p>
                    </div>
                    <div className='flex flex-col gap-7 my-2'>
                        <div className='flex flex-col gap-6'>
                            <AuthButton className='select-none text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]' onClick={handleSendRecoveryLink} text='Resend recovery link' />
                        </div>
                    </div>
                </section>
            )}
        </BaseModal>
    );
}