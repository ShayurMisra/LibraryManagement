document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');
    const updateModal = document.getElementById('updateModal');
    const updateForm = document.getElementById('updateForm');
    const closeModal = document.querySelector('.close');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const searchType = document.getElementById('searchType').value;
        const searchQuery = encodeURIComponent(document.getElementById('searchQuery').value);
        let url = '';

        if (searchType === 'book') {
            url = `http://localhost:4000/api/books/searchbooks?query=${searchQuery}`;
        } else if (searchType === 'user') {
            url = `http://localhost:4000/api/users/searchusers?query=${searchQuery}`;
        }

        try {
            const response = await fetch(url);

            const rawResponseText = await response.text();
            console.log('Raw response:', rawResponseText);

            if (response.headers.get('Content-Type')?.includes('application/json')) {
                const data = JSON.parse(rawResponseText);
                console.log('Parsed response data:', data);

                if (!Array.isArray(data)) {
                    throw new Error('Response data is not an array');
                }

                searchResults.innerHTML = '';

                data.forEach(item => {
                    let cardHtml = `
                        <div class="card">
                            <h3>${searchType === 'book' ? item.bookName : item.userFullName}</h3>
                            ${searchType === 'book' ? `
                                <p>Author: ${item.author}</p>
                                <p>ISBN: ${item.isbn}</p>
                                <p>Genre: ${item.genre}</p>
                                <p>Publication Year: ${item.publicationYear}</p>
                            ` : `
                                <p>Email: ${item.email}</p>
                                <p>Phone Number: ${item.mobileNumber}</p>
                            `}
                            <button class="update-btn" data-id="${item._id}" data-type="${searchType}">Update</button>
                            <button class="delete-btn" data-id="${item._id}" data-type="${searchType}">Delete</button>
                        </div>
                    `;
                    searchResults.innerHTML += cardHtml;
                });

                document.querySelectorAll('.update-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const type = e.target.getAttribute('data-type');
                        openUpdateModal(id, type);
                    });
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const type = e.target.getAttribute('data-type');
                        deleteItem(id, type);
                    });
                });

            } else {
                throw new Error('Response is not JSON');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            searchResults.innerHTML = '<p>Error fetching results. Please try again later.</p>';
        }
    });

    function openUpdateModal(id, type) {
        let url = '';
        if (type === 'book') {
            url = `http://localhost:4000/api/books/getbook/${id}`;
        } else if (type === 'user') {
            url = `http://localhost:4000/api/users/getuser/${id}`;
        }
    
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                updateForm.innerHTML = '';
    
                if (type === 'book') {
                    updateForm.innerHTML = `
                        <input type="text" id="bookName" value="${data.bookName}" placeholder="Book Name">
                        <input type="text" id="author" value="${data.author}" placeholder="Author">
                        <input type="text" id="isbn" value="${data.isbn}" placeholder="ISBN">
                        <input type="text" id="genre" value="${data.genre}" placeholder="Genre">
                        <input type="text" id="publicationYear" value="${data.publicationYear}" placeholder="Publication Year">
                        <button type="submit">Update Book</button>
                    `;
                } else if (type === 'user') {
                    updateForm.innerHTML = `
                        <input type="text" id="userFullName" value="${data.userFullName}" placeholder="Full Name">
                        <input type="text" id="email" value="${data.email}" placeholder="Email">
                        <input type="text" id="mobileNumber" value="${data.mobileNumber}" placeholder="Phone Number">
                        <button type="submit">Update User</button>
                    `;
                }
    
                updateModal.style.display = 'block';
    
                updateForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const updateUrl = type === 'book' ? `http://localhost:4000/api/books/updatebook/${id}` : `http://localhost:4000/api/users/updateuser/${id}`;
                    const formData = new FormData(updateForm);
    
                    const updatedData = {};
                    formData.forEach((value, key) => {
                        updatedData[key] = value;
                    });
    
                    fetch(updateUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedData)
                    })
                    .then(response => response.json())
                    .then(updatedItem => {
                        alert(`${type === 'book' ? 'Book' : 'User'} updated successfully!`);
                        updateModal.style.display = 'none';
                        searchForm.dispatchEvent(new Event('submit'));
                    })
                    .catch(error => {
                        console.error('Error updating item:', error);
                        alert('Error updating item. Please try again later.');
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching item for update:', error);
                alert('Error fetching item for update. Please try again later.');
            });
    }

    function deleteItem(id, type) {
        const deleteUrl = type === 'book' ? `http://localhost:4000/api/books/removebook/${id}` : `http://localhost:4000/api/users/deleteuser/${id}`;

        if (confirm('Are you sure you want to delete this item?')) {
            fetch(deleteUrl, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(`${type === 'book' ? 'Book' : 'User'} deleted successfully!`);
                searchForm.dispatchEvent(new Event('submit'));
            })
            .catch(error => {
                console.error('Error deleting item:', error);
                alert('Error deleting item. Please try again later.');
            });
        }
    }

    closeModal.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === updateModal) {
            updateModal.style.display = 'none';
        }
    });
});