

export default function RightNavbar({ children }) {
    return (
        <section className="lg:min-w-[350px] px-6 py-12 ">
            <div className="w-[260px] hidden lg:block">
                <div className="fixed flex flex-col gap-5">
                    {children}
                </div>
            </div>
        </section>
    );
}