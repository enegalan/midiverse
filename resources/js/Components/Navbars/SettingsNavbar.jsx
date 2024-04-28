import { Link } from "@inertiajs/react";
import { SearchInput } from "../Inputs";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function SettingsNavbar({ activeLink = 'account' }) {
    const links = [
        {
            'id': 'account',
            'name': 'Your account',
        },
        {
            'id': 'privacity',
            'name': 'Privacity',
        },
        {
            'id': 'notifications',
            'name': 'Notifications',
        },
        {
            'id': 'accessibility_display_and_languages',
            'name': 'Accessibility, display and languages',
        },
    ];
    return (
        <section className="lg:min-w-[350px] py-8">
                <div className="hidden lg:flex flex-col gap-5">
                    <div className='px-5 flex flex-col gap-5'>
                        <h2 className="font-bold text-xl">Settings</h2>
                        <SearchInput placeholder='Search settings'/>
                    </div>
                    <ul>
                        {links.map(link => {
                            return (
                                <li key={link.id} id={link.id} className='w-full relative'>
                                    <Link id={link.id} className={`flex items-center justify-between px-5 py-3 transition duration-300 ${activeLink == link.id && 'bg-[var(--hover-light)]'} hover:bg-[var(--hover-light)]`} href={'/settings/' + link.id} >
                                        <div><span>{link.name}</span></div>
                                        <div className='text-2xl'><MdKeyboardArrowRight /></div>
                                    </Link>
                                    {activeLink == link.id && (
                                        <div className='h-full border-r-[var(--main-blue)] border-r-2 right-0 absolute pointer-events-none bottom-0 left-0'></div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
        </section>
    );
}