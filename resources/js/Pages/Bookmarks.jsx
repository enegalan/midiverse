import MainLayout from "@/Layouts/mainLayout";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import BookmarksTopNavbar from "@/Components/Navbars/BookmarksTopNavbar";
import PostCard from "@/Components/Cards/PostCard";

export default function Bookmarks({ user }) {
    console.log(user);
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <section className="pb-16 border-r relative max-w-[800px] flex-1">
                    <BookmarksTopNavbar user={user}/>
                    <div className="w-full h-full">
                        {user.post_bookmarks && user.post_bookmarks.length > 0 ? (user.post_bookmarks.map((bookmark, index) => {
                            return <PostCard key={index} post={bookmark.post} auth_user={user} s/>
                        })) : 
                        (<section className='px-10 lg:ml-36  py-12'>
                            <h2 className='text-3xl font-bold'>
                                Save posts for later
                            </h2>
                            <span className='text-md text-[var(--grey)]'>Bookmark posts to easily find them again in the future.</span>
                        </section>)}
                    </div>
                </section>
                <RightNavbar>

                </RightNavbar>
            </MainLayout>
        </>
    );
}
