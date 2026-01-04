import { motion } from "framer-motion";
import { useMemo } from "react";
import { SectionTitle } from "../components";

// ========================================
// SECTION: Skills - Hiển thị các kỹ năng chuyên môn
// Thiết kế dạng grid cards đơn giản, dễ đọc
// Mock data sẽ được thay thế bằng API call sau này
// ========================================
const Skills = () => {
  // Mock data các skill Backend - sau này sẽ lấy từ API
  const skills = [
    { id: 1, name: "Java" },
    { id: 2, name: "Spring Boot" },
    { id: 3, name: "Spring Security" },
    { id: 4, name: "Spring Data JPA" },
    { id: 5, name: "Hibernate" },
    { id: 6, name: "PostgreSQL" },
    { id: 7, name: "MySQL" },
    { id: 8, name: "Redis" },
    { id: 9, name: "Docker" },
    { id: 10, name: "Kubernetes" },
    { id: 11, name: "Git/GitHub" },
    { id: 12, name: "Maven" },
    { id: 13, name: "Microservices" },
    { id: 14, name: "REST API" },
    { id: 15, name: "Kafka" },
    { id: 16, name: "AWS" },
  ];

  // Tạo random floating params cho mỗi card (chỉ tính 1 lần)
  const floatingParams = useMemo(() => {
    return skills.map(() => ({
      duration: 2.5 + Math.random() * 2, // 2.5-4.5 giây
      delay: Math.random() * 2, // Delay ngẫu nhiên 0-2 giây
      yOffset: 6 + Math.random() * 6, // Di chuyển 6-10px
    }));
  }, [skills.length]);

  // Animation variants cho stagger effect khi xuất hiện
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section id="skills" className="py-20 relative z-40">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="getSkills" subtitle="What I bring to the table" />

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {skills.map((skill, index) => (
            <motion.div key={skill.id} variants={itemVariants} className="relative">
              {/* Wrapper cho floating animation - tách riêng để không conflict với variants */}
              <motion.div
                animate={{
                  y: [0, -floatingParams[index].yOffset, 0, floatingParams[index].yOffset * 0.6, 0],
                }}
                transition={{
                  duration: floatingParams[index].duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: floatingParams[index].delay,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="group relative bg-gray-100 dark:bg-dracula-current/50 rounded-2xl p-8 md:p-10 
                           border border-gray-300/50 dark:border-dracula-comment/30 
                           hover:border-orange-400/50 dark:hover:border-orange-400/50
                           transition-all duration-300 cursor-pointer
                           flex items-center justify-center min-h-[120px] md:min-h-[140px]">
                {/* Skill Name */}
                <span
                  className="text-gray-900 dark:text-dracula-foreground font-medium text-base md:text-lg 
                               group-hover:text-orange-500 dark:group-hover:text-orange-400 
                               transition-colors duration-300 text-center">
                  {skill.name}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
