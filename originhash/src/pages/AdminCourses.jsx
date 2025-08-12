// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Bell,
//   User,
//   BookOpen,
//   BarChart3,
//   Users,
//   GraduationCap,
//   Plus,
//   Trash2,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const Sidebar = () => {
//   const [activeTab, setActiveTab] = useState('courses');
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
//     { id: 'courses', label: 'My Courses', icon: BookOpen },
//     { id: 'analytics', label: 'Analytics', icon: BarChart3 },
//     { id: 'grades', label: 'Grades', icon: GraduationCap },
//     { id: 'students', label: 'Students', icon: Users },
//   ];

//   return (
//     <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
//       <div className="p-6 border-b">
//         <div className="flex items-center space-x-2">
//           <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
//             <GraduationCap className="w-5 h-5 text-white" />
//           </div>
//           <span className="text-xl font-bold text-gray-800">LearnPro</span>
//         </div>
//       </div>
//       <nav className="flex-1 p-4">
//         <ul className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <li key={item.id}>
//                 <button
//                   onClick={() => setActiveTab(item.id)}
//                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
//                     activeTab === item.id
//                       ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
//                       : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>
//       <div className="p-4 border-t">
//         <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
//           <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
//             <User className="w-5 h-5 text-white" />
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-medium text-gray-800">Admin User</p>
//             <p className="text-xs text-gray-500">admin@learnpro.com</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CoursesContent = () => {
//   const [courses, setCourses] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:4001/api/v1/admin/courses', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setCourses(res.data);
//       } catch (err) {
//         console.error('Error fetching courses:', err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:4001/api/v1/admin/course/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCourses(courses.filter((course) => course._id !== id));
//     } catch (err) {
//       console.error('Error deleting course:', err);
//     }
//   };

//   const handleCourseClick = (id) => {
//     navigate(`/admin/course-videos?courseId=${id}`);
//   };

//   return (
//     <div className="flex-1 bg-gray-50 p-8">
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
//           <button
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             onClick={() => navigate('/admin/create-course')}
//           >
//             <Plus className="w-4 h-4" />
//             <span>Create Course</span>
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {courses.map((course) => (
//           <div
//             key={course._id}
//             className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative cursor-pointer"
//             onClick={() => handleCourseClick(course._id)}
//           >
//             {course.thumbnail ? (
//               <img
//                 src={course.thumbnail}
//                 alt={course.title}
//                 className="h-48 w-full object-cover"
//               />
//             ) : (
//               <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
//                 <span className="text-lg font-semibold text-gray-600">{course.title}</span>
//               </div>
//             )}
//             <div className="p-6">
//               <p className="text-sm text-gray-600 mb-2">{course.description}</p>
//               <p className="text-xs text-gray-400 mb-1">
//                 Modules: {course.modules?.length || 0}
//               </p>
//               <p className="text-xs text-gray-400">
//                 Created At: {new Date(course.createdAt).toLocaleDateString()}
//               </p>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation(); // prevent navigation when deleting
//                   handleDelete(course._id);
//                 }}
//                 className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//               >
//                 <Trash2 className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const AdminCourses = () => {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <CoursesContent />
//     </div>
//   );
// };

// export default AdminCourses;




// ... same imports as before
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Bell,
  User,
  BookOpen,
  BarChart3,
  Users,
  GraduationCap,
  Plus,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'grades', label: 'Grades', icon: GraduationCap },
    { id: 'students', label: 'Students', icon: Users },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">LearnPro</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">admin@learnpro.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursesContent = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:4001"; // <-- Added constant

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/v1/admin/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/v1/admin/course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(courses.filter((course) => course._id !== id));
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const handleCourseClick = (id) => {
    navigate(`/admin/course-videos?courseId=${id}`);
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/admin/create-course')}
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative cursor-pointer"
            onClick={() => handleCourseClick(course._id)}
          >
            {course.thumbnail ? (
              <img
                src={`${BACKEND_URL}${course.thumbnail}`} // <-- FIXED here
                alt={course.title}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-600">{course.title}</span>
              </div>
            )}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-2">{course.description}</p>
              <p className="text-xs text-gray-400 mb-1">
                Modules: {course.modules?.length || 0}
              </p>
              <p className="text-xs text-gray-400">
                Created At: {new Date(course.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(course._id);
                }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminCourses = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <CoursesContent />
    </div>
  );
};

export default AdminCourses;
