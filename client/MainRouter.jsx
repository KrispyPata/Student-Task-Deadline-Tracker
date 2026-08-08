import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import LandingPage from './core/LandingPage'
import Home from './core/Home'
import AuthPage from './core/AuthPage'
import Courses from './core/Courses'
import Sessions from './core/Sessions'
import Reminders from './core/Reminders'
import Profile from './core/Profile'
import ReminderNotifier from './core/ReminderNotifier'
import { getAuth } from './src/auth'

const ProtectedRoute = ({ children }) => {
  if (!getAuth()?.token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return (
    <>
      <ReminderNotifier />
      {children}
    </>
  )
}

const MainRouter = () => {
  return (
    <Routes>
      {/* PUBLIC LANDING PAGE */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* AUTH */}
      <Route
        path="/login"
        element={
          <AuthPage mode="login" />
        }
      />

      <Route
        path="/register"
        element={
          <AuthPage mode="register" />
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* COURSES */}
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />

      {/* SESSIONS */}
      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />

      {/* REMINDERS */}
      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  )
}

export default MainRouter