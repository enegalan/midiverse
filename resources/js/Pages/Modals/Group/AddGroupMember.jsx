import BaseModal from '../BaseModal';
import { AuthButton } from '@/Components/Buttons';
import { FloatLabelInput } from '@/Components/Inputs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { closeDropdownsOnClickOutside, closeModal, openModal } from '@/Functions';
import { router } from '@inertiajs/react';
import { SearchInput } from '@/Components/Inputs';
import { FaPlus } from 'react-icons/fa6';
import { IconButton } from '@/Components/Buttons';
import { BsThreeDots } from 'react-icons/bs';
import PeopleCard from '@/Components/Cards/PeopleCard';
import InviteFriends from './InviteFriends';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import EditMemberRoles from './EditMemberRoles';
import InviteLink from './InviteLink';

export default function AddGroupMember({ auth_user = null, group = {}, roles = null }) {
    const [inviteDropdownVisible, setInviteDropdownVisible] = useState(false);
    const [memberMoreOptions, setMemberMoreOptions] = useState(null);
    closeDropdownsOnClickOutside([inviteDropdownVisible], [setInviteDropdownVisible, setMemberMoreOptions])
    const closeThisModal = () => {
        closeModal('add-group-member-modal')
    }
    const handleInvite = (e) => {
        e.preventDefault();
        setInviteDropdownVisible(!inviteDropdownVisible);
    }
    const handleInviteFriends = () => {
        closeThisModal();
        openModal('group-invite-friends', <InviteFriends group_roles={roles} auth_user={auth_user} group={group} />);
    }
    const handleGroupMemberMoreOptions = (id) => {
        setMemberMoreOptions(id);
    }
    const handleDeleteUser = (user_id) => {
        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('group_id', group.id);
        axios.post('/group/member/delete', formData)
        .then(data => {
            closeThisModal();
            window.location.reload()
        });
    }
    const handleEditUserRoles = (user_id) => {
        closeThisModal();
        // Get the user from group
        var user = null;
        for (let groupMember of group.members) {
            if (groupMember.id == user_id) {
                user = groupMember;
            }
        }
        openModal('edit-member-roles', <EditMemberRoles user={user} group={group} roles={roles} />)
    }
    const handleInviteWithLink = () => {
        closeThisModal();
        openModal('group-invite-link', <InviteLink auth_user={auth_user} group={group} roles={roles} />)
    }
    const isAuthGroupOwner = group.roles.some(role => role.pivot.user_id === auth_user.id && role.id === 5);
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
                            const isOwner = group.roles.some(role => role.pivot.user_id === member.id && role.id === 5);
                            return (
                                <div key={index} id={`group-member-${index}`} className='flex items-center justify-between relative'>
                                    <PeopleCard auth_user={auth_user} user={member} />
                                    {group.roles.map((role, index) => {
                                        if (role.pivot.user_id === member.id) {
                                            return (
                                                <div key={index}>
                                                    <span className='text-sm text-[var(--grey)] select-none'>
                                                        {role.title}
                                                    </span>
                                                    <span></span>
                                                </div>
                                            );
                                        }
                                    })}
                                    <div className='relative inline-flex'>
                                        {!isOwner && (
                                            <IconButton onClick={(e) => { e.preventDefault(); handleGroupMemberMoreOptions(`group-member-${index}`) }}>
                                                <BsThreeDots />
                                            </IconButton>
                                        )}
                                        {memberMoreOptions === `group-member-${index}` && (
                                            <section className='dropdown absolute top-10 -left-20'>
                                                <div className={`absolute -top-[${isAuthGroupOwner ? '9.7rem' : '6.7rem'}] left-0 min-w-[160px] bg-white rounded-lg shadow py-2`}>
                                                    <div className='flex flex-col gap-2'>
                                                        {isAuthGroupOwner && (
                                                            <Link onClick={(e) => {e.preventDefault();handleEditUserRoles(member.id)}} className='flex items-center gap-2 px-4 py-2 hover:bg-[var(--hover-light)]'>
                                                                <MdOutlineEdit />
                                                                <span className='text-md'>Edit roles</span>
                                                            </Link>
                                                        )}
                                                        <Link onClick={(e) => {e.preventDefault();handleDeleteUser(member.id)}} className='flex items-center gap-2 px-4 py-2 hover:bg-[var(--hover-red)] text-[var(--red)]'>
                                                            <MdDeleteOutline />
                                                            <span className='text-md'>{member.id == auth_user.id ? 'Leave group' : isAuthGroupOwner && 'Remove user'}</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="absolute top-[-3.2rem] left-[5.25rem] w-5 flex justify-center overflow-hidden">
                                                    <div className="shadow h-3 w-3 bg-white -rotate-45 transform origin-top-left"></div>
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                </div>
            </div>
        </BaseModal>
    );
}