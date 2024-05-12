import MainLayout from "@/Layouts/mainLayout";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import NotificationsNavbar from "@/Components/Navbars/NotificationsNavbar";
import NotificationCard from "@/Components/Cards/NotificationCard";
import { SearchInput } from "@/Components/Inputs";
import MyGroups from '@/Components/Navbars/Components/MyGroups';
import { useEffect } from "react";

export default function Notifications({ user = null }) {
    console.log(user);
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <section className="pb-16 border-r relative max-w-[800px] flex-1">
                    <div className="w-full h-full">
                        <NotificationsNavbar user={user} />
                        <section>
                            {user.notifications?.map((notification, index) => <NotificationCard key={index} notification={notification} />)}
                        </section>
                    </div>
                </section>
                <RightNavbar>
                    <SearchInput placeholder="Search" />
                    <MyGroups groups={user.groups} />
                </RightNavbar>
            </MainLayout>
        </>
    );
}
