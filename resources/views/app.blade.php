<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/png" href="/images/favicon.png"/>
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://kit.fontawesome.com/8e4bd12ccb.js" crossorigin="anonymous"></script>
        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
