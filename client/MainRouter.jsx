import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import Home from './core/Home'
import AuthPage from './core/AuthPage'
import Courses from './core/Courses'
import Sessions from './core/Sessions'
import Reminders from './core/Reminders'
import { getAuth } from './src/auth'

const ProtectedRoute = ({ children }) => {
  return getAuth()?.token
    ? children
    : <Navigate to="/login" replace />
}

const MainRouter = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={<AuthPage mode="login" />}
      />

      <Route
        path="/register"
        element={<AuthPage mode="register" />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default MainRouter