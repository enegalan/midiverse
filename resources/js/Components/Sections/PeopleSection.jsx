import { Link } from "@inertiajs/react";
import PeopleCard from "@/Components/Cards/PeopleCard";

export default function PeopleSection({ auth_user = {}, users = [], viewAll = false, onClickViewAll = () => {} }) {
    const maxPeople = 3;
    if (viewAll && users.length > 3) users = users.slice(0, maxPeople);
    const handleProfileRedirect = (user) => {
        window.location.href = `/u/${user.username}`;
    }
    return (
        <>
            {users.length > 0 ? (users.map((user) => (
                <span onClick={() => {handleProfileRedirect(user)}}>
                    <PeopleCard className='transition duration-300 hover:bg-[var(--hover-light)] cursor-pointer' auth_user={auth_user} key={user.id} user={user} />
                </span>
            ))) : (<span className='ml-3 text-[var(--grey)]'>There are no results right now :(</span>)}
            {viewAll && (
                <div className="mt-6 pl-4 pb-4">
                    <span className='text-[var(--blue)] transition hover:text-[var(--hover-blue)] cursor-pointer' onClick={onClickViewAll}>View all</span>
                </div>
            )}
        </>
    );
}
