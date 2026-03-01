import { Coffee, Github, Linkedin, Mail } from "lucide-react";

// ========================================
// COMPONENT: Footer - Chân trang với thông tin liên hệ
// Sử dụng AOS cho scroll animation
// ========================================
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Các link social media
  const socialLinks = [
    { icon: Github, href: "https://github.com/DUYLINH1402", label: "GitHub" },
    { icon: Mail, href: "mailto:duylinh63b5@gmail.com", label: "Email" },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-dracula-current border-t border-gray-300 dark:border-dracula-comment">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Copyright */}
          <div
            data-aos="fade-right"
            data-aos-duration="600"
            className="flex items-center gap-2 text-gray-500 dark:text-dracula-comment font-mono text-sm">
            <Coffee className="text-orange-500 dark:text-orange-400" size={18} />
            <span>
              © {currentYear} Nguyen Duy Linh
              <span className="text-pink-500 dark:text-dracula-pink">.</span>
              <span className="text-green-600 dark:text-dracula-green">build</span>
              <span className="text-gray-500 dark:text-dracula-comment">()</span>
            </span>
          </div>

          {/* Social Links */}
          <div data-aos="fade-left" data-aos-duration="600" className="flex items-center gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="p-2 rounded-lg bg-white dark:bg-dracula-background hover:bg-gray-200 dark:hover:bg-dracula-comment text-gray-500 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors"
                aria-label={link.label}>
                <link.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
