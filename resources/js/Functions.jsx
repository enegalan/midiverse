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

export { openModal, closeModal };