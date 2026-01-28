# 🚀 CrowdComplaint Deployment Guide

## Part 1: Push to GitHub

You have a local git repository ready. Now you need to host it on GitHub.

1.  **Log in to GitHub** (https://github.com) and click the **+** icon -> **New repository**.
2.  Name it `crowd-complaint` (or anything you like).
3.  **Do NOT check** "Initialize with README", .gitignore, or license (we already have them).
4.  Click **Create repository**.
5.  Copy the URL of your new repository (e.g., `https://github.com/YourUsername/crowd-complaint.git`).
6.  Run the following commands in your terminal (inside the `Project` folder):

```bash
git remote add origin <PASTE_YOUR_GITHUB_URL_HERE>
git branch -M main
git push -u origin main
```

Your code is now on GitHub! 🎉

---

## Part 2: Publish Your Website (Deployment)

Since this is a full-stack app (Frontend + Backend), you host them separately.

### 1. 🌐 Frontend (Vercel) - Easiest for React/Vite
1.  Go to [Vercel.com](https://vercel.com) and sign up/login with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `crowd-complaint` repository.
4.  **Important**: Vercel needs to know where the frontend code lives.
    *   **Root Directory**: Click "Edit" and select `frontend`.
5.  Click **Deploy**.
6.  Once done, you will get a URL like `https://crowd-complaint.vercel.app`.

### 2. ⚙️ Backend (Render) - Free Tier for Java/Spring Boot
1.  Go to [Render.com](https://render.com) and sign up/login with GitHub.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your `crowd-complaint` repository.
4.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Runtime**: `Java`
    *   **Build Command**: `mvn clean package -DskipTests`
    *   **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
5.  Click **Create Web Service**.
6.  You will get a URL like `https://crowd-complaint-api.onrender.com`.

### 3. 🔗 Connect Them
Now that both are online, you need to tell the Frontend where the Backend is.
1.  Go back to your **Local Project**.
2.  Open `frontend/src/pages/Dashboard/CitizenDashboard.jsx` (and others).
3.  Replace `navigate('/login')` or fetch calls to `/api/...` with your **Render Backend URL** (or configure a proxy properly in production).
    *   *Note: For a quick prototype, hardcoding or using `.env` is fine.*
    *   Example: `fetch('https://crowd-complaint-api.onrender.com/api/complaints')`
4.  Commit & Push the changes (`git add .`, `git commit -m "Update API URL"`, `git push`).
5.  Vercel will automatically redeploy!

---

## 🏃‍♂️ How to Run Locally (Reminder)

*   **Frontend**: `cd frontend` -> `npm run dev`
*   **Backend**: `cd backend` -> `mvn spring-boot:run`
