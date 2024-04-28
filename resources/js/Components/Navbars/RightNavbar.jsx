

export default function RightNavbar({ children, width = '260px', minWidth = '350px', rightBorder = false, setPaddingX = true }) {
    return (
        <section className={`lg:min-w-[${minWidth}]`}>
            <div className={`hidden lg:block`}>
                <div className={`fixed w-[${width}] flex flex-col py-12 ${setPaddingX && 'px-6'} gap-5 ${rightBorder && 'border-r'}`}>
                    {children}
                </div>
            </div>
        </section>
    );
}