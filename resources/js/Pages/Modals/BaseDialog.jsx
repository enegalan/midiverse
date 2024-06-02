import { CloseButton } from "@/Components/Buttons";
import { closeModal } from "@/Functions";
import { useEffect } from "react";

export default function BaseDialog({ children, id, width = '800px', closeButton = true, miniDialog = false }) {
    const onClose = () => {
        closeModal(id);
    }
    useEffect(() => {
        const onEscapePressed = (e) => {
            if (e.key == 'Escape') {
                onClose();
            }
        }
        document.addEventListener('keydown', onEscapePressed);
        return () => {
            document.removeEventListener('keydown', onEscapePressed);
        };
    });
    useEffect(() => {
        const handleClickOutside = (event) => {
            let outsideClick = true;
            if (event.target.id != 'dialog-bg') {
                outsideClick = false;
            }
            if (outsideClick) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
    return (
        <div id={id} tabIndex="-1" aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen inset-0 max-h-full">
            <div id='dialog-bg' className='fixed w-full h-screen bg-[#00000066]'></div>
            <div className={`relative p-4 max-w-[${width}] w-full max-h-full`}>
                <div className={`relative bg-white rounded-lg shadow px-4 ${!miniDialog ? 'py-8' : 'py-1'}`}>
                    {closeButton && (<CloseButton onClick={onClose} />)}
                    <section className='flex flex-col items-center justify-center'>
                        <div className={`flex flex-col ${!miniDialog ? 'px-16' : 'px-2'} gap-1 w-full`}>
                            {children}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}