import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { InputError } from '@/Components/Inputs';
import { FloatLabelInput } from '@/Components/Inputs';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AuthButton } from '@/Components/Buttons';

export default function ResetPassword({ token, email }) {
    const [resetButtonDisabled, setResetButtonDisabled] = useState(true);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });
    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);
    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };
    const handlePasswordChange = (e) => {
        setData('password', e.target.value);
        setResetButtonDisabled(true);
        if (e.target.value !== '' && data.password_confirmation !== '') {
            setResetButtonDisabled(false);
        }
    };
    const handlePasswordVerifyChange = (e) => {
        setData('password_confirmation', e.target.value);
        setResetButtonDisabled(true);
        if (e.target.value !== '' && data.password !== '') {
            setResetButtonDisabled(false);
        }
    };
    return (
        <GuestLayout>
            <form className='flex flex-col gap-4' onSubmit={submit}>
                <div>
                    <FloatLabelInput
                        id='email'
                        name='email'
                        value={data.email}
                        type='email'
                        disabled={true}
                        className='block w-full text-black'
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                    <FloatLabelInput
                        id='password'
                        name='password'
                        value={data.password}
                        autoFocus={true}
                        type='password'
                        text={'New password'}
                        className='block w-full text-black'
                        onChange={handlePasswordChange}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div className="mt-4">
                    <FloatLabelInput
                        id='password_confirmation'
                        name='password_confirmation'
                        value={data.password_confirmation}
                        type='password'
                        text={'Confirm new password'}
                        className='block w-full text-black'
                        onChange={handlePasswordVerifyChange}
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>
                <div className="flex items-center justify-end mt-4">
                    <AuthButton disabled={resetButtonDisabled || processing} className={`${resetButtonDisabled && 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default'} select-none text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={submit} text='Reset password' />
                </div>
            </form>
        </GuestLayout>
    );
}
