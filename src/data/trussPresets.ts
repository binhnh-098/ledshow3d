import type { KetCauChinh } from "../types/config";

export interface TrussPreset {
  id: KetCauChinh;
  label: string;
  description: string;
}

export const TRUSS_PRESETS: TrussPreset[] = [
  {
    id: "tu-chon",
    label: "Tự chọn theo mặt bằng & quy mô",
    description: "App tự chọn kết cấu phù hợp nhất theo kích thước bạn nhập (mặc định: cổng chữ U).",
  },
  {
    id: "khong-dung-khung",
    label: "Không dựng khung",
    description: "LED đứng trên chân riêng, đèn đặt trên chân đứng — không có truss treo phía trên.",
  },
  {
    id: "cong-chu-u",
    label: "Truss cổng chữ U",
    description: "2 chân + 1 đà ngang trên nóc. Kết cấu phổ biến nhất, dễ thi công, chi phí hợp lý.",
  },
  {
    id: "khung-hop-ground-support",
    label: "Truss khung hộp ground support",
    description: "Truss nặng hơn, có đà giằng giữa thân — chịu tải tốt hơn cho đèn/loa nặng.",
  },
  {
    id: "khung-hop-co-mai",
    label: "Truss khung hộp có mái",
    description: "4 chân tạo khối hộp có mái che toàn bộ sân khấu — phù hợp ngoài trời, chống mưa nắng.",
  },
  {
    id: "layer-truss-gian-khong-gian",
    label: "Layer truss giàn không gian",
    description: "2 lớp đà song song nối bằng thanh chống — khung lớn, chịu tải cao, cho sự kiện quy mô lớn.",
  },
];
