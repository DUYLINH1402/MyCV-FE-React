import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronUp, ChevronDown } from "lucide-react";

// ========================================
// COMPONENT: ConsoleLogsStream - Giả lập Spring Boot logs chạy liên tục
// Cố định ở phía dưới màn hình, log chạy khi cuộn trang
// Ẩn mặc định, hiển thị sau 3 lần cuộn, tự động thu nhỏ sau 5 giây
// ========================================
const ConsoleLogsStream = () => {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Ẩn mặc định
  const [scrollCount, setScrollCount] = useState(0); // Đếm số lần cuộn
  const logsEndRef = useRef(null);
  const logIdRef = useRef(0);
  const autoCollapseTimerRef = useRef(null);

  // Danh sách các mẫu log Spring Boot
  const logTemplates = [
    {
      type: "INFO",
      messages: [
        "c.d.portfolio.controller.HomeController  : Handling request GET /api/v1/profile",
        "c.d.portfolio.service.DeveloperService   : Fetching developer profile from cache",
        "c.d.portfolio.repository.ProjectRepo     : Found 15 projects in database",
        "o.s.web.servlet.DispatcherServlet        : Completed 200 OK in 23ms",
        "c.d.portfolio.config.SecurityConfig      : JWT token validated successfully",
        "c.d.portfolio.service.SkillService       : Loading skills data from Redis cache",
        "o.hibernate.SQL                          : SELECT * FROM developers WHERE id = ?",
        "c.d.portfolio.filter.RequestLogFilter    : Request processed: /api/v1/skills",
        "o.s.cache.interceptor.CacheInterceptor   : Cache hit for key: developer_1",
        "c.d.portfolio.scheduler.HealthCheck      : System health: CPU 45%, Memory 67%",
      ],
    },
    {
      type: "DEBUG",
      messages: [
        "o.s.web.servlet.DispatcherServlet        : GET /api/v1/projects, parameters={}",
        "c.d.portfolio.mapper.ProjectMapper       : Mapping 8 entities to DTOs",
        "o.s.orm.jpa.JpaTransactionManager        : Creating new transaction",
        "o.hibernate.type.descriptor.sql.BasicBinder : binding parameter [1] as [BIGINT]",
        "c.d.portfolio.util.JsonSerializer        : Serializing response: 2.3KB",
      ],
    },
    {
      type: "WARN",
      messages: [
        "c.d.portfolio.service.CacheService       : Cache approaching memory limit: 85%",
        "o.s.web.servlet.PageNotFound             : Request method 'PATCH' not supported",
        "c.d.portfolio.config.RateLimiter         : Rate limit warning: 80% capacity",
      ],
    },
    {
      type: "TRACE",
      messages: [
        "o.s.security.web.FilterChainProxy        : Invoking SecurityFilterChain",
        "c.d.portfolio.aspect.LoggingAspect       : Method execution time: 12ms",
      ],
    },
  ];

  // Hàm tạo log ngẫu nhiên
  const generateRandomLog = () => {
    const randomType = logTemplates[Math.floor(Math.random() * logTemplates.length)];
    const randomMessage =
      randomType.messages[Math.floor(Math.random() * randomType.messages.length)];
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });

    return {
      id: logIdRef.current++,
      type: randomType.type,
      timestamp,
      message: randomMessage,
    };
  };

  // Effect: Lắng nghe sự kiện cuộn để thêm log mới
  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      // Đếm số lần cuộn
      setScrollCount((prev) => {
        const newCount = prev + 1;
        // Hiển thị console sau 3 lần cuộn
        if (newCount >= 2 && !isVisible) {
          setIsVisible(true);
        }
        return newCount;
      });

      // Thêm 1-3 log mỗi lần cuộn
      const numLogs = Math.floor(Math.random() * 3) + 1;
      const newLogs = Array.from({ length: numLogs }, () => generateRandomLog());

      setLogs((prev) => {
        const updated = [...prev, ...newLogs];
        // Giữ tối đa 40 log để tránh lag
        return updated.slice(-40);
      });

      clearTimeout(scrollTimeout);
    };

    window.addEventListener("scroll", handleScroll);

    // Thêm vài log ban đầu
    const initialLogs = Array.from({ length: 5 }, () => generateRandomLog());
    setLogs(initialLogs);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isVisible]);

  // Auto scroll xuống cuối khi có log mới
  useEffect(() => {
    if (logsEndRef.current && isExpanded) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isExpanded]);

  // Effect: Tự động thu nhỏ sau 4 giây khi hiển thị
  useEffect(() => {
    if (isVisible && isExpanded) {
      // Clear timer cũ nếu có
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
      }
      // Set timer tự động thu nhỏ sau 4 giây
      autoCollapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 4000);
    }

    return () => {
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
      }
    };
  }, [isVisible]);

  // Hàm trả về màu sắc theo loại log - hỗ trợ light/dark mode
  const getLogColor = (type) => {
    switch (type) {
      case "INFO":
        return "text-green-600 dark:text-dracula-green";
      case "DEBUG":
        return "text-cyan-600 dark:text-dracula-cyan";
      case "WARN":
        return "text-amber-500 dark:text-dracula-yellow";
      case "ERROR":
        return "text-red-500 dark:text-dracula-red";
      case "TRACE":
        return "text-purple-600 dark:text-dracula-purple";
      default:
        return "text-gray-900 dark:text-dracula-foreground";
    }
  };

  // Nếu chưa hiển thị (chưa cuộn đủ 3 lần)
  if (!isVisible) {
    return null;
  }

  // Nếu đã minimize hoàn toàn
  if (isMinimized) {
    return (
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dracula-current border border-gray-300 dark:border-dracula-comment rounded-lg shadow-lg hover:border-orange-400/50 transition-colors">
          <Terminal size={16} className="text-green-600 dark:text-dracula-green" />
          <span className="text-gray-900 dark:text-dracula-foreground text-sm font-mono">
            Console
          </span>
          <span className="w-2 h-2 bg-green-600 dark:bg-dracula-green rounded-full animate-pulse"></span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dracula-background border-t border-gray-300 dark:border-dracula-comment shadow-2xl">
      {/* Header của Console */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-dracula-current border-b border-gray-300 dark:border-dracula-comment">
        <div className="flex items-center gap-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2 text-gray-900 dark:text-dracula-foreground text-xs font-mono">
            <Terminal size={14} />
            <span>Spring Boot Console</span>
            <span className="text-gray-500 dark:text-dracula-comment">— Live Stream</span>
            <span className="w-2 h-2 bg-green-600 dark:bg-dracula-green rounded-full animate-pulse"></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle expand/collapse */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-dracula-comment rounded transition-colors">
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-900 dark:text-dracula-foreground" />
            ) : (
              <ChevronUp size={16} className="text-gray-900 dark:text-dracula-foreground" />
            )}
          </motion.button>

          {/* Minimize button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-dracula-comment rounded transition-colors text-gray-500 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground text-xs">
            ✕
          </motion.button>
        </div>
      </div>

      {/* Logs Content - Giảm chiều cao xuống 100px */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 100 }}
            exit={{ height: 0 }}
            className="overflow-hidden">
            <div className="h-[100px] overflow-y-auto p-3 font-mono text-xs">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 leading-5 hover:bg-gray-100 dark:hover:bg-dracula-current/50 px-1 rounded">
                  <span className="text-gray-500 dark:text-dracula-comment shrink-0">
                    {log.timestamp}
                  </span>
                  <span className={`shrink-0 w-12 ${getLogColor(log.type)}`}>
                    {log.type.padEnd(5)}
                  </span>
                  <span className="text-gray-900 dark:text-dracula-foreground truncate">
                    {log.message}
                  </span>
                </motion.div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConsoleLogsStream;
