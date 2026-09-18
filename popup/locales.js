// Localization system for Tab Snooze Extension

const locales = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      snoozed: 'Snoozed',
      history: 'History',
      settings: 'Settings'
    },

    // Sections
    section: {
      quickPresets: 'Quick Presets',
      smartPresets: 'Smart Presets',
      customPresets: 'Your Presets'
    },

    // Presets
    preset: {
      '1hour': '1 Hour',
      '3hours': '3 Hours',
      '6hours': '6 Hours',
      laterToday: 'Later Today',
      thisEvening: 'This Evening',
      tomorrow: 'Tomorrow',
      nextWeekend: 'Next Weekend',
      nextWeek: 'Next Week',
      inMonth: 'In a Month',
      someday: 'Someday',
      pickDate: 'Pick Date'
    },

    // Empty states
    empty: {
      noSnoozed: 'No snoozed tabs',
      goToDashboard: 'Go to Dashboard to snooze this tab',
      noHistory: 'No history yet',
      noHistoryDesc: 'Completed tabs will appear here'
    },

    // History
    history: {
      title: '📜 Recently Opened',
      clear: 'Clear'
    },

    // Settings
    settings: {
      presets: 'Preset Buttons',
      addPreset: '+ Add Preset',
      completed: 'Completed Tabs',
      showCompleted: 'Show completed tabs briefly',
      duration: 'Duration (seconds):',
      reset: 'Reset to Default',
      save: 'Save Settings',
      language: 'Language',
      notifications: 'Notifications',
      about: 'About',
      community: 'Community & Support',
      sound: 'Sound Effects',
      soundEnabled: 'Enable sounds',
      soundDesc: 'Play sounds when snoozing tabs',
      desktopNotifications: 'Desktop Notifications',
      desktopNotificationsDesc: 'Show notification when tab reopens',
      version: 'Version',
      author: 'Made with'
    },

    // Settings pages
    settingsPage: {
      presetsTitle: 'Manage Presets',
      presetsDesc: 'Customize your quick snooze buttons',
      languageTitle: 'Language',
      languageDesc: 'Choose your preferred language',
      notificationsTitle: 'Notifications',
      notificationsDesc: 'Manage how you receive alerts',
      aboutTitle: 'About',
      aboutDesc: 'Version and information',
      communityTitle: 'Community',
      communityDesc: 'Get help and join our community',
      soundTitle: 'Sound Effects',
      soundDesc: 'Choose between sound or silent mode'
    },

    // Edit modal
    edit: {
      title: 'Edit Snoozed Tab',
      reschedule: 'Reschedule',
      customTime: 'Custom Time',
      scheduledFor: '📅 Scheduled for:',
      todayAt: 'Today at',
      orPickDate: 'Or pick date',
      openNow: '🚀 Open Now',
      saveChanges: '💾 Save Changes'
    },

    // Time formats
    time: {
      today: 'Today',
      tomorrow: 'Tomorrow',
      at: 'at'
    }
  },

  ru: {
    // Navigation
    nav: {
      dashboard: 'Дашборд',
      snoozed: 'Отложенные',
      history: 'История',
      settings: 'Настройки'
    },

    // Sections
    section: {
      quickPresets: 'Быстрые пресеты',
      smartPresets: 'Умные пресеты',
      customPresets: 'Ваши пресеты'
    },

    // Presets
    preset: {
      '1hour': '1 час',
      '3hours': '3 часа',
      '6hours': '6 часов',
      laterToday: 'Сегодня позже',
      thisEvening: 'Сегодня вечером',
      tomorrow: 'Завтра',
      nextWeekend: 'Следующие выходные',
      nextWeek: 'Следующая неделя',
      inMonth: 'Через месяц',
      someday: 'Когда-нибудь',
      pickDate: 'Выбрать дату'
    },

    // Empty states
    empty: {
      noSnoozed: 'Нет отложенных вкладок',
      goToDashboard: 'Перейдите в Дашборд, чтобы отложить эту вкладку',
      noHistory: 'История пуста',
      noHistoryDesc: 'Завершенные вкладки появятся здесь'
    },

    // History
    history: {
      title: '📜 Недавно открытые',
      clear: 'Очистить'
    },

    // Settings
    settings: {
      presets: 'Кнопки пресетов',
      addPreset: '+ Добавить пресет',
      completed: 'Завершенные вкладки',
      showCompleted: 'Показывать завершенные вкладки',
      duration: 'Длительность (секунд):',
      reset: 'Сбросить',
      save: 'Сохранить',
      language: 'Язык',
      notifications: 'Уведомления',
      about: 'О программе',
      community: 'Сообщество',
      sound: 'Звуковые эффекты',
      soundEnabled: 'Включить звуки',
      soundDesc: 'Воспроизводить звуки при откладывании вкладок',
      desktopNotifications: 'Уведомления на рабочем столе',
      desktopNotificationsDesc: 'Показывать уведомление при повторном открытии вкладки',
      version: 'Версия',
      author: 'Сделано с'
    },

    // Settings pages
    settingsPage: {
      presetsTitle: 'Управление пресетами',
      presetsDesc: 'Настройте кнопки быстрого откладывания',
      languageTitle: 'Язык',
      languageDesc: 'Выберите предпочитаемый язык',
      notificationsTitle: 'Уведомления',
      notificationsDesc: 'Управление оповещениями',
      aboutTitle: 'О программе',
      aboutDesc: 'Версия и информация',
      communityTitle: 'Сообщество',
      communityDesc: 'Получите помощь и присоединяйтесь к нам',
      soundTitle: 'Звуковые эффекты',
      soundDesc: 'Выберите между звуковым и тихим режимом'
    },

    // Edit modal
    edit: {
      title: 'Редактировать вкладку',
      reschedule: 'Перенести',
      customTime: 'Настраиваемое время',
      scheduledFor: '📅 Запланировано на:',
      todayAt: 'Сегодня в',
      orPickDate: 'Или выберите дату',
      openNow: '🚀 Открыть сейчас',
      saveChanges: '💾 Сохранить'
    },

    // Time formats
    time: {
      today: 'Сегодня',
      tomorrow: 'Завтра',
      at: 'в'
    }
  },

  de: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      snoozed: 'Schlummernd',
      history: 'Verlauf',
      settings: 'Einstellungen'
    },

    // Sections
    section: {
      quickPresets: 'Schnellvorlagen',
      smartPresets: 'Smarte Vorlagen',
      customPresets: 'Deine Vorlagen'
    },

    // Presets
    preset: {
      '1hour': '1 Stunde',
      '3hours': '3 Stunden',
      '6hours': '6 Stunden',
      laterToday: 'Später heute',
      thisEvening: 'Heute Abend',
      tomorrow: 'Morgen',
      nextWeekend: 'Nächstes Wochenende',
      nextWeek: 'Nächste Woche',
      inMonth: 'In einem Monat',
      someday: 'Irgendwann',
      pickDate: 'Datum wählen'
    },

    // Empty states
    empty: {
      noSnoozed: 'Keine schlummernden Tabs',
      goToDashboard: 'Gehe zum Dashboard, um diesen Tab zu schlummern',
      noHistory: 'Kein Verlauf',
      noHistoryDesc: 'Abgeschlossene Tabs erscheinen hier'
    },

    // History
    history: {
      title: '📜 Kürzlich geöffnet',
      clear: 'Löschen'
    },

    // Settings
    settings: {
      presets: 'Vorlagen-Buttons',
      addPreset: '+ Vorlage hinzufügen',
      completed: 'Abgeschlossene Tabs',
      showCompleted: 'Abgeschlossene Tabs kurz anzeigen',
      duration: 'Dauer (Sekunden):',
      reset: 'Zurücksetzen',
      save: 'Speichern',
      desktopNotifications: 'Desktop-Benachrichtigungen',
      desktopNotificationsDesc: 'Benachrichtigung zeigen, wenn der Tab wieder geöffnet wird',
      version: 'Version',
      author: 'Gemacht mit',
      language: 'Sprache',
      notifications: 'Benachrichtigungen',
      about: 'Über',
      community: 'Community',
      sound: 'Soundeffekte',
      soundEnabled: 'Sounds aktivieren',
      soundDesc: 'Sounds abspielen beim Tabs schlummern'
    },

    // Settings pages
    settingsPage: {
      presetsTitle: 'Vorlagen verwalten',
      presetsDesc: 'Passe deine Schnell-Wiedereröffnungs-Buttons an',
      languageTitle: 'Sprache',
      languageDesc: 'Wähle deine bevorzugte Sprache',
      notificationsTitle: 'Benachrichtigungen',
      notificationsDesc: 'Verwalte deine Warnungen',
      aboutTitle: 'Über',
      aboutDesc: 'Version und Informationen',
      communityTitle: 'Community',
      communityDesc: 'Hilfe erhalten und beitreten',
      soundTitle: 'Soundeffekte',
      soundDesc: 'Wähle zwischen Sound- oder Silent-Modus'
    },

    // Edit modal
    edit: {
      title: 'Schlummernden Tab bearbeiten',
      reschedule: 'Neu planen',
      customTime: 'Benutzerdefinierte Zeit',
      scheduledFor: '📅 Geplant für:',
      todayAt: 'Heute um',
      orPickDate: 'Oder Datum wählen',
      openNow: '🚀 Jetzt öffnen',
      saveChanges: '💾 Speichern'
    },

    // Time formats
    time: {
      today: 'Heute',
      tomorrow: 'Morgen',
      at: 'um'
    }
  },

  es: {
    // Navigation
    nav: {
      dashboard: 'Panel',
      snoozed: 'Pospuestas',
      history: 'Historial',
      settings: 'Configuración'
    },

    // Sections
    section: {
      quickPresets: 'Accesos rápidos',
      smartPresets: 'Accesos inteligentes',
      customPresets: 'Tus accesos'
    },

    // Presets
    preset: {
      '1hour': '1 hora',
      '3hours': '3 horas',
      '6hours': '6 horas',
      laterToday: 'Más tarde hoy',
      thisEvening: 'Esta noche',
      tomorrow: 'Mañana',
      nextWeekend: 'Próximo fin de semana',
      nextWeek: 'Próxima semana',
      inMonth: 'En un mes',
      someday: 'Algún día',
      pickDate: 'Elegir fecha'
    },

    // Empty states
    empty: {
      noSnoozed: 'No hay pestañas pospuestas',
      goToDashboard: 'Ve al Panel para posponer esta pestaña',
      noHistory: 'Sin historial',
      noHistoryDesc: 'Las pestañas completadas aparecerán aquí'
    },

    // History
    history: {
      title: '📜 Abiertas recientemente',
      clear: 'Limpiar'
    },

    // Settings
    settings: {
      presets: 'Botones de acceso',
      addPreset: '+ Añadir acceso',
      completed: 'Pestañas completadas',
      showCompleted: 'Mostrar pestañas completadas brevemente',
      duration: 'Duración (segundos):',
      reset: 'Restablecer',
      save: 'Guardar',
      language: 'Idioma',
      notifications: 'Notificaciones',
      about: 'Acerca de',
      community: 'Comunidad',
      sound: 'Efectos de sonido',
      soundEnabled: 'Activar sonidos',
      soundDesc: 'Reproducir sonidos al posponer pestañas',
      desktopNotifications: 'Notificaciones de escritorio',
      desktopNotificationsDesc: 'Mostrar notificación al reabrir la pestaña',
      version: 'Versión',
      author: 'Hecho con'
    },

    // Settings pages
    settingsPage: {
      presetsTitle: 'Gestionar accesos',
      presetsDesc: 'Personaliza tus botones de posposición rápida',
      languageTitle: 'Idioma',
      languageDesc: 'Elige tu idioma preferido',
      notificationsTitle: 'Notificaciones',
      notificationsDesc: 'Gestiona tus alertas',
      aboutTitle: 'Acerca de',
      aboutDesc: 'Versión e información',
      communityTitle: 'Comunidad',
      communityDesc: 'Obtén ayuda y únete',
      soundTitle: 'Efectos de sonido',
      soundDesc: 'Elige entre modo con sonido o silencioso'
    },

    // Edit modal
    edit: {
      title: 'Editar pestaña pospuesta',
      reschedule: 'Reprogramar',
      customTime: 'Hora personalizada',
      scheduledFor: '📅 Programado para:',
      todayAt: 'Hoy a las',
      orPickDate: 'O elegir fecha',
      openNow: '🚀 Abrir ahora',
      saveChanges: '💾 Guardar cambios'
    },

    // Time formats
    time: {
      today: 'Hoy',
      tomorrow: 'Mañana',
      at: 'a las'
    }
  },

  zh: {
    // Navigation
    nav: {
      dashboard: '仪表板',
      snoozed: '已暂停',
      history: '历史记录',
      settings: '设置'
    },

    // Sections
    section: {
      quickPresets: '快速预设',
      smartPresets: '智能预设',
      customPresets: '自定义预设'
    },

    // Presets
    preset: {
      '1hour': '1小时',
      '3hours': '3小时',
      '6hours': '6小时',
      laterToday: '今天稍后',
      thisEvening: '今晚',
      tomorrow: '明天',
      nextWeekend: '下周末',
      nextWeek: '下周',
      inMonth: '一个月后',
      someday: '某天',
      pickDate: '选择日期'
    },

    // Empty states
    empty: {
      noSnoozed: '没有暂停的标签页',
      goToDashboard: '前往仪表板暂停此标签页',
      noHistory: '暂无历史记录',
      noHistoryDesc: '完成的标签页将显示在这里'
    },

    // History
    history: {
      title: '📜 最近打开',
      clear: '清除'
    },

    // Settings
    settings: {
      presets: '预设按钮',
      addPreset: '+ 添加预设',
      completed: '已完成的标签页',
      showCompleted: '短暂显示已完成的标签页',
      duration: '持续时间（秒）：',
      reset: '重置',
      save: '保存设置',
      language: '语言',
      notifications: '通知',
      about: '关于',
      community: '社区',
      sound: '音效',
      soundEnabled: '启用音效',
      soundDesc: '暂停标签页时播放声音',
      desktopNotifications: '桌面通知',
      desktopNotificationsDesc: '重新打开标签页时显示通知',
      version: '版本',
      author: '由',
    },

    // Settings pages
    settingsPage: {
      presetsTitle: '管理预设',
      presetsDesc: '自定义快速暂停按钮',
      languageTitle: '语言',
      languageDesc: '选择你的首选语言',
      notificationsTitle: '通知',
      notificationsDesc: '管理提醒方式',
      aboutTitle: '关于',
      aboutDesc: '版本和信息',
      communityTitle: '社区',
      communityDesc: '获取帮助并加入我们',
      soundTitle: '音效',
      soundDesc: '选择有声模式或静音模式'
    },

    // Edit modal
    edit: {
      title: '编辑暂停的标签页',
      reschedule: '重新安排',
      customTime: '自定义时间',
      scheduledFor: '📅 计划于：',
      todayAt: '今天',
      orPickDate: '或选择日期',
      openNow: '🚀 立即打开',
      saveChanges: '💾 保存更改'
    },

    // Time formats
    time: {
      today: '今天',
      tomorrow: '明天',
      at: '在'
    }
  }
};


