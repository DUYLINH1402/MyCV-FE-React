import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { SectionTitle, FrontendLogoLoop } from "../components";
import { getSkills } from "../services";
import { CATEGORY_COLORS } from "./utils/CategoryColor.js";

// ========================================
// SECTION: Skills - Hiển thị các kỹ năng chuyên môn
// Thiết kế dạng grid cards đơn giản, dễ đọc
// Dữ liệu được lấy từ API /api/v1/skills
// ========================================
// Hàm lấy màu theo category, fallback về OTHER nếu không tìm thấy
const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER;
};

const Skills = () => {
  // State lưu trữ skills từ API
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch skills từ API khi component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const data = await getSkills();
        setSkills(data);
        setError(null);
      } catch (err) {
        console.error("[ERROR] Skills - Failed to load skills:", err);
        setError(err.message);
        // Fallback data khi API lỗi
        // setSkills([
        //   { id: 1, name: "Java", category: "BACKEND", level: "HIGH" },
        //   { id: 2, name: "Spring Boot", category: "BACKEND", level: "HIGH" },
        //   { id: 3, name: "PostgreSQL", category: "DATABASE", level: "MEDIUM" },
        //   { id: 4, name: "Docker", category: "DEVOPS", level: "MEDIUM" },
        // ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Lọc bỏ skills có category FRONTEND (FE sẽ hiển thị ở phần riêng)
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => skill.category !== "FRONTEND");
  }, [skills]);

  // Tạo random floating params cho mỗi card (chỉ tính 1 lần khi skills thay đổi)
  const floatingParams = useMemo(() => {
    return filteredSkills.map(() => ({
      duration: 2.5 + Math.random() * 2, // 2.5-4.5 giây
      delay: Math.random() * 2, // Delay ngẫu nhiên 0-2 giây
      yOffset: 6 + Math.random() * 6, // Di chuyển 6-10px
    }));
  }, [filteredSkills]);

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

  // Loading state
  if (loading) {
    return (
      <section id="skills" className="py-20 relative z-40">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="getSkills" subtitle="What I bring to the table" />
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-orange-500 dark:text-orange-400 text-xl font-mono">
              [INFO] Loading skills from database...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 relative z-40">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="getSkills" subtitle="What I bring to the table" />

        {/* Skills Grid - Chỉ hiển thị skills không phải FRONTEND */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {filteredSkills.map((skill, index) => {
            const colors = getCategoryColor(skill.category);
            return (
              <motion.div key={skill.id} variants={itemVariants} className="relative">
                {/* Wrapper cho floating animation - tách riêng để không conflict với variants */}
                <motion.div
                  animate={{
                    y: [
                      0,
                      -floatingParams[index].yOffset,
                      0,
                      floatingParams[index].yOffset * 0.6,
                      0,
                    ],
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
                  className={`group relative bg-gray-100 dark:bg-dracula-current/50 rounded-2xl p-8 md:p-10 
                             border ${colors.border} ${colors.hoverBorder}
                             transition-all duration-300 cursor-pointer
                             flex flex-col items-center justify-center min-h-[120px] md:min-h-[140px] gap-2`}>
                  {/* Skill Name */}
                  <span
                    className={`text-gray-900 dark:text-dracula-foreground font-medium text-base md:text-lg 
                                 ${colors.text} transition-colors duration-300 text-center`}>
                    {skill.name}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Frontend Technologies Logo Loop */}
        <FrontendLogoLoop />
      </div>
    </section>
  );
};

export default Skills;
