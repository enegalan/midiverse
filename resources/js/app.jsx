import './bootstrap';
import '../css/app.css';
import "@/App.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'react-chat-elements/dist/main.css'

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { PrimeReactProvider } from 'primereact/api';
import { GoogleOAuthProvider } from '@react-oauth/google';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
createInertiaApp({
    title: (title) => `${title} ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API}>
                    <PrimeReactProvider>
                        <App {...props} />
                    </PrimeReactProvider>
                </GoogleOAuthProvider>
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
