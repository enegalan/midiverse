

export default function RightNavbar({ children, width = '260px', minWidth = '350px', rightBorder = false, setPaddingX = true, setPaddingY = true, hideMobile = true, className = '' }) {
    return (
        <section className={`lg:min-w-[${minWidth}]`}>
            <div className={`${hideMobile ? 'hidden lg:block' : 'block'}`}>
                <div className={`fixed w-[${width}] h-full flex flex-col ${setPaddingX ? 'py-12' : ''} ${setPaddingX ? 'px-6' : ''} gap-5 ${rightBorder ? 'border-r' : ''} ${className}`}>
                    {children}
                </div>
            </div>
        </section>
    );
}