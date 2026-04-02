import './bootstrap';
import "./auth/login";
import "./auth/register";
import './courses';
import './course-show';
import './wishlist';
import './dashboard';

function showToast(message, tone = "default") {
    const container = document.getElementById("toastContainer");

    if (!container) {
        return;
    }

    const tones = {
        default: "text-[var(--ink-800)]",
        success: "border-[rgba(135,155,114,0.25)] text-[var(--olive)]",
        error: "border-[rgba(139,94,82,0.24)] text-[var(--accent-dark)]"
    };

    const toast = document.createElement("div");
    toast.className = `toast-card ${tones[tone] || tones.default}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-x-2", "transition");
    }, 2600);

    setTimeout(() => {
        toast.remove();
    }, 3200);
}

window.showToast = showToast;

const logoutBtn = document.getElementById("logoutBtn");
const hasToken = Boolean(localStorage.getItem("token"));

if (logoutBtn && hasToken) {
    logoutBtn.classList.remove("hidden");
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("Vous etes deconnecte.", "success");
        window.location.href = "/login";
    });
}
