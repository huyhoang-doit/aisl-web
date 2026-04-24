# Hướng dẫn Tích hợp Frontend (FE) - Rent Locker Flow

Tài liệu này cung cấp hướng dẫn tích hợp các API cần thiết cho đội ngũ Frontend (Mobile App / Web App / Kiosk) để thực hiện luồng Thuê tủ (Rent Locker) và các thao tác liên quan như Mở tủ tạm thời (Open Temporarily) và Trả tủ (Return/Finish).

---

## 1. Cài đặt Định danh Thiết bị (Kiosk / Web App Setup)

Trước khi Kiosk hoặc Web App tại tủ có thể hoạt động (cho khách thuê/trả đồ), Staff hoặc Admin cần thực hiện bước cài đặt (Settings) ban đầu để định danh thiết bị này đang gắn với Cabinet nào.

1. **Giao diện Cài đặt (Settings):** FE cung cấp một nút hoặc màn hình đặc biệt (yêu cầu đăng nhập tài khoản Staff/Admin) để vào giao diện Cài đặt tủ.
2. **Lấy Danh sách tủ (List Cabinets):**
   - **Endpoint:** `GET /cabinets` (hoặc API lấy danh sách tủ theo Location).
   - **Auth:** Bearer Token (Staff/Admin).
   - **Staff/Admin** sẽ chọn Cabinet tương ứng với vị trí thực tế của màn hình Kiosk.
3. **Lưu định danh thiết bị:**
   - Sau khi chọn và nhấn **Xác nhận (Confirm)**, FE lưu thông tin tủ vào bộ nhớ cục bộ (VD: `localStorage` hoặc Secure Storage).
   - *Ví dụ:* `localStorage.setItem('currentCabinetId', 'uuid-cua-cabinet')`.
4. **Xác minh ở các màn hình hoạt động:**
   - Khi App/Kiosk chạy luồng thuê tủ hoặc lấy/trả hàng, FE luôn đọc `cabinetId` từ `localStorage` để biết chính xác thiết bị này đang điều hướng cho tủ nào. (Raspberry Pi/Web Server bên dưới cũng sẽ chạy theo định danh Cabinet tương ứng để đồng bộ hệ thống).

---

## 2. Tổng quan Luồng Thuê Tủ (Rent Locker)

Luồng thuê tủ cá nhân cơ bản bao gồm các bước sau:
1. **Khách hàng (Guest)** thao tác trên Kiosk (thiết bị đã được định danh Cabinet ở Bước 1). Khách chọn số lượng tủ cần thuê, thời gian thuê dự kiến.
2. **Hệ thống** tính toán chi phí (Prepaid Amount) dựa trên Block Pricing cấu hình sẵn.
3. **Khách hàng** thanh toán (qua QR code, ví điện tử, v.v.).
4. Sau khi thanh toán thành công, **Hệ thống** tạo đơn hàng (Order) và cấp phát tủ (Locker). Khách hàng nhận được **Mã truy cập (OTP)** để sử dụng tủ.
5. Khách hàng sử dụng OTP để **Mở tủ tạm thời** nhiều lần trong thời gian thuê.
6. Khi kết thúc nhu cầu, khách hàng chọn **Trả tủ**. Hệ thống sẽ tính toán phí phụ trội (nếu quá giờ) và yêu cầu thanh toán thêm (nếu có) trước khi hoàn tất đơn hàng.

---

## 3. Chi tiết Các API Endpoints Thao tác với Tủ

Phần này tập trung vào các API thao tác trực tiếp với tủ sau khi đơn hàng (Order) đã được tạo và thanh toán thành công. Các thao tác này yêu cầu sử dụng mã OTP.

> **Lưu ý:** Header yêu cầu thường là `Authorization: Bearer <Token>` (tuỳ thuộc vào thiết kế hệ thống, có thể là token của User đăng nhập hoặc token tạm thời của phiên thuê tủ).

### 3.1. Lấy mã OTP (Generate Access Code)

Khách hàng có thể cần lấy lại hoặc tạo mới mã OTP cho đơn hàng thuê tủ hiện tại (ví dụ: quên mã).

- **Endpoint:** `POST /access-codes/generate`
- **Auth:** Bearer Token
- **Body:**
  ```json
  {
    "orderDetailId": "uuid-cua-chi-tiet-don-hang",
    "userId": "uuid-cua-nguoi-dung", // (Tuỳ chọn nếu dùng token)
    "type": "PERSONAL_RENTAL",       // Loại giao dịch: Thuê cá nhân
    "status": "ACTIVE"
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Tạo mã truy cập thành công",
    "data": {
      "id": "uuid-cua-access-code",
      "codeHash": "mã-otp-đã-được-hash-hoặc-mã-raw-tuỳ-cấu-hình", 
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z",
      "expiredAt": "2024-01-02T00:00:00Z" // Thời gian hết hạn của mã
    }
  }
  ```
  *(Lưu ý: Tuỳ thuộc cấu hình bảo mật, mã OTP thực tế (plain text) có thể được gửi qua SMS/Email/Notification thay vì trả về trực tiếp trong response này).*

