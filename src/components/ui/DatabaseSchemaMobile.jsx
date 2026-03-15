// ========================================
// COMPONENT: DatabaseSchemaMobile
// Phiên bản Mobile của DatabaseSchema
// Layout 2 cột × 6 hàng — tối ưu cho màn hình dọc
// Copy toàn bộ cấu trúc từ DatabaseSchema, chỉ thay đổi vị trí nodes & edges
// ========================================

import { useMemo } from "react";
import ReactFlow, { useNodesState, useEdgesState, Handle, Position, Controls } from "reactflow";
import "reactflow/dist/style.css";
import {
  Database,
  Key,
  Link2,
  User,
  ShoppingCart,
  Package,
  Star,
  Ticket,
  FileText,
  Layers,
  Clock,
  Tag,
  Award,
  MessageSquare,
} from "lucide-react";

// ========================================
// CUSTOM TABLE NODE COMPONENT - Giống hệt bản Desktop
// Thiết kế theo Dracula Theme, hỗ trợ Light/Dark mode
// ========================================
const TableNode = ({ data }) => {
  const { label, columns, color, icon: IconComponent } = data;

  const colorMap = {
    yellow: {
      border: "border-amber-500 dark:border-dracula-yellow",
      bg: "bg-amber-500/10 dark:bg-dracula-yellow/10",
      header: "bg-amber-500 dark:bg-dracula-yellow",
      glow: "shadow-amber-500/30 dark:shadow-dracula-yellow/30",
      handle: "!bg-amber-500 dark:!bg-dracula-yellow",
    },
    green: {
      border: "border-green-500 dark:border-dracula-green",
      bg: "bg-green-500/10 dark:bg-dracula-green/10",
      header: "bg-green-500 dark:bg-dracula-green",
      glow: "shadow-green-500/30 dark:shadow-dracula-green/30",
      handle: "!bg-green-500 dark:!bg-dracula-green",
    },
    purple: {
      border: "border-purple-500 dark:border-dracula-purple",
      bg: "bg-purple-500/10 dark:bg-dracula-purple/10",
      header: "bg-purple-500 dark:bg-dracula-purple",
      glow: "shadow-purple-500/30 dark:shadow-dracula-purple/30",
      handle: "!bg-purple-500 dark:!bg-dracula-purple",
    },
    cyan: {
      border: "border-cyan-500 dark:border-dracula-cyan",
      bg: "bg-cyan-500/10 dark:bg-dracula-cyan/10",
      header: "bg-cyan-500 dark:bg-dracula-cyan",
      glow: "shadow-cyan-500/30 dark:shadow-dracula-cyan/30",
      handle: "!bg-cyan-500 dark:!bg-dracula-cyan",
    },
    pink: {
      border: "border-pink-500 dark:border-dracula-pink",
      bg: "bg-pink-500/10 dark:bg-dracula-pink/10",
      header: "bg-pink-500 dark:bg-dracula-pink",
      glow: "shadow-pink-500/30 dark:shadow-dracula-pink/30",
      handle: "!bg-pink-500 dark:!bg-dracula-pink",
    },
    orange: {
      border: "border-orange-500 dark:border-dracula-orange",
      bg: "bg-orange-500/10 dark:bg-dracula-orange/10",
      header: "bg-orange-500 dark:bg-dracula-orange",
      glow: "shadow-orange-500/30 dark:shadow-dracula-orange/30",
      handle: "!bg-orange-500 dark:!bg-dracula-orange",
    },
    red: {
      border: "border-red-500 dark:border-dracula-red",
      bg: "bg-red-500/10 dark:bg-dracula-red/10",
      header: "bg-red-500 dark:bg-dracula-red",
      glow: "shadow-red-500/30 dark:shadow-dracula-red/30",
      handle: "!bg-red-500 dark:!bg-dracula-red",
    },
  };

  const c = colorMap[color] || colorMap.purple;
  const handleClass = `${c.handle} !w-3 !h-3 !border-2 !border-white dark:!border-dracula-background`;

  return (
    <div
      className={`
        relative min-w-[230px] rounded-lg border-2 ${c.border} ${c.bg}
        shadow-lg ${c.glow} backdrop-blur-sm
        transition-all duration-300 hover:scale-[1.03] hover:shadow-xl
      `}>
      {/* ===== 8 Handles: source + target trên mỗi cạnh ===== */}
      {/* Top */}
      <Handle type="target" position={Position.Top} id="top" className={handleClass} />
      <Handle type="source" position={Position.Top} id="top-src" className={handleClass} />
      {/* Bottom */}
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleClass} />
      <Handle type="target" position={Position.Bottom} id="bottom-tgt" className={handleClass} />
      {/* Left */}
      <Handle type="target" position={Position.Left} id="left" className={handleClass} />
      <Handle type="source" position={Position.Left} id="left-src" className={handleClass} />
      {/* Right */}
      <Handle type="source" position={Position.Right} id="right" className={handleClass} />
      <Handle type="target" position={Position.Right} id="right-tgt" className={handleClass} />

      {/* Header của bảng */}
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md ${c.header}`}>
        {IconComponent && (
          <IconComponent size={18} className="text-white dark:text-dracula-background" />
        )}
        <span className="text-base font-bold font-mono text-white dark:text-dracula-background uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Danh sách columns */}
      <div className="px-4 py-2.5 space-y-2">
        {columns.map((col, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-base font-mono">
            <div className="flex items-center gap-2">
              {col.isPK && (
                <Key size={22} className="text-amber-500 dark:text-dracula-yellow flex-shrink-0" />
              )}
              {col.isFK && (
                <Link2 size={22} className="text-cyan-600 dark:text-dracula-cyan flex-shrink-0" />
              )}
              <span
                className={`
                  ${col.isPK ? "text-amber-600 dark:text-dracula-yellow font-semibold" : ""}
                  ${col.isFK ? "text-cyan-600 dark:text-dracula-cyan" : ""}
                  ${!col.isPK && !col.isFK ? "text-gray-700 dark:text-dracula-foreground" : ""}
                `}>
                {col.name}
              </span>
            </div>
            <span className="text-gray-400 dark:text-dracula-comment text-base">{col.type}</span>
          </div>
        ))}
      </div>

      {/* Badge PK/FK */}
      <div className="absolute -top-2.5 -right-2.5 flex gap-1">
        {columns.some((c) => c.isPK) && (
          <span className="px-2 py-0.5 text-base font-bold bg-amber-500 dark:bg-dracula-yellow text-white dark:text-dracula-background rounded-full">
            PK
          </span>
        )}
        {columns.some((c) => c.isFK) && (
          <span className="px-2 py-0.5 text-base font-bold bg-cyan-500 dark:bg-dracula-cyan text-white dark:text-dracula-background rounded-full">
            FK
          </span>
        )}
      </div>
    </div>
  );
};

// Đăng ký custom node types
const nodeTypes = { tableNode: TableNode };

// ========================================
// Edge style chung - Tạo edge config nhanh
// ========================================
const makeEdge = (id, source, target, label, color, sourceHandle, targetHandle) => ({
  id,
  source,
  target,
  sourceHandle: sourceHandle || "bottom",
  targetHandle: targetHandle || "top",
  type: "smoothstep",
  animated: true,
  label,
  labelStyle: { fill: "#f8f8f2", fontWeight: 700, fontSize: 12 },
  labelBgStyle: { fill: "#6272a4", fillOpacity: 0.85 },
  labelBgPadding: [6, 3],
  labelBgBorderRadius: 4,
  style: { stroke: color, strokeWidth: 2 },
});

// ========================================
// COMPONENT: DatabaseSchemaMobile
// Food Ordering System - 12 bảng chính, 12 quan hệ chính xác
// Layout 2 cột × 6 hàng — tối ưu cho màn hình dọc (Mobile)
// Modules: Order, Food, Coupon, Loyalty Points, Real-time Chat (WebSocket)
// ========================================
const DatabaseSchemaMobile = ({ className = "" }) => {
  // ========================================
  // NODES - Layout hỗn hợp 2-3 cột, tối ưu cho Mobile
  // Hàng 1 (y=0):    users              | chat_messages
  // Hàng 2 (y=240):  categories | foods | food_reviews    (3 cột)
  // Hàng 3 (y=480):  food_variants      | order_items
  // Hàng 4 (y=700):  orders | coupon_usage | coupons      (3 cột)
  // Hàng 5 (y=940):  order_tracking
  // Hàng 6 (y=1120): points
  // ========================================
  const initialNodes = useMemo(
    () => [
      // ---- HÀNG 1 (y=0): User core ----
      {
        id: "users",
        type: "tableNode",
        position: { x: 80, y: 0 },
        data: {
          label: "users",
          icon: User,
          color: "yellow",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "name", type: "VARCHAR" },
            { name: "email", type: "VARCHAR" },
            { name: "role", type: "VARCHAR" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
      },
      {
        id: "chat_messages",
        type: "tableNode",
        position: { x: 520, y: 0 },
        data: {
          label: "chat_messages",
          icon: MessageSquare,
          color: "purple",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "sender_id", type: "BIGINT", isFK: true },
            { name: "content", type: "TEXT" },
            { name: "type", type: "VARCHAR" },
            { name: "sent_at", type: "TIMESTAMP" },
          ],
        },
      },

      // ---- HÀNG 2 (y=240): Food module — 3 cột ----
      {
        id: "categories",
        type: "tableNode",
        position: { x: 0, y: 273 },
        data: {
          label: "categories",
          icon: Layers,
          color: "orange",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "name", type: "VARCHAR" },
            { name: "slug", type: "VARCHAR" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
      },
      {
        id: "foods",
        type: "tableNode",
        position: { x: 290, y: 260 },
        data: {
          label: "foods",
          icon: Package,
          color: "green",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "category_id", type: "BIGINT", isFK: true },
            { name: "name", type: "VARCHAR" },
            { name: "price", type: "DECIMAL" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
      },
      {
        id: "food_reviews",
        type: "tableNode",
        position: { x: 620, y: 260 },
        data: {
          label: "food_reviews",
          icon: Star,
          color: "pink",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "user_id", type: "BIGINT", isFK: true },
            { name: "food_id", type: "BIGINT", isFK: true },
            { name: "rating", type: "INT" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
      },

      // ---- HÀNG 3 (y=480): Variants & Items ----
      {
        id: "food_variants",
        type: "tableNode",
        position: { x: 80, y: 533 },
        data: {
          label: "food_variants",
          icon: Tag,
          color: "cyan",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "food_id", type: "BIGINT", isFK: true },
            { name: "name", type: "VARCHAR" },
            { name: "price", type: "DECIMAL" },
            { name: "stock", type: "INT" },
          ],
        },
      },
      {
        id: "order_items",
        type: "tableNode",
        position: { x: 420, y: 520 },
        data: {
          label: "order_items",
          icon: FileText,
          color: "cyan",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "order_id", type: "BIGINT", isFK: true },
            { name: "food_variant_id", type: "BIGINT", isFK: true },
            { name: "quantity", type: "INT" },
            { name: "price", type: "DECIMAL" },
            { name: "note", type: "VARCHAR" },
          ],
        },
      },

      // ---- HÀNG 4 (y=700): Order & Coupon — 3 cột ----
      {
        id: "orders",
        type: "tableNode",
        position: { x: 0, y: 810 },
        data: {
          label: "orders",
          icon: ShoppingCart,
          color: "purple",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "user_id", type: "BIGINT", isFK: true },
            { name: "total", type: "DECIMAL" },
            { name: "discount_amount", type: "DECIMAL" },
            { name: "status", type: "VARCHAR" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
      },
      {
        id: "coupon_usage",
        type: "tableNode",
        position: { x: 320, y: 824 },
        data: {
          label: "coupon_usage",
          icon: FileText,
          color: "pink",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "user_id", type: "BIGINT", isFK: true },
            { name: "coupon_id", type: "BIGINT", isFK: true },
            { name: "order_id", type: "BIGINT", isFK: true },
            { name: "used_at", type: "TIMESTAMP" },
          ],
        },
      },
      {
        id: "coupons",
        type: "tableNode",
        position: { x: 620, y: 837 },
        data: {
          label: "coupons",
          icon: Ticket,
          color: "red",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "code", type: "VARCHAR" },
            { name: "discount", type: "DECIMAL" },
            { name: "expires_at", type: "TIMESTAMP" },
          ],
        },
      },

      // ---- HÀNG 5 (y=940): Order tracking ----
      {
        id: "order_tracking",
        type: "tableNode",
        position: { x: 520, y: 1110 },
        data: {
          label: "order_tracking",
          icon: Clock,
          color: "orange",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "order_id", type: "BIGINT", isFK: true },
            { name: "status", type: "VARCHAR" },
            { name: "note", type: "TEXT" },
            { name: "tracked_at", type: "TIMESTAMP" },
          ],
        },
      },

      // ---- HÀNG 6 (y=1120): Loyalty Points ----
      {
        id: "points",
        type: "tableNode",
        position: { x: 60, y: 1110 },
        data: {
          label: "points",
          icon: Award,
          color: "green",
          columns: [
            { name: "id", type: "BIGINT", isPK: true },
            { name: "user_id", type: "BIGINT", isFK: true },
            { name: "order_id", type: "BIGINT", isFK: true },
            { name: "amount", type: "INT" },
            { name: "type", type: "VARCHAR" },
            { name: "created_at", type: "TIMESTAMP" },
          ],
        },
      },
    ],
    []
  );

  // ========================================
  // EDGES - 12 mối quan hệ, chọn đường ngắn nhất
  // ========================================
  const initialEdges = useMemo(
    () => [
      // 1. users → chat_messages — ngang phải, cùng hàng 1
      makeEdge("users-chat", "users", "chat_messages", "1:N", "#bd93f9", "right", "left"),

      // 2. users → food_reviews — chéo xuống phải, hàng 1→2
      makeEdge("users-reviews", "users", "food_reviews", "1:N", "#ff79c6", "bottom", "top"),

      // 3. food_reviews → foods — ngang trái, cùng hàng 2
      makeEdge("reviews-foods", "food_reviews", "foods", "N:1", "#50fa7b", "left-src", "right-tgt"),

      // 4. categories → foods — ngang phải, cùng hàng 2
      makeEdge("categories-foods", "categories", "foods", "1:N", "#ffb86c", "right", "left"),

      // 5. users → orders — đi dọc cạnh trái, né các node giữa
      makeEdge("users-orders", "users", "orders", "1:N", "#bd93f9", "left-src", "left"),

      // 6. orders → order_tracking — thẳng xuống, hàng 4→5
      makeEdge("orders-tracking", "orders", "order_tracking", "1:N", "#ffb86c", "bottom", "top"),

      // 7. orders → order_items — chéo lên phải, hàng 4→3
      makeEdge("orders-items", "orders", "order_items", "1:N", "#bd93f9", "top-src", "bottom-tgt"),

      // 8. food_variants → order_items — ngang phải, cùng hàng 3
      makeEdge("variants-items", "food_variants", "order_items", "1:N", "#8be9fd", "right", "left"),

      // 9. foods → food_variants — chéo xuống trái, hàng 2→3
      makeEdge("foods-variants", "foods", "food_variants", "1:N", "#8be9fd", "bottom", "top"),

      // 10. orders → points — đi dọc cạnh trái rồi xuống, hàng 4→6
      makeEdge("orders-points", "orders", "points", "1:N", "#50fa7b", "left-src", "left"),

      // 11. orders → coupon_usage — ngang phải, cùng hàng 4
      makeEdge("orders-usage", "orders", "coupon_usage", "1:N", "#ff79c6", "right", "left"),

      // 12. coupons → coupon_usage — ngang trái, cùng hàng 4
      makeEdge(
        "coupons-usage",
        "coupons",
        "coupon_usage",
        "1:N",
        "#ff5555",
        "left-src",
        "right-tgt"
      ),
    ],
    []
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div
      className={`relative rounded-lg border border-gray-300 dark:border-dracula-comment overflow-hidden ${className}`}>
      {/* Header - Rút gọn cho Mobile */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-dracula-current border-b border-gray-300 dark:border-dracula-comment">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-green-500 dark:text-dracula-green" />
          <span className="text-gray-900 dark:text-dracula-foreground text-sx font-mono font-semibold">
            Database Schema (Project 1)
          </span>
        </div>
      </div>

      {/* ReactFlow Canvas — Cho phép pinch zoom & kéo trên Mobile */}
      <div className="h-[600px] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.06, includeHiddenNodes: true }}
          minZoom={0.2}
          maxZoom={2}
          zoomOnScroll={false}
          zoomOnPinch={true}
          panOnDrag={false}
          panOnScroll={false}
          preventScrolling={false}>
          {/* Ẩn logo React Flow */}
          <style>
            {`
              .react-flow__attribution {
                display: none !important;
              }
            .react-flow__pane {
              top: 0;
            }
            `}
          </style>

          {/* Controls zoom */}
          <Controls
            className="!bg-white dark:!bg-dracula-current !border-gray-300 dark:!border-dracula-comment !shadow-lg"
            showInteractive={false}
            position="bottom-right"
            style={{
              border: "1px solid #44475a",
              borderRadius: "8px",
            }}
          />
        </ReactFlow>
      </div>

      {/* Legend - Rút gọn cho Mobile */}
      <div className="flex flex-wrap items-center justify-center gap-3 px-3 py-2 bg-gray-100 dark:bg-dracula-current border-t border-gray-300 dark:border-dracula-comment">
        <div className="flex items-center gap-1.5 text-[13px] font-mono">
          <Key size={10} className="text-amber-500 dark:text-dracula-yellow" />
          <span className="text-gray-500 dark:text-dracula-comment">PK</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-mono">
          <Link2 size={10} className="text-cyan-600 dark:text-dracula-cyan" />
          <span className="text-gray-500 dark:text-dracula-comment">FK</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-mono">
          <div className="w-3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-dracula-purple dark:to-dracula-pink rounded" />
          <span className="text-gray-500 dark:text-dracula-comment">Relation</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-mono">
          <span className="text-gray-400 dark:text-dracula-comment">1:N</span>
          <span className="text-gray-500 dark:text-dracula-comment">One-to-Many</span>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSchemaMobile;
