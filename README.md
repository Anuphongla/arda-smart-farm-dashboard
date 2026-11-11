# ARDA Smart Agriculture & Weather Dashboard

เว็บแอปพลิเคชันระบบตรวจวัดและวิเคราะห์สภาพอากาศ & ข้อมูลเซนเซอร์วัดค่าดิน IoT (**Smart Agriculture & Weather Dashboard**) เชื่อมต่อกับ **ARDA 365 Days Open API (สำนักงานพัฒนาการวิจัยการเกษตร - สวก.)** พร้อมระบบ Authentication ในธีมที่ออกแบบเฉพาะสำหรับการเกษตรแม่นยำ (Precision Farming) และรองรับ Responsive ทุกขนาดหน้าจอ 100%

---

## 🌟 ฟีเจอร์หลักของระบบ (Core Features)

1. **ระบบความปลอดภัยและการเข้าสู่ระบบ (Authentication):**
   - รองรับ **Email & Password** ด้วยการเข้ารหัสความปลอดภัยสูง **bcrypt (Salt 12 Rounds)**
   - จัดเก็บข้อมูลผู้ใช้งานและเซสชันลงฐานข้อมูล **SQLite ผ่าน Prisma ORM**
   - รองรับการเข้าสู่ระบบผ่าน **Google OAuth** (ติดตั้งคีย์จริงเรียบร้อย)
   - มีระบบ **Quick Fill Helper** สำหรับกดกรอกบัญชีทดสอบในคลิกเดียว

2. **การเชื่อมต่อ ARDA API ครบ 6 Endpoints:**
   - **Weather Station Endpoints:**
     - `GET /api/public/v1/stations` (รายชื่อสถานีตรวจวัดสภาพอากาศ)
     - `GET /api/public/v1/stations/:id/latest` (สภาพอากาศล่าสุด: อุณหภูมิ, ความชื้น, ดัชนีความร้อน, ฝุ่น PM2.5, CO2, VPD, Lux, ฝน, ลม)
     - `GET /api/public/v1/stations/:id/history` (ประวัติสภาพอากาศย้อนหลัง)
   - **Handy Soil IoT Endpoints:**
     - `GET /api/public/v1/handy/devices` (รายชื่ออุปกรณ์วัดดิน IoT)
     - `GET /api/public/v1/handy/devices/:id/latest` (ข้อมูลดินล่าสุด: N, P, K, pH, EC, ความชื้นดิน, อุณหภูมิดิน)
     - `GET /api/public/v1/handy/devices/:id/history` (ประวัติการวัดค่าดินย้อนหลัง)
   - **Next.js Server Proxy:** มีตัวกลางตัดปัญหา CORS (Cross-Origin Resource Sharing) 100%
   - **Dual Mode (Live & Demo):** สลับระหว่าง API สด และโหมดจำลองสถานการณ์เสมือนจริงอัตโนมัติ พร้อมช่องใส่ `x-api-key`

3. **ลูกเล่นและการแสดงผลขั้นสูง (Advanced Agritech Widgets):**
   - **เข็มทิศทิศทางลม (Aviation-style Wind Compass):** เข็มทิศหมุนชี้ไปยังองศาลมจริง (0–360°)
   - **มาตรวัดกรด-ด่างดิน (Calibrated Soil pH Spectrum):** แถบสีวิทยาศาสตร์ 4.0–9.0 พร้อมหมุดชี้ตำแหน่งค่าจริง
   - **คอลัมน์ปริมาตรความชื้นดิน (Soil Moisture Level):** แสดงสเกลน้ำใต้ดิน พร้อมระบบเตือนรดน้ำทันทีเมื่อ `< 30%`
   - **แถบประเมินธาตุอาหาร N-P-K สไตล์ห้องปฏิบัติการ:** วิเคราะห์สัดส่วนแร่ธาตุจำเป็นของพืช
   - **กราฟวิเคราะห์แนวโน้ม (Interactive Recharts):** กราฟเปรียบเทียบสภาพอากาศและดินย้อนหลังแบบ Dual Y-Axis พร้อม Dark Tooltip

