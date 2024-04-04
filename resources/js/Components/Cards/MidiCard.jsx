import { Link } from "@inertiajs/react";
import { AuthButton } from "@/Components/Buttons";

export default function MidiCard({ user = null, midi = {}, }) {
    const handleMidiClicked = () => {
        localStorage.setItem('playing_midi', midi.midi);
        localStorage.setItem('playing_midi_name', midi.name);
        window.location.href = '/playground';
    }
    return (
        <article className='hover:bg-[var(--light-grey)] transition hover:cursor-pointer flex p-3 gap-4 justify-start' id={midi.id} key={midi.id}>
            <div className='flex flex-col w-full gap-6'>
                <div className='flex gap-5'>
                    <img className='w-10 min-w-10 rounded-full' src={user.avatar} alt={`${user.username} avatar`} />
                    <div className='flex flex-col items-start'>
                        <Link href={`/u/${user.username}`} className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[160px] font-bold hover:underline hover:cursor-pointer'>{user.name + ' ' + user.lastname}</Link>
                        <Link href={`/u/${user.username}`} className='text-sm text-gray-400'><label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] hover:cursor-pointer'>{'@' + user.username}</label></Link>
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <div className='flex flex-col items-start'>
                        <span className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[160px] font-bold hover:underline hover:cursor-pointer'>{midi.name}</span>
                        <span className='text-sm whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[160px]'>{midi.duration}</span>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <span className="text-sm">{midi.description}</span>
                    <div className='my-5'>
                        <AuthButton className='bg-[var(--main-blue)] hover:bg-[var(--hover-blue)] text-white' onClick={handleMidiClicked} text='Play it' />
                    </div>
                </div>
            </div>
        </article>
    );
}