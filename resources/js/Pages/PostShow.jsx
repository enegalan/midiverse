import React from 'react';
import Comments from '../Components/Comments';
import MainLayout from "@/Layouts/mainLayout";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import PostTopNavbar from '@/Components/Navbars/PostTopNavbar';
import PostCard from '@/Components/Cards/PostCard';
import { SearchInput } from "@/Components/Inputs";
import MyGroups from '@/Components/Navbars/Components/MyGroups';

const nestComments = (comments) => {
    const commentMap = {};
    comments.forEach((comment) => {
        comment.replies = [];
        commentMap[comment.id] = comment;
    });
    const nestedComments = [];
    comments.forEach((comment) => {
        if (comment.parent_id) {
            commentMap[comment.parent_id].replies.push(comment);
        } else {
            nestedComments.push(comment);
        }
    });
    return nestedComments;
};

export default function PostShow({ user, post, comments }) {
    const nestedComments = nestComments(comments);
    return (
        <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
            <section className="pb-16 border-r relative max-w-[800px] flex-1">
                <PostTopNavbar />
                <div className="w-full h-full">
                    <PostCard separators={true} redirect={false} auth_user={user} post={post} />
                    <Comments user={user} post={post} comments={nestedComments} />
                </div>
            </section>
            <RightNavbar >
                <SearchInput placeholder="Search" />
                <MyGroups groups={user.groups} />
            </RightNavbar>
        </MainLayout>
    );
}
