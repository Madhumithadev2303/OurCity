# How to Run Crowd Complaint

Since the necessary tools (`mvn` and `npm`) are not currently available in the active terminal, you will need to run these commands from a terminal that has Java (Maven) and Node.js installed.

## 1. Backend Setup (Spring Boot)
1.  Open a terminal in `backend/`.
2.  Run:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```
    The server will start on port `8080`.

## 2. Frontend Setup (React)
1.  Open a new terminal in `frontend/`.
2.  Run:
    ```bash
    npm install
    npm run dev
    ```
3.  Open `http://localhost:5173` in your browser.

## Features
- **Login**: Use `demo`/`demo` to test the UI even if the backend is offline.
- **Dashboard**: File complaints and view status.
