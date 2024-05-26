export default function ImagesPreview ({ media }) {
    if (!media || media.length === 0) return;
    return (
        <div className={`bg-[var(--white)] border rounded-xl mt-3 ${media.length === 2 || media.length === 3 ? 'flex border rounded-xl gap-[0.1rem]' : ''} ${media.length === 3 ? 'h-[65%]' : ''}`}>
            {media.map((mediaItem, index) => {
                // If 3 media and it's not the first, return
                if (media.length === 3 && index !== 0) return null;
                if (media.length === 4) return null;
                // If any media and it's the first media
                return (
                    <div className={`grid overflow-hidden ${media.length > 2 && index === 0 ? 'rounded-l-xl' : 'rounded-r-xl'} ${media.length === 2 ? 'w-1/2' : media.length === 3 && 'w-1/2'} `} key={index}>
                        <div className={`${media.length === 1 ? 'rounded-xl max-w-sm' : 'w-full max-w-lg'} ${media.length === 2 && index === 0 ? 'rounded-l-xl' : 'rounded-r-xl'} relative cursor-pointer bg-center bg-no-repeat bg-cover bg-transparent`} style={{ backgroundImage: `url(/storage/media/${mediaItem.filename})` }}>
                            <img style={{ visibility: 'hidden' }} src={`/storage/media/${mediaItem.filename}`} alt={`Post image ${index + 1}`} />
                        </div>
                    </div>
                );
            })}
            <div className={`${media.length <= 2 ? 'hidden' : ''} ${media.length === 4 ? 'flex gap-[0.1rem]' : 'contents'} w-full`}>
                <div id='4_media' className={`flex flex-col gap-[0.1rem] items-center justify-between w-1/2 ${media.length !== 4 ? 'hidden' : ''}`}>
                    {media.map((mediaItem, index) => {
                        // If not 4 media, return
                        if (media.length !== 4) return null;
                        if (index === 2 || index === 3) return null;
                        return (
                            <div className={`grid h-1/2 overflow-hidden ${index === 0 ? 'rounded-tl-xl' : 'rounded-bl-xl'} ${media.length === 3 && 'w-full'} `} key={index}>
                                <div className={`w-full max-w-lg relative cursor-pointer bg-center bg-no-repeat bg-cover bg-transparent`} style={{ backgroundImage: `url(/storage/media/${mediaItem.filename})` }}>
                                    <img style={{ visibility: 'hidden' }} src={`/storage/media/${mediaItem.filename}`} alt={`Post image ${index + 1}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div id='3_4_media' className={`flex flex-col gap-[0.1rem] items-center justify-between w-1/2 ${media.length !== 3 && media.length !== 4 ? 'hidden' : ''}`}>
                    {media.map((mediaItem, index) => {
                        // If not 3 or 4 media, return
                        if (media.length !== 3 && media.length !== 4) return null;
                        // If 3 media and it's the first media, or if 4 media and it's the first or second media, return
                        if ((media.length === 3 && index === 0) || (media.length === 4 && (index === 0 || index === 1))) return null;
                        return (
                            <div className={`grid h-1/2 overflow-hidden ${index === 1 || index === 2 ? 'rounded-tr-xl' : 'rounded-br-xl'} ${media.length === 3 || media.length === 4 && 'w-full'} `} key={index}>
                                <div className={`w-full max-w-lg relative cursor-pointer bg-center bg-no-repeat bg-cover bg-transparent`} style={{ backgroundImage: `url(/storage/media/${mediaItem.filename})` }}>
                                    <img style={{ visibility: 'hidden' }} src={`/storage/media/${mediaItem.filename}`} alt={`Post image ${index + 1}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}