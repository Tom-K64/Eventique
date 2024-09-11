
# Eventique - Event Management System

**Live Demo**: [eventique.tom-k64.in](https://eventique.tom-k64.in)

Eventique is a comprehensive event management platform that simplifies event creation, attendee management, and engagement. It includes features like Q&A sessions, discussion forums, polls, and a ticket booking system to enhance the overall event experience for both organizers and participants.

---

## Features
- **User Authentication**: Secure login and signup
- **Event Creation & Management**: Create, update, and manage events with ease
- **Ticket Booking System**: Users can book tickets with real-time updates
- **Interactive Engagement**: Q&A sessions, polls, and discussion forums for attendees
- **Email Notifications**: Event-related notifications via email
- **Event Filters & Sorting**: Sort and filter events by title, price, and time

---

## Prerequisites
- [Node.js](https://nodejs.org/en/) (v14.x or later)
- [Python 3](https://www.python.org/downloads/) (v3.7 or later)

---

## Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/Tom-K64/Eventique.git
cd Eventique
\`\`\`

### 2. Backend Setup

1. **Create and activate a virtual environment**:

    \`\`\`bash
    python -m venv venv
    source venv/bin/activate  # Mac/Linux
    .\venv\Scripts\activate   # Windows
    \`\`\`

2. **Install backend dependencies**:

    \`\`\`bash
    cd backend
    pip install -r requirements.txt
    \`\`\`

3. **Set up environment variables**:

    - Create a \`.env\` file in the \`backend\` folder.
    - Add your email configuration for sending notifications:

      \`\`\`
      EMAIL_HOST=smtp.example.com
      EMAIL_PORT=587
      EMAIL_HOST_USER=your-email@example.com
      EMAIL_HOST_PASSWORD=your-email-password
      EMAIL_USE_TLS=True
      \`\`\`

4. **Database Setup**:

    \`\`\`bash
    python manage.py makemigrations
    python manage.py migrate
    \`\`\`

5. **Run the backend server**:

    \`\`\`bash
    python manage.py runserver
    \`\`\`

---

### 3. Frontend Setup

1. **Navigate to the frontend directory**:

    \`\`\`bash
    cd frontend
    \`\`\`

2. **Install frontend dependencies**:

    \`\`\`bash
    npm install
    \`\`\`

3. **Set up environment variables**:

    - Create a \`.env\` file inside the \`frontend\` folder.
    - Add the backend base URL:

      \`\`\`bash
      VITE_BASE_URL=http://localhost:8000
      \`\`\`

4. **Run the development server**:

    \`\`\`bash
    npm run dev
    \`\`\`

---

## Access the Application

- Open your browser and go to: \`http://localhost:5173\` to access the frontend.
- The backend API runs on \`http://localhost:8000\`.

---

## Email Notifications Setup

To enable email notifications, configure your email settings in the \`.env\` file in the backend directory. Email configuration details are excluded from the repository for privacy reasons.

---

## Folder Structure

\`\`\`plaintext
Eventique/
│
├── backend/              # Django Backend
│   ├── activities/       
│   ├── core/             # Configurations
│   ├── events/           # Main event app
│   ├── notifications/    
│   ├── user/             
│   ├── .env/             #Email & other Configuration for security reasons
│   ├── userprofile/      
│   ├── manage.py         # Django's manage command
│   └── requirements.txt  # Python dependencies
│
├── frontend/             # React Frontend (Vite)
│   ├── public/           # Static files
│   ├── src/              # Source code
│   ├── .env/             # Base URL for API calls
│   ├── index.html        # Entry point
│   └── package.json      # Node dependencies
│
└── README.md             # Project documentation
\`\`\`

---

