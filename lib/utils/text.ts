// "Học Toán" -> "hoc toan", để gõ không dấu vẫn tìm được.
export function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}