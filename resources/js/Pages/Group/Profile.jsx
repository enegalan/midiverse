import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import ProfileTopNavbar from "@/Components/Navbars/Profile/Group/ProfileTopNavbar";
import ProfileBottomNavbar from "@/Components/Navbars/Profile/Group/ProfileBottomNavbar";
import { AuthButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { IconButton } from "@/Components/Buttons";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "@inertiajs/react";
import MidiCard from "@/Components/Cards/MidiCard";
import ConcertCard from "@/Components/Cards/ConcertCard";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import MyGroups from "@/Components/Navbars/Components/MyGroups";
import { TiUserAddOutline } from "react-icons/ti";
import { openModal, formatDateAtForProfiles, userFollowsGroup, userMemberGroup } from "@/Functions";
import AddGroupMember from "../Modals/Group/AddGroupMember";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import EditGroup from "../Modals/Group/EditGroup";
import DeleteGroup from "../Modals/Group/DeleteGroup";

export default function Profile({ auth_user = null, group = null, group_roles = null }) {
    var isAuthUserGroupProfile = false;
    isAuthUserGroupProfile = auth_user.is_group_user_member;
    var groupInitial = group.name[0].toUpperCase();
    const joined = formatDateAtForProfiles(group.created_at);
    var groupFollowing = userFollowsGroup(auth_user, group);
    var groupMember = userMemberGroup(auth_user, group);
    var groupProfileDisabledDuePrivate = group.visibility == 1 && !groupFollowing && !groupMember;
    const [profileSection, setProfileSection] = useState(localStorage.getItem('group_profile_default_section') ? localStorage.getItem('group_profile_default_section') : 'midi');
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const getProfileSection = (sectionRef) => {
        setProfileSection(sectionRef);
    }
    const renderGroupMidis = () => {
        if (group.midis.length === 0) return;
        return group.midis.map((midi) => <MidiCard group={group} midi={midi} />);
    };
    const renderGroupConcerts = () => {
        if (group.concerts.length === 0) return;
        return group.concerts.map((concert) => <ConcertCard concert={concert} group={group} />);
    }
    const handleAddMembers = () => {
        openModal('add-group-members', <AddGroupMember roles={group_roles} auth_user={auth_user} group={group} />)
    }
    const handleMoreOptions = (e) => {
        e.preventDefault();
        setMoreOptionsVisible(!moreOptionsVisible);
    }
    const handleEditGroup = () => {
        openModal('edit-group-modal', <EditGroup auth_user={auth_user} group={group} />)
    }
    const handleDeleteGroup = () => {
        openModal('delete-group-modal', <DeleteGroup group={group} />)
    }
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
                setMoreOptionsVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [moreOptionsVisible]);
    return (
        <>
            <MainLayout user={auth_user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
                    <ProfileTopNavbar group={group} />
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <div id="profile-header">
                                <div className={`min-h-[200px] w-full ${group.banner === null ? 'bg-[var(--hover-lightblue)]' : ''}`} id="banner">
                                    {group.banner !== null ? (<img src={group.banner} alt="Banner" />) : (<></>)}
                                </div>
                                <div className={`-mt-[50px] lg:-mt-[75px] ml-5`} id="avatar">
                                    <div className='min-h-[6rem] xl:min-h-[9rem] border-4 border-white rounded-full w-fit flex justify-center items-center'>
                                        <img className='rounded-full h-auto w-24 lg:w-36' src={group.logo !== null ? group.logo : groupInitial} alt="Avatar" />
                                    </div>
                                </div>
                            </div>
                            <div id="profile-content" className='flex flex-col relative'>
                                <div className='mx-4 absolute -top-8 right-0 lg:-top-14'>
                                    {isAuthUserGroupProfile ? (
                                        <div className='flex gap-2'>
                                            <div className='flex relative'>
                                                <IconButton onClick={handleMoreOptions} className='text-2xl hover:bg-[var(--hover-light)]' >
                                                    <BsThreeDots />
                                                </IconButton>
                                                {moreOptionsVisible && (
                                                    <section className='dropdown absolute top-10 -left-20'>
                                                        <div className='absolute -top-40 left-0 min-w-[160px] bg-white rounded-lg shadow py-2'>
                                                            <div className='flex flex-col gap-2'>
                                                                <Link onClick={handleEditGroup} className='flex items-center gap-2 px-4 py-2 hover:bg-[var(--hover-light)]'>
                                                                    <MdOutlineEdit />
                                                                    <span className='text-md'>Edit group</span>
                                                                </Link>
                                                                <Link onClick={handleDeleteGroup} className='flex items-center gap-2 px-4 py-2 hover:bg-[var(--hover-red)] text-[var(--red)]'>
                                                                    <MdDeleteOutline />
                                                                    <span className='text-md'>Delete group</span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-[-3.5rem] left-[5.5rem] w-5 flex justify-center overflow-hidden">
                                                            <div className="shadow h-3 w-3 bg-white -rotate-45 transform origin-top-left"></div>
                                                        </div>
                                                    </section>
                                                )}
                                            </div>
                                            <IconButton onClick={handleAddMembers} className='text-2xl hover:bg-[var(--hover-light)]' >
                                                <TiUserAddOutline />
                                            </IconButton>
                                            <AuthButton className='bg-[var(--white)] hover:bg-[var(--hover-light)] text-black border' text="Planificate concert" />
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <FollowButton onClick={() => {window.location.reload()}} group={group} userFollow={false} groupFollow={true} className='text-md bg-[var(--dark)] hover:bg-[var(--hover-black)] text-white border' />
                                        </div>
                                    )}
                                </div>
                                <div className='mx-4 mt-5'>
                                    <h1 className='text-xl font-bold'>{group.name}</h1>
                                </div>
                                <div className='mx-4 mt-3'>
                                    <div className='flex items-center gap-1 text-[var(--grey)]'>
                                        <IoCalendarOutline />
                                        <span className='text-sm'>Created {joined}</span>
                                    </div>
                                </div>
                                <div className='mx-4 flex gap-5 mb-8 mt-2'>
                                    <Link href={`/g/${group.name}/followers`} className='text-sm hover:underline'>
                                        <span className='font-bold'>{group.followers.length}</span>
                                        <span className='text-[var(--grey)]'> Followers</span>
                                    </Link>
                                    <Link href={`/g/${group.name}/members`} className='text-sm hover:underline'>
                                        <span className='font-bold'>{group.members.length}</span>
                                        <span className='text-[var(--grey)]'> Members</span>
                                    </Link>
                                </div>
                                <ProfileBottomNavbar getProfileSection={getProfileSection} />
                                <section id="profile-sections">
                                    {groupProfileDisabledDuePrivate ? (
                                        <section className='flex flex-col justify-center items-center mt-16'>
                                            <h3 className='font-bold text-xl'>This group is private</h3>
                                            <span>Follow this group to see posts and media</span>
                                        </section>
                                    ) : profileSection === 'midi' ? (
                                        <section>
                                            {renderGroupMidis()}
                                        </section>
                                    ) : profileSection === 'concerts' ? (
                                        <section>
                                            {renderGroupConcerts()}
                                        </section>
                                    ) : (<></>)
                                    }
                                </section>
                            </div>
                        </div>
                    </section>

                </div>
                <RightNavbar>
                    <SearchInput placeholder="Search" />
                    <MyGroups groups={auth_user.groups} />
                </RightNavbar>
            </MainLayout>
        </>
    );
}
