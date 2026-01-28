import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import CitizenDashboard from './pages/Dashboard/CitizenDashboard.jsx'
import AdminDashboard from './pages/Dashboard/AdminDashboard.jsx'
import WorkerDashboard from './pages/Dashboard/WorkerDashboard.jsx'
import LandingPage from './pages/LandingPage.jsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<CitizenDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/worker" element={<WorkerDashboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
