import PostCard from '@/Components/Cards/PostCard';

export default function FollowsPosts({ auth_user = null, posts = [] }) {
    return (
        <section className='w-full'>
            {posts.map((post, index) => (
                <PostCard auth_user={auth_user} key={index} post={post} />
            ))}
        </section>
    );
}