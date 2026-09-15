import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

/**
 * Adminga yangi buyurtma haqida xabar yuboradi
 * @param {Object} order - Buyurtma ma'lumotlari
 * @param {Object} userInfo - Telegram foydalanuvchi ma'lumotlari
 */
export async function sendOrderToAdmin(order, userInfo) {
  const adminId = process.env.ADMIN_TELEGRAM_ID;
  if (!adminId) return;

  const now = new Date();
  const timeStr = now.toLocaleString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const productLines = order.products
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} — ${item.quantity} dona × ${item.price.toLocaleString('uz-UZ')} so'm`
    )
    .join('\n');

  const fullName = [userInfo.firstName, userInfo.lastName].filter(Boolean).join(' ');
  const username = userInfo.username ? `@${userInfo.username}` : 'Yo\'q';

  const message = `🛒 <b>Yangi Buyurtma!</b>

👤 Mijoz: <b>${fullName || 'Noma\'lum'}</b>
📱 Username: ${username}
🆔 User ID: <code>${userInfo.userId}</code>

📦 <b>Buyurtma tarkibi:</b>
${productLines}

💰 <b>Jami summa: ${order.totalPrice.toLocaleString('uz-UZ')} so'm</b>

⏰ Vaqt: ${timeStr}

━━━━━━━━━━━━━━━━
💬 Mijoz bilan bog'laning va to'lov tafsilotlarini yuboring.`;

  try {
    await bot.sendMessage(adminId, message, { parse_mode: 'HTML' });
    console.log(`✅ Admin ga xabar yuborildi: order ${order._id}`);
  } catch (err) {
    console.error('❌ Admin ga xabar yuborishda xato:', err.message);
  }
}

export default bot;
