import { SectionTitle } from "../components/common";
import SystemArchitecture from "../components/ui/SystemArchitecture";
import { SystemArchitectureMobile } from "../components/ui";

// ========================================
// SECTION: Architecture
// Hiển thị sơ đồ kiến trúc hệ thống
// Desktop: SystemArchitecture (bố cục ngang)
// Mobile: SystemArchitectureMobile (bố cục dọc, compact)
// ========================================
const Architecture = () => {
  return (
    <section id="architecture">
      {/* Container chính */}
      <div className="max-w-full mx-auto px-1 md:px-1 ">
        {/* Tiêu đề Section */}
        <div data-aos="fade-up">
          <SectionTitle
            pretitle="// Kiến trúc hệ thống"
            title=".architecture"
            subtitle="FoodieExpress System (Project 1)"
            className="mb-1"
          />
        </div>
        {/* Desktop: Sơ đồ bản đầy đủ */}
        <div data-aos="fade-up" data-aos-delay="200" className="hidden lg:block">
          <SystemArchitecture />
        </div>
        {/* Mobile: Sơ đồ bản compact */}
        <div data-aos="fade-up" data-aos-delay="200" className="block lg:hidden">
          <SystemArchitectureMobile />
        </div>
      </div>
    </section>
  );
};

export default Architecture;
