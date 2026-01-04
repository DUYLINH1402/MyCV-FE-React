import { motion } from "framer-motion";
import { FileCode2 } from "lucide-react";

// ========================================
// COMPONENT: IntelliJMockup - Giả lập giao diện IntelliJ IDEA
// Hiển thị code Java/Spring Boot với syntax highlighting
// ========================================
const IntelliJMockup = ({
  fileName = "DeveloperController.java",
  projectName = "backend-portfolio",
}) => {
  // Số dòng code để hiển thị line numbers
  const lineNumbers = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative rounded-lg overflow-hidden bg-white dark:bg-dracula-background border border-gray-300 dark:border-dracula-current shadow-2xl font-mono text-sm">
      {/* Thanh tiêu đề IntelliJ với traffic lights */}
      <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-dracula-current border-b border-gray-300 dark:border-dracula-comment">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-gray-900 dark:text-dracula-foreground text-xs flex items-center justify-center gap-2">
          <FileCode2 size={14} className="text-orange-500 dark:text-orange-400" />
          <span>{fileName}</span>
          <span className="text-gray-500 dark:text-dracula-comment">— {projectName}</span>
        </div>
      </div>

      {/* Nội dung code Java/Spring Boot */}
      <div className="flex">
        {/* Line numbers */}
        <div className="py-4 px-3 bg-gray-100 dark:bg-dracula-current text-gray-400 dark:text-dracula-comment text-right select-none border-r border-gray-300 dark:border-dracula-comment">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code content với syntax highlighting */}
        <div className="p-4 text-gray-900 dark:text-dracula-foreground leading-6 overflow-x-auto flex-1">
          <div>
            <span className="text-pink-600 dark:text-dracula-pink">@RestController</span>
          </div>
          <div>
            <span className="text-pink-600 dark:text-dracula-pink">@RequestMapping</span>(
            <span className="text-amber-600 dark:text-dracula-yellow">"/api/v1/developer"</span>)
          </div>
          <div>
            <span className="text-pink-600 dark:text-dracula-pink">@RequiredArgsConstructor</span>
          </div>
          <div>
            <span className="text-purple-600 dark:text-dracula-purple">public class</span>{" "}
            <span className="text-green-600 dark:text-dracula-green">DeveloperController</span>{" "}
            {"{"}
          </div>
          <div className="h-6"></div>
          <div className="pl-4">
            <span className="text-purple-600 dark:text-dracula-purple">private final</span>{" "}
            DeveloperService{" "}
            <span className="text-orange-500 dark:text-dracula-orange">developerService</span>;
          </div>
          <div className="h-6"></div>
          <div className="pl-4">
            <span className="text-pink-600 dark:text-dracula-pink">@GetMapping</span>(
            <span className="text-amber-600 dark:text-dracula-yellow">"/profile"</span>)
          </div>
          <div className="pl-4">
            <span className="text-purple-600 dark:text-dracula-purple">public</span> ResponseEntity
            {"<"}DeveloperDTO{">"}{" "}
            <span className="text-green-600 dark:text-dracula-green">getProfile</span>() {"{"}
          </div>
          <div className="pl-8">
            <span className="text-purple-600 dark:text-dracula-purple">return</span>{" "}
            ResponseEntity.ok(
          </div>
          <div className="pl-12">
            DeveloperDTO.<span className="text-green-600 dark:text-dracula-green">builder</span>()
          </div>
          <div className="pl-16">
            .name(<span className="text-amber-600 dark:text-dracula-yellow">"Nguyen Duy Linh"</span>
            )
          </div>
          <div className="pl-16">
            .role(
            <span className="text-amber-600 dark:text-dracula-yellow">"Backend Engineer"</span>)
          </div>
          <div className="pl-16">
            .skills(
            <span className="text-purple-600 dark:text-dracula-purple">List</span>.
            <span className="text-green-600 dark:text-dracula-green">of</span>(
            <span className="text-amber-600 dark:text-dracula-yellow">"Java"</span>,{" "}
            <span className="text-amber-600 dark:text-dracula-yellow">"Spring Boot"</span>,{" "}
            <span className="text-amber-600 dark:text-dracula-yellow">"Docker"</span>))
          </div>
          <div className="pl-16">.build()</div>
          <div className="pl-8">);</div>
          <div className="pl-4">{"}"}</div>
          <div>{"}"}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default IntelliJMockup;
