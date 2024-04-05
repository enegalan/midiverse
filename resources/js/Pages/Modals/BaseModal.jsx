import { CloseButton } from "@/Components/Buttons";
import { closeModal } from "@/Functions";
export default function BaseModal({ children, id }) {
    const onClose = () => {
        closeModal(id);
    }
    return (
        <div id={id} tabIndex="-1" aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen inset-0 max-h-full">
            <div className='fixed w-full h-screen bg-[#00000066]'></div>
            <div className="relative p-4 max-w-[650px] w-full max-h-full">
                <div className="relative bg-white rounded-lg shadow px-4 py-8 min-h-[600px]">
                    <CloseButton onClick={onClose} />
                    <section className='flex flex-col items-center justify-center'>
                        <img className='w-12 mt-[-50px] mb-4' src="/logoBlack.svg" alt="miDiverse Logo" />
                        <div className='flex flex-col gap-1'>
                            {children}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}