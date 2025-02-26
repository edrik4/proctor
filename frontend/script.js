function redirectToLogin(role) {
    localStorage.setItem("role", role);
    window.location.href = "login.html";
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = localStorage.getItem("role");

    const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) window.location.href = data.redirect;
    else alert(data.msg);
}

async function registerUser() {
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, role })
    });

    const data = await res.json();
    alert(data.msg);
}
