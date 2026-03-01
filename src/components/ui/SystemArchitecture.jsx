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
  Cpu,
  Radio,
  Search,
  CreditCard,
  Container,
  Cloud,
  Bot,
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

// Node cho ZaloPay Payment Gateway
const PaymentNode = ({ data }) => (
  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500/20 dark:from-blue-400/20 to-cyan-500/20 dark:to-dracula-cyan/20 border border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 dark:shadow-blue-400/20 min-w-[160px]">
    <Handle
      type="target"
      position={Position.Right}
      className="!bg-blue-500 dark:!bg-blue-400 !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-blue-500/30 dark:bg-blue-400/30">
        <CreditCard size={20} className="text-blue-500 dark:text-blue-400" />
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

// Node cho AWS S3 Storage
const StorageNode = ({ data }) => (
  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500/20 dark:from-orange-400/20 to-amber-500/20 dark:to-amber-400/20 border border-orange-500 dark:border-orange-400 shadow-lg shadow-orange-500/20 dark:shadow-orange-400/20 min-w-[160px]">
    <Handle
      type="target"
      position={Position.Right}
      className="!bg-orange-500 dark:!bg-orange-400 !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-orange-500/30 dark:bg-orange-400/30">
        <Cloud size={20} className="text-orange-500 dark:text-orange-400" />
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

// Node cho OpenAI Chatbot
const AINode = ({ data }) => (
  <div className="relative px-4 py-3 rounded-lg bg-gradient-to-r from-violet-500/20 dark:from-violet-400/20 to-fuchsia-500/20 dark:to-fuchsia-400/20 border border-violet-500 dark:border-violet-400 shadow-lg shadow-violet-500/20 dark:shadow-violet-400/20 min-w-[160px]">
    <Handle
      type="target"
      position={Position.Right}
      className="!bg-violet-500 dark:!bg-violet-400 !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-violet-500/30 dark:bg-violet-400/30">
        <Bot size={20} className="text-violet-500 dark:text-violet-400" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-sm">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-dracula-comment text-xs">{data.sublabel}</p>
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

// Node cho Algolia Search Service
const SearchServiceNode = ({ data }) => (
  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500/20 dark:from-indigo-400/20 to-purple-500/20 dark:to-dracula-purple/20 border border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-400/20 min-w-[160px]">
    <Handle
      type="target"
      position={Position.Left}
      className="!bg-indigo-500 dark:!bg-indigo-400 !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-indigo-500/30 dark:bg-indigo-400/30">
        <Search size={20} className="text-indigo-500 dark:text-indigo-400" />
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

// Node cho WebSocket Real-time
const WebSocketNode = ({ data }) => (
  <div className="relative px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500/20 dark:from-emerald-400/20 to-teal-500/20 dark:to-teal-400/20 border border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-400/20 min-w-[180px]">
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-emerald-500 dark:!bg-emerald-400 !w-3 !h-3"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!bg-emerald-500 dark:!bg-emerald-400 !w-3 !h-3"
    />
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-emerald-500/30 dark:bg-emerald-400/30">
        <Radio size={20} className="text-emerald-500 dark:text-emerald-400" />
      </div>
      <div>
        <p className="text-gray-900 dark:text-dracula-foreground font-semibold text-sm">
          {data.label}
        </p>
        <p className="text-gray-500 dark:text-dracula-comment text-xs">{data.sublabel}</p>
      </div>
    </div>
    {/* Hiệu ứng pulse cho real-time */}
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full"
    />
  </div>
);

// Node cho Docker Container - Khung bao quanh toàn bộ backend services
const DockerNode = ({ data }) => (
  <div
    className="relative rounded-xl border-2 border-dashed border-sky-500/60 dark:border-sky-400/60 bg-sky-500/5 dark:bg-sky-400/5"
    style={{ width: data.width || 780, height: data.height || 660 }}>
    {/* Label ở góc trên bên trái */}
    <div className="absolute top-2 left-1 flex items-center gap-2 px-3 py-1 rounded-md bg-sky-500/20 dark:bg-sky-400/20 border border-sky-500/40 dark:border-sky-400/40">
      <Container size={16} className="text-sky-500 dark:text-sky-400" />
      <span className="text-sky-600 dark:text-sky-400 font-semibold text-xs">{data.label}</span>
      <span className="text-sky-500/70 dark:text-sky-400/70 text-xs">{data.sublabel}</span>
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
// NODES & EDGES CONFIGURATION
// ========================================

const initialNodes = [
  // Docker Container - Khung bao quanh toàn bộ backend services (đặt đầu tiên để render phía sau)
  {
    id: "docker",
    type: "dockerNode",
    position: { x: 90, y: 55 },
    zIndex: -1,
    data: {
      label: "Docker Container",
      width: 640,
      height: 620,
    },
  },
  // Layer 1: Client (nằm NGOÀI Docker - đây là browser/mobile)
  {
    id: "client",
    type: "clientNode",
    position: { x: 300, y: -80 },
    data: { label: "Client", sublabel: "Browser / Mobile App" },
  },
  // Layer 2: API Gateway + WebSocket (trong Docker)
  {
    id: "gateway",
    type: "gatewayNode",
    position: { x: 280, y: 80 },
    data: { label: "API Gateway", sublabel: "Spring Cloud Gateway" },
  },
  {
    id: "websocket",
    type: "webSocketNode",
    position: { x: 540, y: 80 },
    data: { label: "WebSocket", sublabel: "STOMP + SockJS" },
  },
  // Layer 3: Security & Services (trong Docker)
  {
    id: "security",
    type: "securityNode",
    position: { x: 140, y: 210 },
    data: { label: "Auth Service", sublabel: "Spring Security + JWT" },
  },
  {
    id: "controller",
    type: "serviceNode",
    position: { x: 400, y: 210 },
    data: { label: "REST Controller", sublabel: "@RestController" },
  },
  // Layer 4: Business Logic (trong Docker)
  {
    id: "service",
    type: "serviceNode",
    position: { x: 300, y: 340 },
    data: { label: "Service Layer", sublabel: "@Service + @Transactional" },
  },
  // Layer 5: Redis Cache (trong Docker)
  {
    id: "cache",
    type: "cacheNode",
    position: { x: 540, y: 445 },
    data: { label: "Redis Cache", sublabel: "@Cacheable" },
  },
  // Layer 6: Data Layer (trong Docker)
  {
    id: "repository",
    type: "serviceNode",
    position: { x: 300, y: 470 },
    data: { label: "Repository", sublabel: "Spring Data JPA" },
  },
  // Layer 7: Database (trong Docker)
  {
    id: "database",
    type: "databaseNode",
    position: { x: 320, y: 590 },
    data: { label: "MySQL", sublabel: "Primary Database" },
  },
  // ========================================
  // EXTERNAL CLOUD SERVICES (nằm NGOÀI Docker)
  // ========================================
  {
    id: "zalopay",
    type: "paymentNode",
    position: { x: -120, y: 240 },
    data: { label: "ZaloPay", sublabel: "Payment Gateway" },
  },
  {
    id: "awsS3",
    type: "storageNode",
    position: { x: -120, y: 340 },
    data: { label: "AWS S3", sublabel: "Image Storage" },
  },
  {
    id: "openai",
    type: "aiNode",
    position: { x: -120, y: 440 },
    data: { label: "OpenAI", sublabel: "AI Chatbot" },
  },
  {
    id: "algolia",
    type: "searchServiceNode",
    position: { x: 765, y: 340 },
    data: { label: "Algolia", sublabel: "Full-text Search" },
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
  // Client -> WebSocket (Real-time connection)
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
  // Service -> ZaloPay (Payment)
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
  // Service -> AWS S3 (Storage)
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
  // Service -> OpenAI (Chatbot)
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
  // Service -> Algolia (Search)
  {
    id: "e-service-algolia",
    source: "service",
    target: "algolia",
    sourceHandle: "right",
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
      {/* React Flow Container */}
      <div className="h-[1100px] w-full rounded-xl overflow-hidden ">
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