### 3.2. Xác thực mã OTP (Verify OTP)

Thao tác này thường diễn ra tại Kiosk hoặc màn hình nhập mã để hệ thống xác nhận mã khách hàng nhập vào là đúng trước khi gọi các API mở/trả tủ.

- **Endpoint:** `POST /access-codes/validate` (hoặc `/lockers/validate` tuỳ cấu hình route)
- **Body:**
  ```json
  {
    "otp": "123456",               // Mã OTP khách hàng nhập
    "type": "PERSONAL_RENTAL"      // Loại giao dịch
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Xác nhận OTP thành công",
    "data": {
        "success": true
    }
  }
  ```

---

## 4. Thao Tác Trực Tiếp Lên Tủ (Hardware Control)

Các API này sẽ gửi lệnh xuống Raspberry Pi để điều khiển khóa cửa tủ.

### 4.1. Mở tủ tạm thời (Open Temporarily)

Trong quá trình thuê, khách hàng có thể mở tủ nhiều lần để lấy ra/cất thêm đồ mà không kết thúc phiên thuê.

- **Endpoint:** `PUT /lockers/rent/open/:lockerId`
- **Auth:** Bearer Token (hoặc xác thực qua OTP ở bước trên)
- **Parameters:**
  - `lockerId`: UUID của ngăn tủ cần mở.
- **Body:** Không yêu cầu (hoặc truyền OTP nếu thiết kế API gộp bước xác thực).
- **Response:**
  ```json
  {
      "statusCode": 200,
      "message": "Mở tủ tạm thời thành công",
      "data": {
           "order": { /* Thông tin đơn hàng cập nhật */ },
           "orderDetail": { /* Thông tin chi tiết đơn hàng */ },
           "locker": { 
               "id": "uuid",
               "isOpen": true, // Trạng thái cửa đang mở
               "isLocked": false
           }
      }
  }
  ```
> **Action FE:** Khi nhận response thành công, giao diện hiển thị thông báo "Tủ đã được mở. Vui lòng lấy/cất đồ và đóng chặt cửa tủ."

### 4.2. Trả tủ / Kết thúc thuê (Finish / Return Locker)

Khách hàng chọn trả tủ khi không còn nhu cầu sử dụng. Thao tác này sẽ kết thúc phiên thuê và cập nhật trạng thái đơn hàng.

- **Endpoint:** `PUT /lockers/rent/finish/:lockerId`
- **Auth:** Bearer Token (hoặc xác thực qua OTP)
- **Parameters:**
  - `lockerId`: UUID của ngăn tủ cần trả.
- **Body:** Không yêu cầu.
- **Response:**
  ```json
  {
      "statusCode": 200,
      "message": "Trả tủ thành công",
      "data": {
           "order": { 
               "id": "uuid",
               "status": "COMPLETED", // Đơn hàng hoàn tất
               "totalCollected": 50000 // Tổng tiền đã thu (bao gồm phí quá hạn nếu có)
           },
           "orderDetail": { 
               "status": "COMPLETED",
               "overdueFee": 0        // Phí quá hạn (nếu có)
           },
           "locker": { 
               "id": "uuid",
               "isOpen": false,
               "isLocked": true,
               "currentStatus": "AVAILABLE" // Trạng thái tủ trở về trống
           }
      }
  }
  ```
> **Action FE:** 
> - Nếu `overdueFee > 0`, giao diện cần hiển thị màn hình yêu cầu thanh toán số tiền phạt quá hạn (Total Collected += Overdue Fee) và cho phép người dùng thanh toán trước khi gọi API Finish (tuỳ thuộc thiết kế payment flow).
> - Nếu trả tủ thành công không có phí phát sinh, hiển thị thông báo "Quý khách đã trả tủ thành công. Cảm ơn quý khách đã sử dụng dịch vụ!"

---

## 5. Business Rules & Pricing (Logic tính phí)

Tham khảo file `guest_rental.md` cho màn hình Checkout (Frontend Cấp độ Customer):

1. **Khách chọn giờ:**
   - Tính tổng tiền (Prepaid Amount) = `Làm tròn lên(Số giờ muốn thuê / Thời gian 1 block) × Giá mỗi block`
2. **Thanh toán:**
   - Khi tạo Order, lưu lại `plannedEndTime = thời gian hiện tại + số giờ muốn thuê`.
3. **Tính phí quá hạn (Hiển thị khi Guest chọn Trả tủ muộn):**
   - Tính thời gian quá hạn = `thời gian hiện tại - plannedEndTime - thời gian grace period (tuỳ chọn)`.
   - Lượng block quá hạn = `Làm tròn lên(Thời gian quá hạn / Thời gian 1 block)`.
   - Phí quá hạn = `Lượng block quá hạn × Phí phạt mỗi block (lateFeePerBlock)`.
