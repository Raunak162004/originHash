// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export default function CreateCourse() {
//   const navigate = useNavigate();
  
//   const [courseData, setCourseData] = useState({
//     title: '',
//     description: ''
//   });
  
//   const [thumbnailUrl, setThumbnailUrl] = useState("");
//   const [lastUpdated, setLastUpdated] = useState('');
//   const fileInputRef = useRef(null);

//   const handleInputChange = (field, value) => {
//     setCourseData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     // Update timestamp
//     const now = new Date();
//     const timeString = now.toLocaleTimeString('en-US', { hour12: false });
//     const dateString = now.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//     setLastUpdated(`${timeString} | ${dateString}`);
//   };

//   const handleThumbnailUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.type.startsWith('image/')) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setThumbnailUrl(e.target.result);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert('Please select a valid image file.');
//       }
//     }
//   };

//   const removeThumbnail = () => {
//     setThumbnailUrl("");
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handlePublish = async (e) => {
//     e.preventDefault();

//     if (!courseData.title.trim() || !courseData.description.trim() || !fileInputRef.current?.files[0]) {
//         alert('Please enter all fields and upload a thumbnail.');
//         return;
//     }

//     try {
//         const token = localStorage.getItem('token');
//         const formData = new FormData();
//         formData.append('title', courseData.title);
//         formData.append('description', courseData.description);
//         formData.append('thumbnail', fileInputRef.current.files[0]); // actual file

//         const res = await axios.post(
//         'http://localhost:4001/api/v1/admin/course',
//         formData,
//         {
//             headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//             }
//         }
//         );

//         if (res.status === 201) {
//         alert('Course published successfully!');
//         navigate('/admin/courses');
//         }
//     } catch (err) {
//         console.error(err);
//         alert(err.response?.data?.message || 'Error publishing course.');
//     }
//     };


//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex items-center gap-4">
//             <a href="/admin/courses" className="text-gray-500 hover:text-gray-700 text-lg">
//               ← My Courses
//             </a>
//             <h1 className="text-2xl font-semibold text-gray-800">Create Course</h1>
//           </div>
          
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//             <div className="flex items-center gap-2 text-gray-500 text-sm">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span>Last Updated: {lastUpdated}</span>
//             </div>
//             <button
//               onClick={handlePublish}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
//             >
//               Publish Course
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
//           <div className="space-y-6">
//             {/* Thumbnail Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Thumbnail
//               </label>
//               <div className="flex flex-col sm:flex-row items-start gap-6">
//                 <div className="w-full sm:w-40 h-30 sm:h-30 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
//                   {thumbnailUrl ? (
//                     <img
//                       src={thumbnailUrl}
//                       alt="Course thumbnail"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="flex items-center justify-center w-full h-full text-gray-400 text-sm">No Image</span>
//                   )}
//                 </div>
//                 <div className="flex gap-3">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleThumbnailUpload}
//                     className="hidden"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
//                   >
//                     Change
//                   </button>
//                   <button
//                     type="button"
//                     onClick={removeThumbnail}
//                     className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Course Title */}
//             <div>
//               <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-2">
//                 Course Title
//               </label>
//               <input
//                 type="text"
//                 id="courseTitle"
//                 value={courseData.title}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 placeholder="Enter course title"
//               />
//             </div>

//             {/* Course Description */}
//             <div>
//               <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 id="courseDescription"
//                 value={courseData.description}
//                 onChange={(e) => handleInputChange('description', e.target.value)}
//                 rows={5}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
//                 placeholder="Enter course description"
//               />
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end pt-4">
//               <button
//                 onClick={handlePublish}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
//               >
//                 Publish Course
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }





// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export default function CreateCourse() {
//   const navigate = useNavigate();

//   const backendBaseURL = "http://localhost:4001"; // <-- Backend URL here

//   const [courseData, setCourseData] = useState({
//     title: '',
//     description: ''
//   });

//   const [thumbnailUrl, setThumbnailUrl] = useState("");
//   const [lastUpdated, setLastUpdated] = useState('');
//   const fileInputRef = useRef(null);

//   const handleInputChange = (field, value) => {
//     setCourseData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     // Update timestamp
//     const now = new Date();
//     const timeString = now.toLocaleTimeString('en-US', { hour12: false });
//     const dateString = now.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//     setLastUpdated(`${timeString} | ${dateString}`);
//   };

