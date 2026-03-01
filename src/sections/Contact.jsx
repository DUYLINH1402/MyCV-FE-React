import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Github,
  FileDown,
  Send,
  Terminal,
  CheckCircle,
  Copy,
  ExternalLink,
  Phone,
} from "lucide-react";
import { SectionTitle } from "../components/common";
import { useProfile } from "../context";

// ========================================
// SECTION: Contact - Thông tin liên hệ
// Bao gồm Email, GitHub, CV download và Contact form
// Thiết kế theo phong cách Terminal/IDE
// ========================================
const Contact = () => {
  // Lấy thông tin profile từ context
  const { profile } = useProfile();

  // State cho form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Thông tin liên hệ - lấy từ profile hoặc dùng mặc định
  const contactInfo = {
    email: profile?.email || "duylinh63b5@gmail.com",
    phone: profile?.phoneNumber || "+84 123 456 789",
    github: profile?.githubUrl || "https://github.com/DUYLINH1402",
    githubUsername: profile?.githubUsername || "DUYLINH1402",
    cvUrl: profile?.cvUrl || "/CV_NguyenDuyLinh.pdf",
  };

  // Hàm copy email vào clipboard
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Hàm copy phone vào clipboard
  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Hàm xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // TODO: Tích hợp API gửi email thực tế (EmailJS, Formspree, etc.)
      // Giả lập gửi form thành công sau 1.5s
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Các contact items để hiển thị
  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: contactInfo.email,
      action: handleCopyEmail,
      actionIcon: copiedEmail ? CheckCircle : Copy,
      actionLabel: copiedEmail ? "Copied!" : "Copy",
      color: "cyan",
    },
    {
      icon: Phone,
      label: "Phone",
      value: contactInfo.phone,
      action: handleCopyPhone,
      actionIcon: copiedPhone ? CheckCircle : Copy,
      actionLabel: copiedPhone ? "Copied!" : "Copy",
      color: "orange",
    },
    {
      icon: Github,
      label: "GitHub",
      value: `@${contactInfo.githubUsername}`,
      href: contactInfo.github,
      actionIcon: ExternalLink,
      actionLabel: "Visit",
      color: "purple",
    },
    {
      icon: FileDown,
      label: "Resume/CV",
      value: "Download PDF",
      href: contactInfo.cvUrl,
      download: true,
      actionIcon: FileDown,
      actionLabel: "Download",
      color: "green",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-dracula-current/30 dark:to-dracula-background">
      {/* Container chính */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Tiêu đề Section */}
        <div data-aos="fade-up">
          <SectionTitle
            pretitle="// Liên hệ với tôi"
            title=".contact"
            subtitle="Sẵn sàng kết nối và hợp tác cùng bạn"
          />
        </div>

        {/* Grid layout: Contact Info + Form */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-12">
          {/* === CỘT TRÁI: Thông tin liên hệ === */}
          <div data-aos="fade-right" data-aos-delay="100" className="space-y-6">
            {/* Terminal-style header */}
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-dracula-comment/30 bg-white dark:bg-dracula-current/50 shadow-lg">
              {/* Terminal title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-dracula-background border-b border-gray-200 dark:border-dracula-comment/30">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <span className="ml-2 text-xs text-gray-500 dark:text-dracula-comment font-mono">
                  contact_info.sh
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-4 md:p-6 font-mono text-sm">
                {/* Command line */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-500 dark:text-dracula-green">➜</span>
                  <span className="text-cyan-500 dark:text-dracula-cyan">~</span>
                  <span className="text-gray-600 dark:text-dracula-foreground">
                    cat contact.json
                  </span>
                </div>

                {/* JSON-style output */}
                <div className="pl-4 space-y-4">
                  {contactItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="group">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dracula-background/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              item.color === "cyan"
                                ? "bg-cyan-100 dark:bg-dracula-cyan/20"
                                : item.color === "orange"
                                ? "bg-orange-100 dark:bg-dracula-orange/20"
                                : item.color === "purple"
                                ? "bg-purple-100 dark:bg-dracula-purple/20"
                                : "bg-green-100 dark:bg-dracula-green/20"
                            }`}>
                            <item.icon
                              size={18}
                              className={
                                item.color === "cyan"
                                  ? "text-cyan-600 dark:text-dracula-cyan"
                                  : item.color === "orange"
                                  ? "text-orange-600 dark:text-dracula-orange"
                                  : item.color === "purple"
                                  ? "text-purple-600 dark:text-dracula-purple"
                                  : "text-green-600 dark:text-dracula-green"
                              }
                            />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-dracula-comment">
                              {item.label}
                            </p>
                            <p className="text-gray-800 dark:text-dracula-foreground font-medium">
                              {item.value}
                            </p>
                          </div>
                        </div>

                        {/* Action button */}
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.download ? "_self" : "_blank"}
                            rel="noopener noreferrer"
                            download={item.download}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-dracula-background hover:bg-gray-200 dark:hover:bg-dracula-comment/50 text-gray-600 dark:text-dracula-foreground transition-colors opacity-0 group-hover:opacity-100">
                            <item.actionIcon size={14} />
                            {item.actionLabel}
                          </a>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={item.action}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all opacity-0 group-hover:opacity-100 ${
                              item.actionLabel === "Copied!"
                                ? "bg-green-100 dark:bg-dracula-green/20 text-green-600 dark:text-dracula-green"
                                : "bg-gray-100 dark:bg-dracula-background hover:bg-gray-200 dark:hover:bg-dracula-comment/50 text-gray-600 dark:text-dracula-foreground"
                            }`}>
                            <item.actionIcon size={14} />
                            {item.actionLabel}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Cursor blink */}
                <div className="flex items-center gap-2 mt-6">
                  <span className="text-green-500 dark:text-dracula-green">➜</span>
                  <span className="text-cyan-500 dark:text-dracula-cyan">~</span>
                  <span className="w-2 h-4 bg-gray-600 dark:bg-dracula-foreground animate-pulse"></span>
                </div>
              </div>
            </div>

            {/* Quick message */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-dracula-orange/10 dark:to-dracula-yellow/10 border border-orange-200 dark:border-dracula-orange/30">
              <p className="text-gray-700 dark:text-dracula-foreground text-sm">
                <span className="text-orange-500 dark:text-dracula-orange font-bold">💡 Tip:</span>{" "}
                I'm always excited to discuss new opportunities, interesting backend projects, or
                simply exchange ideas about system architecture. Feel free to reach out!
              </p>
            </div>
          </div>

          {/* === CỘT PHẢI: Contact Form === */}
          <div data-aos="fade-left" data-aos-delay="100">
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-dracula-comment/30 bg-white dark:bg-dracula-current/50 shadow-lg">
              {/* Form header - IDE style */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-dracula-background border-b border-gray-200 dark:border-dracula-comment/30">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <span className="ml-2 text-xs text-gray-500 dark:text-dracula-comment font-mono">
                  SendMessage.java
                </span>
              </div>

              {/* Form content */}
              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                {/* Code-style comment */}
                <p className="text-gray-400 dark:text-dracula-comment text-xs font-mono">
                  // Fill in the fields below to send me a message
                </p>

                {/* Name field */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-gray-500 dark:text-dracula-comment">
                    <span className="text-pink-500 dark:text-dracula-pink">String</span> name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder='"Your Name"'
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-dracula-background border border-gray-200 dark:border-dracula-comment/30 text-gray-800 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/60 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-dracula-orange focus:border-transparent font-mono text-sm transition-all"
                  />
                </div>

                {/* Email field */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-gray-500 dark:text-dracula-comment">
                    <span className="text-pink-500 dark:text-dracula-pink">String</span> email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder='"your.email@example.com"'
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-dracula-background border border-gray-200 dark:border-dracula-comment/30 text-gray-800 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/60 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-dracula-orange focus:border-transparent font-mono text-sm transition-all"
                  />
                </div>

                {/* Subject field */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-gray-500 dark:text-dracula-comment">
                    <span className="text-pink-500 dark:text-dracula-pink">String</span> subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder='"Job Opportunity / Project Collaboration"'
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-dracula-background border border-gray-200 dark:border-dracula-comment/30 text-gray-800 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/60 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-dracula-orange focus:border-transparent font-mono text-sm transition-all"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-gray-500 dark:text-dracula-comment">
                    <span className="text-pink-500 dark:text-dracula-pink">String</span> message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder='"Your message here..."'
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-dracula-background border border-gray-200 dark:border-dracula-comment/30 text-gray-800 dark:text-dracula-foreground placeholder:text-gray-400 dark:placeholder:text-dracula-comment/60 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-dracula-orange focus:border-transparent font-mono text-sm transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-medium transition-all ${
                    isSubmitting
                      ? "bg-gray-300 dark:bg-dracula-comment/50 text-gray-500 dark:text-dracula-comment cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 dark:from-dracula-orange dark:to-dracula-yellow text-white hover:shadow-lg hover:shadow-orange-500/30 dark:hover:shadow-dracula-orange/30"
                  }`}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>sendMessage()</span>
                    </>
                  )}
                </motion.button>

                {/* Submit status */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-dracula-green/10 border border-green-200 dark:border-dracula-green/30">
                    <CheckCircle size={18} className="text-green-500 dark:text-dracula-green" />
                    <span className="text-green-700 dark:text-dracula-green text-sm font-mono">
                      // Message sent successfully!
                    </span>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-dracula-red/10 border border-red-200 dark:border-dracula-red/30">
                    <Terminal size={18} className="text-red-500 dark:text-dracula-red" />
                    <span className="text-red-700 dark:text-dracula-red text-sm font-mono">
                      // Error: Failed to send. Please try again.
                    </span>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
