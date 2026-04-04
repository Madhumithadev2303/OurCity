# 🏙️ OurCity (CrowdComplaint) - Smart City Issue Reporting Platform

**OurCity** (formerly CrowdComplaint) is a modern, responsive full-stack platform empowering citizens to report infrastructure issues, verify them through community upvoting, and track resolution by municipal workers in real time.

## 🚀 Key Features

### 1. 👥 Role-Based Access
- **Citizen**: Report issues, track their progress, upvote urgent problems, and view the live map.
- **Admin/Supervisor**: View comprehensive analytics, assign tasks to workers, manage infrastructure, and monitor city health.
- **Worker**: View assigned tasks, accept and update statuses, and provide visual evidence (After photos) upon completion.

### 2. 🗺️ Live Incident Map
- Beautiful, interactive map view showing all issues across the city using Leaflet.
- Actionable UI with color-coded markers to quickly identify pending versus completed tasks.

### 3. 👍 Community Upvoting
- Citizens can upvote community issues to signal urgency to the municipal authorities.
- Admins can sort complaints by "Most Upvoted" to prioritize resources effectively.

### 4. 📊 High-Level Analytics
- Visual tracking dashboard with rich charts and metrics mapping complaints by category (e.g. Roads, Water, Sanitation).
- Clear tracking of total progress across all city incidents.

### 5. 📸 Visual Evidence (Before & After)
- Streamlined problem-solving workflow: Citizens provide "Before" photos logging the issue, and Workers must upload "After" photos upon resolution for verification.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Leaflet (Maps), Recharts (Analytics), Vanilla CSS (Premium Glassmorphism & Modern UI Design).
- **Backend**: Java Spring Boot, REST APIs.
- **Database**: H2 In-Memory Database (Great for testing, resets upon restart).

---

## 🔑 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| **Citizen** | `kumar` | `demo` |
| **Admin** | `manager` | `admin` |
| **Worker** | `ram` | `worker` |

*(Note: Feel free to sign up and create a new account from the Login page as well!)*

---

## 🏃‍♂️ How to Run Locally

### 1. Start the Backend
1. Open a terminal and navigate to the `/backend` directory.
2. Run the Spring Boot application using Maven:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
3. The API server will start at: `http://localhost:8080`

### 2. Start the Frontend
1. Open a new terminal and navigate to the `/frontend` directory.
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. The web app will start at: `http://localhost:5173`

---

## 🌐 Deployment 
For automated web deployments:
- **Frontend** can be easily deployed via [Vercel](https://vercel.com/) by importing the project and pointing to the `frontend` root directory.
- **Backend** can be hosted on a cloud provider like [Render](https://render.com/) or Railway using the included Maven build steps. Make sure to update the API base URL in your frontend before pushing!
