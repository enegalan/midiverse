
import BaseModal from './BaseModal';
import { AuthButton } from '@/Components/Buttons';
import { FloatLabelInput } from '@/Components/Inputs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { closeModal, openModal, validateEmail } from '@/Functions';
import { Dropdown } from '@/Components/Inputs';
import LoginModal from './LoginModal';
import { router } from '@inertiajs/react';

export default function RegisterModal() {
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')
    
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')

    const [month, setMonth] = useState(null)
    const [day, setDay] = useState(null)
    const [year, setYear] = useState(null)

    const [dateError, setDateError] = useState('')

    const months = [
        { label: 'January', id: 1, value: '01'},
        { label: 'February', id: 2, value: '02'},
        { label: 'March', id: 3, value: '03'},
        { label: 'April', id: 4, value: '04'},
        { label: 'May', id: 5, value: '05'},
        { label: 'June', id: 6, value: '06'},
        { label: 'July', id: 7, value: '07'},
        { label: 'August', id: 8, value: '08'},
        { label: 'September', id: 9, value: '9'},
        { label: 'October', id: 10, value: '10'},
        { label: 'November', id: 11, value: '11'},
        { label: 'December', id: 12, value: '12'},
    ];
    
    const days = Array.from({ length: 31 }, (_, index) => ({
        label: `${index + 1}`,
        value: index + 1
    }));
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 121 }, (_, index) => ({
        label: `${currentYear - index}`,
        value: currentYear - index
    }));
    
    const [password, setPassword] = useState('')
    const [passwordVerify, setPasswordVerify] = useState('')

    const [passwordError, setPasswordError] = useState('')
    const [passwordVerifyError, setPasswordVerifyError] = useState('')
    
    const [nextStepButtonDisabled, setNextStepButtonDisabled] = useState(true)
    const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true)

    const [step, setStep] = useState('register') // register or password

    const onNameChange = (e) => {
        setName(e.target.value);
        setNameError('');
        setNextStepButtonDisabled(false)
        if (e.target.value === '') {
            setNameError("What's your name?");
            setNextStepButtonDisabled(true)
        }
    }

    const onEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
        setNextStepButtonDisabled(false)
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError('')
    }

    const onPasswordVerifyChange = (e) => {
        setPasswordVerify(e.target.value);
        setPasswordVerifyError('')
        if (e.target.value !== '') {
            setRegisterButtonDisabled(false)
        }
    }

    const handleNextButton = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Invalid email format');
            setNextStepButtonDisabled(true);
            return;
        }
        if (email === '') {
            setEmailError('Please enter an email');
            setNextStepButtonDisabled(true);
            return;
        }
        if (day === null || month === null || year === null) {
            setDateError('Invalid date');
            setNextStepButtonDisabled(true);
            return;
        }
        axios.get('/user/email/exists/', {
            params: { email: email }
        }).then(res => {
            var userExists = res.data.status
            if (userExists == 'false') {
                goNextStep();
            } else {
                setEmailError('This email is already in use');
                setNextStepButtonDisabled(true);
                // TODO: Error toast
            }
        }).catch(error => {
            console.error(error)
        });
    }
    const handleBirthDay = (e) => {
        setDay(e.target.value);
        setDateError('')
        setNextStepButtonDisabled(false);
    }
    const handleBirthMonth = (e) => {
        setMonth(e.target.value);
        setDateError('')
        setNextStepButtonDisabled(false);
    }
    const handleBirthYear = (e) => {
        setYear(e.target.value);
        setDateError('')
        setNextStepButtonDisabled(false);
    }
    const goNextStep = () => {
        setStep('password');
    }
    const onAuth = () => {
        closeModal('register-modal')
    }
    const openLoginModal = () => {
        closeModal('register-modal');
        openModal('login-modal', <LoginModal/>);
    }
    const postSuccess = () => {
        onAuth();
        // Redirect logged user to home
        router.get('/home')
    }
    const handleRegister = async () => {
        if (password === '') {
            setPasswordError("Please enter a password")
            setRegisterButtonDisabled(true)
            return;
        }
        if (passwordVerify == '' || passwordVerify === null || password === null || password != passwordVerify) {
            setPasswordVerifyError('Password does not match')
            setRegisterButtonDisabled(true)
            return;
        }
        const user = [
            {
                'name' : name,
                'birthdate': `${year}-${month}-${day}`,
                'email' : email,
                'password' : password,
            }
        ];
        const formData = new FormData();
        formData.append('user', JSON.stringify(user));
        try {
            await axios.post('/users/register', formData);
            postSuccess();
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <BaseModal id='register-modal'>
            {step === 'register' ? (
                <section>
                    <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Create your account
                        </h3>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <div>
                            <FloatLabelInput className={`${nameError ? 'p-invalid' : ''} w-full`} id='name-register' text='Name' value={name} onChange={onNameChange} />
                            {nameError && <div className="text-red-500">{nameError}</div>}
                        </div>
                        <div>
                            <FloatLabelInput className={`${emailError ? 'p-invalid' : ''} w-full`} id='email-register' text='Email' value={email} onChange={onEmailChange} />
                            {emailError && <div className="text-red-500">{emailError}</div>}
                        </div>
                        <div>
                            <h3 className='font-bold text-sm'>Date of birth</h3>
                            <div className='flex gap-4 justify-around'>
                                <div>
                                    <label className='text-sm text-[var(--grey)]' htmlFor="birth-month">Month</label>
                                    <Dropdown placeholder='' onChange={handleBirthMonth} options={months} id='birth-month'/>
                                </div>
                                <div>
                                    <label className='text-sm text-[var(--grey)]' htmlFor="birth-day">Day</label>
                                    <Dropdown placeholder='' onChange={handleBirthDay} options={days} id='birth-day'/>
                                </div>
                                <div>
                                    <label className='text-sm text-[var(--grey)]' htmlFor="birth-year">Year</label>
                                    <Dropdown placeholder='' onChange={handleBirthYear} options={years} id='birth-year'/>
                                </div>
                            </div>
                            {dateError && <div className="text-red-500">{dateError}</div>}
                        </div>
                        <AuthButton disabled={nextStepButtonDisabled} className={`${nextStepButtonDisabled ? 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default' : ''} mt-5 text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleNextButton} text='Next' />
                    </div>
                </section>
            ) : (
                // Password step
                <section>
                    <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Enter your password
                        </h3>
                    </div>
                    <div className='flex flex-col gap-7 my-2'>
                        <FloatLabelInput disabled={true} className='w-full' id='disabled-email-register' text='Email' value={email} />
                        <div>
                            <FloatLabelInput type='password' className='w-full' id='password-register' text='Password' value={password} onChange={onPasswordChange} />
                            {passwordError && <div className="text-red-500">{passwordError}</div>}
                        </div>
                        <div>
                            <FloatLabelInput type='password' className='w-full' id='password-verify-register' text='Verify password' value={passwordVerify} onChange={onPasswordVerifyChange} />
                            {passwordVerifyError && <div className="text-red-500">{passwordVerifyError}</div>}
                        </div>
                        <div className='flex flex-col gap-6'>
                            <AuthButton disabled={registerButtonDisabled} className={`${registerButtonDisabled ? 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default' : ''} select-none text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleRegister} text='Create account' />
                            <p className='text-gray-500'>Already have an account? <Link onClick={openLoginModal} className='text-[var(--main-blue)] hover:underline'>Sign up</Link></p>
                        </div>
                    </div>
                </section>
            )}
        </BaseModal>
    );
}