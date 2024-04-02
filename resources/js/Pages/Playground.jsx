import React, { useState, useEffect } from 'react';

export default function Playground({ user = null}) {
    useEffect(() => {
        // Dynamically add CSS files to the document head
        const addCssFile = (href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            document.head.appendChild(link);
        };

        // Dynamically add JavaScript files to the document head
        const addJsFile = (src, type = '') => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.type = type;
            document.head.appendChild(script);
        };

        // Add CSS files
        addCssFile('/piano/css/bootstrap.min.css');
        addCssFile('/piano/css/Interface.css');
        addCssFile('/piano/css/Inputs.css');
        addCssFile('/piano/css/Settings.css');
        addCssFile('/piano/css/nano.min.css');

        // Add JavaScript files
        addJsFile('/piano/lib/Pickr/pickr.es5.min.js');
        addJsFile('/piano/lib/Base64.js');
        addJsFile('/piano/lib/Base64binary.js');
        addJsFile('/piano/js/main.js', 'module');
        addJsFile('/piano/lib/Count.js');

        // Clean up function to remove dynamically added elements
        return () => {
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                if (link.href.includes('/piano/css/') || link.href.includes('/piano/css/')) {
                    link.remove();
                }
            });
            document.querySelectorAll('script').forEach(script => {
                if (script.src.includes('/piano/')) {
                    script.remove();
                }
            });
        };
    }, []); // Empty dependency array to run the effect only once

    return (
        <main className='w-full h-screen flex flex-col'>
            <section className='relative flex-1'>
                <section id='piano-viewer'>
                    <div id='midiverse-piano'></div>
                    <div style={{ height: 'inherit', pointerEvents: 'none' }} id='midiverse-piano-menus'></div>
                    <div id='playground-navbar'></div>
                </section>
            </section>
        </main>
    );
}
