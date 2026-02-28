// ========================================
// COMPONENT: LoginModal
// Form đăng nhập cho Admin với phong cách Terminal/IDE
// Thiết kế: Mô phỏng giao diện IntelliJ + Terminal logs
// ========================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Terminal,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/**
 * LoginModal Component
 * @param {boolean} isOpen - Trạng thái hiển thị modal
 * @param {Function} onClose - Callback khi đóng modal
 * @param {Function} onLoginSuccess - Callback khi đăng nhập thành công
 */
const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  // State form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho terminal logs animation
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Auth context
  const { login, error, clearError } = useAuth();

  // Refs
  const usernameRef = useRef(null);
  const terminalRef = useRef(null);

  // Focus vào input username khi modal mở
  useEffect(() => {
    if (isOpen && usernameRef.current) {
      setTimeout(() => usernameRef.current?.focus(), 100);
    }
    // Reset form khi mở modal
    if (isOpen) {
      setEmail("");
      setPassword("");
      setTerminalLogs([]);
      setCurrentStep(0);
      clearError();
    }
  }, [isOpen, clearError]);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Thêm log vào terminal với delay
  const addLog = (type, message, delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: Date.now(),
            type,
            message,
            timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
          },
        ]);
        resolve();
      }, delay);
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      addLog("ERROR", "Missing required credentials");
      return;
    }

    setIsSubmitting(true);
    setTerminalLogs([]);

    try {
      // Step 1: Initializing
      setCurrentStep(1);
      await addLog("INFO", "Initializing secure connection...");
      await addLog("INFO", "Establishing TLS handshake...", 300);

      // Step 2: Validating
      setCurrentStep(2);
      await addLog("INFO", "Validating credentials format...", 400);
      await addLog("DEBUG", `Email: ${email}`, 200);
      await addLog("DEBUG", "Password: ********", 100);

      // Step 3: Authenticating
      setCurrentStep(3);
      await addLog("INFO", "Sending authentication request...", 300);
      await addLog("INFO", "POST /api/auth/login", 200);

      // Gọi API login
      const success = await login(email, password);

      if (success) {
        // Step 4: Success
        setCurrentStep(4);
        await addLog("SUCCESS", "Authentication successful!", 300);
        await addLog("INFO", "JWT token received and stored", 200);
        await addLog("INFO", "Session initialized. Welcome, Admin!", 300);

        // Callback và đóng modal sau 1 giây
        setTimeout(() => {
          onLoginSuccess?.();
          onClose();
        }, 1000);
      } else {
        // Authentication failed
        setCurrentStep(0);
        await addLog("ERROR", "Authentication failed: Invalid credentials", 200);
        await addLog("WARN", "Please check your username and password", 100);
      }
    } catch (err) {
      setCurrentStep(0);
      await addLog("ERROR", `Connection error: ${err.message}`, 200);
      await addLog("WARN", "Please try again later", 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Đóng modal khi click backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  // Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Helper: Lấy màu cho log type
  const getLogColor = (type) => {
    switch (type) {
      case "INFO":
        return "text-dracula-cyan";
      case "DEBUG":
        return "text-dracula-comment dark:text-dracula-comment text-gray-500";
      case "WARN":
        return "text-dracula-yellow";
      case "ERROR":
        return "text-dracula-red";
      case "SUCCESS":
        return "text-dracula-green";
      default:
        return "text-dracula-foreground";
    }
  };

  // Helper: Lấy icon cho log type
  const getLogIcon = (type) => {
    switch (type) {
      case "ERROR":
        return <AlertCircle size={12} className="text-dracula-red" />;
      case "SUCCESS":
        return <CheckCircle size={12} className="text-dracula-green" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}>
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg overflow-hidden rounded-xl shadow-2xl 
                       bg-white dark:bg-dracula-background 
                       border border-gray-200 dark:border-dracula-current">
            {/* Header - Phong cách IntelliJ Title Bar */}
            <div
              className="flex items-center justify-between px-4 py-3 
                            bg-gray-100 dark:bg-dracula-current 
                            border-b border-gray-200 dark:border-dracula-comment/30">
              <div className="flex items-center gap-3">
                {/* Traffic lights (macOS style) */}
                <div className="flex gap-2">
                  <button
                    onClick={!isSubmitting ? onClose : undefined}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                    title="Close"
                  />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                {/* Title */}
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-dracula-purple" />
                  <span className="font-mono text-sm font-medium text-gray-700 dark:text-dracula-foreground">
                    Admin Authentication
                  </span>
                </div>
              </div>
              {/* Close button */}
              <button
                onClick={!isSubmitting ? onClose : undefined}
                disabled={isSubmitting}
                className="p-1 rounded-lg transition-colors
                           hover:bg-gray-200 dark:hover:bg-dracula-comment/50
                           text-gray-500 dark:text-dracula-comment
                           disabled:opacity-50 disabled:cursor-not-allowed">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full
                                bg-dracula-purple/10 dark:bg-dracula-purple/20
                                border border-dracula-purple/30">
                  <Lock size={14} className="text-dracula-purple" />
                  <span className="font-mono text-xs text-dracula-purple">
                    Secure Connection (TLS 1.3)
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 font-mono text-sm 
                               text-gray-600 dark:text-dracula-comment">
                    <Mail size={14} />
                    <span>Email</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={usernameRef}
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="admin@example.com"
                      autoComplete="email"
                      className="w-full px-4 py-3 font-mono text-sm rounded-lg
                                 bg-gray-50 dark:bg-dracula-current
                                 border border-gray-300 dark:border-dracula-comment/50
                                 text-gray-900 dark:text-dracula-foreground
                                 placeholder-gray-400 dark:placeholder-dracula-comment
                                 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50
                                 focus:border-dracula-purple
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="flex items-center gap-2 font-mono text-sm 
                               text-gray-600 dark:text-dracula-comment">
                    <Lock size={14} />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full px-4 py-3 pr-12 font-mono text-sm rounded-lg
                                 bg-gray-50 dark:bg-dracula-current
                                 border border-gray-300 dark:border-dracula-comment/50
                                 text-gray-900 dark:text-dracula-foreground
                                 placeholder-gray-400 dark:placeholder-dracula-comment
                                 focus:outline-none focus:ring-2 focus:ring-dracula-purple/50
                                 focus:border-dracula-purple
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200"
                    />
                    {/* Toggle password visibility */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                                 text-gray-400 dark:text-dracula-comment
                                 hover:text-gray-600 dark:hover:text-dracula-foreground
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg
                               bg-red-50 dark:bg-dracula-red/10
                               border border-red-200 dark:border-dracula-red/30">
                    <AlertCircle size={16} className="text-red-500 dark:text-dracula-red" />
                    <span className="font-mono text-sm text-red-600 dark:text-dracula-red">
                      {error}
                    </span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !password.trim()}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-2 
                             px-6 py-3 rounded-lg font-mono font-medium
                             bg-dracula-purple text-white
                             hover:bg-dracula-purple/90
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200
                             shadow-lg shadow-dracula-purple/20">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Terminal size={18} />
                      <span>Execute Login</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Terminal Logs Section */}
              {terminalLogs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6">
                  {/* Terminal Header */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-t-lg
                                  bg-gray-800 dark:bg-black
                                  border-x border-t border-gray-700 dark:border-dracula-comment/30">
                    <Terminal size={14} className="text-dracula-green" />
                    <span className="font-mono text-xs text-gray-400">Authentication Log</span>
                    {/* Progress indicator */}
                    <div className="ml-auto flex items-center gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            currentStep >= step
                              ? currentStep === 4
                                ? "bg-dracula-green"
                                : "bg-dracula-purple"
                              : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Terminal Body */}
                  <div
                    ref={terminalRef}
                    className="max-h-32 overflow-y-auto p-3 rounded-b-lg
                               bg-gray-900 dark:bg-black
                               border-x border-b border-gray-700 dark:border-dracula-comment/30
                               font-mono text-xs">
                    {terminalLogs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-2 py-0.5">
                        <span className="text-gray-500 select-none">[{log.timestamp}]</span>
                        <span className={`font-medium ${getLogColor(log.type)}`}>
                          [{log.type.padEnd(7)}]
                        </span>
                        {getLogIcon(log.type)}
                        <span className="text-gray-300">{log.message}</span>
                      </motion.div>
                    ))}
                    {/* Blinking cursor */}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-dracula-green">$</span>
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-2 h-4 bg-dracula-green"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-3 text-center
                            bg-gray-50 dark:bg-dracula-current/50
                            border-t border-gray-200 dark:border-dracula-comment/30">
              <p className="font-mono text-xs text-gray-500 dark:text-dracula-comment">
                🔒 This area is restricted to authorized administrators only
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
