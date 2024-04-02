import { AuthButton } from '@/Components/Buttons';
import { GoogleLoginButton } from '@/Components/Buttons';
import Separator from '@/Components/Separator';
import { openModal, closeModal } from '@/Functions';
import LoginModal from './Modals/LoginModal';
import RegisterModal from './Modals/RegisterModal';

export default function Auth() {
    const handleRegister = (e) => {
        e.preventDefault()
        closeModal('login-modal')
        openModal('register-modal', <RegisterModal />)
    }
    const handleLogin = (e) => {
        e.preventDefault();
        openModal('login-modal', <LoginModal/>)
    }
    return (
        <main className="h-screen">
            <div className='flex items-center justify-evenly h-screen'>
                <div>
                    <img className='w-72' src="logoBlack.svg" alt="miDiverse Logo" />
                </div>
                <div className='flex flex-col'>
                    <h1 className='font-bold text-6xl mb-12'>miDiverse</h1>
                    <h2 className='font-bold text-3xl'>Join us.</h2>
                    <section className='py-6'>
                        <form className='mt-2 flex flex-col' action="">
                            <GoogleLoginButton />
                            <Separator />
                            <AuthButton onClick={handleRegister} className='w-full text-center text-white bg-[var(--main-blue)] hover:bg-[var(--blue)]' text='Create account' />
                        </form>
                        <form className='mt-16 flex flex-col gap-3' action=''>
                            <h3 className='font-bold text-lg'>Already have an account?</h3>
                            <AuthButton onClick={handleLogin} className='w-full text-center text-[var(--main-blue)] bg-[var(--white)] hover:bg-[var(--hover-lightblue)] border' text='Sign in' />
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
