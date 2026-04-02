@extends('layouts.app')

@section('content')
<section class="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
    <div class="space-y-6">
        <p class="eyebrow">Authentification securisee</p>
        <h1 class="max-w-xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Reprenez votre parcours dans un espace clair, rassurant et moderne.
        </h1>
        <p class="max-w-xl text-base leading-7 text-[var(--ink-500)]">
            Connectez-vous pour retrouver vos cours, recommandations, groupes et notifications d'inscription.
        </p>
        <div class="grid gap-4 sm:grid-cols-3">
            <div class="feature-badge">JWT securise</div>
            <div class="feature-badge">Acces par role</div>
            <div class="feature-badge">Feedback instantane</div>
        </div>
    </div>

    <div class="auth-shell">
        <div class="mb-8">
            <p class="eyebrow">Connexion</p>
            <h2 class="mt-2 font-serif text-3xl font-semibold">Heureux de vous revoir</h2>
        </div>

        <form id="loginForm" class="space-y-4">
            <label class="field-shell">
                <span class="field-label">Adresse email</span>
                <input id="email" type="email" name="email" placeholder="vous@edumanage.com" class="field-input" required>
            </label>

            <label class="field-shell">
                <span class="field-label">Mot de passe</span>
                <input id="password" type="password" name="password" placeholder="Votre mot de passe" class="field-input" required>
            </label>

            <button id="loginBtn" class="w-full rounded-full bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
                Se connecter
            </button>
        </form>

        <div class="mt-6 flex items-center justify-between gap-4 text-sm text-[var(--ink-500)]">
            <a href="/register" class="font-medium text-[var(--accent)] hover:underline">Creer un compte</a>
            <button id="forgotPasswordBtn" type="button" class="font-medium hover:text-[var(--accent)]">Mot de passe oublie ?</button>
        </div>

        <p id="loginMessage" class="mt-5 text-sm"></p>
    </div>
</section>
@endsection
