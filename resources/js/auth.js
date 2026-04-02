async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(API_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.access_token) {

        localStorage.setItem("token", data.access_token);

        window.location.href = "/courses";
    } else {
        alert("Login failed");
    }
}