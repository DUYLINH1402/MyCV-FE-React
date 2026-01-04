import { motion } from "framer-motion";
import { Code2, Briefcase, GraduationCap, Award } from "lucide-react";
import { SectionTitle, MagicCard } from "../components";

// ========================================
// SECTION: About - Giới thiệu về bản thân
// Bao gồm thông tin cá nhân, kinh nghiệm, học vấn
// Sử dụng MagicCard cho hiệu ứng hover đẹp mắt (lấy từ Magic Bento)
// ========================================
const About = () => {
  // Các thông tin nổi bật
  const highlights = [
    {
      icon: Briefcase,
      title: "3+ Years Experience",
      description: "Backend development with Java ecosystem",
    },
    {
      icon: Code2,
      title: "15+ Projects",
      description: "From REST APIs to Microservices architecture",
    },
    {
      icon: GraduationCap,
      title: "Computer Science",
      description: "Bachelor's degree in Software Engineering",
    },
    {
      icon: Award,
      title: "Certifications",
      description: "AWS, Spring Professional certified",
    },
  ];

  return (
    <section id="about" className="py-20 relative z-40">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="aboutMe" subtitle="Get to know me better" />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Cột trái: Mô tả chi tiết với MagicCard */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 1,
              delay: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="space-y-6">
            <MagicCard
              enableTilt={true}
              enableParticles={true}
              enableBorderGlow={true}
              clickEffect={true}
              enableMagnetism={false}
              particleCount={20}
              glowColor="249, 115, 22"
              className="bg-gray-100 dark:bg-dracula-current rounded-lg p-6 border border-gray-300 dark:border-dracula-comment cursor-pointer">
              {/* Comment style */}
              <p className="text-gray-500 dark:text-dracula-comment font-mono text-sm mb-4">
                {"/**"}
                <br />
                {"* @author Nguyen Duy Linh"}
                <br />
                {"* @role Backend Engineer"}
                <br />
                {"* @since 2021"}
                <br />
                {"*/"}
              </p>

              <p className="text-gray-900 dark:text-dracula-foreground leading-relaxed mb-4">
                I'm a passionate{" "}
                <span className="text-orange-500 dark:text-orange-400">Backend Engineer</span>{" "}
                specialized in building robust, scalable systems using{" "}
                <span className="text-green-600 dark:text-dracula-green">Java</span> and
                <span className="text-green-600 dark:text-dracula-green"> Spring Boot</span>. My
                expertise lies in designing RESTful APIs, implementing microservices architecture,
                and optimizing database performance.
              </p>

              <p className="text-gray-900 dark:text-dracula-foreground leading-relaxed">
                I believe in writing{" "}
                <span className="text-pink-600 dark:text-dracula-pink">
                  clean, maintainable code
                </span>{" "}
                and following best practices like SOLID principles, Design Patterns, and TDD. When
                I'm not coding, you'll find me exploring new technologies or contributing to
                open-source projects.
              </p>
            </MagicCard>
          </motion.div>

          {/* Cột phải: Highlights với MagicCard */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 1,
              delay: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="grid grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}>
                <MagicCard
                  enableTilt={true}
                  enableParticles={true}
                  enableBorderGlow={true}
                  clickEffect={true}
                  enableMagnetism={true}
                  particleCount={8}
                  glowColor="249, 115, 22"
                  className="h-full bg-gray-100 dark:bg-dracula-current rounded-lg p-5 border border-gray-300 dark:border-dracula-comment cursor-pointer">
                  <item.icon className="text-orange-500 dark:text-orange-400 mb-3" size={28} />
                  <h3 className="text-gray-900 dark:text-dracula-foreground font-bold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 dark:text-dracula-comment text-sm">
                    {item.description}
                  </p>
                </MagicCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
