import PostCard from '@/Components/Cards/PostCard';

export default function RecentPosts({ auth_user = null, posts = []}) {
    return (
        <section className='w-full'>
            {posts.map((post, index) => (
                <PostCard border={false} auth_user={auth_user} post={post} key={index} />
            ))}
        </section>
    );
}