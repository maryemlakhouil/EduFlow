@extends('layouts.app')

@section('content')
<section class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
    <div class="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
        <div class="space-y-5">
            <p class="eyebrow">Catalogue de formations</p>
            <div class="space-y-4">
                <h1 class="max-w-3xl font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    Eveillez votre curiosite dans
                    <span class="text-[var(--accent)] italic">EduManage Academy</span>
                </h1>
                <p class="max-w-2xl text-base leading-7 text-[var(--ink-500)] sm:text-lg">
                    Explorez des parcours pensés pour les etudiants et les enseignants:
                    recherche rapide, recommandations, favoris, inscription et suivi dans une interface claire et chaleureuse.
                </p>
            </div>
        </div>

        <div class="hero-stat-card">
            <p class="text-sm uppercase tracking-[0.24em] text-[var(--ink-500)]">Vue globale</p>
            <div class="mt-4 flex items-end gap-3">
                <span id="courseCount" class="font-serif text-5xl font-semibold">0</span>
                <span class="pb-2 text-sm text-[var(--ink-500)]">cours disponibles</span>
            </div>
            <p class="mt-4 text-sm leading-6 text-[var(--ink-500)]">
                Suggestions personnalisees, detail complet, favoris et inscription rapide connectes a votre API Laravel.
            </p>
        </div>
    </div>

    <div class="mt-10 grid gap-4 rounded-[2rem] border border-[var(--line-soft)] bg-white/80 p-4 shadow-[0_24px_60px_rgba(117,86,77,0.08)] backdrop-blur sm:grid-cols-[1.4fr_0.8fr_auto] sm:p-5">
        <label class="search-shell">
            <span class="sr-only">Rechercher un cours</span>
            <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5 text-[var(--ink-400)]">
                <path d="M21 21L15.8 15.8M17 10.5C17 14.0899 14.0899 17 10.5 17C6.91015 17 4 14.0899 4 10.5C4 6.91015 6.91015 4 10.5 4C14.0899 4 17 6.91015 17 10.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input id="search" type="text" placeholder="Rechercher par titre, mot-cle ou enseignant..." class="w-full bg-transparent text-sm text-[var(--ink-800)] outline-none placeholder:text-[var(--ink-400)]">
        </label>

        <div class="filter-chip-row">
            <button type="button" class="filter-chip is-active" data-filter="all">Toutes les categories</button>
            <button type="button" class="filter-chip" data-filter="payant">Payants</button>
            <button type="button" class="filter-chip" data-filter="gratuit">Gratuits</button>
        </div>

        <button type="button" id="clearFilters" class="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
            Reinitialiser
        </button>
    </div>

    <div class="mt-8 flex items-center justify-between gap-4">
        <div>
            <p class="eyebrow">Suggestions pour vous</p>
            <h2 class="mt-2 font-serif text-2xl font-semibold">Une selection inspiree de votre maquette</h2>
        </div>
        <p id="resultSummary" class="text-sm text-[var(--ink-500)]">Chargement des cours...</p>
    </div>

    <div id="coursesContainer" class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"></div>

    <template id="emptyCoursesTemplate">
        <div class="col-span-full rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-white/70 p-10 text-center">
            <p class="font-serif text-2xl font-semibold">Aucun cours ne correspond a votre recherche.</p>
            <p class="mt-3 text-sm leading-6 text-[var(--ink-500)]">Essayez un autre mot-cle ou reinitialisez les filtres pour voir tout le catalogue.</p>
        </div>
    </template>
</section>
@endsection
