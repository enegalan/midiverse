import MainLayout from "@/Layouts/mainLayout";

export default function Messages({ user = null }) {
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <section className="pb-16 border-r relative max-w-[800px] flex-1">
                    <div className="w-full h-full">
                        
                    </div>
                </section>
                <section className="lg:min-w-[350px] px-6 py-12 ">
                    <div className="w-[260px] hidden lg:block">
                        <div className="fixed">
                            
                        </div>
                    </div>
                </section>
            </MainLayout>
        </>
    );
}
