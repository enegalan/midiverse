import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import ProfileTopNavbar from "@/Components/Navbars/Profile/ProfileTopNavbar";
import ProfileBottomNavbar from "@/Components/Navbars/Profile/ProfileBottomNavbar";
import { AuthButton } from "@/Components/Buttons";
import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import PostCard from "@/Components/Cards/PostCard";

export default function Profile({ user = null }) {
    var userInitials = user.name[0].toUpperCase();
    if (user.hasOwnProperty('lastname') && user.lastname && user.lastname.length > 0) {
        userInitials += user.lastname[0].toUpperCase();
    }
    const userFullName = user.name + (user.lastname !== '' && user.lastname !== null ? ' ' + user.lastname : '');
    const dateTime = new Date(user.email_verified_at)
    const dateLocale = 'en-US'; // TODO: set to 'default' for production
    const month = dateTime.toLocaleString(dateLocale, { month: 'long' });
    const year = dateTime.getFullYear();
    const joined = month + ' ' + year;
    const [profileSection, setProfileSection] = useState('posts');
    const getProfileSection = (sectionRef) => {
        setProfileSection(sectionRef);
    }
    const renderUserPosts = () => {
        if (user.posts.length === 0) return;
        return user.posts.map((post) => <PostCard key={post.id} post={post} />);
    };
    const renderUserMidis = () => {
        // TODO: When Save Midi feature is for implement:
        // Create MidiCard
        if (user.midis.length === 0) return;
        return user.midis.map((midi) => <>Midi</>);
    };
    const renderUserLikes = () => {
        // TODO: When Like feature is for implement:
        // Implement the logic for rendering:
        // concert_given_likes & post_given_likes
        // to render all concerts and posts that have been liked by the user in the correct date order
        //return user.likes.map((like) => <>Like</>);
    };
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
                    <ProfileTopNavbar user={user} />
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <div id="profile-header">
                                <div className={`min-h-[200px] w-full ${user.banner === null ? 'bg-[var(--hover-lightblue)]' : ''}`} id="banner">
                                    {user.banner !== null ? (<img src={user.banner} alt="Banner" />) : (<></>)}
                                </div>
                                <div className={`-mt-[50px] lg:-mt-[75px] ml-5`} id="avatar">
                                    <div className='min-h-[10rem] border-4 border-white rounded-full w-fit flex justify-center items-center'>
                                        <img className='rounded-full h-auto w-24 lg:w-36' src={user.avatar !== null ? user.avatar : userInitials} alt="Avatar" />
                                    </div>
                                </div>
                            </div>
                            <div id="profile-content" className='flex flex-col relative mx-6'>
                                <div className='absolute -top-8 right-0 lg:-top-14'>
                                    <AuthButton className='bg-[var(--white)] hover:bg-[var(--hover-light)] text-black border' text="Edit profile" />
                                </div>
                                <div className='mt-5'>
                                    <h1 className='text-xl font-bold'>{userFullName}</h1>
                                    <h4 className='text-sm text-[var(--grey)]'>@{user.username}</h4>
                                </div>
                                <div className='mt-3'>
                                    <div className='flex items-center gap-1 text-[var(--grey)]'>
                                        <IoCalendarOutline />
                                        <span className='text-sm'>Joined {joined}</span>
                                    </div>
                                </div>
                                <div className='flex gap-2 mt-2'>
                                    <div className='flex gap-1 text-sm'>
                                        <span className='font-bold'>{user.followings.length}</span>
                                        <span className='text-[var(--grey)]'>Following</span>
                                    </div>
                                    <div className='flex gap-1 text-sm'>
                                        <span className='font-bold'>{user.followers.length}</span>
                                        <span className='text-[var(--grey)]'>Followers</span>
                                    </div>
                                </div>
                                <ProfileBottomNavbar getProfileSection={getProfileSection} />
                                <section id="profile-sections">
                                    {profileSection === 'posts' ? (
                                        <section>
                                            {renderUserPosts()}
                                        </section>
                                    ) : profileSection === 'midi' ? (
                                        <section>
                                            {renderUserMidis()}
                                        </section>
                                    ) : profileSection === 'likes' ? (
                                        <section>
                                            {renderUserLikes()}
                                        </section>
                                    ): (<></>)
                                    }
                                </section>
                            </div>
                        </div>
                    </section>

                </div>
                <section className="lg:min-w-[350px] px-6 py-12 ">
                    <div className="w-[260px] hidden lg:block">
                        <div className="fixed">
                            <SearchInput placeholder="Search" />
                        </div>
                    </div>
                </section>
            </MainLayout>
        </>
    );
}