4. **ตารางประวัติข้อมูลดิบ (Raw Data Log Table):**
   - สลับดูได้ 2 แท็บ (สภาพอากาศ / ดิน)
   - ค้นหาข้อมูล (Search), เรียงวันที่ (Sort Asc/Desc), แบ่งหน้า (Pagination)
   - **Export to CSV:** รองรับภาษาไทยสมบูรณ์แบบด้วย UTF-8 BOM เปิดใน Microsoft Excel ได้ทันทีโดยสระไม่เพี้ยน

5. **100% Responsive Design:**
   - ใช้งานได้ทุกขนาดหน้าจอ ทั้งมือถือ (Mobile), แท็บเล็ต (Tablet) และคอมพิวเตอร์ (Desktop)
   - ใช้ Custom Dropdown ที่ไม่ล้นขอบจอ

---

## 🔑 บัญชีสำหรับทดสอบระบบ (Demo Accounts)

| บัญชี | Email | Password | บทบาท |
|---|---|---|---|
| **Admin** | `admin@example.com` | `123456` | Administrator |
| **ปุ่มลัด** | สามารถคลิกปุ่ม **"กดกรอกอัตโนมัติ"** บนหน้า Login ได้ทันที | - | - |

*(หรือสามารถกดปุ่ม "สมัครสมาชิก" เพื่อลงทะเบียนบัญชีใหม่ลงฐานข้อมูลจริงได้ทันที)*

---

## 🚀 วิธีการรันโปรเจกต์ (Installation & Running)

### 1. ติดตั้ง Dependencies:
```bash
npm install
```

### 2. เตรียมฐานข้อมูล SQLite:
```bash
npx prisma db push
node prisma/seed.mjs
```

### 3. รันโปรเจกต์:
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
next-blue-dashboard/
├── prisma/
│   ├── schema.prisma                  # Data Models (User, Account, Session)
│   ├── dev.db                         # SQLite Database
│   └── seed.mjs                       # Default Admin Seeder
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── arda/[...path]/route.ts # ARDA API Reverse Proxy (CORS-free)
│   │   │   ├── auth/[...nextauth]/     # NextAuth Configuration Route
│   │   │   └── register/route.ts       # Real User Registration Endpoint
│   │   ├── dashboard/page.tsx         # Smart Agriculture & Weather Dashboard
│   │   ├── login/page.tsx             # Login Interface
│   │   ├── register/page.tsx          # Registration Interface
│   │   ├── layout.tsx                 # Root Layout & SessionProvider
│   │   └── page.tsx                   # Auth Gateway Redirect
│   ├── components/
│   │   ├── auth/                      # Login & Register Form Components
│   │   └── smart-farm/
│   │       ├── HeaderControls.tsx     # Custom Dropdowns & Safe Date Picker
│   │       ├── WeatherOverviewCards.tsx # Weather Cards + Animated Compass
│   │       ├── SoilHealthCards.tsx    # Soil Cards + pH Spectrum + Moisture
│   │       ├── InteractiveCharts.tsx  # Recharts Line/Bar Analytics
│   │       ├── RawDataLogTable.tsx    # History Table & UTF-8 CSV Export
│   │       └── SkeletonLoading.tsx    # Shimmer Loading Animation
│   ├── lib/
│   │   ├── ardaApi.ts                 # ARDA API Client Service
│   │   ├── ardaMock.ts                # Real-world Agricultural Mock Datasets
│   │   ├── auth.ts                    # NextAuth & bcrypt Security Configuration
│   │   └── prisma.ts                  # Global PrismaClient Singleton
│   └── types/
│       └── arda.ts                    # TypeScript Definitions for Weather & Soil
├── .env.local                         # Environment Variables (Google OAuth & NextAuth)
├── .env.example                       # Sample Environment Configuration
├── package.json
└── tailwind.config.ts
```
