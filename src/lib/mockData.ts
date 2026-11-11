export interface MetricItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: "TrendingUp" | "Users" | "Activity" | "DollarSign";
}

export const metricsData: MetricItem[] = [
  {
    id: "m1",
    title: "ยอดรายรับรวม (Total Revenue)",
    value: "฿842,500",
    change: "+14.8%",
    isPositive: true,
    subtext: "เทียบกับเดือนก่อนหน้า",
    iconName: "DollarSign",
  },
  {
    id: "m2",
    title: "ผู้ใช้งานที่กำลังใช้งาน (Active Users)",
    value: "12,480",
    change: "+8.2%",
    isPositive: true,
    subtext: "เพิ่มขึ้น 940 คนในสัปดาห์นี้",
    iconName: "Users",
  },
  {
    id: "m3",
    title: "อัตราความสำเร็จ (Conversion Rate)",
    value: "4.35%",
    change: "+1.2%",
    isPositive: true,
    subtext: "เป้าหมายเฉลี่ย 3.50%",
    iconName: "TrendingUp",
  },
  {
    id: "m4",
    title: "เวลาใช้งานเฉลี่ย (Avg. Session)",
    value: "4m 32s",
    change: "-2.1%",
    isPositive: false,
    subtext: "ลดลงเล็กน้อยในกลุ่ม Mobile",
    iconName: "Activity",
  },
];

export const chartData7Days = [
  { name: "จันทร์", revenue: 42000, visits: 2400, conversions: 180 },
  { name: "อังคาร", revenue: 58000, visits: 3100, conversions: 240 },
  { name: "พุธ", revenue: 51000, visits: 2800, conversions: 210 },
  { name: "พฤหัส", revenue: 67000, visits: 3600, conversions: 310 },
  { name: "ศุกร์", revenue: 89000, visits: 4500, conversions: 390 },
  { name: "เสาร์", revenue: 74000, visits: 3900, conversions: 320 },
  { name: "อาทิตย์", revenue: 62000, visits: 3300, conversions: 260 },
];

export const chartData30Days = [
  { name: "สัปดาห์ 1", revenue: 185000, visits: 14200, conversions: 1120 },
  { name: "สัปดาห์ 2", revenue: 215000, visits: 16800, conversions: 1350 },
  { name: "สัปดาห์ 3", revenue: 240000, visits: 18500, conversions: 1540 },
  { name: "สัปดาห์ 4", revenue: 280000, visits: 21400, conversions: 1780 },
];

export const chartData12Months = [
  { name: "ม.ค.", revenue: 480000, visits: 38000 },
  { name: "ก.พ.", revenue: 520000, visits: 42000 },
  { name: "มี.ค.", revenue: 610000, visits: 49000 },
  { name: "เม.ย.", revenue: 590000, visits: 46000 },
  { name: "พ.ค.", revenue: 680000, visits: 54000 },
  { name: "มิ.ย.", revenue: 740000, visits: 59000 },
  { name: "ก.ค.", revenue: 710000, visits: 57000 },
  { name: "ส.ค.", revenue: 790000, visits: 63000 },
  { name: "ก.ย.", revenue: 830000, visits: 66000 },
  { name: "ต.ค.", revenue: 810000, visits: 64000 },
  { name: "พ.ย.", revenue: 870000, visits: 69000 },
  { name: "ธ.ค.", revenue: 950000, visits: 78000 },
];

export const trafficSourceData = [
  { name: "Organic Search", value: 42, color: "#0ea5e9" },
  { name: "Direct Link", value: 28, color: "#38bdf8" },
  { name: "Social Media", value: 18, color: "#7dd3fc" },
  { name: "Referral / Ads", value: 12, color: "#bae6fd" },
];

export interface Transaction {
  id: string;
  customer: string;
  email: string;
  channel: string;
  amount: string;
  status: "Completed" | "Processing" | "Pending";
  date: string;
}

export const recentTransactions: Transaction[] = [
  {
    id: "TX-9021",
    customer: "สมชาย วงศ์สวัสดิ์",
    email: "somchai.w@gmail.com",
    channel: "Credit Card (Stripe)",
    amount: "฿12,500",
    status: "Completed",
    date: "วันนี้, 14:23",
  },
  {
    id: "TX-9022",
    customer: "ณัฐวุฒิ สิทธิชัย",
    email: "natthawut.s@hotmail.com",
    channel: "PromptPay QR",
    amount: "฿4,800",
    status: "Completed",
    date: "วันนี้, 13:50",
  },
  {
    id: "TX-9023",
    customer: "พิมลดา สุวรรณรัตน์",
    email: "pimonlada@gmail.com",
    channel: "Bank Transfer",
    amount: "฿28,900",
    status: "Processing",
    date: "วันนี้, 11:15",
  },
  {
    id: "TX-9024",
    customer: "ธนภัทร เลิศไพบูลย์",
    email: "thanapat.l@company.co.th",
    channel: "Corporate Invoicing",
    amount: "฿54,000",
    status: "Pending",
    date: "เมื่อวาน, 16:45",
  },
  {
    id: "TX-9025",
    customer: "กัญญาณัฐ เจริญสุข",
    email: "kanyanat.c@outlook.com",
    channel: "PromptPay QR",
    amount: "฿2,350",
    status: "Completed",
    date: "เมื่อวาน, 10:30",
  },
];
