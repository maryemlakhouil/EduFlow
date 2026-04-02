@extends('layouts.app')

@section('content')
<section class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
    <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div class="space-y-4">
            <p class="eyebrow">Liste de cours sauvegardes</p>
            <h1 class="max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                Vos favoris, prets a etre consultes ou rejoints quand vous voulez.
            </h1>
            <p class="max-w-2xl text-base leading-7 text-[var(--ink-500)]">
                Retrouvez ici les cours mis de cote pour plus tard, puis accedez a leur detail ou retirez-les de votre selection.
            </p>
        </div>

        <div class="hero-stat-card">
            <p class="text-sm uppercase tracking-[0.24em] text-[var(--ink-500)]">Ma selection</p>
            <div class="mt-4 flex items-end gap-3">
                <span id="wishlistCount" class="font-serif text-5xl font-semibold">0</span>
                <span class="pb-2 text-sm text-[var(--ink-500)]">cours sauvegardes</span>
            </div>
            <p id="wishlistSummary" class="mt-4 text-sm leading-6 text-[var(--ink-500)]">
                Chargement de vos favoris...
            </p>
        </div>
    </div>

    <div id="wishlistContainer" class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"></div>

    <template id="emptyWishlistTemplate">
        <div class="col-span-full rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-white/70 p-10 text-center">
            <p class="font-serif text-2xl font-semibold">Aucun cours en favoris pour le moment.</p>
            <p class="mt-3 text-sm leading-6 text-[var(--ink-500)]">Ajoutez des cours depuis le catalogue ou la page detail pour les retrouver ici.</p>
            <a href="/courses" class="mt-6 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
                Explorer le catalogue
            </a>
        </div>
    </template>
</section>
@endsection
