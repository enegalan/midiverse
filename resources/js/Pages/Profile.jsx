import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import ProfileTopNavbar from "@/Components/Navbars/Profile/ProfileTopNavbar";
import ProfileBottomNavbar from "@/Components/Navbars/Profile/ProfileBottomNavbar";
import { AuthButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "@inertiajs/react";
import MidiCard from "@/Components/Cards/MidiCard";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import MyGroups from "@/Components/Navbars/Components/MyGroups";
import { openModal, getUserInitials, formatDateAtForProfiles, isUserFollowing } from "@/Functions";
import EditProfileModal from "./Modals/EditProfileModal";
import { router } from "@inertiajs/react";
import { Image } from 'primereact/image';

export default function Profile({ auth_user = null, user = null, roles = null }) {
    var isAuthUserProfile = false;
    if (auth_user['username'] === user['username']) {
        isAuthUserProfile = true;
    }
    var userInitials = getUserInitials(user);
    const userFullName = user.name + (user.lastname !== '' && user.lastname !== null ? ' ' + user.lastname : '');
    const joined = formatDateAtForProfiles(user.email_verified_at);
    var userFollowing = isUserFollowing(auth_user, user);
    var userProfileDisabledDuePrivate = user.private == 1 && !isAuthUserProfile && !userFollowing;
    const [profileSection, setProfileSection] = useState('posts');
    const getProfileSection = (sectionRef) => {
        setProfileSection(sectionRef);
    }
    const renderUserPosts = () => {
        if (user.posts.length === 0) return;

        const sortedPosts = user.posts.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        return sortedPosts.map((post) => <PostCard auth_user={auth_user} key={post.id} post={post} />);
    };
    const renderUserMidis = () => {
        if (user.midis.length === 0) return;
        return user.midis.map((midi) => <MidiCard user={user} midi={midi} />);
    };
    const renderUserLikes = () => {
        // TODO: When Like feature is for implement:
        // Implement the logic for rendering:
        // concert_given_likes & post_given_likes
        // to render all concerts and posts that have been liked by the user in the correct date order
        //return user.likes.map((like) => <>Like</>);
    };
    const renderUserConcerts = () => {
        // TODO: When Concerts feature is for implement:
        // Implement the logic for rendering:
    }
    const handleEditProfile = (e) => {
        e.preventDefault();
        openModal('edit-profile', <EditProfileModal user={auth_user} />)
    }
    const handleDirectMessage = (e) => {
        e.preventDefault();
        router.get(`/messages/${user.username}`)
    }
    return (
        <>
            <MainLayout user={auth_user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
                    <ProfileTopNavbar user={user} />
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <section id="profile-header">
                                <div className={`min-h-[200px] w-full ${user.banner === null ? 'bg-[var(--hover-lightblue)]' : ''}`} id="banner">
                                    {user.banner !== null && (<img src={user.banner} alt="Banner" />)}
                                </div>
                                <div className={`-mt-[50px] lg:-mt-[75px] ml-5`} id="avatar">
                                    <div className='min-h-[6rem] xl:min-h-[9rem] border-4 border-white rounded-full w-fit flex justify-center items-center'>
                                        <Image indicatorIcon={'absolute rounded-full inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 bg-transparent text-gray-100 hover:opacity-100 hover:cursor-pointer hover:bg-black hover:bg-opacity-20'} preview imageClassName='rounded-full h-auto w-24 lg:w-36' src={user.avatar !== null ? user.avatar : userInitials} alt="Avatar" />
                                    </div>
                                </div>
                            </section>
                            <div id="profile-content" className='flex flex-col relative'>
                                <div className='mx-4 absolute -top-8 right-0 lg:-top-14'>
                                    {isAuthUserProfile ? (
                                        <AuthButton onClick={handleEditProfile} className='bg-[var(--white)] hover:bg-[var(--hover-light)] text-black border' text="Edit profile" />
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <IconButton onClick={handleDirectMessage} className='text-2xl hover:bg-[var(--hover-light)]' >
                                                <AiOutlineMessage />
                                            </IconButton>
                                            <FollowButton onClick={() => { window.location.reload() }} user={user} className='text-md bg-[var(--dark)] hover:bg-[var(--hover-black)] text-white border' />
                                        </div>
                                    )}
                                </div>
                                <div className='mx-4 mt-5'>
                                    <h1 className='text-xl font-bold'>{userFullName}</h1>
                                    <h4 className='text-sm text-[var(--grey)]'>@{user.username}</h4>
                                </div>
                                {user.description && (
                                    <div className='mt-3'>
                                        <p className='text-sm px-4'>{user.description}</p>
                                    </div>
                                )}
                                <div className='mx-4 mt-3'>
                                    <div className='flex items-center gap-1 text-[var(--grey)]'>
                                        <IoCalendarOutline />
                                        <span className='text-sm'>Joined {joined}</span>
                                    </div>
                                </div>
                                <div className='mx-4 flex gap-5 mb-8 mt-2'>
                                    <Link href={`/u/${user.username}/following`} className='text-sm hover:underline'>
                                        <span className='font-bold'>{user.followings.length}</span>
                                        <span className='text-[var(--grey)]'> Following</span>
                                    </Link>
                                    <Link href={`/u/${user.username}/followers`} className='text-sm hover:underline'>
                                        <span className='font-bold'>{user.followers.length}</span>
                                        <span className='text-[var(--grey)]'> Followers</span>
                                    </Link>
                                </div>
                                <ProfileBottomNavbar disabled={userProfileDisabledDuePrivate} getProfileSection={getProfileSection} />
                                <section id="profile-sections">
                                    {userProfileDisabledDuePrivate ? (
                                        <section className='flex flex-col justify-center items-center mt-16'>
                                            <h3 className='font-bold text-xl'>This account is private</h3>
                                            <span>Follow this account to see posts and media</span>
                                        </section>
                                    ) :
                                        profileSection === 'posts' ? (
                                            <section>
                                                {renderUserPosts()}
                                            </section>
                                        ) : profileSection === 'midi' ? (
                                            <section>
                                                {renderUserMidis()}
                                            </section>
                                        ) : profileSection === 'concerts' ? (
                                            <section>
                                                {renderUserConcerts()}
                                            </section>
                                        ) : profileSection === 'likes' ? (
                                            <section>
                                                {renderUserLikes()}
                                            </section>
                                        ) : (<></>)}
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
