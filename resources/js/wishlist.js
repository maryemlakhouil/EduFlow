import { apiRequest } from "./api";

const container = document.getElementById("wishlistContainer");

if (container) {
    if (!localStorage.getItem("token")) {
        window.showToast?.("Connectez-vous pour voir vos favoris.", "error");
        setTimeout(() => {
            window.location.href = "/login";
        }, 600);
    } else {
        const wishlistCount = document.getElementById("wishlistCount");
        const wishlistSummary = document.getElementById("wishlistSummary");
        const emptyTemplate = document.getElementById("emptyWishlistTemplate");

        const coverStyles = [
            "linear-gradient(135deg, rgba(110,76,62,0.86), rgba(212,177,150,0.88))",
            "linear-gradient(135deg, rgba(142,173,120,0.94), rgba(234,244,221,0.88))",
            "linear-gradient(135deg, rgba(197,162,120,0.94), rgba(102,78,58,0.90))",
            "linear-gradient(135deg, rgba(205,146,149,0.92), rgba(247,210,197,0.90))"
        ];

        const formatPrice = (price) => Number(price) > 0 ? `${Number(price).toFixed(0)} €` : "Gratuit";

        const renderEmptyState = () => {
            container.innerHTML = "";
            container.appendChild(emptyTemplate.content.cloneNode(true));
            wishlistCount.textContent = "00";
            wishlistSummary.textContent = "Votre selection est vide.";
        };

        const createCard = (course, index) => {
            const cover = coverStyles[index % coverStyles.length];
            const domainBadges = Array.isArray(course.domains) && course.domains.length
                ? course.domains.slice(0, 2).map((domain) => `<span class="rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-700)]">${domain.name}</span>`).join("")
                : `<span class="rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-700)]">Favori</span>`;

            return `
                <article class="group overflow-hidden rounded-[2rem] border border-[var(--line-soft)] bg-white shadow-[0_22px_55px_rgba(117,86,77,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_75px_rgba(117,86,77,0.14)]">
                    <div class="p-4">
                        <div class="relative overflow-hidden rounded-[1.5rem] p-5 text-white" style="background:${cover}">
                            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.40),transparent_35%)]"></div>
                            <div class="relative z-10 flex min-h-48 flex-col justify-between">
                                <div class="flex items-start justify-between gap-3">
                                    <div class="flex flex-wrap gap-2">${domainBadges}</div>
                                    <button type="button" class="remove-favorite inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/88 text-[var(--accent)] shadow-sm transition hover:scale-105" data-course-id="${course.id}" aria-label="Retirer des favoris">
                                        ❤
                                    </button>
                                </div>
                                <div>
                                    <p class="text-sm text-white/80">Dans vos favoris</p>
                                    <h2 class="mt-2 font-serif text-2xl font-semibold leading-tight">${course.titre}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-5 px-5 pb-5">
                        <p class="line-clamp-3 text-sm leading-6 text-[var(--ink-500)]">${course.description || "Description a venir."}</p>

                        <div class="flex items-center gap-3 text-sm text-[var(--ink-500)]">
                            <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-soft)] font-semibold text-[var(--ink-700)]">
                                ${(course.enseignant?.name || "ED").slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                                <p class="font-medium text-[var(--ink-800)]">${course.enseignant?.name || "Equipe enseignante"}</p>
                                <p>Ajoute a votre selection</p>
                            </div>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                            <p class="font-serif text-2xl font-semibold text-[var(--accent)]">${formatPrice(course.prix)}</p>
                            <div class="flex gap-2">
                                <a href="/courses/${course.id}" class="rounded-full bg-[var(--surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--ink-700)] transition hover:bg-[var(--accent)] hover:text-white">
                                    Voir details
                                </a>
                                <button type="button" class="remove-favorite rounded-full border border-[var(--line-strong)] bg-white px-4 py-3 text-sm font-semibold text-[var(--ink-700)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]" data-course-id="${course.id}">
                                    Retirer
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        };

        const bindRemoveActions = (reload) => {
            document.querySelectorAll(".remove-favorite").forEach((button) => {
                button.addEventListener("click", async () => {
                    try {
                        await apiRequest(`/wishlist/${button.dataset.courseId}`, "DELETE");
                        window.showToast?.("Cours retire des favoris.", "success");
                        reload();
                    } catch (error) {
                        window.showToast?.(error.message, "error");
                    }
                });
            });
        };

        const renderWishlist = (courses, reload) => {
            const count = courses.length;
            wishlistCount.textContent = String(count).padStart(2, "0");
            wishlistSummary.textContent = `${count} cours ${count > 1 ? "sauvegardes" : "sauvegarde"} dans votre liste.`;

            if (!count) {
                renderEmptyState();
                return;
            }

            container.innerHTML = courses.map((course, index) => createCard(course, index)).join("");
            bindRemoveActions(reload);
        };

        const loadWishlist = async () => {
            container.innerHTML = `
                <div class="col-span-full rounded-[2rem] border border-[var(--line-soft)] bg-white/75 p-10 text-center text-[var(--ink-500)] shadow-[0_24px_60px_rgba(117,86,77,0.08)]">
                    Chargement de vos favoris...
                </div>
            `;

            try {
                const courses = await apiRequest("/wishlist");
                renderWishlist(Array.isArray(courses) ? courses : [], loadWishlist);
            } catch (error) {
                container.innerHTML = `
                    <div class="col-span-full rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-white/80 p-10 text-center">
                        <p class="font-serif text-2xl font-semibold">Impossible de charger vos favoris.</p>
                        <p class="mt-3 text-sm text-[var(--ink-500)]">${error.message}</p>
                    </div>
                `;
                wishlistSummary.textContent = "Erreur de chargement.";
            }
        };

        loadWishlist();
    }
}
