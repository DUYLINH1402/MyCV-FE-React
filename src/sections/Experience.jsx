// ========================================
// SECTION: Experience - Timeline kinh nghiệm làm việc
// Thiết kế dạng timeline dọc xen kẽ trái/phải (desktop)
// Single column cho mobile
// Dữ liệu từ API /api/v1/public/experiences
// Sử dụng AOS cho scroll animation, Framer Motion cho hover
// ========================================

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Briefcase, MapPin, Calendar, ChevronRight } from "lucide-react";
import { SectionTitle } from "../components";
import {
  getExperiences,
  formatDateRange,
  calculateDuration,
  isCurrentlyWorking,
} from "../services/experienceService";

// ========================================
// SUB-COMPONENT: ExperienceCard
// Card hiển thị thông tin 1 experience
// ========================================
const ExperienceCard = ({ experience, index }) => {
  // Xác định vị trí trái/phải dựa trên index (chẵn: trái, lẻ: phải)
  const isLeft = index % 2 === 0;
  const isCurrent = isCurrentlyWorking(experience);
  const dateRange = formatDateRange(experience.startDate, experience.endDate);
  const duration = calculateDuration(experience.startDate, experience.endDate);

  return (
    <div className="relative flex items-center justify-center mb-8 md:mb-12">
      {/* === DESKTOP LAYOUT: Xen kẽ trái/phải === */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 lg:gap-8 w-full items-center">
        {/* Cột trái */}
        <div className={`${isLeft ? "block" : ""}`}>
          {isLeft ? (
            <div data-aos="fade-right" data-aos-delay={index * 100} data-aos-duration="600">
              <CardContent
                experience={experience}
                isCurrent={isCurrent}
                dateRange={dateRange}
                duration={duration}
                align="right"
              />
            </div>
          ) : (
            // Hiển thị date range ở phía đối diện card
            <div
              data-aos="fade-right"
              data-aos-delay={index * 100}
              data-aos-duration="600"
              className="text-right pr-4">
              <span className="text-sm text-gray-500 dark:text-dracula-comment font-mono">
                {dateRange}
              </span>
              <p className="text-xs text-gray-400 dark:text-dracula-comment/70 mt-1">{duration}</p>
            </div>
          )}
        </div>

        {/* Cột giữa - Timeline line + dot */}
        <div className="flex flex-col items-center relative">
          <motion.div
            whileHover={{ scale: 1.3 }}
            className={`w-5 h-5 rounded-full border-[3px] z-10 transition-colors duration-300
              ${
                isCurrent
                  ? "bg-green-500 dark:bg-dracula-green border-green-300 dark:border-dracula-green/50 shadow-[0_0_12px_rgba(80,250,123,0.4)]"
                  : "bg-purple-500 dark:bg-dracula-purple border-purple-300 dark:border-dracula-purple/50"
              }`}
          />
        </div>

        {/* Cột phải */}
        <div className={`${!isLeft ? "block" : ""}`}>
          {!isLeft ? (
            <div data-aos="fade-left" data-aos-delay={index * 100} data-aos-duration="600">
              <CardContent
                experience={experience}
                isCurrent={isCurrent}
                dateRange={dateRange}
                duration={duration}
                align="left"
              />
            </div>
          ) : (
            // Hiển thị date range ở phía đối diện card
            <div
              data-aos="fade-left"
              data-aos-delay={index * 100}
              data-aos-duration="600"
              className="text-left pl-4">
              <span className="text-sm text-gray-500 dark:text-dracula-comment font-mono">
                {dateRange}
              </span>
              <p className="text-xs text-gray-400 dark:text-dracula-comment/70 mt-1">{duration}</p>
            </div>
          )}
        </div>
      </div>

      {/* === MOBILE LAYOUT: Single column với dot bên trái === */}
      <div className="md:hidden flex gap-4 w-full">
        {/* Timeline dot */}
        <div className="flex flex-col items-center flex-shrink-0 pt-1">
          <div
            className={`w-4 h-4 rounded-full border-[2.5px] z-10
              ${
                isCurrent
                  ? "bg-green-500 dark:bg-dracula-green border-green-300 dark:border-dracula-green/50 shadow-[0_0_10px_rgba(80,250,123,0.4)]"
                  : "bg-purple-500 dark:bg-dracula-purple border-purple-300 dark:border-dracula-purple/50"
              }`}
          />
          {/* Đường line dọc nối các dot (mobile) */}
          <div className="w-0.5 flex-1 bg-gray-200 dark:bg-dracula-comment/30 mt-1" />
        </div>

        {/* Card content */}
        <div
          data-aos="fade-up"
          data-aos-delay={index * 80}
          data-aos-duration="600"
          className="flex-1 pb-2">
          <CardContent
            experience={experience}
            isCurrent={isCurrent}
            dateRange={dateRange}
            duration={duration}
            align="left"
          />
        </div>
      </div>
    </div>
  );
};

// ========================================
// SUB-COMPONENT: CardContent
// Nội dung bên trong card (dùng chung cho cả trái/phải)
// ========================================
const CardContent = ({ experience, isCurrent, dateRange, duration, align }) => {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative bg-white dark:bg-dracula-current/60 rounded-xl p-5 md:p-6
        border border-gray-200 dark:border-dracula-comment/20
        shadow-sm hover:shadow-md dark:hover:shadow-dracula-purple/10
        transition-shadow duration-300 group
        ${align === "right" ? "md:text-right" : "md:text-left"}`}>
      {/* Badge "Present" nếu đang làm việc */}
      {isCurrent && (
        <span
          className={`absolute top-4 ${
            align === "right" ? "md:left-4 right-4 md:right-auto" : "right-4"
          }
            inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
            bg-green-100 dark:bg-dracula-green/15 text-green-700 dark:text-dracula-green
            border border-green-200 dark:border-dracula-green/30`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-dracula-green animate-pulse" />
          Present
        </span>
      )}

      {/* Job Title + Company Logo */}
      <div
        className={`flex items-start gap-3 ${isCurrent ? "mt-6 md:mt-0" : ""} ${
          align === "right" ? "md:flex-row-reverse" : ""
        }`}>
        {experience.companyLogo && (
          <img
            src={experience.companyLogo}
            alt={`${experience.company} logo`}
            className="w-15 h-10 md:w-15 md:h-12 rounded-lg object-contain bg-white dark:bg-dracula-background/50 border border-gray-200 dark:border-dracula-comment/20 p-1 flex-shrink-0"
          />
        )}
        <div className={`flex-1 min-w-0 ${align === "right" ? "md:text-right" : ""}`}>
          <h3
            className={`text-lg md:text-xl font-bold text-gray-900 dark:text-dracula-foreground
              group-hover:text-purple-600 dark:group-hover:text-dracula-purple
              transition-colors duration-300`}>
            {experience.jobTitle}
          </h3>
        </div>
      </div>

      {/* Company + Location */}
      <div
        className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-2
          ${align === "right" ? "md:justify-end" : "md:justify-start"}`}>
        <span className="flex items-center gap-1.5 text-sm text-orange-600 dark:text-dracula-orange font-medium">
          <Briefcase size={14} />
          {experience.company}
        </span>
        {experience.location && (
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-dracula-comment">
            <MapPin size={13} />
            {experience.location}
          </span>
        )}
      </div>

      {/* Date range + Duration (hiển thị trên mobile, ẩn trên desktop vì đã có ở cột đối diện) */}
      <div
        className={`flex items-center gap-2 mt-2 md:hidden text-xs text-gray-400 dark:text-dracula-comment/80`}>
        <Calendar size={12} />
        <span>
          {dateRange} · {duration}
        </span>
      </div>

      {/* Description - Bullet points */}
      {experience.description && experience.description.length > 0 && (
        <ul className={`mt-4 space-y-2 ${align === "right" ? "md:text-right" : ""}`}>
          {experience.description.map((item, i) => (
            <li
              key={i}
              className={`flex items-start gap-2 text-sm text-gray-600 dark:text-dracula-foreground/80
                ${align === "right" ? "md:flex-row-reverse md:text-right" : ""}`}>
              <ChevronRight
                size={14}
                className="text-purple-400 dark:text-dracula-purple mt-0.5 flex-shrink-0"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

// ========================================
// MAIN COMPONENT: Experience Section
// ========================================
const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch experiences từ API khi component mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await getExperiences();
        setExperiences(data);
        setError(null);
      } catch (err) {
        console.error("[ERROR] Experience - Failed to load:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section id="experience" className="py-20 relative z-40">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle title=".experience" subtitle="Where I've worked" />
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-orange-500 dark:text-orange-400 text-xl font-mono">
              [INFO] Loading experiences from database...
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="experience" className="py-20 relative z-40">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle title=".experience" subtitle="Where I've worked" />
          <div className="flex items-center justify-center py-20">
            <div className="text-red-500 dark:text-dracula-red text-lg font-mono">
              [ERROR] Failed to load experiences: {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (experiences.length === 0) {
    return (
      <section id="experience" className="py-20 relative z-40">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle title=".experience" subtitle="Where I've worked" />
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500 dark:text-dracula-comment text-lg font-mono">
              [INFO] No experiences found. Starting career journey...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 relative z-40">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle title=".experience" subtitle="Where I've worked" />

        {/* Timeline container */}
        <div className="relative">
          {/* Đường line dọc chính (desktop) - nằm giữa */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dracula-comment/30" />

          {/* Render các experience cards */}
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.id} experience={experience} index={index} />
          ))}

          {/* Điểm kết thúc timeline (desktop) */}
          <div className="hidden md:flex justify-center">
            <div
              data-aos="zoom-in"
              data-aos-duration="400"
              className="w-3 h-3 rounded-full bg-gray-300 dark:bg-dracula-comment/50 border-2 border-gray-200 dark:border-dracula-comment/30"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
