import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { router } from '@inertiajs/react';

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
                        <form action="">
                            <GoogleLogin
                                onSuccess={handleSubmit}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
