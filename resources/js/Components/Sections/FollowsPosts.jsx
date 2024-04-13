import Post from '@/Components/Cards/PostCard';

export default function FollowsPosts({ posts = [] }) {
    return (
        <section className='w-full'>
            {posts.map((post, index) => (
                <Post key={index} post={post} />
            ))}
        </section>
    );
}