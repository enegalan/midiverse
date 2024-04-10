import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';

function openModal(id, modal) {
    const modalContainer = document.createElement('div');
    document.querySelector('body').appendChild(modalContainer);
    const modalRoot = createRoot(modalContainer);
    modalRoot.render(modal);
}

function closeModal (id) {
    document.querySelector('#' + id)?.remove();
}

function validateEmail (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function logout () {
    googleLogout();
    axios.get(route('logout'));
}

export { openModal, closeModal, validateEmail, logout };