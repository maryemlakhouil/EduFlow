import { apiRequest } from "./api";

const root = document.getElementById("dashboardRoot");

if (root) {
    const state = {
        role: null,
        teacherData: null,
        editingCourseId: null
    };

    const formatPrice = (amount) => `${Number(amount || 0).toFixed(0)} €`;

    const courseGradient = [
        "linear-gradient(135deg, rgba(110,76,62,0.86), rgba(212,177,150,0.88))",
        "linear-gradient(135deg, rgba(142,173,120,0.94), rgba(234,244,221,0.88))",
        "linear-gradient(135deg, rgba(197,162,120,0.94), rgba(102,78,58,0.90))",
        "linear-gradient(135deg, rgba(205,146,149,0.92), rgba(247,210,197,0.90))"
    ];

    const renderStatCard = (label, value, helper) => `
        <article class="rounded-[2rem] border border-[var(--line-soft)] bg-white/85 p-6 shadow-[0_20px_55px_rgba(117,86,77,0.08)]">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-500)]">${label}</p>
            <p class="mt-4 font-serif text-4xl font-semibold text-[var(--ink-900)]">${value}</p>
            <p class="mt-2 text-sm text-[var(--ink-500)]">${helper}</p>
        </article>
    `;

    const renderStudentDashboard = (data) => {
        root.innerHTML = `
            <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                <div class="space-y-4">
                    <p class="eyebrow">Dashboard etudiant</p>
                    <h1 class="max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                        Bonjour ${data.user.name}, suivez vos cours, groupes et recommandations.
                    </h1>
                    <p class="max-w-2xl text-base leading-7 text-[var(--ink-500)]">
                        Votre espace rassemble vos inscriptions confirmees, votre groupe attribue et des suggestions basees sur vos centres d'interet.
                    </p>
                    <div class="flex flex-wrap gap-2">
                        ${(data.domains || []).length
                            ? data.domains.map((domain) => `<span class="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--ink-700)] shadow-sm">${domain.name}</span>`).join("")
                            : `<span class="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--ink-700)] shadow-sm">Aucun centre d'interet enregistre</span>`}
                    </div>
                </div>
                <div class="hero-stat-card">
                    <p class="text-sm uppercase tracking-[0.24em] text-[var(--ink-500)]">Progression</p>
                    <div class="mt-4 flex items-end gap-3">
                        <span class="font-serif text-5xl font-semibold">${String(data.enrolled_count).padStart(2, "0")}</span>
                        <span class="pb-2 text-sm text-[var(--ink-500)]">cours inscrits</span>
                    </div>
                    <p class="mt-4 text-sm leading-6 text-[var(--ink-500)]">
                        ${data.recommended_count} suggestions et ${data.wishlist_count} cours dans vos favoris.
                    </p>
                </div>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
                ${renderStatCard("Cours inscrits", data.enrolled_count, "Vos participations confirmees.")}
                ${renderStatCard("Favoris", data.wishlist_count, "Cours sauvegardes pour plus tard.")}
                ${renderStatCard("Recommandes", data.recommended_count, "Suggestions selon vos interets.")}
            </div>

            <section class="space-y-4">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="eyebrow">Mes cours</p>
                        <h2 class="mt-2 font-serif text-3xl font-semibold">Inscriptions et groupes</h2>
                    </div>
                </div>
                <div class="grid gap-6 xl:grid-cols-2">
                    ${data.enrolled_courses.length ? data.enrolled_courses.map((course, index) => `
                        <article class="overflow-hidden rounded-[2rem] border border-[var(--line-soft)] bg-white shadow-[0_22px_55px_rgba(117,86,77,0.08)]">
                            <div class="p-4">
                                <div class="rounded-[1.5rem] p-6 text-white" style="background:${courseGradient[index % courseGradient.length]}">
                                    <p class="text-sm text-white/80">Statut: ${course.status}</p>
                                    <h3 class="mt-3 font-serif text-3xl font-semibold">${course.titre}</h3>
                                    <p class="mt-3 text-sm leading-6 text-white/82">${course.description}</p>
                                </div>
                            </div>
                            <div class="grid gap-4 p-6 md:grid-cols-2">
                                <div>
                                    <p class="text-xs uppercase tracking-[0.22em] text-[var(--ink-400)]">Enseignant</p>
                                    <p class="mt-2 text-sm font-semibold text-[var(--ink-800)]">${course.enseignant?.name || "Equipe enseignante"}</p>
                                </div>
                                <div>
                                    <p class="text-xs uppercase tracking-[0.22em] text-[var(--ink-400)]">Groupe</p>
                                    <p class="mt-2 text-sm font-semibold text-[var(--ink-800)]">${course.group?.name || "Attribution en attente"}</p>
                                </div>
                            </div>
                        </article>
                    `).join("") : `
                        <div class="rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-white/80 p-10 text-center xl:col-span-2">
                            <p class="font-serif text-2xl font-semibold">Aucune inscription pour le moment.</p>
                            <p class="mt-3 text-sm text-[var(--ink-500)]">Inscrivez-vous a un cours pour voir apparaitre votre groupe ici.</p>
                        </div>
                    `}
                </div>
            </section>

            <section class="space-y-4">
                <div>
                    <p class="eyebrow">Suggestions pour vous</p>
                    <h2 class="mt-2 font-serif text-3xl font-semibold">Cours recommandes</h2>
                </div>
                <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    ${data.recommended_courses.length ? data.recommended_courses.map((course, index) => `
                        <article class="overflow-hidden rounded-[2rem] border border-[var(--line-soft)] bg-white shadow-[0_20px_50px_rgba(117,86,77,0.08)]">
                            <div class="p-4">
                                <div class="rounded-[1.5rem] p-5 text-white" style="background:${courseGradient[index % courseGradient.length]}">
                                    <p class="text-sm text-white/80">Recommande</p>
                                    <h3 class="mt-2 font-serif text-2xl font-semibold">${course.titre}</h3>
                                </div>
                            </div>
                            <div class="space-y-4 px-5 pb-5">
                                <p class="text-sm leading-6 text-[var(--ink-500)]">${course.description}</p>
                                <div class="flex items-center justify-between gap-4">
                                    <span class="font-serif text-2xl font-semibold text-[var(--accent)]">${Number(course.prix) > 0 ? formatPrice(course.prix) : "Gratuit"}</span>
                                    <a href="/courses/${course.id}" class="rounded-full bg-[var(--surface-soft)] px-5 py-3 text-sm font-semibold text-[var(--ink-700)] transition hover:bg-[var(--accent)] hover:text-white">Voir details</a>
                                </div>
                            </div>
                        </article>
                    `).join("") : `
                        <div class="rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-white/80 p-10 text-center md:col-span-2 xl:col-span-3">
                            <p class="font-serif text-2xl font-semibold">Pas encore de recommandations disponibles.</p>
                            <p class="mt-3 text-sm text-[var(--ink-500)]">Ajoutez vos centres d'interet pour enrichir vos suggestions.</p>
                        </div>
                    `}
                </div>
            </section>
        `;
    };

    const renderTeacherDashboard = (data) => {
        state.teacherData = data;

        const domainOptions = (data.available_domains || []).map((domain) => `
            <label class="flex items-center gap-3 rounded-2xl border border-[var(--line-soft)] bg-white px-4 py-3 text-sm text-[var(--ink-700)]">
                <input type="checkbox" name="domains" value="${domain.id}" class="h-4 w-4 rounded border-[var(--line-strong)] text-[var(--accent)] focus:ring-[var(--accent)]">
                <span>${domain.name}</span>
            </label>
        `).join("");

        root.innerHTML = `
            <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                <div class="space-y-4">
                    <p class="eyebrow">Dashboard enseignant</p>
                    <h1 class="max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                        Bonjour ${data.user.name}, pilotez vos cours, groupes et etudiants.
                    </h1>
                    <p class="max-w-2xl text-base leading-7 text-[var(--ink-500)]">
                        Visualisez le nombre d'etudiants inscrits, le nombre de groupes par cours et le detail des etudiants dans chaque groupe.
                    </p>
                </div>
                <div class="hero-stat-card">
                    <p class="text-sm uppercase tracking-[0.24em] text-[var(--ink-500)]">Vue enseignant</p>
                    <div class="mt-4 flex items-end gap-3">
                        <span class="font-serif text-5xl font-semibold">${String(data.courses_count).padStart(2, "0")}</span>
                        <span class="pb-2 text-sm text-[var(--ink-500)]">cours geres</span>
                    </div>
                    <p class="mt-4 text-sm leading-6 text-[var(--ink-500)]">
                        ${data.students_count} etudiants, ${data.groups_count} groupes et ${formatPrice(data.total_revenue)} de revenu estime.
                    </p>
                </div>
            </div>

            <div class="grid gap-4 md:grid-cols-4">
                ${renderStatCard("Cours", data.courses_count, "Nombre total de cours enseignes.")}
                ${renderStatCard("Etudiants", data.students_count, "Inscriptions consolidees sur vos cours.")}
                ${renderStatCard("Groupes", data.groups_count, "Groupes formes automatiquement.")}
                ${renderStatCard("Revenu", formatPrice(data.total_revenue), "Estimation selon les inscriptions.")}
            </div>

            <section class="rounded-[2rem] border border-[var(--line-soft)] bg-white/90 p-6 shadow-[0_22px_55px_rgba(117,86,77,0.08)]">
                <div class="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p class="eyebrow">Gestion des cours</p>
                        <h2 class="mt-2 font-serif text-3xl font-semibold">Creer ou modifier un cours</h2>
                    </div>
                    <button type="button" id="resetCourseForm" class="rounded-full border border-[var(--line-strong)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--ink-700)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                        Nouveau cours
                    </button>
                </div>

                <form id="teacherCourseForm" class="mt-6 space-y-5">
                    <div class="grid gap-4 md:grid-cols-2">
                        <label class="field-shell">
                            <span class="field-label">Titre</span>
                            <input type="text" name="titre" class="field-input" placeholder="Nom du cours" required>
                        </label>

                        <label class="field-shell">
                            <span class="field-label">Prix</span>
                            <input type="number" min="0" step="0.01" name="prix" class="field-input" placeholder="120" required>
                        </label>
                    </div>

                    <label class="field-shell">
                        <span class="field-label">Description</span>
                        <textarea name="description" rows="4" class="field-input resize-none" placeholder="Description du cours" required></textarea>
                    </label>

                    <div class="space-y-3">
                        <div class="flex items-center justify-between gap-4">
                            <span class="field-label">Domaines</span>
                            <span class="text-sm text-[var(--ink-500)]">Selectionnez au moins un domaine</span>
                        </div>
                        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            ${domainOptions || `<p class="text-sm text-[var(--ink-500)]">Aucun domaine disponible.</p>`}
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <button type="submit" id="submitCourseForm" class="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
                            Creer le cours
                        </button>
                        <button type="button" id="cancelEditCourse" class="hidden rounded-full border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink-700)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
                            Annuler la modification
                        </button>
                        <p id="courseFormMessage" class="text-sm text-[var(--ink-500)]"></p>
                    </div>
                </form>
            </section>

            <section class="space-y-5">
                <div>
                    <p class="eyebrow">Par cours</p>
                    <h2 class="mt-2 font-serif text-3xl font-semibold">Cours, groupes et etudiants</h2>
                </div>
                <div class="space-y-6">
                    ${data.courses.length ? data.courses.map((course, index) => `
                        <article class="overflow-hidden rounded-[2rem] border border-[var(--line-soft)] bg-white shadow-[0_22px_55px_rgba(117,86,77,0.08)]">
                            <div class="p-4">
                                <div class="rounded-[1.5rem] p-6 text-white" style="background:${courseGradient[index % courseGradient.length]}">
                                    <p class="text-sm text-white/80">Cours #${course.id}</p>
                                    <h3 class="mt-3 font-serif text-3xl font-semibold">${course.titre}</h3>
                                    <p class="mt-3 max-w-3xl text-sm leading-6 text-white/82">${course.description}</p>
                                </div>
                            </div>

                            <div class="grid gap-4 border-b border-[var(--line-soft)] px-6 pb-6 md:grid-cols-4">
                                <div>
                                    <p class="text-xs uppercase tracking-[0.22em] text-[var(--ink-400)]">Etudiants inscrits</p>
                                    <p class="mt-2 font-serif text-3xl font-semibold text-[var(--ink-900)]">${course.students_count}</p>
                                </div>
                                <div>
                                    <p class="text-xs uppercase tracking-[0.22em] text-[var(--ink-400)]">Groupes</p>
                                    <p class="mt-2 font-serif text-3xl font-semibold text-[var(--ink-900)]">${course.groups_count}</p>
                                </div>
                                <div>
                                    <p class="text-xs uppercase tracking-[0.22em] text-[var(--ink-400)]">Taille moyenne</p>
                                    <p class="mt-2 font-serif text-3xl font-semibold text-[var(--ink-900)]">${course.average_group_size}</p>
                                </div>
                                <div>
                                    <p class="text-xs uppercase tracking-[0.22em] text-[var(--ink-400)]">Revenu estime</p>
                                    <p class="mt-2 font-serif text-3xl font-semibold text-[var(--accent)]">${formatPrice(course.total_revenue)}</p>
                                </div>
                            </div>

                            <div class="space-y-4 p-6">
                                <div class="flex items-center justify-between gap-4">
                                    <div>
                                        <p class="eyebrow">Groupes par cours</p>
                                        <h4 class="mt-2 font-serif text-2xl font-semibold">Voir les etudiants par groupe</h4>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <button type="button" class="edit-course rounded-full bg-[var(--surface-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-700)] transition hover:bg-[var(--accent)] hover:text-white" data-course-id="${course.id}">
                                            Modifier
                                        </button>
                                        <button type="button" class="delete-course rounded-full border border-[var(--line-strong)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--ink-700)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]" data-course-id="${course.id}">
                                            Supprimer
                                        </button>
                                    </div>
                                </div>

                                <div class="flex flex-wrap gap-2">
                                    ${(course.domains || []).map((domain) => `<span class="rounded-full bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--ink-700)]">${domain.name}</span>`).join("")}
                                </div>

                                ${course.groups.length ? `
                                    <div class="space-y-4">
                                        ${course.groups.map((group) => `
                                            <details class="rounded-[1.5rem] border border-[var(--line-soft)] bg-[var(--surface-soft)] p-5">
                                                <summary class="flex cursor-pointer list-none items-center justify-between gap-4">
                                                    <div>
                                                        <p class="text-lg font-semibold text-[var(--ink-800)]">${group.name}</p>
                                                        <p class="mt-1 text-sm text-[var(--ink-500)]">${group.students_count} etudiants dans ce groupe</p>
                                                    </div>
                                                    <span class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--accent)]">Voir les etudiants</span>
                                                </summary>

                                                <div class="mt-5 overflow-hidden rounded-[1.25rem] bg-white">
                                                    ${group.students.length ? `
                                                        <div class="divide-y divide-[var(--line-soft)]">
                                                            ${group.students.map((student) => `
                                                                <div class="flex items-center justify-between gap-4 px-5 py-4">
                                                                    <div>
                                                                        <p class="font-medium text-[var(--ink-800)]">${student.name}</p>
                                                                        <p class="text-sm text-[var(--ink-500)]">${student.email}</p>
                                                                    </div>
                                                                    <span class="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-700)]">Etudiant</span>
                                                                </div>
                                                            `).join("")}
                                                        </div>
                                                    ` : `
                                                        <div class="px-5 py-6 text-sm text-[var(--ink-500)]">Aucun etudiant dans ce groupe pour le moment.</div>
                                                    `}
                                                </div>
                                            </details>
                                        `).join("")}
                                    </div>
                                ` : `
                                    <div class="rounded-[1.5rem] border border-dashed border-[var(--line-strong)] bg-white/80 p-8 text-center">
                                        <p class="font-serif text-2xl font-semibold">Aucun groupe cree pour ce cours.</p>
                                        <p class="mt-3 text-sm text-[var(--ink-500)]">Les groupes apparaitront ici apres les inscriptions confirmees.</p>
                                    </div>
                                `}
                            </div>
                        </article>
                    `).join("") : `
                        <div class="rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-white/80 p-10 text-center">
                            <p class="font-serif text-2xl font-semibold">Aucun cours enseignant disponible.</p>
                            <p class="mt-3 text-sm text-[var(--ink-500)]">Creez un cours pour voir les statistiques et groupes apparaitre ici.</p>
                        </div>
                    `}
                </div>
            </section>
        `;
    };

    const resetTeacherCourseForm = () => {
        const form = document.getElementById("teacherCourseForm");
        const submitButton = document.getElementById("submitCourseForm");
        const cancelButton = document.getElementById("cancelEditCourse");
        const messageNode = document.getElementById("courseFormMessage");

        if (!form) {
            return;
        }

        form.reset();
        state.editingCourseId = null;

        if (submitButton) {
            submitButton.textContent = "Creer le cours";
        }

        if (cancelButton) {
            cancelButton.classList.add("hidden");
        }

        if (messageNode) {
            messageNode.textContent = "";
            messageNode.className = "text-sm text-[var(--ink-500)]";
        }
    };

    const fillTeacherCourseForm = (courseId) => {
        const form = document.getElementById("teacherCourseForm");
        const submitButton = document.getElementById("submitCourseForm");
        const cancelButton = document.getElementById("cancelEditCourse");
        const course = state.teacherData?.courses?.find((item) => Number(item.id) === Number(courseId));

        if (!form || !course) {
            return;
        }

        state.editingCourseId = course.id;
        form.titre.value = course.titre;
        form.prix.value = course.prix;
        form.description.value = course.description;

        form.querySelectorAll("input[name='domains']").forEach((checkbox) => {
            checkbox.checked = (course.domains || []).some((domain) => Number(domain.id) === Number(checkbox.value));
        });

        if (submitButton) {
            submitButton.textContent = "Mettre a jour le cours";
        }

        if (cancelButton) {
            cancelButton.classList.remove("hidden");
        }

        form.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const getTeacherCoursePayload = (form) => {
        const selectedDomains = Array.from(form.querySelectorAll("input[name='domains']:checked")).map((checkbox) => Number(checkbox.value));

        return {
            titre: form.titre.value.trim(),
            description: form.description.value.trim(),
            prix: Number(form.prix.value),
            domains: selectedDomains
        };
    };

    const submitTeacherCourseForm = async (event) => {
        const form = event.currentTarget;
        const messageNode = document.getElementById("courseFormMessage");
        const submitButton = document.getElementById("submitCourseForm");
        const payload = getTeacherCoursePayload(form);

        event.preventDefault();

        if (!payload.domains.length) {
            messageNode.textContent = "Selectionnez au moins un domaine.";
            messageNode.className = "text-sm text-[var(--accent-dark)]";
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = state.editingCourseId ? "Mise a jour..." : "Creation...";

        try {
            if (state.editingCourseId) {
                await apiRequest(`/courses/${state.editingCourseId}`, "PUT", payload);
                window.showToast?.("Cours mis a jour.", "success");
                messageNode.textContent = "Le cours a ete mis a jour avec succes.";
            } else {
                await apiRequest("/courses", "POST", payload);
                window.showToast?.("Cours cree avec succes.", "success");
                messageNode.textContent = "Le cours a ete cree avec succes.";
            }

            messageNode.className = "text-sm text-[var(--olive)]";
            resetTeacherCourseForm();
            await loadDashboard();
        } catch (error) {
            messageNode.textContent = error.message;
            messageNode.className = "text-sm text-[var(--accent-dark)]";
            window.showToast?.(error.message, "error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = state.editingCourseId ? "Mettre a jour le cours" : "Creer le cours";
        }
    };

    const deleteTeacherCourse = async (courseId) => {
        const course = state.teacherData?.courses?.find((item) => Number(item.id) === Number(courseId));

        if (!course) {
            return;
        }

        const confirmed = window.confirm(`Supprimer le cours "${course.titre}" ?`);

        if (!confirmed) {
            return;
        }

        try {
            await apiRequest(`/courses/${courseId}`, "DELETE");
            window.showToast?.("Cours supprime avec succes.", "success");
            if (Number(state.editingCourseId) === Number(courseId)) {
                resetTeacherCourseForm();
            }
            await loadDashboard();
        } catch (error) {
            window.showToast?.(error.message, "error");
        }
    };

    const bindTeacherDashboardActions = () => {
        const form = document.getElementById("teacherCourseForm");
        const resetButton = document.getElementById("resetCourseForm");
        const cancelButton = document.getElementById("cancelEditCourse");

        form?.addEventListener("submit", submitTeacherCourseForm);
        resetButton?.addEventListener("click", resetTeacherCourseForm);
        cancelButton?.addEventListener("click", resetTeacherCourseForm);

        root.querySelectorAll(".edit-course").forEach((button) => {
            button.addEventListener("click", () => fillTeacherCourseForm(button.dataset.courseId));
        });

        root.querySelectorAll(".delete-course").forEach((button) => {
            button.addEventListener("click", () => deleteTeacherCourse(button.dataset.courseId));
        });
    };

    const renderError = (message) => {
        root.innerHTML = `
            <div class="rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-white/80 p-10 text-center">
                <p class="font-serif text-2xl font-semibold">Impossible de charger le dashboard.</p>
                <p class="mt-3 text-sm text-[var(--ink-500)]">${message}</p>
            </div>
        `;
    };

    const loadDashboard = async () => {
        if (!localStorage.getItem("token")) {
            window.showToast?.("Connectez-vous pour acceder au dashboard.", "error");
            setTimeout(() => {
                window.location.href = "/login";
            }, 600);
            return;
        }

        root.innerHTML = `
            <div class="rounded-[2rem] border border-[var(--line-soft)] bg-white/75 p-10 text-center text-[var(--ink-500)] shadow-[0_24px_60px_rgba(117,86,77,0.08)]">
                Chargement du dashboard...
            </div>
        `;

        try {
            const me = await apiRequest("/me");
            const role = me.user?.role;

            if (role === "Enseignant") {
                state.role = role;
                const teacherData = await apiRequest("/dashboard/teacher");
                renderTeacherDashboard(teacherData);
                bindTeacherDashboardActions();
                return;
            }

            state.role = role;
            const studentData = await apiRequest("/dashboard/student");
            renderStudentDashboard(studentData);
        } catch (error) {
            renderError(error.message);
        }
    };

    loadDashboard();
}
