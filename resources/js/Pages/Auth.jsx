import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { AuthButton } from '@/Components/Buttons';

export default function Auth() {
    const handleSubmit = async (credentialResponse) => {
        const userCredentials = jwtDecode(credentialResponse.credential);
        const formData = new FormData();
        formData.append('user', JSON.stringify(userCredentials));
        console.log(userCredentials)
        try {
            await axios.post('/users/register', formData);
            // Redirect logged user to home
            router.get('/home')
        } catch (error) {
            try {
                await axios.post('/users/login', formData)
                // Redirect logged user to home
                router.get('/home')
            } catch (error2) {
                console.error(error2)
            }
        }
    };

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
                            <GoogleLogin
                                onSuccess={handleSubmit}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                            <div class="flex items-center my-4">
                                <div class="border-t border-gray-400 flex-grow"></div>
                                <div class="px-3 text-gray-800 text-md">or</div>
                                <div class="border-t border-gray-400 flex-grow"></div>
                            </div>
                            <AuthButton className='w-full text-center text-white bg-[var(--main-blue)] hover:bg-[var(--blue)]' text='Create account' />
                        </form>
                        <form className='mt-16 flex flex-col gap-3' action=''>
                            <h3 className='font-bold text-lg'>Already have an account?</h3>
                            <AuthButton className='w-full text-center text-[var(--main-blue)] bg-[var(--white)] hover:bg-[var(--hover-lightblue)] border' text='Sign in' />
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
