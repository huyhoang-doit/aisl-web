# Hướng dẫn Tích hợp Frontend (FE) - Logistics Phase 2 & Dispatch

Tài liệu này mô tả chi tiết các bước và luồng API cần thiết để đội ngũ Frontend (Mobile App / Web App) tích hợp tính năng giao nhận hàng hoá (Logistics) có sự tham gia của Shipper (Courier) và hệ thống điều phối tự động (Auto Dispatch).

---

## 1. Tổng quan các ứng dụng (Apps) bị ảnh hưởng

Luồng Logistics mới yêu cầu sự tham gia của 3 đối tượng, tương ứng với các giao diện / ứng dụng sau:
1. **Customer App (Người gửi)**: Tạo đơn gửi hàng, chọn điểm nhận.
2. **Courier App (Shipper)**: Cập nhật vị trí GPS liên tục, Nhận đơn, Lấy hàng tại tủ người gửi, Cất hàng tại tủ người nhận.
3. **Customer App (Người nhận)** / **Màn hình tại tủ (Kiosk)**: Nhập mã OTP để lấy hàng.

---

## 2. Luồng chi tiết & Các API Endpoints

### 2.1. Đầu phía Courier (Shipper) - Cập nhật vị trí

Để hệ thống định tuyến (Dispatch) hoạt động, Courier App cần liên tục gửi vị trí GPS (ví dụ: mỗi 30 giây hoặc khi có thay đổi vị trí đáng kể) khi tài xế đang trong trạng thái "Sẵn sàng làm việc" (Online).

#### Gửi vị trí hiện tại (Online)
- **Endpoint:** `POST /dispatch/courier/location`
- **Auth:** Bearer Token (Courier)
- **Body:**
  ```json
  {
    "latitude": 10.762622,
    "longitude": 106.660172
  }
  ```
- **Response:** `{ "success": true, "message": "Location updated" }`

#### Tắt trạng thái làm việc (Offline)
- **Endpoint:** `DELETE /dispatch/courier/location`
- **Auth:** Bearer Token (Courier)
- **Response:** `{ "success": true, "message": "Courier removed from availability" }`

---

### 2.2. Luồng Người Gửi (Sender) - Tạo đơn gửi hàng

Người gửi chọn một ngăn tủ còn trống (đang ở trạng thái `AVAILABLE` và `CLOSED`), điền thông tin người nhận và tiến hành tạo yêu cầu. Hệ thống sẽ tự động quét và phát thông báo tới các tài xế gần đó.

- **Endpoint:** `POST /logistics/send`
- **Auth:** Bearer Token (Customer)
- **Body:**
  ```json
  {
    "lockerId": "UUID-cua-ngan-tu-nguoi-gui",
    "recipientPhone": "0987654321",
    "recipientName": "Nguyen Van B",
    "itemType": "Tài liệu",
    "note": "Hàng dễ rách, xin nhẹ tay",
    "senderAddress": "Tủ Smart Locker Lô A, Chung cư X",
    "receiverAddress": "Tủ Smart Locker Tòa nhà Y, Quận Z"
  }
  ```
- **Response:**
  ```json
  {
    "dispatchId": "UUID-cua-phien-dieu-phoi",
    "status": "AWAITING_COURIER",
    "message": "Đang tìm courier gần nhất (tìm thấy 3 ứng viên). Vui lòng chờ..."
  }
  ```

> **Lưu ý UI:** Sau khi gọi API này thành công, FE nên hiển thị màn hình "Đang tìm tài xế..." (Loading UI). Do backend chưa hỗ trợ WebSocket bắn ngược lại, FE có thể áp dụng cơ chế Polling (gọi API kiểm tra trạng thái đơn hàng mỗi 3-5 giây) hoặc chờ Push Notification (Firebase FCM) chứa thông tin tài xế đã nhận đơn.

---

### 2.3. Luồng Courier - Nhận đơn và Lấy hàng (Pick-up)

Khi tài xế nhận được thông báo yêu cầu lấy hàng (kèm theo `dispatchId`) và bấm "Nhận đơn", App Tài xế cần gọi API chấp nhận yêu cầu.

#### Bước 1: Courier chấp nhận đơn
- **Endpoint:** `POST /logistics/courier/accept`
- **Auth:** Bearer Token (Courier)
- **Body:**
  ```json
  {
    "dispatchId": "UUID-cua-phien-dieu-phoi-da-nhan"
  }
  ```
- **Response:**
  ```json
  {
    "orderId": "UUID-cua-don-hang",
    "orderCode": "LOG-123456",
    "accessCode": "847291", 
    "lockerLabel": "A-01",
    "cabinetName": "Cabinet Tòa X",
    "address": "Tủ Smart Locker Lô A, Chung cư X",
    "message": "Đã nhận đơn. Dùng mã OTP để mở tủ lấy hàng."
  }
  ```
*(Lúc này tiền phí gửi hàng sẽ tự động bị trừ khỏi Ví (Wallet) của người gửi. Màn hình của người gửi sẽ chuyển sang trạng thái "Tài xế đang tới lấy hàng").*

