// ========================================
// COMPONENT: ScrollIndicator (Scroll Spy Dots)
// Thanh điều hướng dạng chấm tròn cố định bên phải màn hình
// Sử dụng Intersection Observer API để detect section đang hiển thị
// ========================================

import { useState, useEffect, useCallback } from "react";

// Danh sách các section tương ứng với id trên trang
const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "architecture", label: "Architecture" },
  { id: "database-schema", label: "Database" },
  { id: "contact", label: "Contact" },
];

const ScrollIndicator = () => {
  // Section đang active (đang hiển thị trong viewport)
  const [activeSection, setActiveSection] = useState("home");
  // Dot đang được hover (để hiển thị tooltip)
  const [hoveredDot, setHoveredDot] = useState(null);

  // Thiết lập Intersection Observer để theo dõi các section
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        // Khi section chiếm >= 30% viewport thì đánh dấu active
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      // threshold 0.3 = section phải hiển thị ít nhất 30% mới kích hoạt
      threshold: 0.3,
      // rootMargin âm để tránh trigger quá sớm
      rootMargin: "-10% 0px -10% 0px",
    });

    // Observe tất cả các section có id tương ứng
    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Xử lý click vào dot -> scroll mượt đến section tương ứng
  const handleDotClick = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <nav
      className="fixed right-1 md:right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 md:gap-4"
      aria-label="Scroll navigation">
      {SECTIONS.map(({ id, label }) => {
        const isActive = activeSection === id;
        const isHovered = hoveredDot === id;

        return (
          <div key={id} className="relative flex items-center">
            {/* Tooltip - hiển thị khi hover */}
            <span
              className={`absolute right-6 px-2 py-1 text-xs font-mono rounded whitespace-nowrap
                bg-gray-800 dark:bg-dracula-currentLine text-white dark:text-dracula-foreground
                shadow-lg pointer-events-none
                transition-all duration-200 ease-out
                ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}
              `}>
              {label}
            </span>

            {/* Dot */}
            <button
              onClick={() => handleDotClick(id)}
              onMouseEnter={() => setHoveredDot(id)}
              onMouseLeave={() => setHoveredDot(null)}
              aria-label={`Scroll to ${label}`}
              aria-current={isActive ? "true" : undefined}
              className={`w-[10px] h-[10px] rounded-full cursor-pointer
                transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "bg-orange-500 dark:bg-orange-400 scale-[1.4] shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                    : "bg-gray-400 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-500/60 hover:scale-[1.2]"
                }
              `}
            />
          </div>
        );
      })}
    </nav>
  );
};

export default ScrollIndicator;
