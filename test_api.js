const API_URL = 'http://localhost:3000/api';

async function testSignupAndLogin() {
    console.log("Testing Signup...");
    const signupData = {
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
        password: "testpassword"
    };

    try {
        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });
        const data = await res.json();
        console.log("Signup Response:", res.status, data);

        console.log("Testing Login...");
        const loginData = {
            username: "testuser",
            password: "testpassword"
        };
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        const loginDataJson = await loginRes.json();
        console.log("Login Response:", loginRes.status, loginDataJson);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testSignupAndLogin();
