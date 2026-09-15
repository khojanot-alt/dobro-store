# 🛍️ Dobro Store — Telegram Mini App

Kompyuter aksessuarlari uchun Telegram Mini App

## 📁 Loyiha tuzilishi

```
Comp shop/
├── backend/          # Node.js + Express + MongoDB
│   ├── models/       # Mongoose sxemalar
│   ├── routes/       # API routelar
│   ├── middleware/   # Admin autentifikatsiya
│   ├── server.js     # Asosiy server
│   ├── bot.js        # Telegram bot (admin xabari)
│   └── .env.example  # Sozlamalar namunasi
└── frontend/         # React.js + Vite
    ├── src/
    │   ├── pages/    # Sahifalar
    │   ├── components/ # Komponentlar
    │   ├── context/  # Cart context
    │   ├── hooks/    # Telegram hook
    │   └── styles/   # CSS
    └── .env.example  # Frontend sozlamalari
```

---

## ⚙️ O'rnatish

### 1. Bot yaratish
1. Telegramda **@BotFather** ga `/newbot` yuboring
2. Bot nomini va username ni kiriting
3. **Bot Token** ni oling (saqlang!)

### 2. Admin ID olish
1. Telegramda **@userinfobot** ga `/start` yuboring
2. Sizning **Telegram ID** raqamingiz ko'rsatiladi

### 3. MongoDB Atlas (bepul)
1. [mongodb.com/atlas](https://mongodb.com/atlas) ga ro'yxatdan o'ting
2. Bepul cluster yarating (M0 - 512MB)
3. **Connection String** ni oling

---

## 🚀 Ishga tushirish

### Backend sozlash

```bash
cd backend
npm install
```

`.env.example` faylini `.env` nomi bilan nusxalang va to'ldiring:

```bash
copy .env.example .env
```

`.env` ichiga:
```
BOT_TOKEN=123456789:AAFxxxxxxxxxxxxxxxxxxxx
ADMIN_TELEGRAM_ID=987654321
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dobrostore
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Backend ishga tushirish:
```bash
npm run dev
```

---

### Frontend sozlash

```bash
cd frontend
npm install
```

`.env.example` faylini `.env` nomi bilan nusxalang:

```bash
copy .env.example .env
```

`.env` ichiga:
```
VITE_ADMIN_ID=987654321
```

Frontend ishga tushirish:
```bash
npm run dev
```

Brauzerda oching: [http://localhost:5173](http://localhost:5173)

---

## 🤖 Telegram Mini App sozlash

1. **@BotFather** ga `/setmenubutton` yuboring
2. Botingizni tanlang
3. Mini App URL sini kiriting (deploy qilingan URL)
4. Yoki `/newapp` bilan Mini App yarating

### Ishlab chiqish uchun (ngrok)

```bash
# Ngrok o'rnatish
npm install -g ngrok

# Frontendni internet orqali ochish
ngrok http 5173
```

Berilgan `https://xxxx.ngrok.io` URLni BotFather ga bering.

---

## 🌐 Production Deploy

### Frontend (Vercel)
```bash
cd frontend
npm run build
# dist/ papkasini Vercel ga upload qiling
```

### Backend (Railway)
1. [railway.app](https://railway.app) ga kiring
2. GitHub repository ulang
3. `backend/` papkasini tanlang
4. Environment variables kiriting
5. Deploy!

---

## 📋 API Endpointlar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/products` | Barcha mahsulotlar |
| GET | `/api/products?category=mouse` | Kategoriya bo'yicha |
| GET | `/api/products?popular=true` | Mashhur mahsulotlar |
| POST | `/api/products` | Yangi qo'shish (admin) |
| PUT | `/api/products/:id` | Tahrirlash (admin) |
| DELETE | `/api/products/:id` | O'chirish (admin) |
| POST | `/api/orders` | Buyurtma berish |

---

## 🔐 Xavfsizlik

- Admin panel faqat `.env` dagi `ADMIN_TELEGRAM_ID` ga ochiq
- `.env` faylini hech qachon GitHub ga push qilmang
- `.gitignore` ga `.env` qo'shilganligini tekshiring

---

## 📦 Texnologiyalar

| Qism | Stack |
|------|-------|
| Frontend | React 18, Vite, React Router 6 |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB Atlas |
| Bot | node-telegram-bot-api |
| Dizayn | CSS (glassmorphism, ko'k-qora tech) |
