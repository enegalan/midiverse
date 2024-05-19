import BaseDialog from './BaseDialog';
import { AuthButton } from '@/Components/Buttons';
import { closeModal } from '@/Functions';
import { useEffect } from 'react';
import { useState } from 'react';

export default function ConfirmationDialog({ id = 'confirmation-dialog', message = '', subtitle = '', onCancel = (e) => {}, onConfirm = (e) => {}, getStatus = (status) => {}, buttonText = '' }) {
    const [confirmed, setConfirmed] = useState(false)
    const handleConfirm = (e) => {
        e.preventDefault()
        setConfirmed(true)
        try {
            closeModal(id)
            onConfirm()
        } catch (error) {
            console.error(error)
        }
    }
    const handleCancel = (e) => {
        e.preventDefault()
        setConfirmed(false)
        closeModal(id)
        onCancel()
    }
    useEffect(() => {
        getStatus(confirmed)
    }, [confirmed])
    return (
        <BaseDialog miniDialog={true} closeButton={false} width='400px' id={id}>
            <div>
                <div className="flex justify-between pb-2 rounded-t w-full">
                    <h3 className="text-left text-xl font-semibold text-gray-900">
                        {message}
                    </h3>
                </div>
                <section className='pb-6'>
                    <p className='text-sm text-[var(--grey)]'>{subtitle}</p>
                </section>
                <div className='flex flex-col justify-between gap-3'>
                    <AuthButton className={`text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleConfirm} text={buttonText} />
                    <AuthButton className={`text-center w-full bg-[var(--white)] border text-black hover:bg-[var(--hover-light)]`} onClick={handleCancel} text='Cancel' />
                </div>
            </div>
        </BaseDialog>
    );
}
