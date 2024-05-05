// TODO: All TODO
import BaseModal from '../BaseModal';
import { AuthButton } from '@/Components/Buttons';
import { FloatLabelInput } from '@/Components/Inputs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { closeModal, openModal } from '@/Functions';
import { router } from '@inertiajs/react';
import { SearchInput } from '@/Components/Inputs';
import { FaPlus } from 'react-icons/fa6';
import { IconButton } from '@/Components/Buttons';
import { BsThreeDots } from 'react-icons/bs';
import PeopleCard from '@/Components/Cards/PeopleCard';
import InviteFriends from './InviteFriends';

export default function AddGroupMember({ auth_user = null, group = {} }) {
    const [inviteDropdownVisible, setInviteDropdownVisible] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdownElements = document.querySelectorAll(".dropdown");
            let outsideClick = true;
            for (let dropdown of dropdownElements) {
                if (dropdown.contains(event.target)) {
                    outsideClick = false;
                }
            }
            if (outsideClick) {
                setInviteDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [inviteDropdownVisible]);
    const goNextStep = () => {
        setStep('logo');
    }
    const closeThisModal = () => {
        closeModal('add-group-member-modal')
    }
    const postSuccess = () => {
        closeThisModal();
        router.get('groups')
    }
    const handleCreate = async () => {
        const formData = new FormData();
        try {
            await axios.post('/group/create', formData)
            postSuccess();
        } catch (error) {
            console.error(error)
        }
    }
    const handleInvite = () => {
        setInviteDropdownVisible(!inviteDropdownVisible);
    }
    const handleInviteFriends = () => {
        closeThisModal();
        openModal('group-invite-friends', <InviteFriends auth_user={auth_user} group={group} />);
    }
    const handleInviteWithLink = () => {

    }
    return (
        <BaseModal id='add-group-member-modal'>
            <div>
                <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                    <h3 className="text-left text-3xl font-semibold text-gray-900">
                        Members
                    </h3>
                    <div className='relative'>
                        <IconButton onClick={handleInvite} className='flex text-white gap-2 px-3 bg-[var(--main-blue)] hover:bg-[var(--hover-blue)] items-center'>
                            <FaPlus></FaPlus>
                            <span>Invite</span>
                        </IconButton>
                        {inviteDropdownVisible && (
                            <section className='dropdown absolute top-0 -left-36'>
                                <div className='absolute -top-40 left-4 min-w-[300px] bg-white rounded-lg shadow py-2'>
                                    <div className='flex flex-col gap-2'>
                                        <Link onClick={handleInviteFriends} className='flex flex-col px-4 py-2 hover:bg-[var(--hover-light)]'>
                                            <span className='text-md'>Invite miDiverse friends</span>
                                            <span className='text-xs'>Invite your friends to join to this group</span>
                                        </Link>
                                        <Link onClick={handleInviteWithLink} className='flex flex-col px-4 py-2 hover:bg-[var(--hover-light)]'>
                                            <span className='text-md'>Invite with link</span>
                                            <span className='text-xs'>Send an invite link so people can request to join</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="absolute top-[-0.5rem] left-44 w-5 flex justify-center overflow-hidden">
                                    <div className="shadow h-3 w-3 bg-white -rotate-45 transform origin-top-left"></div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
                <div className='flex flex-col gap-6'>
                    <SearchInput placeholder='Search a member' />
                    <section>
                        {group.members.map((member, index) => {
                            return (
                                <div key={index} className='flex items-center justify-between'>
                                    <PeopleCard auth_user={auth_user} user={member} />
                                    {group.roles.length > 0 ? (
                                        group.roles.map((role, index) => {
                                            if (role.pivot.user_id !== member.id) return;
                                            return (<span key={index} className='text-sm text-[var(--grey)] select-none'>{role.title}</span>)
                                        })
                                    ) : (<></>)}
                                    <IconButton>
                                        <BsThreeDots />
                                    </IconButton>
                                </div>
                            );
                        })}
                    </section>
                </div>
            </div>
        </BaseModal>
    );
}