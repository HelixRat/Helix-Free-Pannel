// JavaScript for handling login, account creation, and key generation

const users = JSON.parse(localStorage.getItem('users')) || {}; // Users data from localStorage
const loggedInUser = localStorage.getItem('loggedInUser'); // Logged-in user from localStorage

// Show login page if no user is logged in
if (!loggedInUser) {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('account-creation-container').style.display = 'none';
    document.getElementById('key-generation-container').style.display = 'none';
} else {
    // If already logged in, go to the corresponding page
    const user = users[loggedInUser];
    if (user && user.isAdmin) {
        showAccountCreationPage(); // Admin logged in
    } else {
        showKeyGenerationPage(loggedInUser); // Regular user logged in
    }
}

// Admin login check
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === 'Admin' && password === 'Helixop') {
        localStorage.setItem('loggedInUser', 'Admin');
        showAccountCreationPage(); // Admin redirects to account creation page
    } else if (users[username] && users[username].password === password) {
        localStorage.setItem('loggedInUser', username);
        showKeyGenerationPage(username); // Regular user redirects to key generation page
    } else {
        document.getElementById('login-message').textContent = 'Invalid username or password';
    }
});

// Show account creation page (only for admin)
function showAccountCreationPage() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('account-creation-container').style.display = 'block';
    document.getElementById('key-generation-container').style.display = 'none';
}

// Show key generation page (for regular users)
function showKeyGenerationPage(username) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('account-creation-container').style.display = 'none';
    document.getElementById('key-generation-container').style.display = 'block';

    // Display user's generated keys
    loadKeys(username);
}

// Load keys for the logged-in user
function loadKeys(username) {
    const keyList = document.getElementById('key-list');
    keyList.innerHTML = ''; // Clear previous keys

    const keys = users[username] ? users[username].keys || [] : [];
    keys.forEach(key => {
        const listItem = document.createElement('li');
        listItem.textContent = `Name: ${key.name}, Key: ${key.key}, Expires: ${new Date(key.expiration).toLocaleString()}`;
        keyList.appendChild(listItem);
    });
}

// Create a new user account (only for admin)
document.getElementById('create-account-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const newUsername = document.getElementById('new-username').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();

    if (users[newUsername]) {
        document.getElementById('account-creation-message').textContent = 'Username already exists.';
    } else {
        users[newUsername] = { password: newPassword, keys: [] };
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('account-creation-message').textContent = 'Account created successfully!';
    }
});

// Back to login page
document.getElementById('back-to-login').addEventListener('click', function() {
    document.getElementById('account-creation-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
});

// View created user accounts
document.getElementById('view-users').addEventListener('click', function() {
    const userListDiv = document.getElementById('user-list');
    const userListUl = document.getElementById('user-list-ul');

    // Clear the previous user list
    userListUl.innerHTML = '';

    // Show list of all users
    for (const username in users) {
        if (users.hasOwnProperty(username) && username !== 'Admin') {
            const userItem = document.createElement('li');
            userItem.textContent = `Username: ${username}, Password: ${users[username].password}`;
            
            // Add delete button for each user
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', function() {
                deleteUserAccount(username);
            });

            userItem.appendChild(deleteButton);
            userListUl.appendChild(userItem);
        }
    }

    userListDiv.style.display = 'block';
});

// Delete a user account (admin only)
function deleteUserAccount(username) {
    if (users[username]) {
        delete users[username];
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers(); // Refresh user list after deleting an account

        // If the deleted account was logged in, log out the user
        if (localStorage.getItem('loggedInUser') === username) {
            localStorage.removeItem('loggedInUser');
            document.getElementById('login-container').style.display = 'block';
            document.getElementById('key-generation-container').style.display = 'none';
            document.getElementById('account-creation-container').style.display = 'none';
        }
    }
}

// Refresh the user list after deletion
function loadUsers() {
    const userListDiv = document.getElementById('user-list');
    const userListUl = document.getElementById('user-list-ul');

    // Clear the previous user list
    userListUl.innerHTML = '';

    // Show list of all users except the admin
    for (const username in users) {
        if (users.hasOwnProperty(username) && username !== 'Admin') {
            const userItem = document.createElement('li');
            userItem.textContent = `Username: ${username}, Password: ${users[username].password}`;
            
            // Add delete button for each user
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', function() {
                deleteUserAccount(username);
            });

            userItem.appendChild(deleteButton);
            userListUl.appendChild(userItem);
        }
    }
}

// Key generation for regular users
document.getElementById('generate-key-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const days = parseInt(document.getElementById('days').value);
    const hours = parseInt(document.getElementById('hours').value);
    const key = generateKey(name, days, hours);

    const username = localStorage.getItem('loggedInUser');
    users[username].keys.push(key);
    localStorage.setItem('users', JSON.stringify(users));

    loadKeys(username); // Reload keys after generating a new one
});

// Generate a key with expiration
function generateKey(name, days, hours) {
    const expiration = Date.now() + (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000);
    return { name, key: 'KEY-' + Math.random().toString(36).substr(2, 9), expiration };
}

// Logout functionality
document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    document.getElementById('key-generation-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
});
