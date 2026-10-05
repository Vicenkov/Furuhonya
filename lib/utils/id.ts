export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Trang mở bằng http://192.168.x.x (không phải localhost) không có randomUUID.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}