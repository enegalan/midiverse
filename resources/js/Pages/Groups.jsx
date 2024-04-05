import { useState } from 'react';

import MainLayout from '@/Layouts/mainLayout';
import { SearchInput } from '@/Components/Inputs';
import GroupsNavbar from '@/Components/Navbars/GroupsNavbar';
import GroupCard from '@/Components/Cards/GroupCard';
import { IconButton } from '@/Components/Buttons';
import { FaPlus } from "react-icons/fa";
import { openModal, closeModal } from '@/Functions';
import CreateGroup from './Modals/Group/CreateGroup';
import { Link } from '@inertiajs/react';
export default function Groups({ auth_user = null, groups = null, top_groups = null }) {
    console.log(auth_user)
    const [groupsSection, setGroupsSection] = useState(localStorage.getItem('groups_default_section') ? localStorage.getItem('groups_default_section') : 'top')
    const getGroupsSection = (section) => {
        setGroupsSection(section);
    }
    const handleCreateGroup = (e) => {
        e.preventDefault();
        openModal('create-group-modal', <CreateGroup />)
    }
    return (
        <>
            <MainLayout user={auth_user} headerClassName='backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50' defaultBackgroundColor='transparent' defaultTextColor='var(--main-blue)' dynamicBackground={false}>
                <section className='pb-16 border-r relative max-w-[800px] flex-1'>
                    <div className='px-3 py-3'>
                        <SearchInput placeholder='Search' />
                    </div>
                    <GroupsNavbar getGroupsSection={getGroupsSection} />
                    <div className='w-full h-full'>
                        {/* Top */}
                        <section className={`${groupsSection === 'top' ? 'block' : 'hidden'}`} id='top'>
                            {top_groups && top_groups.length > 0 ? (
                                top_groups.map((group, id) => (
                                    <Link key={id} href={`/group/${group.name}`}>
                                        <GroupCard className='transition duration-200 hover:bg-[var(--hover-light)]' key={id} group={group} />
                                    </Link>
                                ))
                            ) : (
                                <span className='font-[var(--grey)] p-6 block'>No results available for now :(</span>
                            )}
                        </section>
                        {/* New */}
                        <section className={`${groupsSection === 'new' ? 'block' : 'hidden'}`} id='new'>
                            {groups && groups.length > 0 ? (
                                groups.map((group, id) => (
                                    <Link key={id} href={`/group/${group.name}`}>
                                        <GroupCard className='transition duration-200 hover:bg-[var(--hover-light)]' key={id} group={group} />
                                    </Link>
                                ))
                            ) : (
                                <span className='font-[var(--grey)] p-6 block'>No results available for now :(</span>
                            )}
                        </section>
                        {/* My Groups */}
                        <section className={`${groupsSection === 'my-groups' ? 'block' : 'hidden'}`} id='my-groups'>
                            
                            {auth_user.groups && auth_user.groups.length > 0 ? (
                                <div>
                                    <div className='flex items-center justify-between p-2'>
                                    <h2 className='font-bold text-3xl'>Manage groups</h2>
                                    <IconButton onClick={handleCreateGroup} className='flex items-center gap-1 px-3'>
                                        <FaPlus />
                                        <span>Create</span>
                                    </IconButton>
                                </div>
                                {auth_user.groups.map((group, id) => (
                                    <Link key={id} href={`/group/${group.name}`}>
                                        <GroupCard className='transition duration-200 hover:bg-[var(--hover-light)]' disableFollowButton={true} key={id} group={group} />
                                    </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className='flex flex-col gap-3 p-6'>
                                    <div className='flex items-center justify-between'>
                                        <h2 className='font-bold text-3xl'>Looks empty here...</h2>
                                        <IconButton onClick={handleCreateGroup} className='flex items-center gap-1 px-3'>
                                            <FaPlus />
                                            <span>Create</span>
                                        </IconButton>
                                    </div>
                                    <span className='font-[var(--grey)] block'>Create your first group and share your music with them planificating concerts.</span>
                                </div>
                            )}
                        </section>
                    </div>
                </section>
                <section className='lg:min-w-[350px] px-6 py-12 '>
                    <div className='w-[260px] hidden lg:block'>
                        <div className='fixed'>
                            <SearchInput placeholder="Search" />
                        </div>
                    </div>
                </section>
            </MainLayout>
        </>
    );
}