class I18n {
  constructor() {
    this.currentLocale = 'en';
    this.loadLocale();
  }

  loadLocale() {
    // Try to load from storage
    chrome.storage.local.get('locale', (result) => {
      if (result.locale && locales[result.locale]) {
        this.currentLocale = result.locale;
      } else {
        // Try to detect from browser
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('ru')) {
          this.currentLocale = 'ru';
        } else if (browserLang.startsWith('de')) {
          this.currentLocale = 'de';
        } else if (browserLang.startsWith('es')) {
          this.currentLocale = 'es';
        } else if (browserLang.startsWith('zh')) {
          this.currentLocale = 'zh';
        }
      }
      this.updateUI();
    });
  }

  setLocale(locale) {
    if (locales[locale]) {
      this.currentLocale = locale;
      chrome.storage.local.set({ locale: locale });
      this.updateUI();
    }
  }

  get(key) {
    const keys = key.split('.');
    let value = locales[this.currentLocale];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to English
        value = locales['en'];
        for (const fallbackKey of keys) {
          if (value && value[fallbackKey]) {
            value = value[fallbackKey];
          } else {
            return key;
          }
        }
        break;
      }
    }

    return value;
  }

  updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.get(key);
    });
  }

  getAvailableLocales() {
    return Object.keys(locales).map(code => ({
      code,
      name: locales[code].settings?.language || code,
      nativeName: {
        'en': 'English',
        'ru': 'Русский',
        'de': 'Deutsch',
        'es': 'Español',
        'zh': '中文'
      }[code] || code
    }));
  }
}

// Create global instance
const i18n = new I18n();
