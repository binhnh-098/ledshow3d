// Kiểu dữ liệu mô tả toàn bộ tham số cấu hình sự kiện.
// Đây là "nguồn sự thật" duy nhất (single source of truth): mọi thứ trong scene 3D
// đều được sinh ra (generate) từ object này, không lưu trực tiếp hình học 3D.

export type MatBang = "trong-nha" | "ngoai-troi";

export type TinhChatSuKien =
  | "gala"
  | "hoi-nghi"
  | "ra-mat-san-pham"
  | "trao-giai"
  | "tiec-cuoi"
  | "khai-truong"
  | "ky-niem"
  | "concert"
  | "le-hoi"
  | "the-thao";

export type MucDauTu = "co-ban" | "tieu-chuan" | "cao-cap" | "dai-nhac-hoi";

export type KetCauChinh =
  | "tu-chon"
  | "khong-dung-khung"
  | "cong-chu-u"
  | "khung-hop-ground-support"
  | "khung-hop-co-mai"
  | "layer-truss-gian-khong-gian";

export interface EventConfig {
  // 01 Cấu hình của tôi
  matBang: MatBang;
  chieuNgang: number; // m
  chieuDai: number; // m
  tinhChat: TinhChatSuKien;
  soKhach: number;
  mucDauTu: MucDauTu;
  ketCauChinh: KetCauChinh;
  ledPresetId: string;
}

export const DEFAULT_CONFIG: EventConfig = {
  matBang: "ngoai-troi",
  chieuNgang: 30,
  chieuDai: 40,
  tinhChat: "gala",
  soKhach: 500,
  mucDauTu: "tieu-chuan",
  ketCauChinh: "tu-chon",
  ledPresetId: "p3.91",
};
