
import BaseModal from '../BaseModal';
import { AuthButton } from '@/Components/Buttons';
import { FloatLabelInput } from '@/Components/Inputs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { closeModal, openModal } from '@/Functions';
import RegisterModal from '../RegisterModal';
import { router } from '@inertiajs/react';
import { Dropdown } from '@/Components/Inputs';
import { TextAreaInput, DragAndDropBox, DragAndDropBox2 } from '@/Components/Inputs';

export default function CreateGroup() {
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')

    const [visibility, setVisibility] = useState(0)
    const [description, setDescription] = useState('')
    const [groupLogo, setGroupLogo] = useState(null);
    const [groupBanner, setGroupBanner] = useState(null);

    const [nextStepButtonDisabled, setNextStepButtonDisabled] = useState(true)
    const [nextStepButtonDisabled2, setNextStepButtonDisabled2] = useState(true)
    const [createButtonDisabled, setCreateButtonDisabled] = useState(true)

    const [step, setStep] = useState('step1') // step1 or logo or banner

    const onNameChange = (e) => {
        setName(e.target.value);
        setNameError('');
        setNextStepButtonDisabled(true);
        if (e.target.value !== '') {
            setNextStepButtonDisabled(false);
        }
    }
    const onVisibilityChange = (e) => {
        setVisibility(e.target.value);
    }
    const onDescriptionChange = (e) => {
        setDescription(e.target.value);
    }
    const onGroupLogoChange = (logo) => {
        setGroupLogo(logo);
        setNextStepButtonDisabled2(false);
    }
    const onGroupBannerChange = (banner) => {
        setGroupBanner(banner);
        setCreateButtonDisabled(false);
    }

    const handleNextButton = (e) => {
        e.preventDefault();
        if (name === '') {
            setNameError('Please enter a name');
            setNextStepButtonDisabled(true);
            return;
        }
        axios.get('/group/name/exists/', {
            params: { name: name }
        }).then(res => {
            var groupExists = res.data.status
            if (groupExists == 'false') {
                goNextStep();
            } else {
                setNameError('This name is already in use');
                setNextStepButtonDisabled(true);
                // TODO: Error toast
            }
        }).catch(error => {
            console.error(error)
        });
    }
    const handleNextButton2 = (e) => {
        e.preventDefault();
        goNextStep2();
    }
    const goNextStep = () => {
        setStep('logo');
    }
    const goNextStep2 = () => {
        setStep('banner');
    }
    const onAuth = () => {
        closeModal('create-group-modal')
    }
    const postSuccess = () => {
        onAuth();
        router.get('groups')
    }
    const handleCreate = async () => {
        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('description', description);
        formData.append('visibility', visibility);
        formData.append('logo', groupLogo);
        formData.append('banner', groupBanner);
        try {
            await axios.post('/group/create', formData)
            postSuccess();
        } catch (error) {
            console.error(error)
        }
    }
    const visibilityOptions = [
        {
            label : 'Public',
            value : 0,
        },
        {
            label : 'Private',
            value : 1,
        },
    ];
    return (
        <BaseModal id='create-group-modal'>
            {step === 'step1' ? (
                <div>
                    <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Create a group
                        </h3>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <FloatLabelInput className={`${nameError ? 'p-invalid' : ''} w-full`} id='name-group' text='Name' value={name} onChange={onNameChange} />
                        {nameError && <div className="text-red-500">{nameError}</div>}
                        <Dropdown onChange={onVisibilityChange} options={visibilityOptions} />
                        <TextAreaInput onChange={onDescriptionChange} cols={'21'} placeholder='Description (optional)' />
                        <AuthButton disabled={nextStepButtonDisabled} className={`${nextStepButtonDisabled ? 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default' : ''} mt-5 text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleNextButton} text='Next' />                        
                    </div>
                </div>
            ) : step === 'logo' ? (
                // Group Logo
                <section>
                    <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Group logo
                        </h3>
                    </div>
                    <div className='flex flex-col gap-7 my-2'>
                        <DragAndDropBox id='group-logo' title='Drag and drop the group logo file here' previewImage={groupLogo} onChange={onGroupLogoChange} />
                    </div>
                    <AuthButton disabled={nextStepButtonDisabled2} className={`${nextStepButtonDisabled2 ? 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default' : ''} mt-5 text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleNextButton2} text='Next' />                        
                </section>
            ) : step === 'banner' ? (
                // Group Banner
                <section>
                    <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Group banner
                        </h3>
                    </div>
                    <div className='flex flex-col gap-7 my-2'>
                        <DragAndDropBox2 id='group-banner' title='Drag and drop the group banner file here' previewImage={groupBanner} onChange={onGroupBannerChange} />
                    </div>
                    <AuthButton disabled={createButtonDisabled} className={`${createButtonDisabled ? 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default' : ''} select-none text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleCreate} text='Create group' />
                </section>
            ) : (<></>)}
        </BaseModal>
    );
}