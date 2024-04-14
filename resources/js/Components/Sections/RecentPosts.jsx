import PostCard from '@/Components/Cards/PostCard';

export default function RecentPosts({ auth_user = null, posts = []}) {
    return (
        <section className='pt-16 w-full'>
            {posts.map((post, index) => (
                <PostCard auth_user={auth_user} post={post} key={index} />
            ))}
        </section>
    );
}