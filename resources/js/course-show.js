import { apiRequest } from "./api";

const container = document.getElementById("courseDetails");

if (!container) {
    // Page not mounted.
} else {
    const courseId = window.location.pathname.split("/").pop();

    const formatPrice = (price) => Number(price) > 0 ? `${Number(price).toFixed(0)} €` : "Gratuit";

    const coverPatterns = [
        "linear-gradient(135deg, rgba(193,150,128,0.92), rgba(109,70,57,0.88))",
        "linear-gradient(135deg, rgba(133,161,116,0.95), rgba(229,240,219,0.88))",
        "linear-gradient(135deg, rgba(213,186,142,0.95), rgba(142,112,73,0.82))"
    ];

    async function handleWishlist(courseIdToSave) {
        try {
            await apiRequest(`/wishlist/${courseIdToSave}`, "POST");
            window.showToast?.("Cours ajoute aux favoris.", "success");
        } catch (error) {
            window.showToast?.(error.message, "error");
        }
    }

    async function handleEnroll(courseIdToEnroll) {
        if (!localStorage.getItem("token")) {
            window.showToast?.("Connectez-vous d'abord pour vous inscrire a ce cours.", "error");
            setTimeout(() => {
                window.location.href = "/login";
            }, 600);
            return;
        }

        try {
            const response = await apiRequest(`/courses/${courseIdToEnroll}/enroll`, "POST");
            window.showToast?.("Redirection vers le paiement...", "success");

            if (response.checkout_url) {
                window.location.href = response.checkout_url;
                return;
            }

            window.showToast?.("Session de paiement non recue.", "error");
        } catch (error) {
            window.showToast?.(error.message, "error");
        }
    }

    async function loadCourse() {
        container.innerHTML = `
            <div class="lg:col-span-2 rounded-[2rem] border border-[var(--line-soft)] bg-white/70 p-8 text-center text-[var(--ink-500)] shadow-[0_24px_60px_rgba(117,86,77,0.08)]">
                Chargement du cours...
            </div>
        `;

        try {
            const course = await apiRequest(`/courses/${courseId}`);
            const teacherName = course.enseignant?.name || "Enseignant EduManage";
            const domains = Array.isArray(course.domains) ? course.domains : [];
            const coverStyle = coverPatterns[Number(course.id || 0) % coverPatterns.length];

            container.innerHTML = `
                <article class="overflow-hidden rounded-[2rem] border border-[var(--line-soft)] bg-white shadow-[0_28px_70px_rgba(117,86,77,0.10)]">
                    <div class="p-4">
                        <div class="relative overflow-hidden rounded-[1.5rem] p-8 text-white" style="background:${coverStyle}">
                            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.34),transparent_35%)]"></div>
                            <div class="relative z-10">
                                <p class="eyebrow !text-white/80">Cours detail</p>
                                <h1 class="mt-4 max-w-2xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">${course.titre}</h1>
                                <p class="mt-4 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">${course.description}</p>
                                <div class="mt-6 flex flex-wrap gap-3">
                                    ${domains.map((domain) => `<span class="rounded-full bg-white/18 px-4 py-2 text-sm backdrop-blur">${domain.name}</span>`).join("")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid gap-8 p-8 md:grid-cols-2">
                        <div>
                            <p class="eyebrow">A propos du cours</p>
                            <p class="mt-4 text-base leading-8 text-[var(--ink-700)]">
                                ${course.description}
                            </p>
                        </div>

                        <div class="rounded-[1.5rem] bg-[var(--surface-soft)] p-6">
                            <p class="eyebrow">Inclus</p>
                            <div class="mt-5 space-y-4 text-sm text-[var(--ink-700)]">
                                <div class="flex items-center justify-between">
                                    <span>Enseignant</span>
                                    <strong>${teacherName}</strong>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span>Tarif</span>
                                    <strong>${formatPrice(course.prix)}</strong>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span>Acces</span>
                                    <strong>Disponible maintenant</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <aside class="rounded-[2rem] border border-[var(--line-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,239,232,0.96))] p-6 shadow-[0_24px_60px_rgba(117,86,77,0.08)]">
                    <p class="eyebrow">Participation</p>
                    <div class="mt-4">
                        <p class="font-serif text-4xl font-semibold">${formatPrice(course.prix)}</p>
                        <p class="mt-2 text-sm leading-6 text-[var(--ink-500)]">Inscription connectee au paiement et au systeme de groupes deja gere par votre backend.</p>
                    </div>

                    <div class="mt-8 space-y-3">
                        <button id="enrollBtn" class="w-full rounded-full bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
                            S'inscrire au cours
                        </button>
                        <button id="wishlistBtn" class="w-full rounded-full border border-[var(--line-strong)] bg-white px-5 py-3.5 text-sm font-semibold text-[var(--ink-700)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                            Ajouter aux favoris
                        </button>
                    </div>

                    <div class="mt-8 rounded-[1.5rem] bg-white p-5">
                        <p class="text-sm font-semibold text-[var(--ink-800)]">Pourquoi ce design fonctionne</p>
                        <ul class="mt-3 space-y-3 text-sm leading-6 text-[var(--ink-500)]">
                            <li>Lecture tres claire du titre, du prix et du CTA.</li>
                            <li>Univers visuel doux inspire de votre reference.</li>
                            <li>Base ideale pour ajouter statut, notifications et groupes.</li>
                        </ul>
                    </div>
                </aside>
            `;

            document.getElementById("wishlistBtn")?.addEventListener("click", () => handleWishlist(course.id));
            document.getElementById("enrollBtn")?.addEventListener("click", () => handleEnroll(course.id));
        } catch (error) {
            container.innerHTML = `
                <div class="lg:col-span-2 rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-white/80 p-10 text-center">
                    <p class="font-serif text-2xl font-semibold">Impossible de charger ce cours.</p>
                    <p class="mt-3 text-sm text-[var(--ink-500)]">${error.message}</p>
                </div>
            `;
        }
    }

    loadCourse();
}
