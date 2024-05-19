

export default function RightNavbar({ children, width = '260px', minWidth = '350px', rightBorder = false, setPaddingX = true, hideMobile = true, className = '' }) {
    return (
        <section className={`lg:min-w-[${minWidth}]`}>
            <div className={`${hideMobile ? 'hidden lg:block' : 'block'}`}>
                <div className={`fixed w-[${width}] flex flex-col py-12 ${setPaddingX && 'px-6'} gap-5 ${rightBorder && 'border-r'} ${className}`}>
                    {children}
                </div>
            </div>
        </section>
    );
}