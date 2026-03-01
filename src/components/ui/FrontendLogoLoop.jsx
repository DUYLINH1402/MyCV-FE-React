import LogoLoop from "../LogoLoop";

// Import tất cả icons từ thư mục assets/icons
import { AntDesign } from "../../assets/icons/AntDesign";
import { CSS } from "../../assets/icons/CSS";
import { Firebase } from "../../assets/icons/Firebase";
import { HTML5 } from "../../assets/icons/HTML5";
import { JavaScript } from "../../assets/icons/JavaScript";
import { React } from "../../assets/icons/React";
import { Redux } from "../../assets/icons/Redux";
import { Sass } from "../../assets/icons/Sass";
import { SocketIO } from "../../assets/icons/SocketIO";
import { TailwindCSS } from "../../assets/icons/TailwindCSS";
import { Vite } from "../../assets/icons/Vite";

// ========================================
// COMPONENT: FrontendLogoLoop
// Hiển thị các icons Frontend Technologies chạy vô hạn
// Sử dụng LogoLoop component từ reactbits
// Hỗ trợ cả 2 chế độ sáng/tối
// ========================================

// Kích thước icon (px)
const ICON_SIZE = 40;

// ========================================
// COMPONENT: IconWithTooltip
// Wrapper component hiển thị tooltip khi hover
// Tooltip xuất hiện mượt mà phía trên icon
// ========================================
const IconWithTooltip = ({ icon, label }) => {
  return (
    <div className="relative group/tooltip flex items-center justify-center">
      {/* Icon */}
      <div className="transition-transform duration-300 ease-out group-hover/tooltip:scale-110">
        {icon}
      </div>

      {/* Tooltip - hiển thị khi hover */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                    pointer-events-none opacity-0 group-hover/tooltip:opacity-100
                    transition-all duration-300 ease-out
                    group-hover/tooltip:-translate-y-1
                    z-50">
        {/* Tooltip content */}
        <div
          className="relative px-3 py-1.5 rounded-lg whitespace-nowrap
                      bg-gray-800 dark:bg-dracula-current
                      text-white dark:text-dracula-foreground
                      text-xs font-mono font-medium
                      shadow-lg shadow-black/20 dark:shadow-black/40
                      border border-gray-700 dark:border-dracula-comment/30">
          {label}

          {/* Arrow pointing down */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px
                        border-4 border-transparent border-t-gray-800 dark:border-t-dracula-current"
          />
        </div>
      </div>
    </div>
  );
};

// Danh sách các Frontend technologies với icons và thông tin
const FRONTEND_LOGOS = [
  {
    node: <HTML5 width={ICON_SIZE} height={ICON_SIZE} />,
    title: "HTML5",
  },
  {
    node: <CSS width={ICON_SIZE} height={ICON_SIZE} />,
    title: "CSS3",
  },
  {
    node: <JavaScript width={ICON_SIZE} height={ICON_SIZE} />,
    title: "JavaScript",
  },
  {
    node: <React width={ICON_SIZE} height={ICON_SIZE} />,
    title: "React",
  },
  {
    node: <Redux width={ICON_SIZE} height={ICON_SIZE} />,
    title: "Redux",
  },
  {
    node: <TailwindCSS width={ICON_SIZE} height={ICON_SIZE} />,
    title: "Tailwind CSS",
  },
  {
    node: <Sass width={ICON_SIZE} height={ICON_SIZE} />,
    title: "Sass",
  },
  {
    node: <Vite width={ICON_SIZE} height={ICON_SIZE} />,
    title: "Vite",
  },
  {
    node: <Firebase width={ICON_SIZE} height={ICON_SIZE} />,
    title: "Firebase",
  },
  {
    // SocketIO sử dụng currentColor, cần wrapper với màu phù hợp
    node: (
      <span className="text-gray-700 dark:text-gray-300">
        <SocketIO width={ICON_SIZE} height={ICON_SIZE} />
      </span>
    ),
    title: "Socket.IO",
  },
  {
    node: <AntDesign width={ICON_SIZE} height={ICON_SIZE} />,
    title: "Ant Design",
  },
];

// Custom render function cho LogoLoop
// Wrap mỗi icon với IconWithTooltip component
const renderLogoWithTooltip = (item) => {
  return <IconWithTooltip icon={item.node} label={item.title} />;
};

const FrontendLogoLoop = () => {
  return (
    <div data-aos="fade-up" data-aos-duration="800" className="mt-16">
      {/* Tiêu đề phần Frontend */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {/* Đường kẻ trái */}
        <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-cyan-500/50 dark:to-cyan-400/50" />

        {/* Label */}
        <span className="text-sm font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
          Frontend Exposure
        </span>

        {/* Đường kẻ phải */}
        <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-cyan-500/50 dark:to-cyan-400/50" />
      </div>

      {/* Container cho LogoLoop với border và background phù hợp 2 chế độ */}
      <div
        className="relative rounded-2xl overflow-visible
                    border border-gray-200 dark:border-dracula-current/30
                    bg-gray-50/50 dark:bg-dracula-current/20
                    py-8">
        {/* LogoLoop hiển thị các icons */}
        <LogoLoop
          logos={FRONTEND_LOGOS}
          speed={50}
          direction="left"
          logoHeight={40}
          gap={56}
          pauseOnHover={true}
          scaleOnHover={false}
          fadeOut={true}
          ariaLabel="Frontend technology icons"
          className="py-2 overflow-visible"
          renderItem={renderLogoWithTooltip}
        />
      </div>
    </div>
  );
};

export default FrontendLogoLoop;
