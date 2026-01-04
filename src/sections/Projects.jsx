import { motion } from "framer-motion";
import { ExternalLink, Github, Database, Server, Shield, Workflow } from "lucide-react";
import { SectionTitle, Button, DatabaseSchema } from "../components";

// ========================================
// SECTION: Projects - Hiển thị các dự án đã thực hiện
// Mỗi project card hiển thị thông tin chi tiết và metrics
// ========================================
const Projects = () => {
  // Danh sách các dự án
  const projects = [
    {
      title: "E-Commerce Microservices",
      description:
        "Hệ thống thương mại điện tử sử dụng kiến trúc microservices với Spring Boot, bao gồm các service: User, Product, Order, Payment, Notification.",
      techStack: ["Spring Boot", "PostgreSQL", "Redis", "Kafka", "Docker"],
      metrics: [
        { label: "Services", value: "8" },
        { label: "API Endpoints", value: "45+" },
        { label: "Concurrent Users", value: "10k+" },
      ],
      icon: Server,
      color: "from-orange-500 to-dracula-pink",
      github: "#",
      demo: "#",
    },
    {
      title: "Banking Transaction API",
      description:
        "REST API xử lý giao dịch ngân hàng với tính năng bảo mật cao, transaction management, và audit logging. Đạt 99.9% uptime.",
      techStack: ["Spring Boot", "Spring Security", "MySQL", "JWT", "AOP"],
      metrics: [
        { label: "Transactions/day", value: "50k+" },
        { label: "Response Time", value: "<100ms" },
        { label: "Uptime", value: "99.9%" },
      ],
      icon: Shield,
      color: "from-dracula-green to-dracula-cyan",
      github: "#",
      demo: "#",
    },
    {
      title: "Real-time Chat System",
      description:
        "Hệ thống chat realtime sử dụng WebSocket và STOMP protocol, hỗ trợ group chat, file sharing, và message persistence.",
      techStack: ["Spring WebSocket", "STOMP", "MongoDB", "Redis Pub/Sub"],
      metrics: [
        { label: "Active Connections", value: "5k+" },
        { label: "Messages/min", value: "10k" },
        { label: "Latency", value: "<50ms" },
      ],
      icon: Workflow,
      color: "from-dracula-purple to-dracula-pink",
      github: "#",
      demo: "#",
    },
    {
      title: "Inventory Management",
      description:
        "Hệ thống quản lý kho hàng với tính năng tracking real-time, automated alerts, và reporting dashboard. Tích hợp với ERP systems.",
      techStack: ["Spring Boot", "PostgreSQL", "Elasticsearch", "Flyway"],
      metrics: [
        { label: "Products Tracked", value: "100k+" },
        { label: "Daily Sync", value: "500MB" },
        { label: "Search Time", value: "<10ms" },
      ],
      icon: Database,
      color: "from-dracula-cyan to-dracula-green",
      github: "#",
      demo: "#",
    },
  ];

  return (
    <section id="projects" className="py-20 relative z-40">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="getProjects" subtitle="Things I've built" />

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gray-100 dark:bg-dracula-current rounded-lg overflow-hidden border border-gray-300 dark:border-dracula-comment hover:border-orange-400/50 transition-all duration-300">
              {/* Project Header với gradient */}
              <div className={`h-2 bg-gradient-to-r ${project.color}`}></div>

              <div className="p-6">
                {/* Title và Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${project.color}`}>
                      <project.icon size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-dracula-foreground">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 dark:text-dracula-comment text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-white dark:bg-dracula-background rounded-lg p-2 text-center">
                      <p className="text-green-600 dark:text-dracula-green font-bold text-lg">
                        {metric.value}
                      </p>
                      <p className="text-gray-500 dark:text-dracula-comment text-xs">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-white dark:bg-dracula-background text-gray-900 dark:text-dracula-foreground text-xs font-mono rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-dracula-comment">
                  <a
                    href={project.github}
                    className="flex items-center gap-2 text-gray-500 dark:text-dracula-comment hover:text-gray-900 dark:hover:text-dracula-foreground transition-colors text-sm">
                    <Github size={16} />
                    <span>Source Code</span>
                  </a>
                  <a
                    href={project.demo}
                    className="flex items-center gap-2 text-gray-500 dark:text-dracula-comment hover:text-orange-500 dark:hover:text-orange-400 transition-colors text-sm">
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Database Schema Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12">
          <p className="text-center text-gray-500 dark:text-dracula-comment font-mono text-sm mb-6">
            // Hover to see data flow relationships
          </p>
          <DatabaseSchema className="max-w-3xl mx-auto" />
        </motion.div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12">
          <Button text="View All Projects" icon={Github} href="https://github.com/duylinh" />
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
