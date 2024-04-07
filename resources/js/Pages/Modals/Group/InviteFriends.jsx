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
import { Checkbox } from '@/Components/Buttons';
import { CloseButton } from '@/Components/Buttons';

export default function InviteFriends({ auth_user = null, group = {} }) {
    const [users, setUsers] = useState([]);
    const [inviteDropdownVisible, setInviteDropdownVisible] = useState(false);
    const [sendInvitationButtonDisabled, setSendInvitationButtonDisabled] = useState(true);
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
        openModal('group-invite-friends');
    }
    const handleToggleCheckboxUser = (e) => {
        if (!e.target.checked) {
            setUsers(users.filter((user) => user.id != e.target.value));
        } else {
            const selectedUser = auth_user.followers.find((follower) => follower.id == e.target.value)
            setUsers(prevUsers => [...prevUsers, selectedUser]);
        }
        if (users.length === 0) {
            setSendInvitationButtonDisabled(false)
        } else {
            setSendInvitationButtonDisabled(true)
        }
    }
    const removeUser = (e) => {
        const userId = e.target.value;
        setUsers(users.filter((user) => user.id != userId));
        setCheckboxStatus(e.target.value + '-invite-checkbox', false);
        if (users.length === 0) {
            setSendInvitationButtonDisabled(false)
        } else {
            setSendInvitationButtonDisabled(true)
        }
    }
    const setCheckboxStatus = (id, status = false) => {
        const el = document.getElementById(id);
        if (el) el.checked = status;
    }
    return (
        <BaseModal id='add-group-member-modal'>
            <div>
                <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                    <h3 className="text-left text-3xl font-semibold text-gray-900">
                        Invite friends to this group
                    </h3>
                </div>
                <div className='flex gap-6'>
                    <div className='flex flex-col gap-6 w-[50%]'>
                        <SearchInput placeholder='Search a friend' />
                        <section>
                            {auth_user.followers.map((member, index) => {
                                return (
                                    <div key={index} className='flex justify-between items-center w-full transition duration-300 px-2'>
                                        <Link id={member.id + '-invite'} className=''>
                                            <PeopleCard className='pointer-events-none' disableFollowButton={true} auth_user={auth_user} user={member} />
                                        </Link>
                                        <Checkbox onChange={handleToggleCheckboxUser} value={member.id} name={member.id + '-invite'} id={member.id + '-invite-checkbox'} />
                                    </div>
                                );
                            })}
                        </section>
                    </div>
                    <div className='w-[50%] flex flex-col gap-2'>
                        <h4 className='text-sm'>{users.length} friends selected</h4>
                        <div className='flex flex-col'>
                            {users.length > 0 && (users.map((user, index) => {
                                return (
                                    <div className='flex justify-between' key={index}>
                                        <PeopleCard user={user} className='pointer-events-none text-sm' disableFollowButton={true} />
                                        <CloseButton value={user.id} onClick={removeUser} />
                                    </div>
                                );
                            }))}
                        </div>
                    </div>
                </div>
                <div className='absolute bottom-8 flex gap-6'>
                    <AuthButton text='Cancel' className='text-[var(--main-blue)] hover:bg-[var(--hover-light)]' />
                    <AuthButton text='Send invitation' className={`${sendInvitationButtonDisabled ? 'bg-[var(--light-grey)] text-[var(--grey)]' : 'text-white bg-[var(--main-blue)] hover:bg-[var(--light-blue)]'}`} />
                </div>
            </div>
        </BaseModal>
    );
}