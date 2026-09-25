import {
  AlertTriangle,
  Boxes,
  Droplets,
  FlaskConical,
  GraduationCap,
  Layers,
  ShieldCheck,
  Shirt,
  SprayCan,
  Truck,
  Warehouse,
  Wheat,
  type LucideIcon,
} from 'lucide-react'

/**
 * Ánh xạ tên icon trong lớp dữ liệu sang component Lucide.
 *
 * Nhập tĩnh thay vì tra động để bundler loại bỏ được phần không dùng, và để một tên icon
 * sai bị bắt ngay ở bước biên dịch chứ không phải lúc chạy. MASTER §8: chỉ dùng Lucide,
 * tuyệt đối không dùng emoji làm icon.
 */
export const ICONS = {
  droplets: Droplets,
  shirt: Shirt,
  wheat: Wheat,
  layers: Layers,
  boxes: Boxes,
  'spray-can': SprayCan,
  warehouse: Warehouse,
  truck: Truck,
  'flask-conical': FlaskConical,
  'shield-check': ShieldCheck,
  'alert-triangle': AlertTriangle,
  'graduation-cap': GraduationCap,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

export function getIcon(name: string): LucideIcon {
  return ICONS[name as IconName] ?? FlaskConical
}
