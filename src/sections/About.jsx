import { Code2, Briefcase, GraduationCap, Award } from "lucide-react";
import { SectionTitle, MagicCard } from "../components";
import { useProfile } from "../context";

// ========================================
// SECTION: About - Giới thiệu về bản thân
// Bao gồm thông tin cá nhân, kinh nghiệm, học vấn
// Sử dụng MagicCard cho hiệu ứng hover đẹp mắt (lấy từ Magic Bento)
// Dữ liệu được lấy từ API thông qua ProfileContext
// ========================================
const About = () => {
  // Lấy dữ liệu profile từ context
  const { profile } = useProfile();

  // Tách tên từ fullName để hiển thị
  const authorName = profile?.fullName || "Nguyen Duy Linh";
  const authorRole = profile?.title || "Backend Engineer";

  // Các thông tin nổi bật - lấy từ API
  const highlights = [
    {
      icon: Briefcase,
      title: "Intensive Training",
      description: `${
        profile?.experienceYears || "1+"
      } Years of dedicated learning and building production-grade applications with Java Spring Boot ecosystem.`,
    },
    {
      icon: Code2,
      title: `${profile?.totalProjects || "3+"} Scalable Projects`,
      description:
        "Integrated ZaloPay, OpenAI, WebSockets, and AWS Cloud (EC2, S3, RDS) for real-world business logic",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: profile?.educationSummary || "Bachelor's degree in Software Engineering",
    },
    {
      icon: Award,
      title: "Certifications",
      description: profile?.certSummary || "Professional certified",
    },
  ];

  return (
    <section id="about" className="py-10 relative z-40">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="aboutMe" subtitle="Get to know me better" />
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Cột trái: Mô tả chi tiết với MagicCard */}
          <div data-aos="fade-right" data-aos-duration="800" className="space-y-6">
            <MagicCard
              enableTilt={true}
              enableParticles={true}
              enableBorderGlow={true}
              clickEffect={true}
              enableMagnetism={false}
              particleCount={20}
              glowColor="249, 115, 22"
              className="bg-gray-100 dark:bg-dracula-current rounded-lg p-6 border border-gray-300 dark:border-dracula-comment cursor-pointer">
              {/* Comment style - Dữ liệu từ API */}
              <p className="text-gray-500 dark:text-dracula-comment font-mono text-sm mb-4">
                {"/**"}
                <br />
                {`* @author ${authorName}`}
                <br />
                {`* @role ${authorRole}`}
                <br />
                {`* @since ${
                  profile?.createdAt ? new Date(profile.createdAt).getFullYear() : 2021
                }`}
                <br />
                {"*/"}
              </p>

              {/* Bio từ API */}
              <p className="text-gray-900 dark:text-dracula-foreground leading-relaxed mb-4">
                {profile?.bio ||
                  "I'm a passionate Backend Engineer specialized in building robust, scalable systems using Java and Spring Boot."}
              </p>

              {/* Professional Summary từ API */}
              <p className="text-gray-900 dark:text-dracula-foreground leading-relaxed">
                <>
                  {profile?.professional_summary ||
                    "I build production-ready backend systems with real-time processing, optimized database performance, and automated cloud deployments."}
                </>
              </p>
            </MagicCard>
          </div>

          {/* Cột phải: Highlights với MagicCard */}
          <div data-aos="fade-left" data-aos-duration="800" className="grid grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                data-aos-duration="600">
                <MagicCard
                  enableTilt={true}
                  enableParticles={true}
                  enableBorderGlow={true}
                  clickEffect={true}
                  enableMagnetism={true}
                  particleCount={8}
                  glowColor="249, 115, 22"
                  className="h-full bg-gray-100 dark:bg-dracula-current rounded-lg p-5  border border-gray-300 dark:border-dracula-comment cursor-pointer">
                  <item.icon className="text-orange-500 dark:text-orange-400 mb-3" size={28} />
                  <h3 className="text-gray-900 dark:text-dracula-foreground font-bold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-[#cdcfd7] text-sm">{item.description}</p>
                </MagicCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