#### Bước 2: Courier tới tủ người gửi và mở tủ
- Tài xế xem thông tin `cabinetName`, `address` để di chuyển tới vị trí tủ.
- Tới nơi, tài xế tìm đúng ngăn tủ `lockerLabel` (ví dụ: A-01).
- Tài xế nhập mã OTP (`accessCode`: "847291") trên màn hình tủ (hoặc trên App kết nối tủ) để mở cửa.
- Tài xế lấy hàng và **ĐÓNG CỬA TỦ**.
*(Backend sẽ tự động catch sự kiện cửa đóng và chuyển trạng thái đơn hàng sang `IN_TRANSIT`).*

---

### 2.4. Luồng Courier - Giao hàng vào tủ (Deposit & Chụp ảnh)

Để đảm bảo có bằng chứng giao hàng (Delivery Proof), quy trình cất hàng của Shipper được chia làm 3 bước: **Mở tủ -> Chụp ảnh cất hàng -> Xác nhận đóng tủ**.

#### Bước 1: Mở tủ cất hàng
- **Endpoint:** `POST /logistics/courier/deposit/open`
- **Auth:** Bearer Token (Courier)
- **Body:**
  ```json
  {
    "orderCode": "LOG-123456",
    "lockerId": "UUID-cua-ngan-tu-nguoi-nhan"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Mở tủ thành công. Vui lòng cất hàng và chụp ảnh bằng chứng."
  }
  ```
> **Action:** Cửa tủ bật mở. Tài xế cất gói hàng vào ngăn. Màn hình App FE hiển thị giao diện Camera yêu cầu chụp ảnh không gian bên trong tủ (thấy rõ kiện hàng).

#### Bước 2: Upload ảnh (FE tự thực hiện)
- App gọi API Upload File (sẵn có của hệ thống) để đẩy file ảnh chứa bằng chứng lên server (MinIO/S3).
- Nhận về danh sách `imageUrls` (ví dụ: `["https://s3.domain.com/proof1.jpg"]`).

#### Bước 3: Xác nhận hoàn tất (Confirm)
Tài xế **ĐÓNG CỬA TỦ**, sau đó App gọi API Confirm truyền kèm link ảnh.

- **Endpoint:** `POST /logistics/courier/deposit/confirm`
- **Auth:** Bearer Token (Courier)
- **Body:**
  ```json
  {
    "orderCode": "LOG-123456",
    "lockerId": "UUID-cua-ngan-tu-nguoi-nhan",
    "recipientName": "Nguyen Van B",
    "recipientPhone": "0987654321",
    "imageUrls": ["https://s3.domain.com/proof1.jpg"]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Giao hàng thành công vào locker B-05. OTP đã gửi cho người nhận."
  }
  ```
> **Lưu ý Backend Block:** API `deposit/confirm` sẽ **block (treo) chờ cho tới khi nào cảm biến báo tủ đã đóng thực sự** thì mới chạy tiếp để trả kết quả. Ngay sau khi cửa đóng và API trả về, hệ thống sẽ tự sinh mã OTP gửi cho người nhận.

---

### 2.5. Luồng Người Nhận (Receiver) - Nhận hàng

Người nhận nhận được thông báo/SMS kèm mã OTP để lấy hàng. Họ đi tới chiếc tủ được chỉ định và tiến hành nhập OTP (trên điện thoại hoặc trực tiếp trên màn hình Kiosk của tủ).

- **Endpoint:** `POST /logistics/pickup`
- **Auth:** Ai cũng có thể gọi (có thể gắn Bearer Token nếu là user đã login)
- **Body:**
  ```json
  {
    "accessCode": "192837" // Mã OTP nhận được qua thông báo
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "orderCode": "LOG-123456",
    "lockerLabel": "B-05",
    "message": "Nhận hàng thành công!"
  }
  ```
> **Action:** Cửa tủ tự động bật mở. Khách hàng lấy bưu kiện và đóng tủ. Đơn hàng hoàn tất (`COMPLETED`).

---

## 3. Tóm tắt Trạng thái Đơn hàng (Dành cho Tracking UI)

Dưới đây là sơ đồ vòng đời (Lifecycle) của 1 đơn Logistics cho việc hiển thị Thanh trạng thái (Progress Bar) trên App:

1. `ACTIVE / AWAITING_COURIER`: Người gửi vừa tạo đơn. Đang chờ tài xế quét và nhận đơn.
2. `AWAITING_COURIER` (hoặc `COURIER_ACCEPTED` tuỳ thuộc vào FE build tự lưu): Tài xế đã nhận đơn và đang di chuyển tới lấy hàng. OTP 1 đã được cấp cho tài xế.
3. `IN_TRANSIT`: Tài xế đã mở tủ, lấy hàng ra và đóng tủ lại. Đang trên đường đi giao.
4. `AWAITING_PICKUP`: Tài xế đã cất hàng vào tủ đích và đóng cửa. Hàng đang đợi người nhận tới lấy. OTP 2 đã được cấp cho người nhận.
5. `COMPLETED`: Người nhận đã nhập OTP, mở tủ lấy hàng xong.

## 4. Admin API (Optional - Dùng cho CMS/Dashboard)

Dành cho Web Admin muốn theo dõi vị trí các Courier đang rảnh trên bản đồ (hiển thị Map).

- **Endpoint:** `GET /dispatch/couriers/nearest?latitude=10.7&longitude=106.6&maxDistanceKm=10&limit=50`
- **Response:** Trả về danh sách tài xế cùng toạ độ và khoảng cách tương đối để vẽ marker lên Google Maps / Leaflet.
