// ========================================
// PAGE: Dashboard Overview
// Tổng quan hệ thống với các thống kê và status
// Thiết kế: Terminal logs + System metrics
// ========================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  Code2,
  FolderGit2,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Terminal,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
} from "lucide-react";

/**
 * DashboardOverview Component
 * Hiển thị tổng quan hệ thống và các thống kê
 */
const DashboardOverview = () => {
  const [systemLogs, setSystemLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    profileViews: 1247,
    skillsCount: 12,
    projectsCount: 8,
    uptime: "99.9%",
  });

  // Giả lập system logs
  useEffect(() => {
    const initialLogs = [
      { id: 1, type: "INFO", message: "Application started successfully", time: "00:00:01" },
      { id: 2, type: "INFO", message: "Connected to database: portfolio_db", time: "00:00:02" },
      { id: 3, type: "SUCCESS", message: "Admin session initialized", time: "00:00:03" },
      { id: 4, type: "INFO", message: "Loading dashboard metrics...", time: "00:00:04" },
      { id: 5, type: "SUCCESS", message: "Dashboard ready", time: "00:00:05" },
    ];
    setSystemLogs(initialLogs);

    // Thêm log mới mỗi 5 giây
    const interval = setInterval(() => {
      const randomLogs = [
        { type: "INFO", message: "Health check: OK" },
        { type: "DEBUG", message: "Cache refreshed" },
        { type: "INFO", message: "Metrics updated" },
        { type: "SUCCESS", message: "Backup completed" },
      ];
      const randomLog = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      const now = new Date();
      setSystemLogs((prev) => [
        ...prev.slice(-9),
        {
          id: Date.now(),
          ...randomLog,
          time: now.toLocaleTimeString("en-US", { hour12: false }),
        },
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Stat cards data
  const statCards = [
    {
      id: "views",
      label: "Profile Views",
      value: metrics.profileViews,
      icon: Users,
      color: "cyan",
      change: "+12%",
      isPositive: true,
    },
    {
      id: "skills",
      label: "Skills Listed",
      value: metrics.skillsCount,
      icon: Code2,
      color: "purple",
      change: "+2",
      isPositive: true,
    },
    {
      id: "projects",
      label: "Projects",
      value: metrics.projectsCount,
      icon: FolderGit2,
      color: "green",
      change: "+1",
      isPositive: true,
    },
    {
      id: "uptime",
      label: "Uptime",
      value: metrics.uptime,
      icon: Activity,
      color: "orange",
      change: "Stable",
      isPositive: true,
    },
  ];

  // System status cards
  const systemStatus = [
    { id: "api", label: "API Server", status: "online", icon: Server },
    { id: "db", label: "Database", status: "online", icon: Database },
    { id: "cache", label: "Redis Cache", status: "online", icon: Cpu },
    { id: "storage", label: "Storage", status: "online", icon: HardDrive },
  ];

  // Color mapping cho log types
  const logColors = {
    INFO: "text-dracula-cyan",
    DEBUG: "text-dracula-comment",
    SUCCESS: "text-dracula-green",
    WARN: "text-dracula-orange",
    ERROR: "text-dracula-red",
  };

  // Color mapping cho stat cards
  const cardColors = {
    cyan: "from-dracula-cyan/20 to-dracula-cyan/5 border-dracula-cyan/30",
    purple: "from-dracula-purple/20 to-dracula-purple/5 border-dracula-purple/30",
    green: "from-dracula-green/20 to-dracula-green/5 border-dracula-green/30",
    orange: "from-dracula-orange/20 to-dracula-orange/5 border-dracula-orange/30",
  };

  const iconColors = {
    cyan: "text-dracula-cyan",
    purple: "text-dracula-purple",
    green: "text-dracula-green",
    orange: "text-dracula-orange",
  };

  return (
    <div className="p-6 space-y-6">
      {/* === HEADER === */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dracula-foreground">Dashboard Overview</h1>
          <p className="text-sm text-dracula-comment mt-1">
            Welcome back, Admin! Here's what's happening with your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-dracula-green/10 rounded-full">
          <Wifi size={14} className="text-dracula-green" />
          <span className="text-xs text-dracula-green">All systems operational</span>
        </div>
      </div>

      {/* === STAT CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-5 rounded-xl border bg-gradient-to-br
                ${cardColors[stat.color]}
              `}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-dracula-comment">{stat.label}</p>
                  <p className="text-3xl font-bold text-dracula-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp
                      size={14}
                      className={stat.isPositive ? "text-dracula-green" : "text-dracula-red"}
                    />
                    <span
                      className={`text-xs ${
                        stat.isPositive ? "text-dracula-green" : "text-dracula-red"
                      }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-dracula-background/50 flex items-center justify-center ${
                    iconColors[stat.color]
                  }`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* === SYSTEM STATUS & LOGS === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 p-5 rounded-xl border border-dracula-selection bg-dracula-background/50">
          <h3 className="text-lg font-semibold text-dracula-foreground mb-4 flex items-center gap-2">
            <Server size={18} className="text-dracula-purple" />
            System Status
          </h3>
          <div className="space-y-3">
            {systemStatus.map((system) => {
              const Icon = system.icon;
              return (
                <div
                  key={system.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-dracula-current">
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-dracula-comment" />
                    <span className="text-sm text-dracula-foreground">{system.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-dracula-green animate-pulse" />
                    <span className="text-xs text-dracula-green capitalize">{system.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Terminal Logs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-xl border border-dracula-selection overflow-hidden">
          {/* Terminal header */}
          <div className="px-4 py-3 bg-dracula-current border-b border-dracula-selection flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-dracula-red" />
              <span className="w-3 h-3 rounded-full bg-dracula-yellow" />
              <span className="w-3 h-3 rounded-full bg-dracula-green" />
            </div>
            <div className="flex items-center gap-2 text-sm text-dracula-comment">
              <Terminal size={14} />
              <span>system-logs.sh</span>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-4 bg-dracula-background font-mono text-sm h-64 overflow-y-auto">
            {systemLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 py-1">
                <span className="text-dracula-comment">[{log.time}]</span>
                <span className={`font-semibold ${logColors[log.type]}`}>[{log.type}]</span>
                <span className="text-dracula-foreground">{log.message}</span>
              </motion.div>
            ))}
            <div className="flex items-center gap-2 text-dracula-green mt-2">
              <span>$</span>
              <span className="animate-pulse">▊</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* === QUICK ACTIONS === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-5 rounded-xl border border-dracula-selection bg-dracula-background/50">
        <h3 className="text-lg font-semibold text-dracula-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Edit Profile", icon: Users, color: "cyan" },
            { label: "Add Skill", icon: Code2, color: "purple" },
            { label: "New Project", icon: FolderGit2, color: "green" },
            { label: "View Analytics", icon: Activity, color: "orange" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className={`
                  p-4 rounded-xl border border-dracula-selection
                  bg-dracula-current hover:bg-dracula-selection
                  transition-all duration-200 group
                  flex flex-col items-center gap-2
                `}>
                <Icon size={24} className={iconColors[action.color]} />
                <span className="text-sm text-dracula-comment group-hover:text-dracula-foreground">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
