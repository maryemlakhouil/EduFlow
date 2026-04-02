@extends('layouts.app')

@section('content')
<section class="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
    <div class="rounded-[2rem] border border-[var(--line-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(252,247,242,0.95))] p-8 shadow-[0_26px_80px_rgba(117,86,77,0.10)]">
        <p class="eyebrow">Onboarding intelligent</p>
        <h1 class="mt-3 font-serif text-4xl font-semibold tracking-tight">Creez votre espace et commencez a apprendre ou enseigner.</h1>
        <p class="mt-4 text-base leading-7 text-[var(--ink-500)]">
            Choisissez votre role pour activer les bons ecrans: catalogue, recommandations, groupes, tableau de bord enseignant et parcours d'inscription.
        </p>

        <div class="mt-8 space-y-4">
            <div class="info-row">
                <span class="info-dot bg-[var(--accent)]"></span>
                <span>Etudiant: suggestions, wishlist, inscription, groupe attribue.</span>
            </div>
            <div class="info-row">
                <span class="info-dot bg-[var(--olive)]"></span>
                <span>Enseignant: CRUD cours, groupes, statistiques et suivi des inscrits.</span>
            </div>
            <div class="info-row">
                <span class="info-dot bg-[var(--gold)]"></span>
                <span>Frontend responsive pret a etre etendu a Stripe, notifications et dashboard.</span>
            </div>
        </div>
    </div>

    <div class="auth-shell">
        <div class="mb-8">
            <p class="eyebrow">Inscription</p>
            <h2 class="mt-2 font-serif text-3xl font-semibold">Ouvrir un compte</h2>
        </div>

        <form id="registerForm" class="space-y-4">
            <label class="field-shell">
                <span class="field-label">Nom complet</span>
                <input type="text" name="name" placeholder="Votre nom complet" class="field-input" required>
            </label>

            <label class="field-shell">
                <span class="field-label">Adresse email</span>
                <input type="email" name="email" placeholder="vous@edumanage.com" class="field-input" required>
            </label>

            <label class="field-shell">
                <span class="field-label">Mot de passe</span>
                <input type="password" name="password" placeholder="Au moins 8 caracteres" class="field-input" required>
            </label>

            <label class="field-shell">
                <span class="field-label">Confirmation</span>
                <input type="password" name="password_confirmation" placeholder="Confirmez votre mot de passe" class="field-input" required>
            </label>

            <label class="field-shell">
                <span class="field-label">Role</span>
                <select name="role" class="field-input" required>
                    <option value="">Choisir un role</option>
                    <option value="Etudiant">Etudiant</option>
                    <option value="Enseignant">Enseignant</option>
                </select>
            </label>

            <button class="w-full rounded-full bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
                Creer mon compte
            </button>
        </form>

        <p class="mt-6 text-sm text-[var(--ink-500)]">
            Deja inscrit ?
            <a href="/login" class="font-medium text-[var(--accent)] hover:underline">Se connecter</a>
        </p>

        <p id="message" class="mt-4 text-sm"></p>
    </div>
</section>
@endsection
