import React from 'react';
import Comments from '../Components/Comments';
import MainLayout from "@/Layouts/mainLayout";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import PostTopNavbar from '@/Components/Navbars/PostTopNavbar';
import { SearchInput } from "@/Components/Inputs";
import MyGroups from '@/Components/Navbars/Components/MyGroups';
import CommentCard from '@/Components/Cards/CommentCard';

export default function CommentShow({ auth_user, user, post, comment, replies }) {
    return (
        <MainLayout user={auth_user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
            <section className="pb-16 border-r relative max-w-[800px] flex-1">
                <PostTopNavbar />
                <div className="w-full h-full">
                    <CommentCard auth_user={auth_user} comment={comment} post={post} user={auth_user} />
                    <Comments parent_id={comment.id} user={user} post={post} comments={replies} />
                </div>
            </section>
            <RightNavbar >
                <SearchInput placeholder="Search" />
                <MyGroups groups={auth_user.groups} />
            </RightNavbar>
        </MainLayout>
    );
}
