async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {  // Port must match backend
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            if (data.role === "admin") {
                window.location.href = "admin-panel.html";
            } else if (data.role === "teacher") {
                window.location.href = "teacher-dashboard.html";
            } else if (data.role === "student") {
                window.location.href = "student-dashboard.html";
            }
        } else {
            alert(data.message || "Invalid credentials");
        }
    } catch (error) {
        alert("Error connecting to the server.");
        console.error("Login Error:", error);
    }
}

function redirectToLogin(role) {
    window.location.href = `login.html?role=${role}`;
}
async function addUser() {
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const message = document.getElementById("message");

    // Simple validation
    if (!name || !username || !password) {
        message.innerText = "All fields are required!";
        message.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/admin/addUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, username, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            message.innerText = "User added successfully!";
            message.style.color = "green";

            // Clear input fields
            document.getElementById("name").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        } else {
            message.innerText = data.message || "Error adding user.";
            message.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        message.innerText = "Server error. Please try again.";
        message.style.color = "red";
    }
}

