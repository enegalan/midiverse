import Post from '@/Components/Cards/PostCard';

export default function RecentPosts({ posts = []}) {
    return (
        <section className='pt-16 w-full'>
            {posts.map((post, index) => (
                <Post post={post} key={index} />
            ))}
        </section>
    );
}