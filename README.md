# 🏢 Complaint Management System

A sleek, modern, and secure web-based application for managing department complaints, built with **HTML, CSS, JavaScript**, and **Node.js**, powered by **Supabase**.

## ✨ Features

- **Student Dashboard**: Quick access to lodge new complaints and track previous ones.
- **Admin Dashboard**: Full visibility into all student complaints with status update capabilities.
- **Secure Backend**: Express.js proxy to keep Supabase credentials hidden from the frontend.
- **Arché Aesthetic**: A premium design system using "Warm Alabaster" and "Deep Graphite" themes.
- **Micro-interactions**: Smooth page transitions and responsive feedback.

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- A Supabase project.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/24br16239-cyber/complaint_managemnt.git
   cd complaint_managemnt
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_service_role_key
   ```

4. **Run the application:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000/login.html`.

## 🛠️ Technology Stack
- **Frontend**: Vanilla JavaScript, CSS3 (Arché Design System), HTML5.
- **Backend**: Node.js, Express.js.
- **Database**: Supabase (PostgreSQL).
- **Authentication**: Custom logic with Supabase verification.

## 📜 License
This project is open-source and available for educational use.
