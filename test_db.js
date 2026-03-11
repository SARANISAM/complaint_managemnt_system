require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log("URL:", supabaseUrl ? "Exists" : "Missing");
console.log("KEY:", supabaseKey ? "Exists" : "Missing");

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log("Attempting to query 'users' table...");
        const { data, error } = await supabase.from('users').select('*').limit(1);
        
        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Success! Data:", data);
        }
    } catch (err) {
        console.error("Exception:", err);
    }
}

testConnection();
