import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { Carousel, Image } from "antd";
import {
  ExternalLink,
  Github,
  Eye,
  Users,
  Zap,
  Mail,
  Shield,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Server,
  Code,
  Boxes,
  Trophy,
  Hash,
  Play,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";

// ========================================
// COMPONENT: FeaturedProjectCard - Card dự án dạng Zig-Zag
// Hiển thị full-width với layout ảnh-chữ xen kẽ
// Carousel gallery với lazy loading sử dụng Ant Design
// ========================================

// Mapping icon names từ API sang Lucide components
const iconMap = {
  users: Users,
  zap: Zap,
  mail: Mail,
  shield: Shield,
  cloud: Cloud,
};

const FeaturedProjectCard = ({ project, index }) => {
  // Xác định layout: chẵn = ảnh trái, lẻ = ảnh phải
  const isReversed = index % 2 !== 0;

  // Ref cho Carousel để điều khiển navigation
  const carouselRef = useRef(null);

  // State để theo dõi slide hiện tại và lazy loading
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set([0, 1])); // Preload 2 ảnh đầu

  // State cho expand/collapse chi tiết
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // State cho copy to clipboard
  const [copiedField, setCopiedField] = useState(null);

  // Destructure dữ liệu từ API
  const {
    title,
    shortDescription,
    fullDescription,
    imageUrl,
    demoUrl,
    githubUrl,
    reviewUrl,
    technologies,
    category,
    status,
    projectDate,
    gallery, // Mảng ảnh từ API
    videoUrl,
  } = project;

  // Tạo mảng ảnh từ gallery hoặc fallback về imageUrl
  const images = gallery && gallery.length > 0 ? gallery : imageUrl ? [imageUrl] : [];

  // Lấy dữ liệu từ fullDescription
  const { overview, keyHighlights, results, challenges, technicalArchitecture, testAccounts } =
    fullDescription || {};

  // Hàm copy to clipboard
  const handleCopy = async (text, fieldId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Hàm lấy YouTube embed URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  const youtubeEmbedUrl = getYoutubeEmbedUrl(videoUrl);

  // Lazy load ảnh khi sắp chuyển sang
  useEffect(() => {
    if (images.length > 0) {
      const nextSlide = (currentSlide + 1) % images.length;
      const prevSlide = (currentSlide - 1 + images.length) % images.length;

      setLoadedImages((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentSlide);
        newSet.add(nextSlide);
        newSet.add(prevSlide);
        return newSet;
      });
    }
  }, [currentSlide, images.length]);

  // Xử lý khi carousel thay đổi slide
  const handleSlideChange = (current) => {
    setCurrentSlide(current);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-600 dark:text-dracula-green border-green-500/30";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-600 dark:text-dracula-yellow border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-dracula-comment border-gray-500/30";
    }
  };

  // Toggle expand/collapse
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setActiveTab(0); // Reset về tab đầu tiên khi mở
    }
  };

  // ========================================
  // TAB PANELS CHO PHẦN MỞ RỘNG
  // Sử dụng useMemo để tránh re-render không cần thiết (đặc biệt với YouTube iframe)
  // ========================================

  // Tab Overview - Hiển thị overview và keyHighlights đầy đủ (không bị cắt như ở card)
  const OverviewPanel = useMemo(
    () => (
      <div className="space-y-6">
        {/* Overview text */}
        {overview && (
          <div>
            <p className="text-gray-600 dark:text-dracula-comment leading-relaxed">{overview}</p>
          </div>
        )}

        {/* Full Key Highlights - hiển thị tất cả, không filter */}
        {keyHighlights && keyHighlights.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dracula-foreground mb-4 flex items-center gap-2">
              <Zap size={18} className="text-orange-500" />
              Key Highlights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyHighlights.map((highlight, idx) => {
                const IconComponent = iconMap[highlight.icon] || Zap;
                return (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 dark:bg-dracula-current/30 rounded-lg border border-gray-200 dark:border-dracula-comment/30 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg shrink-0">
                        <IconComponent size={18} className="text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-dracula-foreground mb-1">
                          {highlight.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-dracula-comment">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* YouTube Video nếu có */}
        {youtubeEmbedUrl && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dracula-foreground mb-4 flex items-center gap-2">
              <Play size={18} className="text-red-500" />
              Demo Video
            </h4>
            <div className="relative w-full h-0 pb-[56.25%] rounded-xl overflow-hidden border border-gray-200 dark:border-dracula-comment/50 shadow-lg">
              <iframe
                src={youtubeEmbedUrl}
                title={`${title} - Demo Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    ),
    [overview, keyHighlights, youtubeEmbedUrl, title]
  );

  // Tab Technical - Kiến trúc và công nghệ chi tiết
  const TechnicalPanel = useMemo(
    () => (
      <div className="space-y-6">
        {/* Technical Architecture */}
        {technicalArchitecture && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dracula-foreground mb-4 flex items-center gap-2">
              <Boxes size={18} className="text-purple-500" />
              Technical Architecture
            </h4>
            <div className="bg-gray-900  rounded-xl p-5 border border-gray-700 dark:border-dracula-comment/50">
              <pre className="text-gray-300 dark:text-dracula-foreground font-mono text-sm leading-relaxed whitespace-pre-wrap m-0">
                {technicalArchitecture}
              </pre>
            </div>
          </div>
        )}

        {/* Full Tech Stack */}
        {technologies && technologies.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dracula-foreground mb-4 flex items-center gap-2">
              <Hash size={18} className="text-cyan-500 dark:text-dracula-cyan" />
              Technologies Used ({technologies.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, idx) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-white dark:bg-dracula-background text-gray-700 dark:text-dracula-foreground text-sm font-mono rounded-lg border border-gray-200 dark:border-dracula-comment/50 hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    [technicalArchitecture, technologies]
  );

  // Tab Challenges & Results
  const ResultsPanel = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Challenges */}
        {challenges && challenges.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dracula-foreground mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-500 dark:text-dracula-yellow" />
              Challenges Faced
            </h4>
            <div className="space-y-3">
              {challenges.map((challenge, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
                      <AlertTriangle size={14} className="text-white" />
                    </div>
                    {idx < challenges.length - 1 && (
                      <div className="w-0.5 flex-1 bg-yellow-300 dark:bg-yellow-500/30 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-dracula-foreground">
                        {challenge}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dracula-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500 dark:text-dracula-green" />
              Results Achieved
            </h4>
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    {idx < results.length - 1 && (
                      <div className="w-0.5 flex-1 bg-green-300 dark:bg-green-500/30 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-dracula-foreground">{result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    [challenges, results]
  );

  // Tab Test Accounts - Hiển thị tài khoản test cho nhà tuyển dụng
  const TestAccountsPanel = useMemo(
    () => (
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <KeyRound size={16} />
            <span>
              These test accounts are provided for recruiters and reviewers to explore the full
              functionality of the application.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testAccounts &&
            testAccounts.map((account, idx) => {
              // Xác định màu dựa trên role
              const isAdmin = account.role?.toLowerCase().includes("admin");
              const roleColor = isAdmin
                ? "from-purple-500 to-pink-500"
                : "from-green-500 to-teal-500";
              const bgColor = isAdmin
                ? "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30"
                : "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30";
              const headerBg = isAdmin
                ? "bg-purple-100 dark:bg-purple-500/20"
                : "bg-green-100 dark:bg-green-500/20";

              return (
                <div
                  key={idx}
                  className={`rounded-xl border overflow-hidden ${bgColor} transition-all duration-200 hover:shadow-lg`}>
                  {/* Header với role badge */}
                  <div className={`${headerBg} px-4 py-3 border-b border-inherit`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-r ${roleColor} flex items-center justify-center`}>
                          <Users size={14} className="text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-dracula-foreground">
                          {account.role}
                        </span>
                      </div>
                      {isAdmin && (
                        <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-mono rounded-full">
                          Full Access
                        </span>
                      )}
                    </div>
                    {account.description && (
                      <p className="text-xs text-gray-600 dark:text-dracula-comment mt-2">
                        {account.description}
                      </p>
                    )}
                  </div>

                  {/* Credentials */}
                  <div className="p-4 space-y-3">
                    {/* Username */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 dark:text-dracula-comment font-mono uppercase tracking-wide">
                        Username
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-white dark:bg-dracula-background rounded-lg border border-gray-200 dark:border-dracula-comment/50 font-mono text-sm text-gray-900 dark:text-dracula-foreground">
                          {account.username}
                        </code>
                        <button
                          onClick={() => handleCopy(account.username, `username-${idx}`)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-dracula-current rounded-lg transition-colors"
                          title="Copy username">
                          {copiedField === `username-${idx}` ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} className="text-gray-500 dark:text-dracula-comment" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 dark:text-dracula-comment font-mono uppercase tracking-wide">
                        Password
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-white dark:bg-dracula-background rounded-lg border border-gray-200 dark:border-dracula-comment/50 font-mono text-sm text-gray-900 dark:text-dracula-foreground">
                          {account.password}
                        </code>
                        <button
                          onClick={() => handleCopy(account.password, `password-${idx}`)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-dracula-current rounded-lg transition-colors"
                          title="Copy password">
                          {copiedField === `password-${idx}` ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} className="text-gray-500 dark:text-dracula-comment" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Permissions/Notes nếu có */}
                    {account.permissions && account.permissions.length > 0 && (
                      <div className="pt-2 border-t border-gray-200 dark:border-dracula-comment/30">
                        <label className="text-xs text-gray-500 dark:text-dracula-comment font-mono uppercase tracking-wide">
                          Permissions
                        </label>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {account.permissions.map((perm, permIdx) => (
                            <span
                              key={permIdx}
                              className="px-2 py-0.5 bg-gray-200 dark:bg-dracula-current text-gray-700 dark:text-dracula-foreground text-xs font-mono rounded">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Note về bảo mật */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>
              Note: These are demo accounts for testing purposes only. Data may be reset
              periodically.
            </span>
          </p>
        </div>
      </div>
    ),
    [testAccounts, copiedField]
  );

  // Cấu hình tabs - chỉ hiển thị tabs có nội dung
  const tabs = useMemo(
    () =>
      [
        {
          label: "Overview",
          icon: Server,
          panel: OverviewPanel,
          show: overview || (keyHighlights && keyHighlights.length > 0) || youtubeEmbedUrl,
        },
        {
          label: "Technical",
          icon: Code,
          panel: TechnicalPanel,
          show: technicalArchitecture || (technologies && technologies.length > 0),
        },
        {
          label: "Challenges & Results",
          icon: Trophy,
          panel: ResultsPanel,
          show: (challenges && challenges.length > 0) || (results && results.length > 0),
        },
        {
          label: "Demo Credentials",
          icon: KeyRound,
          panel: TestAccountsPanel,
          show: testAccounts && testAccounts.length > 0,
        },
      ].filter((tab) => tab.show),
    [
      OverviewPanel,
      TechnicalPanel,
      ResultsPanel,
      TestAccountsPanel,
      overview,
      keyHighlights,
      youtubeEmbedUrl,
      technicalArchitecture,
      technologies,
      challenges,
      results,
      testAccounts,
    ]
  );

  return (
    <div
      data-aos={isReversed ? "fade-left" : "fade-right"}
      data-aos-duration="800"
      data-aos-delay={index * 100}
      className="relative w-full mb-16 lg:mb-24">
      {/* Border Container với gradient và hover effect */}
      <div className="relative p-6 lg:p-8 rounded-xl bg-white dark:bg-dracula-background border border-gray-200 dark:border-dracula-comment/50 shadow-lg hover:shadow-2xl hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-500 group/card">
        {/* Gradient accent line ở trên cùng */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 rounded-t-2xl"></div>

        {/* Project number badge */}
        <div className="absolute -top-4 left-6 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-purple-500 text-white text-sm font-mono font-bold rounded-full shadow-lg">
          Project #{index + 1}
        </div>

        {/* Container chính */}
        <div
          className={`flex flex-col ${
            isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
          } gap-8 lg:gap-12 items-stretch mt-4`}>
          {/* ========== Phần Trái: Thông tin + Hình ảnh ========== */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Category & Status */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-mono rounded-full border border-orange-500/30">
                {category}
              </span>
              <span
                className={`px-3 py-1 text-xs font-mono rounded-full border ${getStatusColor(
                  status
                )}`}>
                {status === "completed" ? "Completed" : "In Progress"}
              </span>
              <span className="text-gray-500 dark:text-dracula-comment text-sm font-mono">
                {formatDate(projectDate)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-dracula-foreground leading-tight mb-3">
              {title}
            </h3>

            {/* Short Description */}
            <p className="text-gray-600 dark:text-dracula-comment text-base leading-relaxed mb-6">
              {shortDescription}
            </p>

            {/* ========== Phần Hình ảnh với Carousel ========== */}
            <motion.div
              className="relative group flex-1"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}>
              {/* Frame giả lập Browser/IDE */}
              <div className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-dracula-comment shadow-2xl">
                {/* Browser Header */}
                <div className="bg-gray-200 dark:bg-dracula-current px-4 py-3 flex items-center gap-2 border-b border-gray-300 dark:border-dracula-comment">
                  {/* Traffic lights */}
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  {/* URL Bar */}
                  <div className="flex-1 ml-4">
                    <div className="bg-white dark:bg-dracula-background rounded px-3 py-1 text-xs font-mono text-gray-500 dark:text-dracula-comment truncate">
                      {demoUrl || "https://localhost:8080"}
                    </div>
                  </div>
                  {/* Slide Counter */}
                  {images.length > 1 && (
                    <div className="text-xs font-mono text-gray-500 dark:text-dracula-comment">
                      {currentSlide + 1}/{images.length}
                    </div>
                  )}
                </div>

                {/* Project Image Carousel */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dracula-background dark:to-dracula-current relative overflow-hidden">
                  {images.length > 0 ? (
                    <>
                      <Carousel
                        ref={carouselRef}
                        autoplay
                        autoplaySpeed={4000}
                        dots={false}
                        effect="fade"
                        beforeChange={(from, to) => handleSlideChange(to)}
                        className="h-full">
                        {images.map((img, idx) => (
                          <div key={idx} className="!h-full">
                            <div className="aspect-video w-full h-full">
                              {loadedImages.has(idx) ? (
                                <Image
                                  src={img}
                                  alt={`${title} - Screenshot ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  preview={false}
                                  placeholder={
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-dracula-current">
                                      <div className="animate-pulse text-gray-400 dark:text-dracula-comment font-mono text-sm">
                                        Loading...
                                      </div>
                                    </div>
                                  }
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-dracula-current">
                                  <div className="animate-pulse text-gray-400 dark:text-dracula-comment font-mono text-sm">
                                    Loading...
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </Carousel>

                      {/* Custom Navigation Arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => carouselRef.current?.prev()}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() => carouselRef.current?.next()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}

                      {/* Dots Indicator */}
                      {images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => carouselRef.current?.goTo(idx)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === currentSlide
                                  ? "bg-orange-500 w-6"
                                  : "bg-white/50 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Placeholder với System Architecture preview
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-8">
                        {/* Fake Architecture Diagram */}
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className="w-16 h-12 bg-orange-500/20 border border-orange-500/50 rounded flex items-center justify-center">
                            <span className="text-orange-500 text-xs font-mono">Client</span>
                          </div>
                          <ArrowRight
                            className="text-gray-400 dark:text-dracula-comment"
                            size={20}
                          />
                          <div className="w-16 h-12 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center">
                            <span className="text-green-600 dark:text-dracula-green text-xs font-mono">
                              API
                            </span>
                          </div>
                          <ArrowRight
                            className="text-gray-400 dark:text-dracula-comment"
                            size={20}
                          />
                          <div className="w-16 h-12 bg-purple-500/20 border border-purple-500/50 rounded flex items-center justify-center">
                            <span className="text-purple-600 dark:text-dracula-purple text-xs font-mono">
                              DB
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-500 dark:text-dracula-comment text-sm font-mono">
                          System Architecture Preview
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
            </motion.div>
          </div>

          {/* ========== Phần Phải: Key Highlights, Tech Stack, Actions ========== */}
          <div className="w-full lg:w-1/2 space-y-6 flex flex-col justify-center">
            {/* Key Highlights */}
            {keyHighlights && keyHighlights.length > 0 && (
              <div className="space-y-3">
                {/* Ưu tiên hiển thị: users, zap, cloud (thay vì mail) */}
                {keyHighlights
                  .filter((h) => ["users", "zap", "cloud", "shield"].includes(h.icon))
                  .slice(0, 4)
                  .map((highlight, idx) => {
                    const IconComponent = iconMap[highlight.icon] || Zap;
                    return (
                      <div
                        key={idx}
                        data-aos="fade-left"
                        data-aos-delay={idx * 100}
                        data-aos-duration="600"
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dracula-current/50 rounded-lg border border-gray-200 dark:border-dracula-comment/30">
                        <div className="p-2 bg-orange-500/10 rounded-lg shrink-0">
                          <IconComponent size={16} className="text-orange-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-dracula-foreground">
                            {highlight.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-dracula-comment mt-1">
                            {highlight.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Results preview */}
            {results && results.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {results.slice(0, 2).map((result, idx) => (
                  <div
                    key={idx}
                    data-aos="zoom-in"
                    data-aos-delay={idx * 100}
                    data-aos-duration="500"
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full">
                    <CheckCircle2 size={14} className="text-green-600 dark:text-dracula-green" />
                    <span className="text-xs text-green-700 dark:text-dracula-green font-medium">
                      {result.length > 50 ? result.substring(0, 50) + "..." : result}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2" data-aos="fade-up" data-aos-duration="600">
              {technologies?.slice(0, 5).map((tech, idx) => (
                <span
                  key={tech}
                  data-aos="zoom-in"
                  data-aos-delay={idx * 50}
                  data-aos-duration="400"
                  className="px-3 py-1.5 bg-white dark:bg-dracula-background text-gray-700 dark:text-dracula-foreground text-xs font-mono rounded-lg border border-gray-200 dark:border-dracula-comment/50 hover:border-orange-500/50 transition-colors">
                  {tech}
                </span>
              ))}
              {technologies?.length > 5 && (
                <span className="px-3 py-1.5 text-gray-500 dark:text-dracula-comment text-xs font-mono">
                  +{technologies.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ========================================
            ACTION BUTTONS - Luôn hiển thị ở cuối card
            3 nút trên 1 hàng: Read Case Study, Source Code, Live Demo/Watch Demo
        ======================================== */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-dracula-comment/30"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="600">
          {/* Nút Read Case Study / Hide Details */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleToggleExpand}
            className={`flex items-center justify-center gap-2 px-4 py-3 font-mono font-medium text-sm rounded-lg transition-all duration-200 shadow-lg ${
              isExpanded
                ? "bg-gray-600 hover:bg-gray-700 dark:bg-dracula-comment dark:hover:bg-gray-600 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
            }`}>
            {isExpanded ? (
              <>
                <ChevronUp size={16} />
                <span>Hide Details</span>
              </>
            ) : (
              <>
                <Eye size={16} />
                <span>Read Case Study</span>
              </>
            )}
          </motion.button>

          {/* Nút Source Code */}
          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-dracula-current dark:hover:bg-dracula-comment text-white font-mono font-medium text-sm rounded-lg transition-all duration-200 shadow-lg">
              <Github size={16} />
              <span>Source Code</span>
            </motion.a>
          )}

          {/* Nút Live Demo hoặc Watch Demo (YouTube) */}
          {demoUrl ? (
            <motion.a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-mono font-medium text-sm rounded-lg transition-all duration-200 shadow-lg shadow-green-500/20">
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </motion.a>
          ) : videoUrl ? (
            <motion.a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-mono font-medium text-sm rounded-lg transition-all duration-200 shadow-lg shadow-red-500/20">
              <Play size={16} />
              <span>Watch Demo</span>
            </motion.a>
          ) : null}
        </div>

        {/* ========================================
            PHẦN MỞ RỘNG - EXPAND SECTION
            Hiển thị chi tiết dự án với 3 tabs
        ======================================== */}
        <AnimatePresence>
          {isExpanded && tabs.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden">
              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-dracula-comment/30 mt-8 pt-8">
                {/* Tabs Navigation */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-dracula-comment/30 mb-6 overflow-x-auto">
                  {tabs.map((tab, idx) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 whitespace-nowrap font-mono text-sm ${
                          activeTab === idx
                            ? "border-orange-500 text-orange-500 font-semibold"
                            : "border-transparent text-gray-600 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground hover:bg-gray-50 dark:hover:bg-dracula-current/50"
                        }`}>
                        <IconComponent size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content với animation */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[200px]">
                  {tabs[activeTab]?.panel}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative glow effect on hover */}
        <div className="absolute -z-10 inset-0 bg-gradient-to-r from-orange-500/5 via-purple-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover/card:opacity-100 blur-xl transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

export default FeaturedProjectCard;
