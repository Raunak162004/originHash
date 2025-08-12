import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import GoogleCallback from "./components/GoogleCallback";
import NotFound from "./pages/NotFound";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminCourses from "./pages/AdminCourses";
import CreateCourse from "./pages/CreateCourse";
import CourseVideos from "./pages/CourseVideos";

function App() {
  return (
    <Router>
      <>
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/superadmin-login" element={<SuperAdminLogin />} />
          <Route path="/admin-login/admincredentials" element={<AdminLogin />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/create-course" element={<CreateCourse />} />
          <Route path="/admin/course-videos" element={<CourseVideos />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
