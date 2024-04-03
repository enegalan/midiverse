import { Link } from "@inertiajs/react";
import PeopleCard from "@/Components/Cards/PeopleCard";

export default function PeopleSection({ auth_user = {}, users = [], viewAll = false }) {
    const maxPeople = 3;
    if (viewAll && users.length > 3) users = users.slice(0, maxPeople);
    return (
        <>
            {users.length > 0 ? (users.map((user) => (
                <PeopleCard auth_user={auth_user} key={user.id} user={user} />
            ))) : (<span className='ml-3 text-[var(--grey)]'>There are no results right now :(</span>)}
            {viewAll ? (
                <div className="mt-6 pl-4 pb-4">
                    <Link className='text-[var(--blue)] transition hover:text-[var(--hover-blue)]' href={''}>View all</Link>
                </div>
            ) : ''}
        </>
    );
}
