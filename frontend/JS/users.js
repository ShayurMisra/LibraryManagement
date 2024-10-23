document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:4000/api/users';
    const userList = document.getElementById('userList');
    const addUserForm = document.getElementById('addUserForm');
    const editUserFormContainer = document.getElementById('editUserFormContainer');
    const editUserForm = document.getElementById('editUserForm');

    // Fetch and display users
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/allmembers`);
            const users = await response.json();
            displayUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Display users in the list
    const displayUsers = (users) => {
        userList.innerHTML = '<h3>All Users</h3>';
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <h4>${user.userFullName}</h4>
                <p>Email: ${user.email}</p>
                <p>Mobile Number: ${user.mobileNumber}</p>
                <p>User Type: ${user.userType}</p>
                <button onclick="editUser('${user._id}')">Edit</button>
                <button onclick="deleteUser('${user._id}')">Delete</button>
            `;
            userList.appendChild(userItem);
        });
    };

    // Add new user
    document.getElementById("addUserForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const userData = {
            userFullName: document.getElementById("userFullName").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            mobileNumber: document.getElementById("mobileNumber").value,
            userType: document.getElementById("userType").value,
            age: document.getElementById("age").value || null,
            gender: document.getElementById("gender").value || null,
            dob: document.getElementById("dob").value || null,
            address: document.getElementById("address").value || "",
            isAdmin: document.getElementById("isAdmin").value === "true"
        };
    
        try {
            const response = await fetch(`${apiUrl}/adduser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Read the error response as text
                throw new Error(`Server Error: ${errorText}`);
            }
    
            const result = await response.json();
            console.log('User added successfully:', result);

            // Clear the form fields
            addUserForm.reset();

            // Refresh the user list
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error.message);
            alert(`Error adding user: ${error.message}`);
        }
    });

    // Function to delete a user
    window.deleteUser = async (userId) => {
        try {
            const response = await fetch(`${apiUrl}/deleteuser/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                alert('User deleted successfully');
                fetchUsers(); // Refresh the user list
            } else {
                const error = await response.json();
                alert(`Error deleting user: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Function to edit a user
    window.editUser = async (userId) => {
        try {
            const response = await fetch(`${apiUrl}/getuser/${userId}`);
            const user = await response.json();
            
            document.getElementById('editUserId').value = userId;
            document.getElementById('editUserFullName').value = user.userFullName;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editMobileNumber').value = user.mobileNumber;
            document.getElementById('editUserType').value = user.userType;
            document.getElementById('editAge').value = user.age || '';
            document.getElementById('editGender').value = user.gender || '';
            document.getElementById('editDob').value = user.dob || '';
            document.getElementById('editAddress').value = user.address || '';
            document.getElementById('editIsAdmin').checked = user.isAdmin || false;

            editUserFormContainer.style.display = 'block';
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Handle edit user form submission
    editUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('editUserId').value;
        const userData = {
            userFullName: document.getElementById('editUserFullName').value,
            email: document.getElementById('editEmail').value,
            mobileNumber: document.getElementById('editMobileNumber').value,
            userType: document.getElementById('editUserType').value,
            age: document.getElementById('editAge').value || null,
            gender: document.getElementById('editGender').value || null,
            dob: document.getElementById('editDob').value || null,
            address: document.getElementById('editAddress').value || "",
            isAdmin: document.getElementById('editIsAdmin').checked
        };

        try {
            const response = await fetch(`${apiUrl}/updateuser/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('User updated successfully');
                editUserFormContainer.style.display = 'none';
                fetchUsers(); // Refresh the user list
            } else {
                const error = await response.json();
                alert(`Error updating user: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert(`Error updating user: ${error.message}`);
        }
    });

    // Handle cancel edit
    document.getElementById('cancelEdit').addEventListener('click', () => {
        editUserFormContainer.style.display = 'none';
    });

    fetchUsers(); // Initial fetch to display users
});