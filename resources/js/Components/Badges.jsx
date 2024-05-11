import { useEffect, useState } from 'react';

const BadgeProvider = ({ className = '', children, ...props }) => {
    return (
        <div {...props} className={`relative ${className}`}>
            {children}
        </div>
    );
}

const NotificationBadge = ({ className = '', value = 0 }) => {
    if (value === 0 || !value) return; 
    if (value > 20) value = '20+';
    return (
        <div className={`absolute box-content top-[-2px] -right-1 ${className}`}>
            <span className='flex items-center justify-center text-center text-[10px] border h-[16px] border-white text-white py-[0.1rem] px-2 bg-[var(--main-blue)] rounded-full'>
                <span>{value}</span>
            </span>
        </div>
    );
}

export { BadgeProvider, NotificationBadge };