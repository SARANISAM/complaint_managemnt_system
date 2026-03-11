const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- API ROUTES ---

// 0. Sign Up
app.post('/api/signup', async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .insert([
                { name, email, username, password, role: 'student' } // default role is student
            ])
            .select();

        if (error) throw error;
        res.json({ user: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Login Authentication
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ user: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Insert Complaint
app.post('/api/complaints', async (req, res) => {
    const { user_id, title, description, priority } = req.body;

    try {
        const { data, error } = await supabase
            .from('complaints')
            .insert([
                { user_id, title, description, priority, status: 'Pending' }
            ])
            .select();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Fetch complaints for a specific student
app.get('/api/complaints/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .eq('user_id', userId)
            .order('date_submitted', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Fetch all complaints (for Admin)
app.get('/api/complaints', async (req, res) => {
    try {
        // We join with the users table to get the student name
        const { data, error } = await supabase
            .from('complaints')
            .select(`
                *,
                users ( name )
            `)
            .order('date_submitted', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Update complaint status and add remarks
app.post('/api/complaints/status', async (req, res) => {
    const { complaint_id, status, remarks } = req.body;

    try {
        // Update the complaints table
        const { error: updateError } = await supabase
            .from('complaints')
            .update({ status: status })
            .eq('complaint_id', complaint_id);

        if (updateError) throw updateError;

        // Insert into status_updates table
        if (remarks) {
            const { error: remarkError } = await supabase
                .from('status_updates')
                .insert([
                    { complaint_id, status, remarks }
                ]);

            if (remarkError) throw remarkError;
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});
// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
