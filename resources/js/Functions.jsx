import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';
import { format } from 'date-fns';

function openModal(id, modal) {
    const modalContainer = document.createElement('div');
    modalContainer.id = id;
    document.body.appendChild(modalContainer);
    const modalRoot = createRoot(modalContainer);
    modalRoot.render(modal);
    document.body.style.overflow = 'hidden';
}

function closeModal (id) {
    document.querySelector('#' + id)?.remove();
    document.body.style.overflow = 'auto';
}

function validateEmail (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function logout () {
    googleLogout();
    axios.get(route('logout'));
}

function getUserInitials (user) {
    if (!user) return;
    var userInitials = user.name[0].toUpperCase();
    if (user.hasOwnProperty('lastname') && user.lastname && user.lastname.length > 0) {
        userInitials += user.lastname[0].toUpperCase();
    }
    return userInitials;
}

function formatDate(dateString, dateFormat) {
    const date = new Date(dateString);
    return format(date, dateFormat);
}

function getAllMonths() {
    // TO-IMPROVE: When Translations are implemented make the necessary logic to return the months with the user lang
    const months = [
        { label: 'January', value: '01' },
        { label: 'February', value: '02' },
        { label: 'March', value: '03' },
        { label: 'April', value: '04' },
        { label: 'May', value: '05' },
        { label: 'June', value: '06' },
        { label: 'July', value: '07' },
        { label: 'August', value: '08' },
        { label: 'September', value: '09' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' }
    ];
    return months;
}

function getMonthDays(month, year) {
    if (!month) return;
    if (!year) return;
    // Get the last day of the month
    const lastDay = new Date(year, month, 0).getDate();
    const daysArray = [];
    for (let day = 1; day <= lastDay; day++) {
        daysArray.push({
            label: day.toString(),
            value: day.toString(),
        });
    }
    return daysArray;
}

function getYearsFromYearsAgo(yearsAgo = 120) {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - yearsAgo;
    const yearsArray = [];
    for (let year = startYear; year <= currentYear; year++) {
        yearsArray.push({
            label: year,
            value: year,
        });
    }
    return yearsArray;
}

function formatDateAtForProfiles(createdAt) {
    const dateTime = new Date(createdAt);
    const dateLocale = 'en-US'; // TODO: set to 'default' for production
    const month = dateTime.toLocaleString(dateLocale, { month: 'long' });
    const year = dateTime.getFullYear();
    const joined = month + ' ' + year;
    return joined;
}

function formatDateForPublic(date) {
    if (!date) return;
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) {
        // < 1m
        return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
        // < 1h
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        return `${diffInMinutes}min`;
    } else if (diffInSeconds < 86400) {
        // < 1 days
        const diffInHours = Math.floor(diffInSeconds / 3600);
        return `${diffInHours}h`;
    } else {
        // > 1 days
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
}

function isUserFollowing(auth_user, user) {
    for (let follower of auth_user.followings) {
        if (follower.id == user.id) return true; break;
    }
    return false;
}

function isUserFollower(auth_user, user) {
    for (let follower of auth_user.followers) {
        if (follower.id == user.id) return true; break;
    }
    return false;
}

function userFollowsGroup(user, group) {
    for (let follower of group.followers) {
        if (follower.id == user.id) return true; break;
    }
    return false;
}

function userMemberGroup(user, group) {
    for (let member of group.members) {
        if (member.id == user.id) return true;
    }
    return false;
}

function getUsernameFromEmail(email) {
    if (email.includes('@')) {
        return email.split('@')[0].trim();
    }
}

function isMobile() {
    return window.innerWidth < 1024;
}


export { openModal, closeModal, validateEmail, logout, getUserInitials, formatDate, getAllMonths, getMonthDays, getYearsFromYearsAgo, formatDateAtForProfiles, isUserFollowing, isUserFollower, userFollowsGroup, userMemberGroup, getUsernameFromEmail, formatDateForPublic, isMobile };