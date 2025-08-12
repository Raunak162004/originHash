import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";


// Video Player Component
const VideoPlayer = ({ videoUrl, title, onClose }) => {
  const baseURL = 'http://localhost:4001';
  const fullVideoUrl = videoUrl?.startsWith('http') ? videoUrl : `${baseURL}${videoUrl}`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <CloseIcon />
          </button>
        </div>
        
        <div className="video-container">
          <video 
            controls 
            width="100%" 
            height="400"
            preload="metadata"
            className="rounded-lg"
            onError={(e) => {
              console.error('Video playback error:', e);
              alert('Error playing video. Please check if the file exists.');
            }}
          >
            <source src={fullVideoUrl} type="video/mp4" />
            <source src={fullVideoUrl} type="video/webm" />
            <source src={fullVideoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

// Close Icon Component
const CloseIcon = () => (
  <svg
    className="w-6 h-6 text-gray-400 hover:text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({ url: '', title: '' });
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    duration: "",
    videoFile: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch modules from backend
  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      console.log("Fetching modules for courseId:", courseId);
      const response = await fetch(
        `http://localhost:4001/api/v1/admin/course/modules/fetchCourseDetails/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched modules data:", data);
      setModules(data.modules || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching modules:", error);
      setLoading(false);
      setModules([]);
    }
  };

  const toggleModule = (moduleId) => {
    setModules(
      modules.map((module) =>
        module._id === moduleId
          ? { ...module, isExpanded: !module.isExpanded }
          : module
      )
    );
  };

  const handleAddModule = async (courseId) => {
    console.log("Adding module for courseId:", courseId);
    const newModule = {
      title: `Module ${modules.length + 1}: New Module`,
      lessonCount: 0,
      isExpanded: true,
      lessons: [],
    };

    try {
      const response = await fetch(
        `http://localhost:4001/api/v1/admin/course/addModules/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newModule),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdModule = await response.json();
      console.log("Created module:", createdModule);

      // Add the created module to state
      setModules((prevModules) => [...prevModules, createdModule]);
    } catch (error) {
      console.error("Error creating module:", error);
      // Fallback: add to local state anyway
      const tempModule = {
        ...newModule,
        _id: Date.now(),
        id: Date.now(),
      };
      setModules((prevModules) => [...prevModules, tempModule]);
    }
  };

  const openLessonModal = (moduleId) => {
    setCurrentModuleId(moduleId);
    setShowLessonModal(true);
    setLessonForm({ title: "", duration: "", videoFile: null });
    setUploadProgress(0);
    setIsUploading(false);
  };

  const closeLessonModal = () => {
    setShowLessonModal(false);
    setCurrentModuleId(null);
    setLessonForm({ title: "", duration: "", videoFile: null });
    setUploadProgress(0);
    setIsUploading(false);
  };

  const openVideoPlayer = (videoUrl, title) => {
    setCurrentVideo({ url: videoUrl, title });
    setShowVideoPlayer(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setCurrentVideo({ url: '', title: '' });
  };

  const handleVideoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file");
        return;
      }

      // Validate file size (e.g., max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        alert("File size too large. Maximum allowed is 500MB");
        return;
      }

      setLessonForm((prev) => ({
        ...prev,
        videoFile: file,
      }));
    }
  };

  const handleLessonFormChange = (field, value) => {
    setLessonForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addLesson = async () => {
    if (!lessonForm.title.trim() || !lessonForm.duration.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!lessonForm.videoFile) {
      alert("Please upload a video file");
      return;
    }

    if (!currentModuleId || !courseId) {
      alert("Module ID or Course ID is missing");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('videoFile', lessonForm.videoFile);
      formData.append('title', lessonForm.title);
      formData.append('duration', lessonForm.duration);
      formData.append('type', 'video');
      formData.append('courseId', courseId);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const response = await fetch(
        `http://localhost:4001/api/v1/admin/course/module/addLesson/${currentModuleId}`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const createdLesson = await response.json();
      console.log('Created lesson:', createdLesson);

      // Update the modules state with the new lesson
      setModules(prevModules => prevModules.map(module => 
        module._id === currentModuleId 
          ? { 
              ...module, 
              lessons: [...(module.lessons || []), createdLesson],
              lessonCount: (module.lessonCount || 0) + 1
            }
          : module
      ));

      setIsUploading(false);
      closeLessonModal();
      alert('Lesson added successfully!');
    } catch (error) {
      console.error('Error creating lesson:', error);
      setIsUploading(false);
      alert(`Failed to add lesson: ${error.message}`);
    }
  };

  const deleteLesson = async (moduleId, lessonId) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const response = await fetch(
        `http://localhost:4001/api/v1/admin/course/module/${moduleId}/lesson/${lessonId}`,
        {
          method: 'DELETE'
        }
      );

      if (response.ok) {
        setModules(
          modules.map((module) =>
            module._id === moduleId
              ? {
                  ...module,
                  lessons: (module.lessons || []).filter(
                    (lesson) => lesson._id !== lessonId
                  ),
                  lessonCount: Math.max(0, (module.lessonCount || 0) - 1),
                }
              : module
          )
        );
        alert('Lesson deleted successfully!');
      } else {
        throw new Error('Failed to delete lesson');
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert('Failed to delete lesson. Please try again.');
    }
  };

  const UploadIcon = () => (
    <svg
      className="w-8 h-8 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );

  const VideoIcon = () => (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );

  const EditIcon = () => (
    <svg
      className="w-4 h-4 text-gray-400 hover:text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  const EyeIcon = () => (
    <svg
      className="w-4 h-4 text-gray-400 hover:text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      className="w-4 h-4 text-gray-400 hover:text-red-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );

  const HamburgerIcon = () => (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const ChevronIcon = ({ isExpanded }) => (
    <svg
      className={`w-4 h-4 text-gray-400 transition-transform ${
        isExpanded ? "rotate-90" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  // Show error state if courseId is missing
  if (!courseId) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: Course ID not found</p>
          <p className="text-gray-500 text-sm mt-2">
            Please make sure you're accessing this page from a valid course link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            <h1 className="text-xl font-semibold text-gray-800">Modules</h1>
          </div>
          <button
            onClick={() => handleAddModule(courseId)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Module
          </button>
        </div>

        {/* Show message if no modules */}
        {modules.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No modules found for this course.</p>
            <p className="text-gray-500 text-sm mt-2">
              Click "Add Module" to create your first module.
            </p>
          </div>
        ) : (
          /* Modules List */
          <div className="space-y-4">
            {modules.map((module) => (
              <div
                key={module._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                {/* Module Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <HamburgerIcon />
                    <button
                      onClick={() => toggleModule(module._id)}
                      className="flex items-center gap-2"
                    >
                      <ChevronIcon isExpanded={module.isExpanded} />
                    </button>
                    <h3 className="font-medium text-gray-800">
                      {module.title} ({module.lessonCount || 0} lessons)
                    </h3>
                  </div>
                  <button
                    onClick={() => openLessonModal(module._id)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <span className="text-lg">+</span>
                    Add Lesson
                  </button>
                </div>

                {/* Lessons List */}
                {module.isExpanded && (
                  <div className="divide-y divide-gray-100">
                    {(module.lessons || []).length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No lessons in this module. Click "Add Lesson" to add your first lesson.
                      </div>
                    ) : (
                      (module.lessons || []).map((lesson, index) => (
                        <div
                          key={lesson._id || index}
                          className="flex items-center justify-between p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <HamburgerIcon />
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-blue-500 font-medium">
                                Lesson {index + 1}
                              </span>
                              <VideoIcon />
                              <span className="text-sm text-gray-700">
                                {lesson.title}
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {lesson.duration}
                              </span>
                              {lesson.videoUrl && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  Video Available
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <EditIcon />
                            </button>
                            {lesson.videoUrl && (
                              <button 
                                onClick={() => openVideoPlayer(lesson.videoUrl, lesson.title)}
                                className="p-1 hover:bg-gray-200 rounded"
                                title="Play Video"
                              >
                                <EyeIcon />
                              </button>
                            )}
                            <button
                              onClick={() => deleteLesson(module._id, lesson._id)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Add New Lesson
              </h2>
              <button
                onClick={closeLessonModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) =>
                    handleLessonFormChange("title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter lesson title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  value={lessonForm.duration}
                  onChange={(e) =>
                    handleLessonFormChange("duration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="e.g., 10:30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video File *
                </label>
                <div className="space-y-3">
                  {/* Video Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                      id="videoUpload"
                    />

                    {!lessonForm.videoFile ? (
                      <label htmlFor="videoUpload" className="cursor-pointer">
                        <UploadIcon />
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-blue-600 hover:text-blue-500">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          MP4, AVI, MOV up to 500MB
                        </p>
                      </label>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <VideoIcon />
                          <span className="text-sm font-medium text-gray-700">
                            {lessonForm.videoFile.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {(lessonForm.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setLessonForm((prev) => ({
                              ...prev,
                              videoFile: null,
                            }))
                          }
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove file
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Uploading video...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeLessonModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={addLesson}
                disabled={isUploading || !lessonForm.videoFile}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Add Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <VideoPlayer 
          videoUrl={currentVideo.url} 
          title={currentVideo.title} 
          onClose={closeVideoPlayer}
        />
      )}
    </div>
  );
}
