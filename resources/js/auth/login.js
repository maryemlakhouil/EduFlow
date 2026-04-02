import { apiRequest } from "../api";

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const loginMessage = document.getElementById("loginMessage");
    const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const submitButton = form.querySelector("button[type='submit'], button:not([type])");
        const formData = new FormData(form);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Connexion...";
        }

        try {
            const response = await apiRequest("/login", "POST", {
                email: formData.get("email"),
                password: formData.get("password")
            });

            localStorage.setItem("token", response.access_token);
            localStorage.setItem("user", JSON.stringify(response.user));

            loginMessage.textContent = "Connexion reussie. Redirection...";
            loginMessage.className = "mt-5 text-sm text-[var(--olive)]";
            window.showToast?.("Connexion reussie.", "success");

            setTimeout(() => {
                window.location.href = "/courses";
            }, 700);
        } catch (error) {
            loginMessage.textContent = error.message;
            loginMessage.className = "mt-5 text-sm text-[var(--accent-dark)]";
            window.showToast?.(error.message, "error");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Se connecter";
            }
        }
    });

    forgotPasswordBtn?.addEventListener("click", async () => {
        const email = loginForm.email.value.trim();

        if (!email) {
            loginMessage.textContent = "Saisissez votre email avant de demander la reinitialisation.";
            loginMessage.className = "mt-5 text-sm text-[var(--accent-dark)]";
            return;
        }

        try {
            const response = await apiRequest("/forgot-password", "POST", { email });
            loginMessage.textContent = response.message || "Lien de reinitialisation envoye.";
            loginMessage.className = "mt-5 text-sm text-[var(--olive)]";
            window.showToast?.("Demande de reinitialisation envoyee.", "success");
        } catch (error) {
            loginMessage.textContent = error.message;
            loginMessage.className = "mt-5 text-sm text-[var(--accent-dark)]";
            window.showToast?.(error.message, "error");
        }
    });
}
