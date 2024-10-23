document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:4000/api/auth';

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${apiUrl}/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(error);
                }

                const data = await response.json();
                console.log('Login successful:', data);
                window.location.href = 'index.html'; // Redirect to dashboard
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please check your credentials and try again.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userFullName: name,
                        email,
                        password
                    }),
                });

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(error);
                }

                const data = await response.json();
                console.log('Registration successful:', data);
                window.location.href = 'login.html'; // Redirect to login page
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            }
        });
    }
});
