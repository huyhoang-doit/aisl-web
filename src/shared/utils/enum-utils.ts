import {
  LogisticsType,
  OrderStatus,
  OrderDetailStatus,
  PaymentStatus,
  TransactionType,
  TransactionStatus,
  OrderType,
  LockerStatus,
  ItemType,
  FeeBlockUnit,
} from "../constants/enums";
import type {
  LogisticsTypeValue,
  OrderStatusValue,
  OrderDetailStatusValue,
  PaymentStatusValue,
  TransactionTypeValue,
  TransactionStatusValue,
  OrderTypeValue,
  LockerStatusValue,
  ItemTypeValue,
  FeeBlockUnitValue,
} from "../constants/enums";

export class EnumTranslator {
  static translateLogisticsType(type: LogisticsTypeValue | string): string {
    switch (type) {
      case LogisticsType.LOCKER_TO_LOCKER:
        return "Giao từ tủ qua tủ";
      case LogisticsType.HOME_TO_LOCKER:
        return "Giao từ nhà tới tủ";
      default:
        return typeof type === "string" ? type : "";
    }
  }

  static translateOrderStatus(status: OrderStatusValue | string): string {
    switch (status) {
      case OrderStatus.PENDING:
        return "Đang chờ xử lý";
      case OrderStatus.AWAITING_COURIER:
        return "Chờ người giao hàng";
      case OrderStatus.AWAITING_PICKUP:
        return "Chờ lấy hàng";
      case OrderStatus.ACTIVE:
        return "Đang hoạt động";
      case OrderStatus.COMPLETED:
        return "Đã hoàn tất";
      case OrderStatus.LOCKED_BY_BALANCE:
        return "Bị khóa do số dư";
      case OrderStatus.CANCELLED:
        return "Đã hủy";
      default:
        return typeof status === "string" ? status : "";
    }
  }

  static translateOrderDetailStatus(status: OrderDetailStatusValue | string): string {
    switch (status) {
      case OrderDetailStatus.PENDING:
        return "Chờ xử lý";
      case OrderDetailStatus.AWAITING_COURIER:
        return "Chờ người giao hàng";
      case OrderDetailStatus.AWAITING_PICKUP:
        return "Chờ lấy hàng";
      case OrderDetailStatus.AWAITING_CONFIRM_DEPOSIT:
        return "Chờ xác nhận gửi hàng";
      case OrderDetailStatus.IN_TRANSIT:
        return "Đang vận chuyển";
      case OrderDetailStatus.OCCUPIED:
        return "Đang sử dụng";
      case OrderDetailStatus.COMPLETED:
        return "Hoàn tất";
      case OrderDetailStatus.OVERDUE:
        return "Quá hạn";
      case OrderDetailStatus.COLLECTING:
        return "Đang gom hàng";
      case OrderDetailStatus.COLLECTED:
        return "Đã lấy hàng";
      default:
        return typeof status === "string" ? status : "";
    }
  }

  static translatePaymentStatus(status: PaymentStatusValue | string): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return "Chờ thanh toán";
      case PaymentStatus.UNPAID:
        return "Chưa thanh toán";
      case PaymentStatus.PAID:
        return "Đã thanh toán";
      case PaymentStatus.PARTIAL_PAID:
        return "Thanh toán một phần";
      case PaymentStatus.REFUNDED:
        return "Đã hoàn tiền";
      default:
        return typeof status === "string" ? (status || "Chưa xác định") : "Chưa xác định";
    }
  }

  static translateTransactionType(type: TransactionTypeValue | string): string {
    switch (type) {
      case TransactionType.DEPOSIT:
        return "Nạp tiền";
      case TransactionType.RENTAL_DEDUCTION:
        return "Phí thuê tủ";
      case TransactionType.LOGISTICS_DEDUCTION:
        return "Phí vận chuyển";
      case TransactionType.OVERDUE_PENALTY:
        return "Phí quá hạn";
      case TransactionType.REFUND:
        return "Hoàn tiền";
      case TransactionType.TOP_UP:
        return "Nạp tiền vào ví";
      case TransactionType.WITHDRAW:
        return "Rút tiền";
      default:
        return typeof type === "string" ? type : "";
    }
  }

  static translateTransactionStatus(status: TransactionStatusValue | string): string {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return "Thành công";
      case TransactionStatus.FAILED:
        return "Thất bại";
      case TransactionStatus.PENDING:
        return "Đang chờ";
      case TransactionStatus.CANCELLED:
        return "Đã hủy";
      default:
        return typeof status === "string" ? status : "";
    }
  }

  static translateOrderType(type: OrderTypeValue | string): string {
    switch (type) {
      case OrderType.LOGISTICS:
        return "Dịch vụ vận chuyển";
      case OrderType.PERSONAL_RENTAL:
        return "Thuê tủ cá nhân";
      case OrderType.SHARED_RENTAL:
        return "Cho thuê kho chung";
      default:
        return typeof type === "string" ? type : "";
    }
  }

  static translateLockerStatus(status: LockerStatusValue | string): string {
    switch (status) {
      case LockerStatus.AVAILABLE:
        return "Sẵn sàng";
      case LockerStatus.OCCUPIED:
        return "Đang sử dụng";
      case LockerStatus.RESERVED:
        return "Đã đặt trước";
      case LockerStatus.LOCKED_BY_BALANCE:
        return "Khóa do số dư";
      case LockerStatus.FAULT:
        return "Bị lỗi";
      case LockerStatus.MAINTENANCE:
        return "Bảo trì";
      case LockerStatus.INITIALIZING:
        return "Đang khởi tạo";
      default:
        return typeof status === "string" ? status : "";
    }
  }

  static translateHwStatus(status: string): string {
    const value = (status || "").toLowerCase();
    switch (value) {
      case "locked":
        return "Đã khóa";
      case "unlocked":
        return "Đã mở khóa";
      case "open":
        return "Đang mở";
      case "closed":
        return "Đã đóng";
      case "unknown":
        return "Không xác định";
      case "error":
        return "Lỗi";
      case "opening":
        return "Đang mở...";
      case "closing":
        return "Đang đóng...";
      case "offline":
        return "Ngoại tuyến";
      default:
        return status;
    }
  }

  static translateItemType(type: ItemTypeValue | string): string {
    const value = typeof type === "string" ? type.toUpperCase() : type;
    switch (value) {
      case ItemType.FOOD:
        return "Thực phẩm";
      case ItemType.OTHER:
        return "Khác";
      default:
        return typeof type === "string" ? type : "";
    }
  }

  static translateFeeBlockUnit(unit: FeeBlockUnitValue | string): string {
    const value = typeof unit === "string" ? unit.toUpperCase() : unit;
    switch (value) {
      case FeeBlockUnit.MINUTE:
        return "phút";
      case FeeBlockUnit.HOUR:
        return "giờ";
      case FeeBlockUnit.DAY:
        return "ngày";
      case FeeBlockUnit.WEEK:
        return "tuần";
      case FeeBlockUnit.MONTH:
        return "tháng";
      default:
        return typeof unit === "string" ? unit.toLowerCase() : "";
    }
  }
}
