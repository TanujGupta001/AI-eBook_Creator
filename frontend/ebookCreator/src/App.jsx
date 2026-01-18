import React from 'react'
import { Routes , Route } from "react-router-dom";
import ProtectedRoute from './components/auth/ProtectedRoute';
import EditorPage from './pages/EditorPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import ViewBookPage from './pages/ViewBookPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path = "/" element = {<LandingPage/>}/>
        <Route path = "/login" element = {<LoginPage/>}/>
        <Route path = "/signup" element = {<SignupPage/>}/>

        <Route
        path = "/dashboard"
        element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}
        />
        <Route
        path = "/editor/:bookId"
        element={<ProtectedRoute><EditorPage/></ProtectedRoute>}
        />
        <Route
        path = "/view-book/:bookId"
        element={<ProtectedRoute><ViewBookPage/></ProtectedRoute>}
        />
        <Route
        path = "/profile"
        element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}
        />


      </Routes>
      <div  className=''>HELLO</div>
    </div>
  )
}

export default App
