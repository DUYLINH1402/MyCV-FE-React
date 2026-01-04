import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Key, Link2, Table2 } from "lucide-react";

// ========================================
// COMPONENT: DatabaseSchema - Sơ đồ Database với animation
// Hiển thị các bảng và mối quan hệ, sáng lên khi hover
// ========================================
const DatabaseSchema = ({ className = "" }) => {
  const [activeConnection, setActiveConnection] = useState(null);
  const [hoveredTable, setHoveredTable] = useState(null);

  // Định nghĩa các bảng trong database schema
  const tables = [
    {
      id: "users",
      name: "users",
      x: 50,
      y: 30,
      columns: [
        { name: "id", type: "BIGINT", isPK: true },
        { name: "username", type: "VARCHAR(50)" },
        { name: "email", type: "VARCHAR(100)" },
        { name: "created_at", type: "TIMESTAMP" },
      ],
      color: "orange",
    },
    {
      id: "orders",
      name: "orders",
      x: 280,
      y: 30,
      columns: [
        { name: "id", type: "BIGINT", isPK: true },
        { name: "user_id", type: "BIGINT", isFK: true, ref: "users" },
        { name: "total", type: "DECIMAL(10,2)" },
        { name: "status", type: "VARCHAR(20)" },
      ],
      color: "green",
    },
    {
      id: "products",
      name: "products",
      x: 50,
      y: 200,
      columns: [
        { name: "id", type: "BIGINT", isPK: true },
        { name: "name", type: "VARCHAR(100)" },
        { name: "price", type: "DECIMAL(10,2)" },
        { name: "stock", type: "INT" },
      ],
      color: "purple",
    },
    {
      id: "order_items",
      name: "order_items",
      x: 280,
      y: 200,
      columns: [
        { name: "id", type: "BIGINT", isPK: true },
        { name: "order_id", type: "BIGINT", isFK: true, ref: "orders" },
        { name: "product_id", type: "BIGINT", isFK: true, ref: "products" },
        { name: "quantity", type: "INT" },
      ],
      color: "cyan",
    },
  ];

  // Định nghĩa các kết nối (relationships)
  const connections = [
    {
      id: "users-orders",
      from: "users",
      to: "orders",
      fromPos: "right",
      toPos: "left",
      label: "1:N",
    },
    {
      id: "orders-order_items",
      from: "orders",
      to: "order_items",
      fromPos: "bottom",
      toPos: "top",
      label: "1:N",
    },
    {
      id: "products-order_items",
      from: "products",
      to: "order_items",
      fromPos: "right",
      toPos: "left",
      label: "1:N",
    },
  ];

  // Hàm lấy màu theo tên
  const getColor = (colorName, isActive) => {
    const colors = {
      orange: isActive ? "#ffb86c" : "#44475a",
      green: isActive ? "#50fa7b" : "#44475a",
      purple: isActive ? "#bd93f9" : "#44475a",
      cyan: isActive ? "#8be9fd" : "#44475a",
    };
    return colors[colorName] || colors.orange;
  };

  // Hàm tính toán vị trí của đường kết nối
  const getConnectionPath = (conn) => {
    const fromTable = tables.find((t) => t.id === conn.from);
    const toTable = tables.find((t) => t.id === conn.to);

    if (!fromTable || !toTable) return "";

    const tableWidth = 200;
    const tableHeight = 140;

    let x1, y1, x2, y2;

    // Tính điểm bắt đầu
    switch (conn.fromPos) {
      case "right":
        x1 = fromTable.x + tableWidth;
        y1 = fromTable.y + tableHeight / 2;
        break;
      case "bottom":
        x1 = fromTable.x + tableWidth / 2;
        y1 = fromTable.y + tableHeight;
        break;
      default:
        x1 = fromTable.x + tableWidth;
        y1 = fromTable.y + tableHeight / 2;
    }

    // Tính điểm kết thúc
    switch (conn.toPos) {
      case "left":
        x2 = toTable.x;
        y2 = toTable.y + tableHeight / 2;
        break;
      case "top":
        x2 = toTable.x + tableWidth / 2;
        y2 = toTable.y;
        break;
      default:
        x2 = toTable.x;
        y2 = toTable.y + tableHeight / 2;
    }

    // Tạo đường cong Bezier
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    if (conn.fromPos === "bottom" && conn.toPos === "top") {
      return `M ${x1} ${y1} Q ${x1} ${midY} ${midX} ${midY} Q ${x2} ${midY} ${x2} ${y2}`;
    }

    return `M ${x1} ${y1} Q ${midX} ${y1} ${midX} ${midY} Q ${midX} ${y2} ${x2} ${y2}`;
  };

  // Kiểm tra xem connection có active không
  const isConnectionActive = (conn) => {
    return activeConnection === conn.id || hoveredTable === conn.from || hoveredTable === conn.to;
  };

  return (
    <div
      className={`relative bg-white dark:bg-dracula-background rounded-lg border border-gray-300 dark:border-dracula-comment overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dracula-current border-b border-gray-300 dark:border-dracula-comment">
        <Database size={14} className="text-orange-500 dark:text-orange-400" />
        <span className="text-gray-900 dark:text-dracula-foreground text-xs font-mono">
          Database Schema
        </span>
        <span className="text-gray-500 dark:text-dracula-comment text-xs">— E-Commerce System</span>
      </div>

      {/* Schema SVG */}
      <svg viewBox="0 0 530 370" className="w-full h-auto p-4">
        {/* Connections */}
        <defs>
          {/* Gradient cho đường kết nối active */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff79c6" />
            <stop offset="100%" stopColor="#8be9fd" />
          </linearGradient>

          {/* Arrow marker */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={activeConnection ? "#ff79c6" : "#6272a4"} />
          </marker>

          <marker
            id="arrowheadActive"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ff79c6" />
          </marker>
        </defs>

        {/* Vẽ các đường kết nối */}
        {connections.map((conn) => {
          const isActive = isConnectionActive(conn);
          return (
            <g key={conn.id}>
              <motion.path
                d={getConnectionPath(conn)}
                fill="none"
                stroke={isActive ? "url(#connectionGradient)" : "#6272a4"}
                strokeWidth={isActive ? 3 : 2}
                strokeDasharray={isActive ? "0" : "5,5"}
                markerEnd={isActive ? "url(#arrowheadActive)" : "url(#arrowhead)"}
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  strokeWidth: isActive ? 3 : 2,
                }}
                transition={{ duration: 0.5 }}
                onMouseEnter={() => setActiveConnection(conn.id)}
                onMouseLeave={() => setActiveConnection(null)}
                className="cursor-pointer"
              />

              {/* Label cho relationship */}
              {isActive && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <rect
                    x={
                      (tables.find((t) => t.id === conn.from).x +
                        tables.find((t) => t.id === conn.to).x) /
                        2 +
                      85
                    }
                    y={
                      (tables.find((t) => t.id === conn.from).y +
                        tables.find((t) => t.id === conn.to).y) /
                        2 +
                      55
                    }
                    width="30"
                    height="20"
                    rx="4"
                    fill="#282a36"
                    stroke="#ff79c6"
                  />
                  <text
                    x={
                      (tables.find((t) => t.id === conn.from).x +
                        tables.find((t) => t.id === conn.to).x) /
                        2 +
                      100
                    }
                    y={
                      (tables.find((t) => t.id === conn.from).y +
                        tables.find((t) => t.id === conn.to).y) /
                        2 +
                      69
                    }
                    textAnchor="middle"
                    className="text-xs fill-dracula-pink font-mono">
                    {conn.label}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}

        {/* Vẽ các bảng */}
        {tables.map((table) => {
          const isActive =
            hoveredTable === table.id ||
            connections.some(
              (c) => (c.from === table.id || c.to === table.id) && activeConnection === c.id
            );

          return (
            <motion.g
              key={table.id}
              onMouseEnter={() => setHoveredTable(table.id)}
              onMouseLeave={() => setHoveredTable(null)}
              whileHover={{ scale: 1.02 }}
              style={{ cursor: "pointer" }}>
              {/* Shadow khi active */}
              {isActive && (
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  x={table.x - 4}
                  y={table.y - 4}
                  width={208}
                  height={148}
                  rx="8"
                  fill={getColor(table.color, true)}
                  filter="blur(8px)"
                />
              )}

              {/* Table container */}
              <rect
                x={table.x}
                y={table.y}
                width={200}
                height={140}
                rx="6"
                fill="#282a36"
                stroke={isActive ? getColor(table.color, true) : "#44475a"}
                strokeWidth={isActive ? 2 : 1}
              />

              {/* Table header */}
              <rect
                x={table.x}
                y={table.y}
                width={200}
                height={28}
                rx="6"
                fill={isActive ? getColor(table.color, true) : "#44475a"}
              />
              <rect
                x={table.x}
                y={table.y + 22}
                width={200}
                height={6}
                fill={isActive ? getColor(table.color, true) : "#44475a"}
              />

              {/* Table icon và name */}
              <Table2
                x={table.x + 8}
                y={table.y + 6}
                size={16}
                className={isActive ? "fill-dracula-background" : "fill-dracula-foreground"}
              />
              <text
                x={table.x + 30}
                y={table.y + 18}
                className={`text-xs font-bold font-mono ${
                  isActive ? "fill-dracula-background" : "fill-dracula-foreground"
                }`}>
                {table.name}
              </text>

              {/* Columns */}
              {table.columns.map((col, idx) => (
                <g key={col.name}>
                  <text
                    x={table.x + 12}
                    y={table.y + 50 + idx * 24}
                    className="text-[10px] font-mono fill-dracula-foreground">
                    {col.isPK && <tspan className="fill-dracula-yellow">🔑 </tspan>}
                    {col.isFK && <tspan className="fill-dracula-cyan">🔗 </tspan>}
                    <tspan
                      className={
                        col.isPK
                          ? "fill-dracula-yellow"
                          : col.isFK
                          ? "fill-dracula-cyan"
                          : "fill-dracula-foreground"
                      }>
                      {col.name}
                    </tspan>
                  </text>
                  <text
                    x={table.x + 188}
                    y={table.y + 50 + idx * 24}
                    textAnchor="end"
                    className="text-[9px] font-mono fill-dracula-comment">
                    {col.type}
                  </text>
                </g>
              ))}
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 px-4 py-2 bg-gray-100 dark:bg-dracula-current border-t border-gray-300 dark:border-dracula-comment">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Key size={12} className="text-amber-500 dark:text-dracula-yellow" />
          <span className="text-gray-500 dark:text-dracula-comment">Primary Key</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <Link2 size={12} className="text-cyan-600 dark:text-dracula-cyan" />
          <span className="text-gray-500 dark:text-dracula-comment">Foreign Key</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-pink-600 dark:text-dracula-pink">→</span>
          <span className="text-gray-500 dark:text-dracula-comment">Relationship</span>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSchema;
