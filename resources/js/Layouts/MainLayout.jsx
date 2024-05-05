import Navbar from "@/Components/Navbars/Navbar";

export default function MainLayout({ user = null, navClassName = '', children }) {
    return (
        <div className="flex">
            <Navbar className={navClassName} user={user} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="border-l flex min-h-[100vh]">
                    {children}
                </main>
            </div>
        </div>
    );
}