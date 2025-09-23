import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

import AdminRoute from './components/AdminRoute';
import AdminUsers from './pages/AdminUsers';
import AdminPosts from './pages/AdminPosts';

import { NotificationProvider } from './context/NotificationContext';

// import other pages...

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute>{/* Home/feed component here */}</PrivateRoute>} />
          {/* Add more protected routes as needed */}
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/posts" element={<AdminRoute><AdminPosts /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;