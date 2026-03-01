import { useRef, useCallback } from "react";
import { TypeAnimation } from "react-type-animation";
import {
  Mail,
  FolderGit2,
  Coffee,
  Database,
  Server,
  Layers,
  Github,
  Linkedin,
  Cloud,
} from "lucide-react";
import { Button, Badge } from "../components";
import { IntelliJMockup } from "../components";
import { useProfile } from "../context";

// ========================================
// SECTION: Hero - Phần giới thiệu đầu tiên của trang
// Bao gồm thông tin cá nhân, tech stack, và code mockup
// Dữ liệu được lấy từ API thông qua ProfileContext
// ========================================
const Hero = ({ onAvatarTripleClick }) => {
  // Lấy dữ liệu profile từ context
  const { profile, loading } = useProfile();

  // Ref để lưu thông tin click cho chức năng triple click mở Login Modal
  // Hỗ trợ mobile users không có bàn phím để gõ "login"
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  // Xử lý triple click vào avatar - 3 lần click trong 2 giây
  const handleAvatarClick = useCallback(() => {
    clickCountRef.current += 1;

    // Reset timer mỗi lần click
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // Nếu đủ 3 lần click -> mở Login Modal
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (onAvatarTripleClick) {
        onAvatarTripleClick();
      }
      return;
    }

    // Đặt timer 2 giây để reset số lần click
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);
  }, [onAvatarTripleClick]);

  // Skeleton loading khi đang fetch data
  if (loading) {
    return (
      <section
        id="home"
        className="max-w-7xl mx-auto px-6 pt-32 pb-16 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-orange-500 dark:text-orange-400 text-xl font-mono">
          [INFO] Loading profile data...
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="max-w-7xl mx-auto px-6 pt-32 pb-16 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12 relative z-40">
      {/* --- CỘT BÊN TRÁI: Thông tin cá nhân --- */}
      <div
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="300"
        className="flex-1 text-center lg:text-left space-y-8">
        {/* Ảnh đại diện với viền gradient - Lấy từ API */}
        {/* Triple click (3 lần trong 2s) để mở Login Modal - hỗ trợ mobile */}
        <div
          className="relative inline-block cursor-pointer select-none"
          data-aos="zoom-in"
          data-aos-delay="400"
          onClick={handleAvatarClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleAvatarClick()}>
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 dark:to-dracula-purple rounded-full blur opacity-75 animate-pulse"></div>
          <img
            src={profile?.avatarUrl}
            alt={`${profile?.fullName} - ${profile?.title}`}
            className="relative rounded-full w-40 h-40 border-4 border-white dark:border-dracula-background mx-auto lg:mx-0 object-cover object-[50%_30%]"
          />
        </div>

        <div className="space-y-4">
          <h2
            data-aos="fade-up"
            data-aos-delay="500"
            className="text-xl font-medium text-orange-500 dark:text-orange-400">
            // Hello World, I'm
          </h2>

          {/* Hiệu ứng chữ đánh máy - Nội dung Backend Engineer */}
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            data-aos="fade-up"
            data-aos-delay="600">
            <TypeAnimation
              key={profile?.fullName}
              sequence={[
                profile?.fullName || "Nguyen Duy Linh",
                2000,
                profile?.title || "Backend Engineer",
                2000,
                "Java & Spring Boot",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 dark:from-dracula-foreground to-purple-600 dark:to-dracula-purple whitespace-nowrap"
            />
          </h1>

          {/* Bio từ API */}
          <p
            className="text-lg text-gray-500 dark:text-dracula-comment max-w-lg mx-auto lg:mx-0 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="700">
            {profile?.professionalSummary ||
              "Backend is more than APIs — it's the security, data, performance, and scalability of the entire system."}
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div
          className="flex flex-wrap gap-3 justify-center lg:justify-start"
          data-aos="fade-up"
          data-aos-delay="800">
          <Badge icon={Coffee} label="Java" color="text-orange-500 dark:text-orange-400" />
          <Badge icon={Layers} label="Spring Boot" color="text-green-600 dark:text-dracula-green" />
          <Badge icon={Database} label="MySQL" color="text-cyan-600 dark:text-dracula-cyan" />
          <Badge icon={Cloud} label="AWS" color="text-amber-500 dark:text-yellow-400" />
          <Badge icon={Server} label="Docker" color="text-purple-600 dark:text-dracula-purple" />
        </div>

        {/* Các nút hành động - Email từ API */}
        <div
          className="flex flex-wrap gap-4 justify-center lg:justify-start"
          data-aos="fade-up"
          data-aos-delay="900">
          <Button text="Contact Me" primary icon={Mail} href={`mailto:${profile?.email}`} />
          <Button text="View Projects" icon={FolderGit2} href="#projects" />
          {profile?.githubUrl && (
            <Button text="GitHub" icon={Github} href={profile.githubUrl} target="_blank" />
          )}
          {profile?.linkedinUrl && (
            <Button text="LinkedIn" icon={Linkedin} href={profile.linkedinUrl} target="_blank" />
          )}
        </div>
      </div>

      {/* --- CỘT BÊN PHẢI: IDE Mockup và Terminal --- */}
      <div
        data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-delay="300"
        className="flex-1 w-full max-w-xl space-y-4">
        <div data-aos="fade-up" data-aos-delay="600">
          <IntelliJMockup />
        </div>
      </div>
    </section>
  );
};

export default Hero;
