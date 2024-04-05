import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';


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

export { openModal, closeModal, validateEmail };