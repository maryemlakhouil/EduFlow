import { apiRequest } from "../api";

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const messageNode = document.getElementById("message");
        const submitButton = form.querySelector("button[type='submit'], button:not([type])");

        const data = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            password_confirmation: form.password_confirmation.value,
            role: form.role.value
        };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Creation du compte...";
        }

        try {
            const response = await apiRequest("/register", "POST", data);

            localStorage.setItem("token", response.access_token);
            localStorage.setItem("user", JSON.stringify(response.user));

            messageNode.textContent = "Inscription reussie. Redirection...";
            messageNode.className = "mt-4 text-sm text-[var(--olive)]";
            window.showToast?.("Compte cree avec succes.", "success");

            setTimeout(() => {
                window.location.href = "/courses";
            }, 700);
        } catch (error) {
            messageNode.textContent = error.message || "Erreur inscription";
            messageNode.className = "mt-4 text-sm text-[var(--accent-dark)]";
            window.showToast?.(error.message, "error");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Creer mon compte";
            }
        }
    });
}
