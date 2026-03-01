import { SectionTitle } from "../components/common";
import SystemArchitecture from "../components/ui/SystemArchitecture";

// ========================================
// SECTION: Architecture
// Hiển thị sơ đồ kiến trúc hệ thống
// ========================================
const Architecture = () => {
  return (
    <section id="architecture">
      {/* Container chính */}
      <div className="max-w-full mx-auto px-1 md:px-1">
        {/* Tiêu đề Section */}
        <div data-aos="fade-up">
          <SectionTitle
            pretitle="// Kiến trúc hệ thống"
            title=".architecture"
            subtitle="FoodieExpress System (Project 1)"
          />
        </div>
        {/* System Architecture Component */}
        <div data-aos="fade-up" data-aos-delay="200">
          <SystemArchitecture />
        </div>
      </div>
    </section>
  );
};

export default Architecture;
