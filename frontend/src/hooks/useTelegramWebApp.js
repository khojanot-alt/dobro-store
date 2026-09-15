import { useEffect, useState } from 'react';

/**
 * Telegram WebApp API bilan ishlash uchun custom hook
 */
export function useTelegramWebApp() {
  const [user, setUser] = useState(null);
  const [colorScheme, setColorScheme] = useState('dark');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();

      // Telegram tema ranglarini CSS variablega o'rnatish
      tg.setHeaderColor('#0a0a0f');
      tg.setBackgroundColor('#0a0a0f');

      setColorScheme(tg.colorScheme || 'dark');
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);
    } else {
      // Test muhiti — browser da ishlayotganda
      setUser({
        id: 0,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
      });
      setIsReady(true);
    }
  }, []);

  /**
   * Foydalanuvchi admin ekanligini tekshiradi
   * @param {string|number} adminId - .env dagi ADMIN_TELEGRAM_ID
   */
  function isAdmin(adminId) {
    if (!user) return false;
    return String(user.id) === String(adminId);
  }

  /** Haptic feedback — muvaffaqiyat */
  function hapticSuccess() {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    } catch {}
  }

  /** Haptic feedback — xato */
  function hapticError() {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
    } catch {}
  }

  /** Haptic feedback — engil zarba */
  function hapticImpact() {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    } catch {}
  }

  /** Orqaga tugmasini yashirish yoki ko'rsatish */
  function showBackButton(onBack) {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);
  }

  function hideBackButton() {
    window.Telegram?.WebApp?.BackButton?.hide();
  }

  return {
    user,
    colorScheme,
    isReady,
    isAdmin,
    hapticSuccess,
    hapticError,
    hapticImpact,
    showBackButton,
    hideBackButton,
    tg: window.Telegram?.WebApp || null,
  };
}
