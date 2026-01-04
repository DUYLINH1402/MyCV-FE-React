import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Menu, X } from "lucide-react";

// ========================================
// COMPONENT: Header - Navigation bar cố định
// Bao gồm logo, menu navigation và nút toggle theme
// ========================================
const Header = ({ isDarkMode, toggleTheme }) => {
  // State để điều khiển mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State để kiểm tra scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // Các mục menu navigation
  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
  ];

  // Effect: Lắng nghe sự kiện scroll để thay đổi style header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hàm xử lý smooth scroll khi click vào menu item
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Đóng mobile menu sau khi click
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-4 bg-white/95 dark:bg-dracula-background/95 backdrop-blur-md shadow-lg shadow-black/10"
          : "py-6 bg-white/80 dark:bg-dracula-background/80 backdrop-blur-sm"
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.a
          href="#home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-bold text-xl tracking-tight flex items-center gap-2 cursor-pointer text-gray-900 dark:text-dracula-foreground"
          onClick={(e) => handleNavClick(e, "#home")}>
          <Coffee className="text-orange-500 dark:text-orange-400" size={24} />
          <span>DuyLinh</span>
          <span className="text-orange-500 dark:text-orange-400">.java</span>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-gray-500 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors font-mono text-sm relative group">
              <span className="text-pink-500 dark:text-dracula-pink">.</span>
              {item.label.toLowerCase()}
              <span className="text-gray-500 dark:text-dracula-comment">()</span>
              {/* Underline effect on hover */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 dark:bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
          ))}
        </nav>

        {/* Right side: Theme toggle + Mobile menu button */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-dracula-current hover:bg-gray-300 dark:hover:bg-dracula-comment transition-colors"
            title="Toggle Theme"
            aria-label="Toggle dark/light mode">
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-500 dark:text-dracula-yellow" />
            ) : (
              <Moon size={20} className="text-purple-600 dark:text-dracula-purple" />
            )}
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-dracula-current hover:bg-gray-300 dark:hover:bg-dracula-comment transition-colors"
            aria-label="Toggle menu">
            {isMenuOpen ? (
              <X size={20} className="text-gray-900 dark:text-dracula-foreground" />
            ) : (
              <Menu size={20} className="text-gray-900 dark:text-dracula-foreground" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <motion.nav
        initial={false}
        animate={isMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-gray-100/95 dark:bg-dracula-current/95 backdrop-blur-md">
        <div className="px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="block text-gray-500 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors font-mono text-sm py-2">
              <span className="text-pink-500 dark:text-dracula-pink">.</span>
              {item.label.toLowerCase()}
              <span className="text-gray-500 dark:text-dracula-comment">()</span>
            </a>
          ))}
        </div>
      </motion.nav>
    </header>
  );
};

export default Header;
