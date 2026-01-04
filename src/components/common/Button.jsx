import { motion } from "framer-motion";

// ========================================
// COMPONENT: Button - Nút bấm tái sử dụng với hiệu ứng Framer Motion
// Hỗ trợ 2 variant: primary (màu cam nổi bật) và secondary (viền)
// ========================================
const Button = ({
  children,
  text,
  primary = false,
  icon: Icon,
  onClick,
  href,
  className = "",
  ...props
}) => {
  // Base classes cho button - hỗ trợ light/dark mode
  const baseClasses = `px-6 py-3 rounded-lg font-mono font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
    primary
      ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20"
      : "bg-gray-200 dark:bg-dracula-current text-gray-900 dark:text-dracula-foreground hover:bg-gray-300 dark:hover:bg-dracula-comment border border-gray-300 dark:border-dracula-comment"
  } ${className}`;

  // Nếu có href, render thành thẻ <a>
  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={baseClasses}
        {...props}>
        {Icon && <Icon size={18} />}
        {text || children}
      </motion.a>
    );
  }

  // Mặc định render thành <button>
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={baseClasses}
      {...props}>
      {Icon && <Icon size={18} />}
      {text || children}
    </motion.button>
  );
};

export default Button;
