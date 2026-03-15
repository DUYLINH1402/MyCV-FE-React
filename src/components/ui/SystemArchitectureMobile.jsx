import React, { useMemo, useRef } from "react";
import ReactFlow, {
  Controls,
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
  Layers,
  Cpu,
  Radio,
  Search,
  CreditCard,
  Container,
  Cloud,
  Bot,
} from "lucide-react";

// ========================================
// CUSTOM NODE COMPONENTS - Phiên bản Mobile (nhỏ gọn hơn)
// ========================================

// Node cho Client/Browser
const ClientNode = ({ data }) => (
  <div className="relative px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 dark:from-dracula-purple/20 to-pink-500/20 dark:to-dracula-pink/20 border border-purple-500 dark:border-dracula-purple shadow-lg shadow-purple-500/20 dark:shadow-dracula-purple/20 min-w-[120px]">
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-purple-500 dark:!bg-dracula-purple !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-purple-500/30 dark:bg-dracula-purple/30">
        <Globe size={16} className="text-purple-600 dark:text-dracula-purple" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
    {/* Hiệu ứng pulse */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 dark:bg-dracula-green rounded-full"
    />
  </div>
);

// Node cho API Gateway
const GatewayNode = ({ data }) => (
  <div className="relative px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500/20 dark:from-dracula-orange/20 to-amber-500/20 dark:to-dracula-yellow/20 border border-orange-500 dark:border-dracula-orange shadow-lg shadow-orange-500/20 dark:shadow-dracula-orange/20 min-w-[130px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-orange-500 dark:!bg-dracula-orange !w-2.5 !h-2.5"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-orange-500 dark:!bg-dracula-orange !w-2.5 !h-2.5"
    />
    <Handle
      type="source"
      position={Position.Left}
      id="left"
      className="!bg-orange-500 dark:!bg-dracula-orange !w-2.5 !h-2.5"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="!bg-orange-500 dark:!bg-dracula-orange !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-orange-500/30 dark:bg-dracula-orange/30">
        <Layers size={16} className="text-orange-500 dark:text-dracula-orange" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho Security/Auth
const SecurityNode = ({ data }) => (
  <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500/20 dark:from-dracula-red/20 to-pink-500/20 dark:to-dracula-pink/20 border border-red-500 dark:border-dracula-red shadow-lg shadow-red-500/20 dark:shadow-dracula-red/20 min-w-[120px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-red-500 dark:!bg-dracula-red !w-2.5 !h-2.5"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-red-500 dark:!bg-dracula-red !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-red-500/30 dark:bg-dracula-red/30">
        <Shield size={16} className="text-red-500 dark:text-dracula-red" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho Service/Controller
const ServiceNode = ({ data }) => (
  <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-500/20 dark:from-dracula-green/20 to-cyan-500/20 dark:to-dracula-cyan/20 border border-green-500 dark:border-dracula-green shadow-lg shadow-green-500/20 dark:shadow-dracula-green/20 min-w-[120px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-green-500 dark:!bg-dracula-green !w-2.5 !h-2.5"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-green-500 dark:!bg-dracula-green !w-2.5 !h-2.5"
    />
    <Handle
      type="source"
      position={Position.Left}
      id="left"
      className="!bg-green-500 dark:!bg-dracula-green !w-2.5 !h-2.5"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="!bg-green-500 dark:!bg-dracula-green !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-green-500/30 dark:bg-dracula-green/30">
        <Server size={16} className="text-green-500 dark:text-dracula-green" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho Cache (Redis) - Mobile: Handle ở Top thay vì Left
const CacheNode = ({ data }) => (
  <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 dark:from-dracula-cyan/20 to-purple-500/20 dark:to-dracula-purple/20 border border-cyan-500 dark:border-dracula-cyan shadow-lg shadow-cyan-500/20 dark:shadow-dracula-cyan/20 min-w-[100px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-cyan-500 dark:!bg-dracula-cyan !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-cyan-500/30 dark:bg-dracula-cyan/30">
        <Cpu size={16} className="text-cyan-500 dark:text-dracula-cyan" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho Database
const DatabaseNode = ({ data }) => (
  <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 dark:from-dracula-yellow/20 to-orange-500/20 dark:to-dracula-orange/20 border border-amber-500 dark:border-dracula-yellow shadow-lg shadow-amber-500/20 dark:shadow-dracula-yellow/20 min-w-[110px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-amber-500 dark:!bg-dracula-yellow !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-amber-500/30 dark:bg-dracula-yellow/30">
        <Database size={16} className="text-amber-500 dark:text-dracula-yellow" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho ZaloPay Payment Gateway
const PaymentNode = ({ data }) => (
  <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 dark:from-blue-400/20 to-cyan-500/20 dark:to-dracula-cyan/20 border border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 dark:shadow-blue-400/20 min-w-[100px]">
    <Handle
      type="target"
      position={Position.Right}
      className="!bg-blue-500 dark:!bg-blue-400 !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-blue-500/30 dark:bg-blue-400/30">
        <CreditCard size={16} className="text-blue-500 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho AWS S3 Storage
const StorageNode = ({ data }) => (
  <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500/20 dark:from-orange-400/20 to-amber-500/20 dark:to-amber-400/20 border border-orange-500 dark:border-orange-400 shadow-lg shadow-orange-500/20 dark:shadow-orange-400/20 min-w-[100px]">
    <Handle
      type="target"
      position={Position.Right}
      className="!bg-orange-500 dark:!bg-orange-400 !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-orange-500/30 dark:bg-orange-400/30">
        <Cloud size={16} className="text-orange-500 dark:text-orange-400" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho OpenAI Chatbot
const AINode = ({ data }) => (
  <div className="relative px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500/20 dark:from-violet-400/20 to-fuchsia-500/20 dark:to-fuchsia-400/20 border border-violet-500 dark:border-violet-400 shadow-lg shadow-violet-500/20 dark:shadow-violet-400/20 min-w-[100px]">
    <Handle
      type="target"
      position={Position.Right}
      className="!bg-violet-500 dark:!bg-violet-400 !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-violet-500/30 dark:bg-violet-400/30">
        <Bot size={16} className="text-violet-500 dark:text-violet-400" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
    {/* Hiệu ứng AI đang hoạt động */}
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 dark:bg-violet-400 rounded-full"
    />
  </div>
);

// Node cho Algolia Search Service - Mobile: Handle ở Right (các service ngoài đều nằm bên trái)
const SearchServiceNode = ({ data }) => (
  <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500/20 dark:from-indigo-400/20 to-purple-500/20 dark:to-dracula-purple/20 border border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-400/20 min-w-[100px]">
    <Handle
      type="target"
      position={Position.Right}
      className="!bg-indigo-500 dark:!bg-indigo-400 !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-indigo-500/30 dark:bg-indigo-400/30">
        <Search size={16} className="text-indigo-500 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
  </div>
);

// Node cho WebSocket Real-time
const WebSocketNode = ({ data }) => (
  <div className="relative px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 dark:from-emerald-400/20 to-teal-500/20 dark:to-teal-400/20 border border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-400/20 min-w-[110px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-emerald-500 dark:!bg-emerald-400 !w-2.5 !h-2.5"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-emerald-500 dark:!bg-emerald-400 !w-2.5 !h-2.5"
    />
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-emerald-500/30 dark:bg-emerald-400/30">
        <Radio size={16} className="text-emerald-500 dark:text-emerald-400" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-base">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-[#bcd053] text-base">{data.sublabel}</p>
      </div>
    </div>
    {/* Hiệu ứng pulse cho real-time */}
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"
    />
  </div>
);

// Node cho Docker Container - Khung bao quanh toàn bộ backend services
const DockerNode = ({ data }) => (
  <div
    className="relative rounded-xl border-2 border-dashed border-sky-500/60 dark:border-sky-400/60 bg-sky-500/5 dark:bg-sky-400/5"
    style={{ width: data.width || 390, height: data.height || 740 }}>
    {/* Label ở góc trên bên trái */}
    <div className="absolute -top-8 left-1 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-500/20 dark:bg-sky-400/20 border border-sky-500/40 dark:border-sky-400/40">
      <Container size={12} className="text-sky-500 dark:text-sky-400" />
      <span className="text-sky-600 dark:text-sky-400 font-semibold text-base">{data.label}</span>
    </div>
    {/* Hiệu ứng nhấp nháy nhẹ ở góc */}
    <motion.div
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute top-2 right-2 w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full"
    />
  </div>
);

// ========================================
// NODES & EDGES CONFIGURATION - Bố cục Mobile
// Tất cả external services nằm bên TRÁI, Docker + internal services bên PHẢI
// Giảm chiều ngang tổng thể để fitView scale lớn hơn trên mobile
// ========================================

const initialNodes = [
  // Docker Container - mở rộng hơn, dãn dọc cho thoáng
  {
    id: "docker",
    type: "dockerNode",
    position: { x: 130, y: 60 },
    zIndex: -1,
    data: {
      label: "Docker Container",
      width: 450,
      height: 740,
    },
  },
  // Client (nằm NGOÀI Docker - phía trên, căn giữa)
  {
    id: "client",
    type: "clientNode",
    position: { x: 235, y: -75 },
    data: { label: "Client", sublabel: "Browser / Mobile" },
  },
  // Layer 2: API Gateway + WebSocket (trong Docker - dãn ngang)
  {
    id: "gateway",
    type: "gatewayNode",
    position: { x: 170, y: 95 },
    data: { label: "API Gateway", sublabel: "Spring Cloud" },
  },
  {
    id: "websocket",
    type: "webSocketNode",
    position: { x: 370, y: 95 },
    data: { label: "WebSocket", sublabel: "STOMP" },
  },
  // Layer 3: Security & Controller (tăng khoảng cách Y)
  {
    id: "security",
    type: "securityNode",
    position: { x: 155, y: 240 },
    data: { label: "Auth Service", sublabel: "JWT" },
  },
  {
    id: "controller",
    type: "serviceNode",
    position: { x: 355, y: 240 },
    data: { label: "Controller", sublabel: "@RestController" },
  },
  // Layer 4: Service Layer (căn giữa Docker, dãn xuống)
  {
    id: "service",
    type: "serviceNode",
    position: { x: 245, y: 400 },
    data: { label: "Service", sublabel: "@Service" },
  },
  // Layer 5: Cache (trong Docker - bên phải, dãn ra)
  {
    id: "cache",
    type: "cacheNode",
    position: { x: 370, y: 500 },
    data: { label: "Redis", sublabel: "@Cacheable" },
  },
  // Layer 6: Repository (dãn xuống thêm)
  {
    id: "repository",
    type: "serviceNode",
    position: { x: 225, y: 570 },
    data: { label: "Repository", sublabel: "JPA" },
  },
  // Layer 7: Database (cuối Docker)
  {
    id: "database",
    type: "databaseNode",
    position: { x: 250, y: 720 },
    data: { label: "MySQL", sublabel: "Primary DB" },
  },
  // ========================================
  // EXTERNAL SERVICES - Xếp dọc bên TRÁI Docker, dãn đều
  // ========================================
  {
    id: "zalopay",
    type: "paymentNode",
    position: { x: -35, y: 280 },
    data: { label: "ZaloPay", sublabel: "Payment" },
  },
  {
    id: "awsS3",
    type: "storageNode",
    position: { x: -35, y: 400 },
    data: { label: "AWS S3", sublabel: "Storage" },
  },
  {
    id: "openai",
    type: "aiNode",
    position: { x: -35, y: 520 },
    data: { label: "OpenAI", sublabel: "Chatbot" },
  },
  {
    id: "algolia",
    type: "searchServiceNode",
    position: { x: -35, y: 640 },
    data: { label: "Algolia", sublabel: "Search" },
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
  // Client -> WebSocket
  {
    id: "e-client-websocket",
    source: "client",
    target: "websocket",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#10b981", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
  },
  // WebSocket -> Controller
  {
    id: "e-websocket-controller",
    source: "websocket",
    target: "controller",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#10b981", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
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
  // Security -> Controller
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
  // Service -> Cache (mobile: dùng default bottom→top thay vì right→left)
  {
    id: "e-service-cache",
    source: "service",
    target: "cache",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#8be9fd", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8be9fd" },
  },
  // Service -> ZaloPay
  {
    id: "e-service-zalopay",
    source: "service",
    target: "zalopay",
    sourceHandle: "left",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#3b82f6", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
  },
  // Service -> AWS S3
  {
    id: "e-service-s3",
    source: "service",
    target: "awsS3",
    sourceHandle: "left",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#f97316", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f97316" },
  },
  // Service -> OpenAI
  {
    id: "e-service-openai",
    source: "service",
    target: "openai",
    sourceHandle: "left",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
  },
  // Service -> Algolia (mobile: sourceHandle="left" vì Algolia nằm bên trái)
  {
    id: "e-service-algolia",
    source: "service",
    target: "algolia",
    sourceHandle: "left",
    animated: true,
    label: " ",
    labelStyle: { fill: "#f8f8f2", fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: "#282a36", fillOpacity: 0.8 },
    style: { stroke: "#6366f1", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
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
// MAIN COMPONENT - Phiên bản Mobile
// ========================================
function SystemArchitectureMobile() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Ref cho container để theo dõi scroll position
  const containerRef = useRef(null);

  // Theo dõi scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Cấu hình spring mượt
  const springConfig = {
    stiffness: 30,
    damping: 50,
    restDelta: 0.001,
  };

  // Hiệu ứng opacity theo scroll
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
      paymentNode: PaymentNode,
      searchServiceNode: SearchServiceNode,
      webSocketNode: WebSocketNode,
      dockerNode: DockerNode,
      storageNode: StorageNode,
      aiNode: AINode,
    }),
    []
  );

  return (
    <motion.div ref={containerRef} style={{ opacity }} className="w-full">
      {/* React Flow Container - chiều cao phù hợp mobile */}
      <div className="system-arch-mobile h-[650px] w-full rounded-xl overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15, includeHiddenNodes: true }}
          minZoom={0.3}
          maxZoom={1.5}
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnDrag={false}
          panOnScroll={false}
          preventScrolling={false}
          defaultViewport={{ x: 0, y: 0, zoom: 5 }}>
          {/* Ẩn logo React Flow + Dịch diagram lên trên (chỉ áp dụng cho component này) */}
          <style>
            {`
            .system-arch-mobile .react-flow__attribution {
              display: none !important;
            }
            .system-arch-mobile .react-flow__pane {
              top: -35px !important;
            }
            `}
          </style>
          {/* Controls nhỏ gọn */}
          <Controls
            showInteractive={false}
            position="top-left"
            style={{
              border: "1px solid #44475a",
              borderRadius: "8px",
            }}
          />
        </ReactFlow>
      </div>
    </motion.div>
  );
}

export default SystemArchitectureMobile;
