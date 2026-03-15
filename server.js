require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('⚠️ Please add SUPABASE_URL and SUPABASE_KEY to your .env file');
}

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies for form submits
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper to check Supabase config
const checkSupabaseConfig = (req, res, next) => {
  if (!supabase) {
    return res.status(500).send('Supabase is not configured yet. Please check your .env file.');
  }
  next();
};

// --- Routes ---

// List all students
app.get('/', checkSupabaseConfig, async (req, res) => {
  try {
    const { data: mahasiswa, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.render('index', { mahasiswa });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).render('error', { message: 'Failed to fetch student data', error });
  }
});

// Show create form
app.get('/create', (req, res) => {
  res.render('create');
});

// Handle create form submission
app.post('/create', checkSupabaseConfig, async (req, res) => {
  try {
    const { nim, nama, jurusan, angkatan } = req.body;
    
    const { error } = await supabase
      .from('mahasiswa')
      .insert([
        { nim, nama, jurusan, angkatan: parseInt(angkatan) }
      ]);
      
    if (error) throw error;
    res.redirect('/');
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).render('error', { message: 'Failed to create student data', error });
  }
});

// Show edit form
app.get('/edit/:id', checkSupabaseConfig, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: mahasiswa, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!mahasiswa) return res.status(404).send('Student not found');
    
    res.render('edit', { mhs: mahasiswa });
  } catch (error) {
    console.error('Error fetching single data:', error);
    res.status(500).render('error', { message: 'Failed to fetch student for editing', error });
  }
});

// Handle edit form submission
app.post('/edit/:id', checkSupabaseConfig, async (req, res) => {
  try {
    const { id } = req.params;
    const { nim, nama, jurusan, angkatan } = req.body;
    
    const { error } = await supabase
      .from('mahasiswa')
      .update({ nim, nama, jurusan, angkatan: parseInt(angkatan) })
      .eq('id', id);

    if (error) throw error;
    res.redirect('/');
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).render('error', { message: 'Failed to update student data', error });
  }
});

// Handle delete action
app.post('/delete/:id', checkSupabaseConfig, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('mahasiswa')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).render('error', { message: 'Failed to delete student data', error });
  }
});

// Start server or export for Vercel
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
