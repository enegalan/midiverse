import MainLayout from "@/Layouts/mainLayout";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import NotificationsNavbar from "@/Components/Navbars/NotificationsNavbar";
import NotificationCard from "@/Components/Cards/NotificationCard";

export default function Notifications({ user = null }) {
    // TODO: useEffect for set notifications as viewed
    console.log(user);
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <section className="pb-16 border-r relative max-w-[800px] flex-1">
                    <div className="w-full h-full">
                        <NotificationsNavbar user={user} />
                        <section>
                            {user.notifications?.map((notification, index) => <NotificationCard auth_user={user} key={index} notification={notification} />)}
                        </section>
                    </div>
                </section>
                <RightNavbar>

                </RightNavbar>
            </MainLayout>
        </>
    );
}
