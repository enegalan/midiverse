import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import BackButtonArrow  from '@/Components/BackButtonArrow.jsx';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        lastname:'',
        birthdate:'',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const openModal = () => {
        document.getElementById('confirmModal').classList.remove('hidden');
    };

    const closeModal = () => {
        document.getElementById('confirmModal').classList.add('hidden');
    };

    const confirmModal = () => {
        closeModal();
        post(route('register'));
    };

    const submit = (e) => {
        e.preventDefault();

        if (!data.name || !data.lastname || !data.birthdate || !data.email || !data.password) {
            setData('name', data.name);
            setData('lastname', data.lastname);
            setData('birthdate', data.birthdate);
            setData('email', data.email);
            setData('password', data.password);
            errors.name = !data.name ? 'Name is required' : null;
            errors.lastname = !data.lastname ? 'Last name is required' : null;
            errors.birthdate = !data.birthdate ? 'Birthdate is required' : null;
            errors.email = !data.email ? 'Email is required' : null;
            errors.password = !data.password ? 'Password is required' : null;
        } else {
            openModal();
        }

    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div id="confirmModal" className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center hidden">
                <div className="bg-white p-8 rounded shadow-md">
                    <p className="text-lg font-semibold mb-4">Are you sure you want to register?</p>
                    <div className="flex justify-end">
                        <PrimaryButton className="mr-2" onClick={confirmModal}>Yes</PrimaryButton>
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                    </div>
                </div>
            </div>
            {/*Register form*/}
            <form>
                <h1 className="text-white text-3xl font-bold mb-4">Register</h1>
                <div>
                    <InputLabel forInput="name" value="Name" className="text-white"/>
                    <TextInput
                        id="name"

                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div>
                    <InputLabel forInput="lastname" value="Last name" className="text-white"/>
                    <TextInput
                        id="lastname"
                        name="lastname"
                        value={data.lastname}
                        className="mt-1 block w-full"
                        autoComplete="lastname"
                        isFocused={true}
                        onChange={(e) => setData('lastname', e.target.value)}
                        required
                    />
                    <InputError message={errors.lastname} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel forInput="email" value="Email" className="text-white"/>
                    <TextInput
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel forInput="birthdate" value="Birth date" className="text-white"/>
                    <TextInput
                        id="birthdate"
                        type="date"
                        placeholder="birthdate"
                        name="birthdate"
                        value={data.birthdate}
                        className="mt-1 block w-full"
                        autoComplete="birthdate"
                        onChange={(e) => setData('birthdate', e.target.value)}
                        required
                    />

                    <InputError message={errors.birthdate} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel forInput="password" value="Password" className="text-white"/>
                    <TextInput
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel forInput="password_confirmation" value="Password confirmation" className="text-white"/>
                    <TextInput
                        id="password_confirmation"
                        placeholder="Password confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-[--light-blue] hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing} onClick={submit}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
