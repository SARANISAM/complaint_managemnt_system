// Base API URL
const API_URL =https://complaint-managemnt-system.onrender.com/api;

// --- AUTHENTICATION ---
async function signup(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Signup failed');
            return;
        }

        // Store user in local storage immediately log them in
        localStorage.setItem('user', JSON.stringify(data.user));

        // Default redirects to student dashboard after sign up
        window.location.href = 'student_dashboard.html';
        alert('Welcome to the Complaint Management System!');
    } catch (error) {
        console.error('Error signing up:', error);
        alert('An error occurred during signup.');
    }
}

async function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Login failed');
            return;
        }

        // Store user in local storage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') {
            window.location.href = 'admin_dashboard.html';
        } else {
            window.location.href = 'student_dashboard.html';
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred during login.');
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function checkAuth(roleRequired = null) {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = 'login.html';
        return null;
    }
    const user = JSON.parse(userStr);
    
    if (roleRequired && user.role !== roleRequired) {
        alert('Unauthorized access');
        window.location.href = 'login.html';
        return null;
    }
    
    // Update UI if element exists
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = user.name;
    
    return user;
}

// --- STUDENT ACTIONS ---
async function submitComplaint(event) {
    event.preventDefault();
    const user = checkAuth('student');
    if (!user) return;

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;

    try {
        const response = await fetch(`${API_URL}/complaints`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.user_id,
                title,
                description,
                priority
            })
        });

        if (response.ok) {
            alert('Complaint submitted successfully!');
            window.location.href = 'view_complaints.html';
        } else {
            const data = await response.json();
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error submitting complaint:', error);
    }
}

async function loadStudentComplaints() {
    const user = checkAuth('student');
    if (!user) return;

    try {
        const response = await fetch(`${API_URL}/complaints/user/${user.user_id}`);
        const complaints = await response.json();

        const tableBody = document.getElementById('complaints-tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';

        complaints.forEach(c => {
            const date = new Date(c.date_submitted).toLocaleDateString();
            const statusClass = `status-${c.status.toLowerCase().replace(' ', '-')}`;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${c.complaint_id}</td>
                <td>${c.title}</td>
                <td>${c.priority}</td>
                <td><span class="status-badge ${statusClass}">${c.status}</span></td>
                <td>${date}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading complaints:', error);
    }
}

// --- ADMIN ACTIONS ---
async function loadAllComplaints() {
    checkAuth('admin');

    try {
        const response = await fetch(`${API_URL}/complaints`);
        const complaints = await response.json();

        const tableBody = document.getElementById('admin-complaints-tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        complaints.forEach(c => {
            const statusClass = `status-${c.status.toLowerCase().replace(' ', '-')}`;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${c.complaint_id}</td>
                <td>${c.users ? c.users.name : 'Unknown User'}</td>
                <td>${c.title}</td>
                <td>${c.priority}</td>
                <td><span class="status-badge ${statusClass}">${c.status}</span></td>
                <td>
                    <select id="status-${c.complaint_id}" class="update-select">
                        <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="Rejected" ${c.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
                <td>
                    <input type="text" id="remark-${c.complaint_id}" placeholder="Add remark..." class="update-input" />
                </td>
                <td>
                    <button onclick="updateComplaintStatus(${c.complaint_id})" class="btn" style="padding: 0.5rem 1rem; font-size: 0.6rem;">Update</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading all complaints:', error);
    }
}

async function updateComplaintStatus(complaintId) {
    checkAuth('admin');

    const statusObj = document.getElementById(`status-${complaintId}`);
    const remarkObj = document.getElementById(`remark-${complaintId}`);
    
    const status = statusObj.value;
    const remarks = remarkObj.value;

    try {
        const response = await fetch(`${API_URL}/complaints/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ complaint_id: complaintId, status, remarks })
        });

        if (response.ok) {
            alert('Complaint updated successfully!');
            loadAllComplaints(); // Reload the table
        } else {
            const data = await response.json();
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
}
