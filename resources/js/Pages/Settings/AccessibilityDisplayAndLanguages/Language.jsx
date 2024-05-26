import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import { AuthButton, BackButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { TbHeartBroken } from "react-icons/tb";
import PeopleCard from "@/Components/Cards/PeopleCard";
import { Checkbox } from "@/Components/Buttons";
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from "@/Components/Inputs";

export default function Language({ user = null }) {
    // TODO: Get user current language
    const [currentLanguage, setCurrentLanguage] = useState(1);
    const [selectedLanguage, setSelectedLanguage] = useState(1);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(false);
    const [activeElement, setActiveElement] = useState('accessibility_display_and_languages'); // accessibility_display_and_languages or null
    const handleDisplayLanguage = (e) => {
        e.preventDefault();
    }
    const handleLanguage = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage)
        if (selectedLanguage == currentLanguage) {
            setSaveButtonDisabled(false);
        } else {
            setSaveButtonDisabled(true);
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        // TODO: Set default new language as default and apply it
    }
    const languages = [
        {
            'label': 'English',
            'value': 1,
        },
        {
            'label': 'Spanish',
            'value': 2,
        },
    ];
    useEffect(() => {
        localStorage.removeItem('settings_active_link');
    }, [])
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('settings_active_link', 'accessibility_display_and_languages');
        window.location.href = '/settings/accessibility_display_and_languages';
    }
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className={`${hiddenRightNavbar ? 'flex' : 'hidden lg:flex'} flex-col w-full`} >
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <SettingsNavbar hidden={!hiddenRightNavbar} activeLink={activeElement} onClick={(e) => { setHiddenRightNavbar(!hiddenRightNavbar) }} />
                        </div>
                    </section>
                </div>
                <RightNavbar hideMobile={hiddenRightNavbar} className='w-[70%] lg:w-[40%]' rightBorder={true} setPaddingX={false} minWidth='700px'>
                    <div className='h-screen'>
                        <div className='px-5 flex gap-8 mb-2 items-center'>
                            <BackButton onClick={handleBack} />
                            <h2 className='font-bold text-xl'>Change display language</h2>
                        </div>
                        <div className='mt-2 flex flex-col gap-2 border-b'>
                            <div className='py-4'>
                                <div className='px-8'>
                                    <h2 className='font-bold text-xl'>Display language</h2>
                                </div>
                                <div className='flex flex-col gap-3 mt-2 px-8'>
                                    <Dropdown onChange={handleLanguage} options={languages} />
                                    <p className='text-sm text-[var(--grey)] -mt-2'>Select your preferred language for headlines, buttons, and other text from MiDiverse.</p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-6 px-5'>
                            <AuthButton disabled={saveButtonDisabled} className={`${saveButtonDisabled && 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default'} select-none text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleSave} text='Save' />
                        </div>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
