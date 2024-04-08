import { CloseButton } from "@/Components/Buttons";
import { closeModal } from "@/Functions";
export default function BaseDialog({ children, id }) {
    const onClose = () => {
        closeModal(id);
    }
    return (
        <div id={id} tabIndex="-1" aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen inset-0 max-h-full">
            <div className='fixed w-full h-screen bg-[#00000066]'></div>
            <div className="relative p-4 max-w-[800px] w-full max-h-full">
                <div className="relative bg-white rounded-lg shadow px-4 py-8 min-h-[300px]">
                    <CloseButton onClick={onClose} />
                    <section className='flex flex-col items-center justify-center'>
                        <div className='flex flex-col px-16 gap-1 w-full'>
                            {children}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}