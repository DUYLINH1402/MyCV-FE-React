# Sử dụng Node.js bản ổn định để build dự án
FROM node:22-alpine AS build_stage

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file quản lý thư viện vào trước để tối ưu cache
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Build dự án ra thư mục /dist
RUN npm run build

# Bước 2: Dùng Nginx để chạy file đã build (rất nhẹ)
FROM nginx:alpine
COPY --from=build_stage /app/dist /usr/share/nginx/html

# Mở cổng 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]