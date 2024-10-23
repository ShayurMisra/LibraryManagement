document.addEventListener('DOMContentLoaded', () => {
    const createTransactionForm = document.getElementById('create-transaction-form');
    const transactionsTable = document.getElementById('transactions-table').getElementsByTagName('tbody')[0];

    // Fetch and display transactions
    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/transactions/all-transactions');
            const transactions = await response.json();
            transactionsTable.innerHTML = transactions.map(transaction => `
                <tr>
                    <td>${transaction.bookName}</td>
                    <td>${transaction.borrowerName}</td>
                    <td>${transaction.transactionType}</td>
                    <td>${transaction.fromDate}</td>
                    <td>${transaction.toDate}</td>
                    <td>${transaction.returnDate || 'N/A'}</td>
                    <td>${transaction.transactionStatus}</td>
                    <td>
                        ${transaction.transactionStatus === 'Active' ? `
                            <button onclick="closeTransaction('${transaction._id}')">Close</button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // Handle form submission
    createTransactionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(createTransactionForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:4000/api/transactions/add-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') // Adjust if using tokens
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            alert('Transaction created successfully');
            createTransactionForm.reset();
            fetchTransactions();
        } catch (error) {
            console.error('Error creating transaction:', error);
            alert('Error creating transaction');
        }
    });

    // Close transaction
    window.closeTransaction = async (transactionId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/transactions/update-transaction/${transactionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') // Adjust if using tokens
                },
                body: JSON.stringify({ transactionStatus: 'Closed', isAdmin: true }) // Add necessary fields
            });
            const result = await response.json();
            alert('Transaction closed successfully');
            fetchTransactions();
        } catch (error) {
            console.error('Error closing transaction:', error);
            alert('Error closing transaction');
        }
    };

    // Initial load
    fetchTransactions();
});