//   const handleThumbnailUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.type.startsWith('image/')) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setThumbnailUrl(e.target.result);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert('Please select a valid image file.');
//       }
//     }
//   };

//   const removeThumbnail = () => {
//     setThumbnailUrl("");
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handlePublish = async (e) => {
//     e.preventDefault();

//     if (!courseData.title.trim() || !courseData.description.trim() || !fileInputRef.current?.files[0]) {
//       alert('Please enter all fields and upload a thumbnail.');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('title', courseData.title);
//       formData.append('description', courseData.description);
//       formData.append('thumbnail', fileInputRef.current.files[0]); // actual file

//       const res = await axios.post(
//         `${backendBaseURL}/api/v1/admin/course`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       if (res.status === 201) {
//         alert('Course published successfully!');
//         navigate('/admin/courses');
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Error publishing course.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex items-center gap-4">
//             <a href="/admin/courses" className="text-gray-500 hover:text-gray-700 text-lg">
//               ← My Courses
//             </a>
//             <h1 className="text-2xl font-semibold text-gray-800">Create Course</h1>
//           </div>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//             <div className="flex items-center gap-2 text-gray-500 text-sm">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span>Last Updated: {lastUpdated}</span>
//             </div>
//             <button
//               onClick={handlePublish}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
//             >
//               Publish Course
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
//           <div className="space-y-6">
//             {/* Thumbnail Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Thumbnail
//               </label>
//               <div className="flex flex-col sm:flex-row items-start gap-6">
//                 <div className="w-full sm:w-40 h-30 sm:h-30 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
//                   {thumbnailUrl ? (
//                     <img
//                       src={thumbnailUrl.startsWith('data:') ? thumbnailUrl : `${backendBaseURL}${thumbnailUrl}`}
//                       alt="Course thumbnail"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="flex items-center justify-center w-full h-full text-gray-400 text-sm">No Image</span>
//                   )}
//                 </div>
//                 <div className="flex gap-3">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleThumbnailUpload}
//                     className="hidden"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
//                   >
//                     Change
//                   </button>
//                   <button
//                     type="button"
//                     onClick={removeThumbnail}
//                     className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Course Title */}
//             <div>
//               <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-2">
//                 Course Title
//               </label>
//               <input
//                 type="text"
//                 id="courseTitle"
//                 value={courseData.title}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 placeholder="Enter course title"
//               />
//             </div>

//             {/* Course Description */}
//             <div>
//               <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 id="courseDescription"
//                 value={courseData.description}
//                 onChange={(e) => handleInputChange('description', e.target.value)}
//                 rows={5}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
//                 placeholder="Enter course description"
//               />
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end pt-4">
//               <button
//                 onClick={handlePublish}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
//               >
//                 Publish Course
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateCourse() {
  const navigate = useNavigate();
  const backendBaseURL = "http://localhost:4001"; // your backend

  const [courseData, setCourseData] = useState({
    title: '',
    description: ''
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [lastUpdated, setLastUpdated] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    const dateString = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setLastUpdated(`${timeString} | ${dateString}`);
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setThumbnailPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file.');
      }
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    if (!courseData.title.trim() || !courseData.description.trim() || !fileInputRef.current?.files[0]) {
      alert('Please enter all fields and upload a thumbnail.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('thumbnail', fileInputRef.current.files[0]);

      const res = await axios.post(
        `${backendBaseURL}/api/v1/admin/course`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.status === 201) {
        alert('Course published successfully!');
        setCourseData({ title: '', description: '' });
        setThumbnailPreview("");
        fileInputRef.current.value = '';
        navigate('/admin/courses');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error publishing course.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <a href="/admin/courses" className="text-gray-500 hover:text-gray-700 text-lg">
              ← My Courses
            </a>
            <h1 className="text-2xl font-semibold text-gray-800">Create Course</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <button
              onClick={handlePublish}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Publish Course
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="space-y-6">
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-full sm:w-40 h-30 sm:h-30 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Course thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Course Title */}
            <div>
              <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                id="courseTitle"
                value={courseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter course title"
              />
            </div>

            {/* Course Description */}
            <div>
              <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="courseDescription"
                value={courseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
                placeholder="Enter course description"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handlePublish}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
              >
                Publish Course
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

