import { Head, Link, useForm } from '@inertiajs/react';
import { AuthButton } from '@/Components/Buttons';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <main className='w-full h-screen flex flex-col px-24 items-center justify-center'>
            <Link href={route('home')}>
                <img className='w-12 mt-[-50px] mb-4' src="/logoBlack.svg" alt="miDiverse" />
            </Link>
            <div className='bg-[var(--hover-light)] px-6 py-8 rounded-md'>
                <Head title="Email Verification" />

                <div className="mb-4 text-sm text-black">
                    Thanks for signing up! Before getting started, could you verify your email address by clicking on the
                    link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        A new verification link has been sent to the email address you provided during registration.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mt-4 flex flex-col gap-3 items-center justify-between">
                        <AuthButton className='text-white bg-[var(--main-blue)]' disabled={processing} text='Resend Verification Email' />
                        <Link
                            href={''}
                            method="post"
                            as="button"
                            className="text-sm text-[var(--main-blue)] hover:underline rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Log Out
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
