// import { useState, useEffect } from "react";
// import {
//   ExternalLink,
//   Github,
//   Users,
//   Zap,
//   Mail,
//   Shield,
//   Cloud,
//   CheckCircle2,
//   AlertTriangle,
//   Server,
//   Calendar,
//   Play,
//   ChevronLeft,
//   ChevronRight,
//   Code,
//   Boxes,
//   Trophy,
//   Hash,
//   X,
// } from "lucide-react";

// // Icon mapping
// const iconMap = {
//   users: Users,
//   zap: Zap,
//   mail: Mail,
//   shield: Shield,
//   cloud: Cloud,
//   server: Server,
// };

// const ProjectDetailModal = ({ project, isOpen, onClose }) => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [activeTab, setActiveTab] = useState(0);
//   const [imageViewOpen, setImageViewOpen] = useState(false);

//   useEffect(() => {
//     if (!isOpen) {
//       setCurrentSlide(0);
//       setActiveTab(0);
//     }
//   }, [isOpen]);

//   if (!project || !isOpen) return null;

//   const {
//     title,
//     shortDescription,
//     fullDescription,
//     imageUrl,
//     demoUrl,
//     githubUrl,
//     reviewUrl,
//     technologies,
//     category,
//     status,
//     projectDate,
//     gallery,
//     youtubeUrl,
//   } = project;

//   const images = gallery && gallery.length > 0 ? gallery : imageUrl ? [imageUrl] : [];

//   const getYoutubeEmbedUrl = (url) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     if (match && match[2].length === 11) {
//       return `https://www.youtube.com/embed/${match[2]}`;
//     }
//     return null;
//   };

//   const youtubeEmbedUrl = getYoutubeEmbedUrl(youtubeUrl);

//   const { overview, keyHighlights, results, challenges, technicalArchitecture } =
//     fullDescription || {};

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
//   };

//   const handlePrevSlide = () => {
//     setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   const handleNextSlide = () => {
//     setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//   };

//   // Tab panels
//   const OverviewPanel = () => (
//     <div className="py-4">
//       <p className="text-base leading-relaxed text-gray-600 mb-6">{overview}</p>

