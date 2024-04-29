import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { TextInput } from '@/Components/Inputs';
import { InputError } from '@/Components/Inputs';
import { FloatLabelInput } from '@/Components/Inputs';
import { AuthButton } from '@/Components/Buttons';
import { useState } from 'react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const [fpSection, SetFpSection] = useState('email')

    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

    const handleEmailChange = (e) => {
        setData('email', e.target.value)
        if (nextButtonDisabled) setNextButtonDisabled(false);
        if (e.target.value == '') {
            setNextButtonDisabled(true)
        }
    }

    const submit = (e) => {
        e.preventDefault();
        SetFpSection('sent')
        post(route('password.email'));
    };

    const handleGoBack = (e) => {
        e.preventDefault();
        SetFpSection('email');
    }

    return (
        <GuestLayout>
            
            {fpSection === 'email' ? (
                <>
                    <div className="mb-8 text-sm text-[var(--grey)]">
                        Forgot your password? No problem. Just let us know your email address and we will email you a password
                        reset link that will allow you to choose a new one.
                    </div>
                    <form onSubmit={submit}>
                        <FloatLabelInput
                            id='email'
                            text={'Type your email'}
                            value={data.email}
                            autoFocus={true}
                            type='email'
                            className='my-8 block w-full text-black'
                            onChange={handleEmailChange}
                        />
                        <InputError message={errors.email} className="mt-2" />
                        <AuthButton disabled={nextButtonDisabled || processing} className={`${nextButtonDisabled && 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default'} select-none text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={submit} text='Send verification link' />
                    </form>
                </>
            ) : (
                <section className='flex flex-col gap-4'>
                    <div>
                        {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                        <p className='text-[var(--grey)] text-sm'>Check your email to get your reset password link. If you need to request a new code, go back and request again.</p>
                    </div>
                    <AuthButton disabled={nextButtonDisabled || processing} className={`border select-none text-center w-full bg-[var(--white)] text-black hover:bg-[var(--hover-light)]`} onClick={handleGoBack} text='Back' />
                </section>
            )}

        </GuestLayout>
    );
}
