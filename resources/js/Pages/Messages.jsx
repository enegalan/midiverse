import MainLayout from "@/Layouts/mainLayout";
import RightNavbar from "@/Components/Navbars/RightNavbar";

export default function Messages({ user = null }) {
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <section className="pb-16 border-r relative max-w-[800px] flex-1">
                    <div className="w-full h-full">

                    </div>
                </section>
                <RightNavbar>

                </RightNavbar>
            </MainLayout>
        </>
    );
}
