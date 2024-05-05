import React, { useState, useEffect } from 'react';
import { AuthButton, CloseButton } from '@/Components/Buttons';
import { FloatLabelInput, TextAreaInput } from '@/Components/Inputs';
import { Link } from '@inertiajs/react';
import { closeModal, formatDate, getAllMonths, getMonthDays, getYearsFromYearsAgo, getUserInitials, openModal } from '@/Functions';
import ConfirmationDialog from './ConfirmationDialog';
import { Dropdown } from '@/Components/Inputs';
import axios from 'axios';
import { InputError } from '@/Components/Inputs';

export default function EditProfileModal({ user }) {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [description, setDescription] = useState('');

    const [editBirthdateEnabled, setEditBirthdateEnabled] = useState(false);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [birthdate, setBirthdate] = useState('');

    const [nameError, setNameError] = useState(false);
    const nameErrorMessage = 'Name is required';

    useEffect(() => {
        if (user) {
            setName(user.name ?? '');
            setLastname(user.lastname ?? '');
            setDescription(user.description ?? '');

            if (user.birthdate) {
                const [birthYear, birthMonth, birthDay] = user.birthdate.split('-');
                setYear(birthYear);
                setMonth(birthMonth);
                setDay(birthDay);
                setBirthdate(user.birthdate);
            }
        }
    }, [user]);

    const postSuccess = () => {
        closeModal('edit-profile');
        window.location.reload();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (name && name.length > 0 && name.trim() != '') {
            const formData = new FormData();
            formData.append('name', name);
            if (lastname) {
                formData.append('lastname', lastname);
            }
            if (description) {
                formData.append('description', description);
            }
            if (year && month && day) {
                const birthdate = `${year}-${month}-${day}`;
                setBirthdate(birthdate);
                formData.append('birthdate', birthdate);
            }
            try {
                await axios.post('/user/profile/update', formData);
                postSuccess();
            } catch (error) {
                console.error(error);
            }
        } else {
            setNameError(true);
        }
    };

    const onClose = () => {
        closeModal('edit-profile');
    };

    const handleEditBirthdate = (e) => {
        e.preventDefault();
        openModal('edit-birthdate', <ConfirmationDialog getStatus={handleEditBirthdateConfirmation} id='edit-birthdate' buttonText='Edit' message='Edit date of birth?' subtitle='This can only be changed a few times. Make sure you enter the age of the person using the account.' />);
    };

    const handleEditBirthdateConfirmation = (status) => {
        setEditBirthdateEnabled(status);
        if (!year) setYear(getYearsFromYearsAgo()[getYearsFromYearsAgo().length - 1].value);
        if (!month) setMonth(getAllMonths()[0].value);
        if (!day) setDay('1');
    };

    const handleCancelBirthdate = (e) => {
        e.preventDefault();
        setEditBirthdateEnabled(false);
    };

    const handleRemoveBirthdate = (e) => {
        e.preventDefault();
        openModal('remove-birthdate', <ConfirmationDialog getStatus={handleRemoveBirthdateConfirmation} id='remove-birthdate' buttonText='Remove' message='Remove date of birth?' subtitle='This can only be changed a few times. Make sure you enter the age of the person using the account.' />);
    };

    const handleRemoveBirthdateConfirmation = (status) => {
        if (status) {
            setYear('');
            setMonth('');
            setDay('');
            setBirthdate('');
            setEditBirthdateEnabled(false);
        }
    };

    return (
        <div id='edit-profile' tabIndex="-1" aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen inset-0 max-h-full">
            <div className='fixed w-full h-screen pointer bg-[#00000066]'></div>
            <div className="relative max-w-[650px] w-full max-h-full">
                <div className="relative bg-white rounded-lg shadow min-h-[600px] max-h-[600px] overflow-y-auto">
                    <nav className='sticky flex items-center rounded-lg top-0 z-50 w-full backdrop-blur-md border-b border-gray-200/50'>
                        <div className='bg-white/85 px-3 flex gap-6 items-center w-full justify-between'>
                            <div className='flex gap-8 items-center'>
                                <CloseButton onClick={onClose} />
                                <div className='flex flex-col'>
                                    <h2 className='font-bold text-xl'>Edit profile</h2>
                                </div>
                            </div>
                            <AuthButton onClick={handleSave} className='bg-[var(--dark)] text-white transition duration-300 hover:bg-[var(--hover-black)]' text='Save' />
                        </div>
                    </nav>
                    <main className='flex flex-col items-center justify-center'>
                        <section className='w-full' id="edit-profile-header">
                            <div className={`min-h-[200px] w-full ${user.banner === null ? 'bg-[var(--hover-lightblue)]' : ''}`} id="banner">
                                {user.banner !== null && (<img src={user.banner} alt="Banner" />)}
                            </div>
                            <div className={`-mt-[50px] lg:-mt-[75px] ml-5`} id="avatar">
                                <div className='min-h-[6rem] xl:min-h-[9rem] border-4 border-white rounded-full w-fit flex justify-center items-center'>
                                    <img className='rounded-full h-auto w-24 lg:w-36' src={user.avatar !== null ? user.avatar : getUserInitials(user)} alt="Avatar" />
                                </div>
                            </div>
                        </section>
                        <section className='flex flex-col w-full gap-8 px-5 my-8' id='edit-profile-info'>
                            <div>
                                <FloatLabelInput invalid={nameError} className='w-full' onChange={(e) => { setName(e.target.value); if (e.target.value.length > 0) setNameError(false) }} value={name} text='Name' />
                                <InputError message={nameError && nameErrorMessage} className="mt-2" />
                            </div>
                            <FloatLabelInput className='w-full' onChange={(e) => { setLastname(e.target.value) }} value={lastname} text='Lastname' />
                            <TextAreaInput className='w-full' onChange={(e) => { setDescription(e.target.value) }} value={description} placeholder='Bio' />
                            <div className='flex flex-col'>
                                <div className='flex text-sm'>
                                    <span>Birth date · </span>
                                    {!editBirthdateEnabled ? (
                                        <Link onClick={handleEditBirthdate} className='text-[var(--main-blue)] transition duration-300 hover:text-[var(--hover-blue)]'>Edit</Link>
                                    ) : (
                                        <Link onClick={handleCancelBirthdate} className='text-[var(--main-blue)] transition duration-300 hover:text-[var(--hover-blue)]'>Cancel</Link>
                                    )}
                                </div>
                                <div>
                                    {!editBirthdateEnabled && (
                                        <span className={`text-lg font-semibold`}>{birthdate !== null && birthdate !== '' ? formatDate(birthdate, 'MMMM d, yyyy') : 'Add your date of birth'}</span>
                                    )}
                                    {editBirthdateEnabled && (
                                        <div>
                                            <p className='text-sm text-[var(--grey)]'>This should be the date of birth of the person using the account.</p>
                                            <div className='flex items-center gap-2 mt-5'>
                                                <Dropdown value={month} onChange={(e) => setMonth(e.target.value)} options={getAllMonths()} />
                                                <Dropdown value={day} onChange={(e) => setDay(e.target.value)} options={getMonthDays(month, year)} />
                                                <Dropdown value={year} onChange={(e) => setYear(e.target.value)} options={getYearsFromYearsAgo()} />
                                            </div>
                                            <div className='w-full my-6 flex'>
                                                <Link onClick={handleRemoveBirthdate} className='text-[var(--red)] w-full py-4 px-8 text-center transition duration-300 hover:bg-[var(--hover-red)]'>
                                                    Remove birth date
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
