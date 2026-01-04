import { motion } from "framer-motion";

// ========================================
// COMPONENT: Badge - Hiển thị tech stack với icon
// Sử dụng cho việc hiển thị các công nghệ/kỹ năng
// ========================================
const Badge = ({
  icon: Icon,
  label,
  color = "text-gray-900 dark:text-dracula-foreground",
  className = "",
}) => (
  <motion.div
    whileHover={{ scale: 1.1, y: -2 }}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200 dark:bg-dracula-current border border-gray-300 dark:border-dracula-comment text-sm font-mono ${color} ${className}`}>
    {Icon && <Icon size={14} />}
    <span>{label}</span>
  </motion.div>
);

export default Badge;
