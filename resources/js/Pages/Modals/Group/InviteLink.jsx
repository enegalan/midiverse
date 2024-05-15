import BaseModal from '../BaseModal';
import { AuthButton } from '@/Components/Buttons';
import { FloatLabelInput } from '@/Components/Inputs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { closeModal, openModal } from '@/Functions';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiLink } from "react-icons/fi";
import { FaRegCopy } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { MdOutlineVisibility } from "react-icons/md";

export default function InviteLink({ auth_user = null, group = {}, roles = null }) {
    const [link, setLink] = useState(null);
    useEffect(() => {
        const formData = new FormData();
        formData.append('group_id', group.id);
        axios.post('/group/generate/invite', formData)
        .then(data => {
            if (data) {
                setLink(data.data);
            }
        })
    }, []);
    const closeThisModal = () => {
        closeModal('group-invite-link')
    }
    const handleCopy = () => {

    }
    const isAuthGroupOwner = group.roles.some(role => role.pivot.user_id === auth_user.id && role.id === 5);
    return (
        <BaseModal id='group-invite-link'>
            <div>
                <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                    <h3 className="text-left text-3xl font-semibold text-gray-900">
                        Link created
                    </h3>
                </div>
                <div className='flex flex-col gap-6'>
                    <section>
                        <CopyToClipboard text={link} onCopy={handleCopy}>
                            <button className='bg-[var(--light-grey)] px-3 py-2 flex gap-4 items-center rounded-lg transition duration-300 hover:bg-[var(--hover-light)] '>
                                <span className='text-lg'>
                                    <FiLink />
                                </span>
                                <div className='flex flex-col justify-start items-start'>
                                    <span className='text-md'>{link != null ? link : 'Loading...'}</span>
                                    <span className='text-[var(--grey)] text-left text-sm'>Anyone who has this link will be able to see the group information and will be part of the members.</span>
                                </div>
                                <span className='text-lg'>
                                    <FaRegCopy />
                                </span>
                            </button>
                        </CopyToClipboard>
                    </section>
                    <article className='w-full flex gap-4 items-center'>
                        <span><i className='text-[1.3rem] pi pi-stopwatch'></i></span>
                        <span className='text-md'>This link expires in 2 days.</span>
                    </article>
                    <article className='w-full flex gap-4 items-center'>
                        <span className='text-2xl'><TbReload /></span>
                        <span className='text-md'>You can create another link if this one expires.</span>
                    </article>
                    <article className='w-full flex gap-4 items-center'>
                        <span className='text-2xl'><MdOutlineVisibility /></span>
                        <span className='text-md'>The people you send the link to might notice that you are a member of this group.</span>
                    </article>
                </div>
                <div className='mt-16'>
                    <AuthButton onClick={closeThisModal} text='Close' className='text-white px-8 bg-[var(--main-blue)] hover:bg-[var(--hover-blue)]' />
                </div>
            </div>
        </BaseModal>
    );
}