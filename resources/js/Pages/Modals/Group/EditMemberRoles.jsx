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
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { DropdownCheckbox } from '@/Components/Inputs';

export default function EditMemberRoles({ user = null, group = {}, roles = null }) {
    const [inviteDropdownVisible, setInviteDropdownVisible] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);
    
    const closeThisModal = () => {
        closeModal('edit-member-roles')
    }
    const handleSave = () => {
        const formData = new FormData();
        formData.append('roles', JSON.stringify(selectedRoles));
        formData.append('group_id', group.id);
        formData.append('user_id', user.id);
        axios.post('/group/roles/edit', formData)
        .then(data => {
            closeThisModal();
            window.location.reload();
        });
    }
    var userActualRoles = [];
    for (let groupRole of group.roles) {
        if (groupRole.pivot.user_id == user.id) {
            userActualRoles.push(groupRole.id);
        }
    }
    var roleOptions = [];
    if (roles && roles.length > 0) {
        for (let role of roles) {
            if (role.name !== 'group_owner') {
                roleOptions.push({
                    'label' : role.title,
                    'id' : role.id,
                })
            }
        }
    }
    const handleRoleChange = (role) => {
        console.log(role);
        setSelectedRoles(role);
    }
    return (
        <BaseModal id='edit-member-roles'>
            <div>
                <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                    <div className='flex flex-col gap-1'>
                        <h3 className="text-left text-2xl font-semibold text-gray-900">
                            Group Role Management
                        </h3>
                        <h4 className='text-left text-md text-[var(--grey)]'>
                            Edit {user.username}'s roles for {group.name} group
                        </h4>
                    </div>
                </div>
                <div className='flex flex-col gap-6'>
                    <section className='flex flex-col gap-6'>
                        <DropdownCheckbox onChange={handleRoleChange} options={roleOptions} selectedOptionIds={userActualRoles} />
                        <div className='flex'>
                            <IconButton onClick={(e) => {e.preventDefault();handleSave()}} className='flex text-white gap-2 px-6 bg-[var(--blue)] hover:bg-[var(--hover-blue)] items-center'>
                                <span>Save</span>
                            </IconButton>
                        </div>
                    </section>
                </div>
            </div>
        </BaseModal>
    );
}