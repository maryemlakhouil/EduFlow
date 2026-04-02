import { apiRequest } from "./api";

const container = document.getElementById("coursesContainer");

if (container) {
    const searchInput = document.getElementById("search");
    const clearFiltersBtn = document.getElementById("clearFilters");
    const resultSummary = document.getElementById("resultSummary");
    const courseCount = document.getElementById("courseCount");
    const emptyTemplate = document.getElementById("emptyCoursesTemplate");
    const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

    let activeFilter = "all";
    let allCourses = [];

    const coverStyles = [
        "linear-gradient(135deg, rgba(110,76,62,0.86), rgba(212,177,150,0.88))",
        "linear-gradient(135deg, rgba(142,173,120,0.94), rgba(234,244,221,0.88))",
        "linear-gradient(135deg, rgba(197,162,120,0.94), rgba(102,78,58,0.90))",
        "linear-gradient(135deg, rgba(205,146,149,0.92), rgba(247,210,197,0.90))"
    ];

    const formatPrice = (price) => Number(price) > 0 ? `${Number(price).toFixed(0)} €` : "Gratuit";

    const summarizeResults = (count) => {
        resultSummary.textContent = `${count} cours ${count > 1 ? "affiches" : "affiche"}`;
        courseCount.textContent = String(count).padStart(2, "0");
    };

    const renderEmptyState = () => {
        container.innerHTML = "";
        const fragment = emptyTemplate.content.cloneNode(true);
        container.appendChild(fragment);
    };

    const matchesFilter = (course) => {
        if (activeFilter === "gratuit") {
            return Number(course.prix) === 0;
        }

        if (activeFilter === "payant") {
            return Number(course.prix) > 0;
        }

        return true;
    };

    const matchesSearch = (course, query) => {
        if (!query) {
            return true;
        }

        const values = [
            course.titre,
            course.description,
            course.enseignant?.name
        ].filter(Boolean).join(" ").toLowerCase();

        return values.includes(query);
    };

    const createCourseCard = (course, index) => {
        const cover = coverStyles[index % coverStyles.length];
        const domainBadges = Array.isArray(course.domains) && course.domains.length
            ? course.domains.slice(0, 2).map((domain) => `<span class="rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-700)]">${domain.name}</span>`).join("")
            : `<span class="rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-700)]">Catalogue</span>`;

        return `
            <article class="group overflow-hidden rounded-[2rem] border border-[var(--line-soft)] bg-white shadow-[0_22px_55px_rgba(117,86,77,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_75px_rgba(117,86,77,0.14)]">
                <div class="p-4">
                    <div class="relative overflow-hidden rounded-[1.5rem] p-5 text-white" style="background:${cover}">
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.40),transparent_35%)] transition duration-300 group-hover:scale-105"></div>
                        <div class="relative z-10 flex min-h-48 flex-col justify-between">
                            <div class="flex items-start justify-between gap-3">
                                <div class="flex flex-wrap gap-2">
                                    ${domainBadges}
                                </div>
                                <button type="button" class="wishlist-toggle inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/88 text-[var(--accent)] shadow-sm transition hover:scale-105" data-course-id="${course.id}" aria-label="Ajouter aux favoris">
                                    ❤
                                </button>
                            </div>
                            <div>
                                <p class="text-sm text-white/80">EduManage selection</p>
                                <h3 class="mt-2 font-serif text-2xl font-semibold leading-tight">${course.titre}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-5 px-5 pb-5">
                    <div class="space-y-3">
                        <p class="line-clamp-3 text-sm leading-6 text-[var(--ink-500)]">${course.description || "Description a venir."}</p>
                        <div class="flex items-center gap-3 text-sm text-[var(--ink-500)]">
                            <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-soft)] font-semibold text-[var(--ink-700)]">
                                ${(course.enseignant?.name || "ED").slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                                <p class="font-medium text-[var(--ink-800)]">${course.enseignant?.name || "Equipe enseignante"}</p>
                                <p>Disponible maintenant</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.22em] text-[var(--ink-400)]">Tarif</p>
                            <p class="mt-1 font-serif text-2xl font-semibold text-[var(--accent)]">${formatPrice(course.prix)}</p>
                        </div>
                        <a href="/courses/${course.id}" class="rounded-full bg-[var(--surface-soft)] px-5 py-3 text-sm font-semibold text-[var(--ink-700)] transition hover:bg-[var(--accent)] hover:text-white">
                            Voir details
                        </a>
                    </div>
                </div>
            </article>
        `;
    };

    const renderCourses = () => {
        const query = searchInput.value.trim().toLowerCase();
        const filteredCourses = allCourses.filter((course) => matchesFilter(course) && matchesSearch(course, query));

        summarizeResults(filteredCourses.length);

        if (!filteredCourses.length) {
            renderEmptyState();
            return;
        }

        container.innerHTML = filteredCourses.map((course, index) => createCourseCard(course, index)).join("");

        document.querySelectorAll(".wishlist-toggle").forEach((button) => {
            button.addEventListener("click", async () => {
                try {
                    await apiRequest(`/wishlist/${button.dataset.courseId}`, "POST");
                    window.showToast?.("Cours ajoute aux favoris.", "success");
                } catch (error) {
                    window.showToast?.(error.message, "error");
                }
            });
        });
    };

    const setFilter = (nextFilter) => {
        activeFilter = nextFilter;

        filterButtons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.filter === nextFilter);
        });

        renderCourses();
    };

    async function loadCourses() {
        container.innerHTML = `
            <div class="col-span-full rounded-[2rem] border border-[var(--line-soft)] bg-white/75 p-10 text-center text-[var(--ink-500)] shadow-[0_24px_60px_rgba(117,86,77,0.08)]">
                Chargement du catalogue...
            </div>
        `;

        try {
            const courses = await apiRequest("/courses");
            allCourses = Array.isArray(courses) ? courses : [];
            renderCourses();
        } catch (error) {
            container.innerHTML = `
                <div class="col-span-full rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-white/80 p-10 text-center">
                    <p class="font-serif text-2xl font-semibold">Impossible de charger les cours.</p>
                    <p class="mt-3 text-sm text-[var(--ink-500)]">${error.message}</p>
                </div>
            `;
            resultSummary.textContent = "Erreur de chargement";
        }
    }

    searchInput?.addEventListener("input", renderCourses);
    clearFiltersBtn?.addEventListener("click", () => {
        searchInput.value = "";
        setFilter("all");
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => setFilter(button.dataset.filter));
    });

    loadCourses();
}