//       {keyHighlights && keyHighlights.length > 0 && (
//         <div>
//           <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
//             <Zap size={20} className="text-orange-500" />
//             Key Highlights
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {keyHighlights.map((highlight, idx) => {
//               const IconComponent = iconMap[highlight.icon] || Zap;
//               return (
//                 <div
//                   key={idx}
//                   className="h-full p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
//                   <div className="flex items-start gap-3">
//                     <div className="p-2 bg-orange-100 rounded-lg shrink-0">
//                       <IconComponent size={20} className="text-orange-500" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="font-semibold mb-1">{highlight.title}</div>
//                       <div className="text-sm text-gray-600">{highlight.description}</div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const TechnicalPanel = () => (
//     <div className="py-4">
//       {technicalArchitecture && (
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
//             <Boxes size={20} className="text-purple-500" />
//             Technical Architecture
//           </h3>
//           <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
//             <pre className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap m-0">
//               {technicalArchitecture}
//             </pre>
//           </div>
//         </div>
//       )}

//       {technologies && technologies.length > 0 && (
//         <div>
//           <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
//             <Hash size={20} className="text-cyan-500" />
//             Technologies Used
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {technologies.map((tech) => (
//               <span
//                 key={tech}
//                 className="px-3 py-1 text-sm font-mono border border-gray-300 rounded hover:bg-gray-50 transition-colors">
//                 {tech}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const ResultsPanel = () => (
//     <div className="py-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {challenges && challenges.length > 0 && (
//           <div>
//             <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
//               <AlertTriangle size={20} className="text-yellow-500" />
//               Challenges
//             </h3>
//             <div className="space-y-3">
//               {challenges.map((challenge, idx) => (
//                 <div key={idx} className="flex gap-3">
//                   <div className="flex flex-col items-center">
//                     <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
//                       <AlertTriangle size={14} className="text-white" />
//                     </div>
//                     {idx < challenges.length - 1 && (
//                       <div className="w-0.5 flex-1 bg-gray-300 my-1" />
//                     )}
//                   </div>
//                   <div className="flex-1 pb-4">
//                     <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                       <p className="text-sm text-gray-700">{challenge}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {results && results.length > 0 && (
//           <div>
//             <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
//               <CheckCircle2 size={20} className="text-green-500" />
//               Results
//             </h3>
//             <div className="space-y-3">
//               {results.map((result, idx) => (
//                 <div key={idx} className="flex gap-3">
//                   <div className="flex flex-col items-center">
//                     <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
//                       <CheckCircle2 size={14} className="text-white" />
//                     </div>
//                     {idx < results.length - 1 && <div className="w-0.5 flex-1 bg-gray-300 my-1" />}
//                   </div>
//                   <div className="flex-1 pb-4">
//                     <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                       <p className="text-sm text-gray-700">{result}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // Filter tabs
//   const tabs = [
//     { label: "Overview", icon: Server, panel: <OverviewPanel /> },
//     ...(technicalArchitecture || (technologies && technologies.length > 0)
//       ? [{ label: "Technical", icon: Code, panel: <TechnicalPanel /> }]
//       : []),
//     ...((challenges && challenges.length > 0) || (results && results.length > 0)
//       ? [{ label: "Challenges & Results", icon: Trophy, panel: <ResultsPanel /> }]
//       : []),
//   ];

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
//         onClick={onClose}>
//         {/* Modal */}
//         <div
//           className="bg-white rounded-lg max-w-5xl w-full max-h-screen overflow-hidden shadow-2xl"
//           onClick={(e) => e.stopPropagation()}>
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute right-4 top-4 z-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all duration-200">
//             <X size={20} />
//           </button>

//           {/* Scrollable Content */}
//           <div className="overflow-y-auto max-h-screen">
//             {/* Header with Gallery */}
//             <div className="relative h-80 bg-gradient-to-br from-orange-500 via-orange-600 to-purple-600 overflow-hidden">
//               {images.length > 0 ? (
//                 <>
//                   <div className="relative h-full">
//                     <img
//                       src={images[currentSlide]}
//                       alt={`${title} - Screenshot ${currentSlide + 1}`}
//                       className="w-full h-full object-cover cursor-pointer transition-transform duration-300"
//                       onClick={() => setImageViewOpen(true)}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black from-opacity-70 via-transparent to-transparent" />
//                   </div>

//                   {images.length > 1 && (
//                     <>
//                       <button
//                         onClick={handlePrevSlide}
//                         className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all duration-200">
//                         <ChevronLeft size={24} />
//                       </button>

//                       <button
//                         onClick={handleNextSlide}
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all duration-200">
//                         <ChevronRight size={24} />
//                       </button>

//                       <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
//                         {images.map((_, idx) => (
//                           <button
//                             key={idx}
//                             onClick={() => setCurrentSlide(idx)}
//                             className={`h-2 rounded-full transition-all duration-300 ${
//                               idx === currentSlide
//                                 ? "bg-orange-500 w-8"
//                                 : "bg-white bg-opacity-50 hover:bg-opacity-80 w-2"
//                             }`}
//                           />
//                         ))}
//                       </div>

//                       <div className="absolute top-4 left-4 px-3 py-1 bg-black bg-opacity-50 text-white font-mono text-sm rounded">
//                         {currentSlide + 1} / {images.length}
//                       </div>
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-white text-opacity-20 text-6xl font-bold">No Image</div>
//                 </div>
//               )}

//               {/* Title Overlay */}
//               <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black from-opacity-80 to-transparent">
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   <span className="px-2 py-1 bg-orange-500 text-white text-xs font-mono rounded">
//                     {category}
//                   </span>
//                   {status && (
//                     <span
//                       className={`px-2 py-1 text-white text-xs rounded ${
//                         status === "Completed" ? "bg-green-500" : "bg-blue-500"
//                       }`}>
//                       {status}
//                     </span>
//                   )}
//                   <span className="px-2 py-1 text-white text-opacity-80 text-xs flex items-center gap-1 bg-white bg-opacity-10 rounded">
//                     <Calendar size={14} />
//                     {formatDate(projectDate)}
//                   </span>
//                 </div>
//                 <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
//                 <p className="text-white text-opacity-90 text-base">{shortDescription}</p>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-6 bg-white">
//               {/* YouTube Video */}
//               {youtubeEmbedUrl && (
//                 <div className="mb-6">
//                   <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
//                     <Play size={20} className="text-red-500" />
//                     Demo Video
//                   </h3>
//                   <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden border border-gray-200 shadow-md">
//                     <iframe
//                       src={youtubeEmbedUrl}
//                       title={`${title} - Demo Video`}
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                       allowFullScreen
//                       className="absolute top-0 left-0 w-full h-full"
//                     />
//                   </div>
//                   <div className="border-t border-gray-200 my-6" />
//                 </div>
//               )}

//               {/* Tabs */}
//               <div>
//                 <div className="flex gap-2 border-b border-gray-200 mb-4 overflow-x-auto">
//                   {tabs.map((tab, idx) => {
//                     const IconComponent = tab.icon;
//                     return (
//                       <button
//                         key={idx}
//                         onClick={() => setActiveTab(idx)}
//                         className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 whitespace-nowrap ${
//                           activeTab === idx
//                             ? "border-orange-500 text-orange-500 font-semibold"
//                             : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                         }`}>
//                         <IconComponent size={16} />
//                         {tab.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <div>{tabs[activeTab]?.panel}</div>
//               </div>

//               <div className="border-t border-gray-200 my-6" />

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-3">
//                 {demoUrl && (
//                   <a
//                     href={demoUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg">
//                     <ExternalLink size={18} />
//                     Live Demo
//                   </a>
//                 )}

//                 {githubUrl && (
//                   <a
//                     href={githubUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:shadow-md">
//                     <Github size={18} />
//                     View Source
//                   </a>
//                 )}

//                 {reviewUrl && (
//                   <a
//                     href={reviewUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-500 text-purple-500 hover:bg-purple-50 font-semibold rounded-lg transition-all duration-200 hover:shadow-md">
//                     <ExternalLink size={18} />
//                     Review Project
//                   </a>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Image Viewer Modal */}
//       {imageViewOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4"
//           onClick={() => setImageViewOpen(false)}>
//           <button
//             onClick={() => setImageViewOpen(false)}
//             className="absolute right-4 top-4 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full text-white transition-all duration-200">
//             <X size={24} />
//           </button>
//           <img
//             src={images[currentSlide]}
//             alt={`${title} - Full view`}
//             className="max-w-full max-h-full object-contain"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default ProjectDetailModal;
