export default function Separator ({ or = true }) {
    return (
        <div className="flex items-center my-4 w-full">
            <div className="border-t border-gray-300 flex-grow"></div>
            {or && (
                <>
                    <div className="px-3 text-gray-700 text-md">or</div>
                    <div className="border-t border-gray-300 flex-grow"></div>
                </>
            )}
        </div>
    );
}