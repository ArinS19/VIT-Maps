let isLogin = true;

const formTitle = document.getElementById("formTitle");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const toggleBtn = document.getElementById("toggleBtn");

// Toggle between Login & Signup
toggleBtn.addEventListener("click", () => {
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.innerText = "Login to VITMaps";
        nameInput.style.display = "none";
        submitBtn.innerText = "Login";
        toggleBtn.innerText = "Sign up";
        toggleBtn.parentElement.firstChild.textContent = "Don't have an account? ";
    } else {
        formTitle.innerText = "Create an Account";
        nameInput.style.display = "block";
        submitBtn.innerText = "Sign Up";
        toggleBtn.innerText = "Login";
        toggleBtn.parentElement.firstChild.textContent = "Already have an account? ";
    }
});

// Submit handler
submitBtn.addEventListener("click", () => {

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

    const body = isLogin
        ? { email, password }
        : { name, email, password };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {

        if (isLogin && data.message === "Login successful") {
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Login successful!");
            window.location.href = "../index.html";
        } else if (!isLogin && data.message === "User registered successfully") {
            alert("Signup successful! Please login.");
        } else {
            alert(data.message);
        }

    })
    .catch(err => console.error(err));
});