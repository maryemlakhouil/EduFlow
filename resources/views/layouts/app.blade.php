<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduManage</title>
    @vite(['resources/css/app.css','resources/js/app.js'])
</head>

<body class="min-h-screen bg-[var(--bg-cream)] text-[var(--ink-900)] antialiased">
<div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div class="absolute left-[-8rem] top-[-8rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(171,123,104,0.18),_transparent_68%)]"></div>
    <div class="absolute right-[-10rem] top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(217,197,164,0.24),_transparent_66%)]"></div>
    <div class="absolute bottom-[-12rem] left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(139,168,123,0.15),_transparent_64%)]"></div>
</div>

<header class="border-b border-[var(--line-soft)] bg-white/75 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/courses" class="flex items-center gap-3">
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white shadow-[0_18px_40px_rgba(131,89,78,0.22)]">EM</span>
            <div>
                <p class="font-serif text-xl font-semibold tracking-tight">EduManage</p>
                <p class="text-xs text-[var(--ink-500)]">Apprendre avec intention</p>
            </div>
        </a>

        <nav class="hidden items-center gap-2 rounded-full border border-[var(--line-soft)] bg-[var(--surface-soft)] px-2 py-2 md:flex">
            <a href="/courses" class="nav-pill">Catalogue</a>
            <a href="/dashboard" class="nav-pill">Dashboard</a>
            <a href="/wishlist" class="nav-pill">Favoris</a>
            <a href="/register" class="nav-pill">Inscription</a>
            <a href="/login" class="nav-pill">Connexion</a>
        </nav>

        <div class="flex items-center gap-3">
            <button id="logoutBtn" class="hidden rounded-full border border-[var(--line-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink-700)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]">
                Déconnexion
            </button>
            <a href="/register" class="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(131,89,78,0.26)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
                Commencer
            </a>
        </div>
    </div>
</header>

<main class="pb-16">
    @yield('content')
</main>

<div id="toastContainer" class="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3"></div>
</body>
</html>
