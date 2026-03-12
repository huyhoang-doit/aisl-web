# Phụ Lục Kỹ Thuật (Frontend API Integration) - Admin Dashboard 

Tài liệu này cung cấp hướng dẫn tích hợp các API mới dành cho trang Admin & Staff Dashboard.

**Lưu ý Chung:**
- Base Path tùy thuộc vào cấu hình Gateway (vd: `http://localhost:3000`).
- Header yêu cầu: `Authorization: Bearer <Admin/Staff_Token>`

---

## 1. Analytics & Thống Kê

### 1.1 Thống kê Đơn hàng (Order Statistics)
GET `/analytics/orders`
- **Mô tả:** Trả về tổng quan lượng đơn, bao gồm tổng số đơn và chia theo loại đơn (DELIVERY vs RENTAL).
- **Query Params:**
  - `startDate` (ISO String, filter theo ngày, tuỳ chọn)
  - `endDate` (ISO String, filter theo ngày, tuỳ chọn)
- **Response:**
```typescript
{
  totalOrders: number;
  deliveryOrders: number;
  rentalOrders: number;
}
```

### 1.2 Thống kê Doanh thu (Revenue Statistics)
GET `/analytics/revenue`
- **Mô tả:** Trả về báo cáo doanh thu theo ngày trong một khoảng thời gian.
- **Query Params:**
  - `startDate` (bắt buộc)
  - `endDate` (bắt buộc)
- **Response:**
```typescript
{
  totalRevenue: number;
  revenueByDay: Record<string, number>; // object với key là YYYY-MM-DD
}
```

### 1.3 Thống kê Người dùng mới (User Growth)
GET `/analytics/users`
- **Mô tả:** Trả về lượng người dùng mới theo tháng trong năm. 
- **Query Params:**
  - Không có param
- **Response:**
```typescript
{
  totalUsers: number;
  newUsersByMonth: Record<string, number>; // object với key là số của tháng
}
```

### 1.4 Thống kê Tủ (Locker Statistics)
GET `/analytics/lockers`
- **Mô tả:** Trả về thống kê số lượng ngăn tủ đang được sử dụng và tổng số tủ.
- **Response:**
```typescript
{
  totalCabinets: number;
  totalLockers: number;
  inUseLockers: number;
  availableLockers: number;
}
```

---

## 2. Giao Dịch Toàn Hệ Thống (System Transactions)

### 2.1 Lấy toàn bộ giao dịch
GET `payments/admin/transactions`
- **Mô tả:** Cho phép Admin xem lịch sử giao dịch của TẤT CẢ người dùng (Nạp tiền, trừ ví, v.v.).
- **Query Params:**
  - `page`, `limit` (Pagination)
  - `search` (Tìm kiếm theo mã giao dịch)
  - `status` (SUCCESS, FAILED...)
  - `type` (TOPUP, PAYMENT)
- **Response:** Dạng phân trang (Pagination) chứa log Giao dịch.

---

## 3. Thao Tác Đơn Hàng Nâng Cao (Order Admin Actions)

### 3.1 Bắt buộc Hủy Đơn (Force Cancel)
POST `/orders/:id/force-cancel`
- **Mô tả:** Cho phép Admin can thiệp hủy đơn hàng đang bị kẹt hoặc có lỗi kỹ thuật. 
- **Body:** Không yêu cầu.
- **Response:** Trả về chi tiết đơn hàng (trạng thái sẽ nhảy thành `CANCELLED`).

### 3.2 Bắt buộc Hoàn Thành Đơn (Force Complete)
POST `/orders/:id/force-complete`
- **Mô tả:** Cho phép Admin đánh dấu hoàn thành đơn hàng bằng tay.
- **Body:** Không yêu cầu.
- **Response:** Trả về chi tiết đơn hàng (trạng thái sẽ nhảy thành `COMPLETED`).

---

## 4. Giám Sát Phần Cứng Tủ (Hardware Monitoring)

### 4.1 Lấy trạng thái giám sát
GET `/cabinets/monitor/status`
- **Mô tả:** Liệt kê trạng thái kết nối phần cứng của tất cả các tủ, dùng cho bảng Dashboard giám sát tủ (Online/Offline).
- **Query Params:**
  - `page`, `limit` (Tuỳ chọn)
  - `locationId` (Lọc tủ theo điểm đặt)
  - `status` (ONLINE / OFFLINE)
- **Response:**
```typescript
{
  items: [
    {
      cabinetId: string;
      name: string;
      connectionStatus: "ONLINE" | "OFFLINE";
      lastHeartbeatAt: string;
      totalLockers: number;
      onlineLockers: number;
      offlineLockers: number;
      inUseLockers: number;
    }
  ],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
```

---

## 5. Quản Lý Đối Tác Vận Chuyển Nâng Cao (Courier Status)

### 5.1 Cập nhật Trạng thái Đối tác (Đình chỉ/Kích hoạt)
PUT `/users/:id/courier-status`
- **Mô tả:** Cho phép Admin hoặc Staff Đình chỉ (`SUSPENDED`) hoặc Kích hoạt/Từ chối một thành viên Courier.
- **Path Params:** `id` (userId của Courier)
- **Body:**
```json
{
  "status": "SUSPENDED", // Hoặc "ACTIVE", "REJECTED", "PENDING"
  "reason": "Vi phạm chính sách lấy hàng" // Lý do (khoá lý do không bắt buộc nhưng khuyến nghị)
}
```
- **Response:** Trả về chi tiết User kèm trạng thái mới.
