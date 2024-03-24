import { Link } from "@inertiajs/react";
import PeopleCard from "@/Components/PeopleCard";

export default function PeopleSection({ users = [], viewAll = false }) {
    const maxPeople = 3;
    if (users.length > 3) users = users.slice(0, maxPeople);
    return (
        <>
            {users.map((user) => (
                <PeopleCard user={user} />
            ))}
            {viewAll ? (
                <div className="mt-6 pl-4 pb-4">
                    <Link className='text-[var(--blue)] transition hover:text-[var(--hover-blue)]' href={''}>View all</Link>
                </div>
            ) : ''}
        </>
    );
}
