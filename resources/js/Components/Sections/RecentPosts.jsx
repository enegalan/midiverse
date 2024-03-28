import Post from '@/Components/Cards/PostCard';

export default function RecentPosts({ posts = []}) {
    posts = [
        {
            id: 1,
            user: {
                name: 'Eneko',
                lastname: 'Galan',
                username: 'egalan',
                avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            },
            date: 'Mar 22',
            content: 'Test for you content of a post. ASDASDASDASDASDASDSADASCXZXCZXCXZCXCZASFGDSKFOASKDASODKASODK',
            comments: [],
            likes: [],
            href: '',
        },
        {
            user: {
                name: 'Eneko',
                lastname: 'Galan',
                username: 'egalan',
                avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            },
            date: 'Mar 22',
            content: 'Test content of a post. ASDASDASDASDASDASDSADASCXZXCZXCXZCXCZASFGDSKFOASKDASODKASODK',
            comments: [],
            likes: [],
            href: '',
        },
        {
            id: 2,
            user: {
                name: 'Eneko',
                lastname: 'Galan',
                username: 'egalan',
                avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            },
            date: 'Mar 22',
            content: 'Test content of a post. ASDASDASDASDASDASDSADASCXZXCZXCXZCXCZASFGDSKFOASKDASODKASODK',
            comments: [],
            likes: [],
            href: '',
        },
        {
            id: 3,
            user: {
                name: 'Eneko',
                lastname: 'Galan',
                username: 'egalan',
                avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            },
            date: 'Mar 22',
            content: 'Test content of a post. ASDASDASDASDASDASDSADASCXZXCZXCXZCXCZASFGDSKFOASKDASODKASODK',
            comments: [],
            likes: [],
            href: '',
        },
        {
            id: 4,
            user: {
                name: 'Eneko',
                lastname: 'Galan',
                username: 'egalan',
                avatar: 'https://pbs.twimg.com/profile_images/1727305364549279744/CAUlxYmC_x96.jpg',
            },
            date: 'Mar 22',
            content: 'Test content of a post. ASDASDASDASDASDASDSADASCXZXCZXCXZCXCZASFGDSKFOASKDASODKASODK',
            comments: [],
            likes: [],
            href: '',
        },
    ];
    return (
        <section className='pt-16 w-full'>
            {posts.map((post, index) => (
                <Post post={post} key={index} />
            ))}
        </section>
    );
}