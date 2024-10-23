document.addEventListener('DOMContentLoaded', () => {
    const librarianNameElement = document.getElementById('librarianName');
    const totalBooksElement = document.getElementById('totalBooks');
    const newTransactionsElement = document.getElementById('newTransactions');
    const recentActivitiesList = document.getElementById('recentActivitiesList');

    // Fetch librarian data and stats from the server
    const fetchDashboardData = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/dashboard'); // Adjust the URL as needed
            const data = await response.json();
            librarianNameElement.textContent = data.librarianName;
            totalBooksElement.textContent = data.totalBooks;
            newTransactionsElement.textContent = data.newTransactions;

            recentActivitiesList.innerHTML = data.recentActivities.map(activity => `<li>${activity}</li>`).join('');
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    fetchDashboardData();

    // Logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
        // Handle logout (e.g., clear tokens and redirect to login)
        window.location.href = 'login.html'; // Adjust as needed
    });
});
