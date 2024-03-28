import Navbar from "@/Components/Navbar";

export default function MainLayout({ user = null, children }) {
    return (
        <div className="flex">
            <Navbar user={user} />
            <div className="flex flex-col flex-1">
                <main className="border-l flex min-h-[100vh]">
                    {children}
                </main>
            </div>
        </div>
    );
}