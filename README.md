# 🔍 Lost & Found Portal

A fully functional, real-time MERN stack application designed exclusively for college campuses to help safely connect individuals who have lost or found items. This platform features secure authentication, image uploads, dynamic infinite scrolling, and a robust real-time chatting engine.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=flat-square&logo=react)
![Socket.IO](https://img.shields.io/badge/Socket.io-Enabled-black?style=flat-square&logo=socket.io)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Uploads-blue?style=flat-square&logo=cloudinary)

## ✨ Core Features

* **Secure Authentication:** JWT-based authentication relying strictly on HTTP-Only secure cookies. Registration is locked to specific college domains (e.g., `@iiitl.ac.in`) to ensure a closed, safe environment.
* **Real-time Messaging:** Integrated Socket.IO enables live, WhatsApp-styled chat between users without refreshing the page.
* **Smart Notifications:** The application natively calculates unread messages globally and per-conversation, instantly pushing red notification UI bubbles to the Navbar and Dashboard when someone messages you.
* **Infinite Scroll & Pagination:** The Home feed optimizes database pulling by fetching exactly 9 items at a time through Mongoose `.skip()` and `.limit()` queries natively integrated with a React state-driven "Load More" logic.
* **Personalized Dashboard:** Users have their own protected `/dashboard` to manage, easily resolve, and delete their specific uploaded items without digging through the global feed.
* **Cloudinary Image Hosting:** Item proofs and photos are seamlessly uploaded directly to Cloudinary servers.
* **Omni-Search Engine:** Filter through thousands of items simultaneously checking standard titles, deep descriptions, categories, and item locations in a single keystroke.

## 🛠️ Technology Stack

**Frontend Framework:**
* React.js (v18+)
* React Router DOM
* TailwindCSS (Styling & Modern UX)
* Axios (Data fetching)
* Socket.IO-Client

**Backend Architecture:**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT) & bcrypt.js
* Socket.IO (Real-time duplex syncing)
* Multer & Cloudinary (File processing)

## 🚀 Local Development Setup

To run this project locally on your machine, you need Node.js and MongoDB installed.

### 1. Clone the repository
```bash
git clone https://github.com/vaibhav-agrawal264/lost-found-portal.git
cd lost-found-portal
```

### 2. Configure Environment Variables
You will need to create `.env` files in both the `frontend` and `backend` folders using the templates below.

**`backend/.env`**
```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_LIFETIME=1d
CLIENT_ORIGIN=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_secret
```

**`frontend/.env`**
```text
REACT_APP_API_URL=http://localhost:5000
```

### 3. Initialize the Backend
Navigate to the backend directory, install the required packages, and spin up the Express server.
```bash
cd backend
npm install
npm start
```

### 4. Initialize the Frontend
Open a new terminal, navigate to the frontend directory, install the React dependencies, and boot the application.
```bash
cd frontend
npm install
npm start
```

## 🌐 Deployment Configuration

This specific mono-repo is fully configured to be deployed on **Vercel** (Frontend) and **Render** (Backend).

* **Render (Backend):** Set your Root Directory to `backend` and the start command to `npm start`. Ensure `CLIENT_ORIGIN` matches your final Vercel domain exactly (with absolutely no trailing slash).
* **Vercel (Frontend):** Set your Root Directory to `frontend`. Inject your Render live URL as the `REACT_APP_API_URL`.

---

*Designed & Architected by Vaibhav Agrawal.*
