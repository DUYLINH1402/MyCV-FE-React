import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";

// ========================================
// COMPONENT: SpringBootTerminal - Terminal giả lập Spring Boot startup logs
// Hiển thị các log với hiệu ứng typing animation
// ========================================
const SpringBootTerminal = ({ autoPlay = true }) => {
  const [logs, setLogs] = useState([]);

  // Danh sách các log mô phỏng quá trình khởi động Spring Boot
  const bootLogs = [
    { type: "INFO", message: "Starting BackendPortfolioApplication v2.0.0" },
    { type: "INFO", message: "Tomcat initialized with port: 8080 (http)" },
    { type: "INFO", message: "HikariPool-1 - Starting..." },
    { type: "INFO", message: "HikariPool-1 - Start completed. (MySQL)" },
    { type: "INFO", message: "Hibernate: create sequence developer_seq" },
    { type: "INFO", message: "Initialized JPA EntityManagerFactory" },
    { type: "INFO", message: "Exposing 15 REST endpoints" },
    { type: "WARN", message: "Cache 'developerCache' already initialized" },
    { type: "INFO", message: "Started in 2.847s (process running for 3.2s)" },
  ];

  // Effect: Thêm log từng dòng với hiệu ứng delay
  useEffect(() => {
    if (!autoPlay) return;

    bootLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, index * 400); // Delay 400ms cho mỗi dòng log
    });

    // Cleanup function
    return () => setLogs([]);
  }, [autoPlay]);

  // Hàm trả về màu sắc tương ứng với loại log
  const getLogColor = (type) => {
    switch (type) {
      case "INFO":
        return "text-green-600 dark:text-dracula-green";
      case "WARN":
        return "text-amber-500 dark:text-dracula-yellow";
      case "ERROR":
        return "text-red-500 dark:text-dracula-red";
      default:
        return "text-gray-900 dark:text-dracula-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="rounded-lg overflow-hidden bg-white dark:bg-dracula-background border border-gray-300 dark:border-dracula-current shadow-xl font-mono text-xs">
      {/* Thanh tiêu đề Terminal */}
      <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-dracula-current border-b border-gray-300 dark:border-dracula-comment">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-gray-900 dark:text-dracula-foreground text-xs flex items-center justify-center gap-2">
          <TerminalIcon size={12} />
          <span>Terminal — Spring Boot</span>
        </div>
      </div>

      {/* Nội dung log */}
      <div className="p-4 h-24 overflow-y-auto">
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 leading-5">
            <span className="text-gray-500 dark:text-dracula-comment">[</span>
            <span className={getLogColor(log.type)}>{log.type}</span>
            <span className="text-gray-500 dark:text-dracula-comment">]</span>
            <span className="text-gray-900 dark:text-dracula-foreground">{log.message}</span>
          </motion.div>
        ))}
        {/* Con trỏ nhấp nháy */}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-green-600 dark:bg-dracula-green ml-1"></motion.span>
      </div>
    </motion.div>
  );
};

export default SpringBootTerminal;
