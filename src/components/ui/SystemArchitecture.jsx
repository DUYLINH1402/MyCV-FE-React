import React, { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Globe,
  Shield,
  Server,
  Database,
  HardDrive,
  Layers,
  MessageSquare,
  Cpu,
  ArrowRight,
} from "lucide-react";

// ========================================
// CUSTOM NODE COMPONENTS - Tạo các node tùy chỉnh với icon và style Dracula
// ========================================

// Node cho Client/Browser
const ClientNode = ({ data }) => (
  <div className="relative px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 dark:from-dracula-purple/20 to-pink-500/20 dark:to-dracula-pink/20 border border-purple-500 dark:border-dracula-purple shadow-lg shadow-purple-500/20 dark:shadow-dracula-purple/20 min-w-[180px]">
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-purple-500 dark:!bg-dracula-purple !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-purple-500/30 dark:bg-dracula-purple/30">
        <Globe size={20} className="text-purple-600 dark:text-dracula-purple" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-sm">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-dracula-comment text-xs">{data.sublabel}</p>
      </div>
    </div>
    {/* Hiệu ứng pulse */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 dark:bg-dracula-green rounded-full"
    />
  </div>
);

// Node cho API Gateway
const GatewayNode = ({ data }) => (
  <div className="relative px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500/20 dark:from-dracula-orange/20 to-amber-500/20 dark:to-dracula-yellow/20 border border-orange-500 dark:border-dracula-orange shadow-lg shadow-orange-500/20 dark:shadow-dracula-orange/20 min-w-[200px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-orange-500 dark:!bg-dracula-orange !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-orange-500 dark:!bg-dracula-orange !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Left}
      id="left"
      className="!bg-orange-500 dark:!bg-dracula-orange !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="!bg-orange-500 dark:!bg-dracula-orange !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-orange-500/30 dark:bg-dracula-orange/30">
        <Layers size={20} className="text-orange-500 dark:text-dracula-orange" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-sm">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-dracula-comment text-xs">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho Security/Auth
const SecurityNode = ({ data }) => (
  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-red-500/20 dark:from-dracula-red/20 to-pink-500/20 dark:to-dracula-pink/20 border border-red-500 dark:border-dracula-red shadow-lg shadow-red-500/20 dark:shadow-dracula-red/20 min-w-[180px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-red-500 dark:!bg-dracula-red !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-red-500 dark:!bg-dracula-red !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-red-500/30 dark:bg-dracula-red/30">
        <Shield size={20} className="text-red-500 dark:text-dracula-red" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-sm">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-dracula-comment text-xs">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho Service/Controller
const ServiceNode = ({ data }) => (
  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-green-500/20 dark:from-dracula-green/20 to-cyan-500/20 dark:to-dracula-cyan/20 border border-green-500 dark:border-dracula-green shadow-lg shadow-green-500/20 dark:shadow-dracula-green/20 min-w-[200px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-green-500 dark:!bg-dracula-green !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-green-500 dark:!bg-dracula-green !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Left}
      id="left"
      className="!bg-green-500 dark:!bg-dracula-green !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="!bg-green-500 dark:!bg-dracula-green !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-green-500/30 dark:bg-dracula-green/30">
        <Server size={20} className="text-green-500 dark:text-dracula-green" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-sm">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-dracula-comment text-xs">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho Cache (Redis)
const CacheNode = ({ data }) => (
  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500/20 dark:from-dracula-cyan/20 to-purple-500/20 dark:to-dracula-purple/20 border border-cyan-500 dark:border-dracula-cyan shadow-lg shadow-cyan-500/20 dark:shadow-dracula-cyan/20 min-w-[160px]">
    <Handle
      type="target"
      position={Position.Left}
      className="!bg-cyan-500 dark:!bg-dracula-cyan !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Left}
      id="out"
      className="!bg-cyan-500 dark:!bg-dracula-cyan !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-cyan-500/30 dark:bg-dracula-cyan/30">
        <Cpu size={20} className="text-cyan-500 dark:text-dracula-cyan" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-sm">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-dracula-comment text-xs">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho Database
const DatabaseNode = ({ data }) => (
  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500/20 dark:from-dracula-yellow/20 to-orange-500/20 dark:to-dracula-orange/20 border border-amber-500 dark:border-dracula-yellow shadow-lg shadow-amber-500/20 dark:shadow-dracula-yellow/20 min-w-[180px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-amber-500 dark:!bg-dracula-yellow !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-amber-500/30 dark:bg-dracula-yellow/30">
        <Database size={20} className="text-amber-500 dark:text-dracula-yellow" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-sm">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-dracula-comment text-xs">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho Message Queue
const QueueNode = ({ data }) => (
  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500/20 dark:from-dracula-pink/20 to-purple-500/20 dark:to-dracula-purple/20 border border-pink-500 dark:border-dracula-pink shadow-lg shadow-pink-500/20 dark:shadow-dracula-pink/20 min-w-[160px]">
    <Handle
      type="target"
      position={Position.Right}
      className="!bg-pink-500 dark:!bg-dracula-pink !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="out"
      className="!bg-pink-500 dark:!bg-dracula-pink !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-pink-500/30 dark:bg-dracula-pink/30">
        <MessageSquare size={20} className="text-pink-500 dark:text-dracula-pink" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-sm">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-dracula-comment text-xs">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// ========================================
// NODES & EDGES CONFIGURATION
// ========================================

const initialNodes = [
  // Layer 1: Client
  {
    id: "client",
    type: "clientNode",
    position: { x: 300, y: 0 },
    data: { label: "Client", sublabel: "Browser / Mobile App" },
  },
  // Layer 2: API Gateway
  {
    id: "gateway",
    type: "gatewayNode",
    position: { x: 280, y: 120 },
    data: { label: "API Gateway", sublabel: "Spring Cloud Gateway" },
  },
  // Layer 3: Security & Services
  {
    id: "security",
    type: "securityNode",
    position: { x: 0, y: 250 },
    data: { label: "Auth Service", sublabel: "Spring Security + JWT" },
  },
  {
    id: "controller",
    type: "serviceNode",
    position: { x: 270, y: 250 },
    data: { label: "REST Controller", sublabel: "@RestController" },
  },
  // Layer 4: Business Logic
  {
    id: "service",
    type: "serviceNode",
    position: { x: 270, y: 380 },
    data: { label: "Service Layer", sublabel: "@Service + @Transactional" },
  },
  // Layer 5: Cache & Queue
  {
    id: "cache",
    type: "cacheNode",
    position: { x: 570, y: 320 },
    data: { label: "Redis Cache", sublabel: "@Cacheable" },
  },
  {
    id: "queue",
    type: "queueNode",
    position: { x: 20, y: 400 },
    data: { label: "Message Queue", sublabel: "RabbitMQ / Kafka" },
  },
  // Layer 6: Data Layer
  {
    id: "repository",
    type: "serviceNode",
    position: { x: 270, y: 510 },
    data: { label: "Repository", sublabel: "Spring Data JPA" },
  },
  // Layer 7: Database
  {
    id: "database",
    type: "databaseNode",
    position: { x: 290, y: 640 },
    data: { label: "PostgreSQL", sublabel: "Primary Database" },
  },
];

const initialEdges = [
  // Client -> Gateway
  {
    id: "e-client-gateway",
    source: "client",
    target: "gateway",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#bd93f9", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#bd93f9" },
  },
  // Gateway -> Security
  {
    id: "e-gateway-security",
    source: "gateway",
    target: "security",
    sourceHandle: "left",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#ff5555", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#ff5555" },
  },
  // Security -> Controller (qua Gateway)
  {
    id: "e-security-controller",
    source: "security",
    target: "controller",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#50fa7b", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#50fa7b" },
  },
  // Gateway -> Controller
  {
    id: "e-gateway-controller",
    source: "gateway",
    target: "controller",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#ffb86c", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#ffb86c" },
  },
  // Controller -> Service
  {
    id: "e-controller-service",
    source: "controller",
    target: "service",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#50fa7b", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#50fa7b" },
  },
  // Service -> Cache
  {
    id: "e-service-cache",
    source: "service",
    target: "cache",
    sourceHandle: "right",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#8be9fd", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8be9fd" },
  },
  // Service -> Queue
  {
    id: "e-service-queue",
    source: "service",
    target: "queue",
    sourceHandle: "left",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#ff79c6", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#ff79c6" },
  },
  // Service -> Repository
  {
    id: "e-service-repository",
    source: "service",
    target: "repository",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#50fa7b", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#50fa7b" },
  },
  // Repository -> Database
  {
    id: "e-repository-database",
    source: "repository",
    target: "database",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#f1fa8c", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f1fa8c" },
  },
];

// ========================================
// MAIN COMPONENT
// ========================================
function SystemArchitecture() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Ref cho container để theo dõi scroll position
  const containerRef = useRef(null);

  // Theo dõi scroll progress của element trong viewport
  // offset: ["start end", "end start"] nghĩa là:
  // - Bắt đầu khi top của element chạm bottom của viewport
  // - Kết thúc khi bottom của element chạm top của viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Cấu hình spring - chậm và mượt
  const springConfig = {
    stiffness: 30, // Giảm xuống để chậm hơn nữa
    damping: 50, // Tăng để mượt hơn
    restDelta: 0.001,
  };

  // Chỉ giữ lại hiệu ứng opacity - rõ dần khi scroll xuống, mờ dần khi scroll lên
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0.1, 0.4, 0.8, 1]),
    springConfig
  );

  // Đăng ký các custom node types
  const nodeTypes = useMemo(
    () => ({
      clientNode: ClientNode,
      gatewayNode: GatewayNode,
      securityNode: SecurityNode,
      serviceNode: ServiceNode,
      cacheNode: CacheNode,
      databaseNode: DatabaseNode,
      queueNode: QueueNode,
    }),
    []
  );

  return (
    <motion.div ref={containerRef} style={{ opacity }} className="w-full">
      {/* React Flow Container */}
      <div className="h-[1000px] w-full rounded-xl overflow-hidden ">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, includeHiddenNodes: true }}
          minZoom={0.5}
          maxZoom={1.5}
          zoomOnScroll={false} // Tắt lăn chuột để zoom
          zoomOnPinch={false} // Tắt zoom bằng trackpad
          panOnDrag={false} // Tắt kéo để di chuyển sơ đồ - fix lỗi mobile không scroll được
          panOnScroll={false} // Tắt pan khi scroll
          // nodesDraggable={false} // Tắt kéo các node
          preventScrolling={false} // Cho phép trang web cuộn mượt mà qua section này
          defaultViewport={{ x: 0, y: 0, zoom: 5 }}>
          {/* Style ghi đè để ẩn logo React Flow */}
          <style>
            {`
            .react-flow__attribution {
          display: none !important;
           }
          `}
          </style>
          {/* Controls với style tối */}
          <Controls
            style={{
              border: "1px solid #44475a",
              borderRadius: "8px",
            }}
          />
          {/* Background với pattern */}
          {/* <Background color="#44475a" gap={20} size={1} /> */}
        </ReactFlow>
      </div>
    </motion.div>
  );
}

export default SystemArchitecture;
