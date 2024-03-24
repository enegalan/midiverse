import Navbar from "@/Components/Navbar";

export default function MainLayout({ user = null, children }) {
    return (
        <div className="flex">
            <Navbar user={user} />
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    );
}