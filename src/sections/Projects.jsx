import { useState, useEffect } from "react";
import { Github, Loader2, AlertCircle, Code2 } from "lucide-react";
import { SectionTitle, Button, DatabaseSchema, FeaturedProjectCard, Spinner } from "../components";
import { getProjects } from "../services";

// ========================================
// SECTION: Projects - Hiển thị các dự án đã thực hiện
// Layout Zig-Zag (Featured Layout) cho các dự án tâm đắc nhất
// Chi tiết project được mở rộng inline (không dùng Modal)
// ========================================
const Projects = () => {
  // State quản lý dữ liệu projects từ API
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects từ API khi component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        // Sắp xếp theo displayOrder
        const sortedProjects = data.sort((a, b) => a.displayOrder - b.displayOrder);
        setProjects(sortedProjects);
        setError(null);
      } catch (err) {
        console.error("[ERROR] Failed to load projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <section id="projects" className="py-20 relative z-40">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="getProjects" subtitle="Things I've built" />
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 dark:text-dracula-comment font-mono text-sm">
              [INFO] Loading projects from database...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section id="projects" className="py-20 relative z-40">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="getProjects" subtitle="Things I've built" />
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-red-500/10 rounded-full mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <p className="text-red-500 dark:text-dracula-red font-mono text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 relative z-40">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="getProjects" subtitle="Things I've built" />

        {/* Terminal-style intro */}
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="mb-12 p-4 bg-gray-900 dark:bg-dracula-current rounded-lg font-mono text-sm border border-gray-700 dark:border-dracula-comment/50">
          <div className="flex items-center gap-0 text-gray-400 mb-2">
            <Code2 size={16} className="text-orange-500 mr-2" />
            <span className="text-dracula-green">projectRepository</span>
            <span className="text-gray-500">.</span>
            <span className="text-dracula-cyan">findAllByFeatured</span>
            <span className="text-gray-500">(</span>
            <span className="text-dracula-orange">true</span>
            <span className="text-gray-500">)</span>
          </div>
          <p className="text-dracula-comment">
            // Fetched {projects.length} featured project{projects.length > 1 ? "s" : ""} from API
          </p>
        </div>

        {/* ========== Featured Projects - Layout Zig-Zag ========== */}
        {/* Chi tiết được mở rộng inline khi click "Read Case Study" */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Thông báo nếu chưa có projects */}
        {projects.length === 0 && !loading && (
          <div data-aos="fade-up" className="text-center py-20">
            <div className="p-4 bg-gray-100 dark:bg-dracula-current rounded-full inline-block mb-4">
              <Code2 size={32} className="text-gray-400 dark:text-dracula-comment" />
            </div>
            <p className="text-gray-500 dark:text-dracula-comment font-mono">
              // No projects found. Check back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
