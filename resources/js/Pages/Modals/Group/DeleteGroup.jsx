
import BaseDialog from '../BaseDialog';
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

export default function DeleteGroup({ group = {} }) {
    const handleDelete = () => {
        try {
            axios.delete('/group/delete/'+group.name)
            closeModal('delete-group-dialog')
            axios.get('/groups/')
        } catch (error) {
            console.error(error)
        }
    }
    const handleCancel = () => {
        closeModal('delete-group-dialog')
    }
    return (
        <BaseDialog id='delete-group-dialog'>
            <div>
                <div className="flex justify-between pb-6 rounded-t w-full">
                    <h3 className="text-left text-3xl font-semibold text-gray-900">
                        Are you sure?
                    </h3>
                </div>
                <section className='pb-6'>
                    <p className='text-md'>If you delete this group all MIDI and concerts will be removed from miDiverse</p>
                </section>
                <div className='flex flex-row justify-between gap-6'>
                    <AuthButton className={`mt-5 text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleCancel} text='Cancel' />
                    <AuthButton className={`mt-5 text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleDelete} text='Confirm' />
                </div>
            </div>
        </BaseDialog>
    );
}