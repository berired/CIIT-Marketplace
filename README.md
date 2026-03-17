# CIIT Marketplace

A two-sided marketplace platform where users can list items for sale and communicate with other users.

## Tech Stack

**Backend:** Node.js, Express, Firebase Authentication  
**Frontend:** React, Vite, JavaScript

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Firebase project credentials

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with Firebase credentials:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. Start the server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the API endpoint:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

## Features

- User authentication (login/register)
- Create and browse product listings
- View product details
- Messaging between users
- User profile management
- Admin panel

## Important Details

- Authentication uses Firebase
- API backend handles all marketplace logic
- CORS is configured for local development
- Real-time messaging support
- Products support detailed descriptions and listings management
