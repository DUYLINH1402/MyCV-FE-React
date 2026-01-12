// ========================================
// COMPONENT: SectionTitle - Tiêu đề cho mỗi section
// Thiết kế theo phong cách comment Java
// Sử dụng AOS cho scroll animation
// ========================================
const SectionTitle = ({ title, subtitle, className = "" }) => (
  <div data-aos="fade-up" data-aos-duration="600" className={`text-center mb-12 ${className}`}>
    {/* Comment style như trong Java */}
    <p className="text-gray-500 dark:text-dracula-comment font-mono text-sm mb-2">
      {"// "}
      {subtitle}
    </p>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dracula-foreground">
      {title}
      <span className="text-orange-500 dark:text-orange-400">()</span>
      <span className="text-gray-500 dark:text-dracula-comment">;</span>
    </h2>
  </div>
);

export default SectionTitle;
