import { useEffect } from 'react';

import { Link, useForm } from '@inertiajs/react';

import { GlowSubmitButton } from '@/Components/Buttons';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        if (!data.email || !data.password) {
            setData('email', data.email);  
            setData('password', data.password);
            errors.email = !data.email ? 'Email is required' : null;
            errors.password = !data.password ? 'Password is required' : null;
        }else{
            post(route('login'));
        }
    };

    return (
        <div className="bg-gray-100 h-screen">
            {/*Go back button*/}
            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
            <div className="flex justify-center items-center pt-9">
                <Link href="/">
                    <img src="/logoWhite.svg" className='w-40' alt="Logo PrintHub" />
                </Link>
            </div>
            <form className='w-full' onSubmit={submit}>
                <div className="sm:flex sm:justify-center block">
                    <div className="w-full sm:w-1/2 sm:max-w-[500px]">
                        
                        <div className="mt-8 border bg-[var(--main-blue)] border-gray-500 sm:rounded-xl p-12 px-26 shadow-2xl">
                            <h2 className="text-white text-3xl font-bold mb-4">Log In</h2>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={data.username_email}
                                    autoComplete="username_email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    name="email"
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="Email"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="Password"
                                />
                                
                            </div>
                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    name="remember_me"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="remember_me" className="text-white">Remember Me</label>
                            </div>
                            <div className="flex flex-col items-center mb-4 gap-5">
                                <GlowSubmitButton backgroundColor='var(--blue)' value='Log in'/>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="transition underline text-sm text-[--light-blue] hover:text-white rounded-md"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>
                            <div className="mb-2">
                                <p className="text-white">Don't have an account? <Link href="/register" className="transition text-[--light-blue] hover:text-white">Register Here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}