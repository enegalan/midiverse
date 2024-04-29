import '@/../css/Colors.css';
import { Link } from '@inertiajs/react';
import { BackButton } from '@/Components/Buttons';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className='flex items-center justify-around w-full'>
                <Link href="/">
                    <img src='/logoBlack.svg' href='/' className="w-40 h-40 fill-current text-gray-500" />
                </Link>
            </div>
            <div className="w-full sm:max-w-md mt-6 px-10 py-12 border-2 rounded bg-[var(--hover-light)] border-[var(--main-blue)] shadow-lg overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
