import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Mail, FolderGit2, Coffee, Database, Server, Layers } from "lucide-react";
import { Button, Badge } from "../components";
import { IntelliJMockup, SpringBootTerminal } from "../components";

// ========================================
// SECTION: Hero - Phần giới thiệu đầu tiên của trang
// Bao gồm thông tin cá nhân, tech stack, và code mockup
// ========================================
const Hero = () => {
  return (
    <section
      id="home"
      className="max-w-7xl mx-auto px-6 pt-32 pb-16 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12 relative z-40">
      {/* --- CỘT BÊN TRÁI: Thông tin cá nhân --- */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 1,
          delay: 3.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="flex-1 text-center lg:text-left space-y-8">
        {/* Ảnh đại diện với viền gradient */}
        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 dark:to-dracula-purple rounded-full blur opacity-75 animate-pulse"></div>
          <img
            src="https://res.cloudinary.com/ddia5yfia/image/upload/v1767447064/3C937529-0AD2-409F-B0BD-BB31B4A5A841_1_201_a_u9dzus.jpg"
            alt="Nguyen Duy Linh - Backend Engineer"
            className="relative rounded-full w-40 h-40 border-4 border-white dark:border-dracula-background mx-auto lg:mx-0 object-cover object-[50%_30%]"
          />
        </div>

        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium text-orange-500 dark:text-orange-400">
            // Hello World, I'm
          </motion.h2>

          {/* Hiệu ứng chữ đánh máy - Nội dung Backend Engineer */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <TypeAnimation
              sequence={[
                "Nguyen Duy Linh",
                2000,
                "Backend Engineer",
                2000,
                "Java & Spring Boot",
                2000,
                "System Architect",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 dark:from-dracula-foreground to-purple-600 dark:to-dracula-purple"
            />
          </h1>

          <p className="text-lg text-gray-500 dark:text-dracula-comment max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Building scalable microservices and RESTful APIs with Spring Boot. Passionate about
            clean architecture, database optimization, and handling
            <span className="text-green-600 dark:text-dracula-green font-semibold">
              {" "}
              10k+ concurrent requests
            </span>
            .
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <Badge icon={Coffee} label="Java" color="text-orange-500 dark:text-orange-400" />
          <Badge icon={Layers} label="Spring Boot" color="text-green-600 dark:text-dracula-green" />
          <Badge icon={Database} label="PostgreSQL" color="text-cyan-600 dark:text-dracula-cyan" />
          <Badge icon={Server} label="Docker" color="text-purple-600 dark:text-dracula-purple" />
        </div>

        {/* Các nút hành động */}
        <div className="flex gap-4 justify-center lg:justify-start">
          <Button text="Contact Me" primary icon={Mail} href="#contact" />
          <Button text="View Projects" icon={FolderGit2} href="#projects" />
        </div>
      </motion.div>

      {/* --- CỘT BÊN PHẢI: IDE Mockup và Terminal --- */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 1,
          delay: 3.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="flex-1 w-full max-w-xl space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}>
          <IntelliJMockup />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}>
          <SpringBootTerminal />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
