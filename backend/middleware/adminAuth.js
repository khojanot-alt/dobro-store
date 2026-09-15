/**
 * Admin autentifikatsiya middleware
 * Telegram ID ni tekshiradi — faqat admin ruxsat
 */
export function adminAuth(req, res, next) {
  const telegramId =
    req.headers['x-admin-id'] ||
    req.body?.telegramId ||
    req.query?.telegramId;

  if (!telegramId) {
    return res.status(401).json({ error: 'Autentifikatsiya ma\'lumoti topilmadi' });
  }

  if (String(telegramId) !== String(process.env.ADMIN_TELEGRAM_ID)) {
    return res.status(403).json({ error: 'Ruxsat yo\'q — faqat admin uchun' });
  }

  next();
}
