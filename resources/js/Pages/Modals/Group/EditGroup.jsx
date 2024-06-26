
import BaseModal from '../BaseModal';
import { AuthButton } from '@/Components/Buttons';
import { FloatLabelInput } from '@/Components/Inputs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { closeModal } from '@/Functions';
import { router } from '@inertiajs/react';
import { Dropdown } from '@/Components/Inputs';
import { TextAreaInput, DragAndDropBox, DragAndDropBox2 } from '@/Components/Inputs';

export default function EditGroup( { auth_user = {}, group = {} } ) {
    const [name, setName] = useState(group.name)
    const [nameError, setNameError] = useState('')

    const [visibility, setVisibility] = useState(group.visibility)
    const [description, setDescription] = useState(group.description ?? '')
    const [groupLogo, setGroupLogo] = useState(group.logo);
    const [groupBanner, setGroupBanner] = useState(group.banner);

    const [nextStepButtonDisabled, setNextStepButtonDisabled] = useState(false)
    const [nextStepButtonDisabled2, setNextStepButtonDisabled2] = useState(false)
    const [editButtonDisabled, setEditButtonDisabled] = useState(false)

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
        setEditButtonDisabled(false);
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
            for (let group of auth_user.groups) {
                if (group.name == name) {
                    groupExists = 'false';
                }
            }
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
        closeModal('edit-group-modal')
    }
    const postSuccess = () => {
        onAuth();
        router.get('/g/'+group.name)
    }
    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('description', description);
        formData.append('visibility', visibility);
        formData.append('logo', groupLogo);
        formData.append('banner', groupBanner);
        try {
            await axios.post('/group/edit/'+group.id, formData)
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
        <BaseModal id='edit-group-modal'>
            {step === 'step1' ? (
                <div>
                    <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Edit {group.name} group
                        </h3>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <FloatLabelInput className={`${nameError ? 'p-invalid' : ''} w-full`} id='name-group' text='Name' value={name} onChange={onNameChange} />
                        {nameError && <div className="text-red-500">{nameError}</div>}
                        <Dropdown value={visibility} onChange={onVisibilityChange} options={visibilityOptions} />
                        <TextAreaInput className='w-full' value={description} onChange={onDescriptionChange} placeholder='Description (optional)' />
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
                        <DragAndDropBox id='group-logo' title='Drag and drop the group logo file here' previewImage={group.logo} onChange={onGroupLogoChange} />
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
                    <AuthButton disabled={editButtonDisabled} className={`${editButtonDisabled ? 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default' : ''} select-none text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleSave} text='Save' />
                </section>
            ) : (<></>)}
        </BaseModal>
    );
}