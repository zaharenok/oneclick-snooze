# -*- coding: utf-8 -*-
"""Master table for Chrome Web Store listing. Edit here, then run build.py.

Locales: 5 UI languages (popup/locales.js: en, ru, de, es, zh) + 12 popular
Chrome Web Store listing languages (uk, fr, pt, it, pl, tr, ja, tw, ko, nl,
vi, id). Localized listings do NOT imply UI support — every long description
states the real UI language set. No _locales in this project.
"""
from pathlib import Path

TITLES, SHORTS, LONGS = {}, {}, {}


def reg(lang, title, short, long):
    TITLES[lang] = title
    SHORTS[lang] = short
    LONGS[lang] = long


# ---------------------------------------------------------------- English (default)
reg("en",
    "Tab Snooze – Close and Reopen Later",
    "Snooze tabs: close now, reopen later on a tab timer. OneClick Snooze cuts tab clutter and frees memory. Free, no account.",
    """Snooze a tab in one click: close it now, and it reopens automatically later — tonight, tomorrow at 9:00, or any custom time. OneClick Snooze is a free tab timer and tab snooze extension for Chrome: close tabs and reopen them later, exactly when you need them.

Too many open tabs slow the browser down, eat memory and bury what matters under clutter. Instead of keeping tabs open "just in case", snooze them: the tab closes (Chrome gets lighter right away) and comes back on schedule — alarms survive Chrome restarts, and overdue tabs are restored automatically on startup, even after a computer shutdown.

Features:
1. One-click tab snooze — pick a preset (in 30 minutes, this evening, tomorrow at 9:00) or set any custom date and time. Your tab timer, your schedule.
2. Tabs reopen automatically on time — no missed reminders, even after restarts.
3. Snoozed-tabs dashboard: reschedule any tab, open it now, or cancel.
4. History of everything you snoozed, with dates and times.
5. Custom presets: your own names and emoji for each time slot.
6. Desktop notification and optional sound reminder when a tab comes back.
Free, no account, no ads. Interface in English, Russian, German, Spanish and Chinese.

What people use it for: close tabs and reopen later, save tabs for later reading, set a tab reminder, clear tab clutter, free up memory and focus — a "read later" button for your whole browser.

How to use: click the extension icon → choose when the tab should come back → the tab closes. It reopens automatically at the chosen time.

Add OneClick Snooze to Chrome — free. Close the tab now; it comes back exactly when you need it.""")

# ---------------------------------------------------------------- Russian
reg("ru",
    "Таймер вкладок: закрыть сейчас, открыть позже",
    "Сон вкладок и таймер вкладок: закройте сейчас, откройте позже. Меньше вкладок, больше памяти. Бесплатно, без аккаунта.",
    """Отложите вкладку в один клик: закройте сейчас — и она автоматически откроется позже: сегодня вечером, завтра в 9:00 или в любое выбранное время. OneClick Snooze — бесплатный таймер вкладок и расширение «сон вкладок» для Chrome: закройте вкладки и откройте их позже, ровно когда нужно.

Слишком много открытых вкладок замедляют браузер, забивают память и важное тонет среди лишнего. Вместо того чтобы держать вкладки открытыми «на всякий случай», отложите их: вкладка закрывается (Chrome сразу легче) и возвращается по расписанию — будильники переживают перезапуск Chrome, а просроченные вкладки восстанавливаются при старте, даже после выключения компьютера.

Функции:
1. Откладывание вкладок в один клик — пресет (через 30 минут, сегодня вечером, завтра в 9:00) или любое своё время. Ваш таймер вкладок — ваше расписание.
2. Вкладки открываются автоматически вовремя — напоминания не теряются даже после перезапуска.
3. Панель отложенных вкладок: измените время, откройте сразу или отмените.
4. История всех отложенных вкладок с датами и временем.
5. Свои пресеты: собственные названия и эмодзи для каждого времени.
6. Уведомление на рабочем столе и звуковое напоминание, когда вкладка возвращается.
Бесплатно, без аккаунта и рекламы. Интерфейс на английском, русском, немецком, испанском и китайском.

Для чего используют: закрыть вкладки и открыть позже, сохранить вкладки на потом, поставить напоминание по вкладке, навести порядок в вкладках, освободить память и сосредоточиться — кнопка «прочитать позже» для всего браузера.

Как пользоваться: нажмите на иконку расширения → выберите, когда вернуть вкладку → вкладка закроется. Она откроется автоматически в выбранное время.

Добавьте OneClick Snooze в Chrome — бесплатно. Закройте вкладку сейчас — она вернётся ровно тогда, когда нужно.""")

# ---------------------------------------------------------------- German
reg("de",
    "Tab-Timer: Tabs schließen und später öffnen",
    "Tabs schlafenlegen mit Tab-Timer: jetzt schließen, später automatisch öffnen. Weniger Tabs, mehr Speicher. Kostenlos.",
    """Legen Sie Tabs mit einem Klick schlafen: Jetzt schließen — und sie öffnen sich automatisch später von selbst: heute Abend, morgen um 9:00 oder zu Ihrer eigenen Zeit. OneClick Snooze ist ein kostenloser Tab-Timer und Tab-Snoozer für Chrome: Tabs schließen und später öffnen, genau dann, wenn Sie sie brauchen.

Zu viele offene Tabs machen den Browser langsam, fressen Speicher und begraben Wichtiges im Chaos. Statt Tabs „für alle Fälle“ offen zu lassen, legen Sie sie schlafen: Der Tab schließt (Chrome wird sofort leichter) und kommt pünktlich zurück — Wecker überleben Chrome-Neustarts, überfällige Tabs werden beim Start automatisch wiederhergestellt, sogar nach einem Rechner-Ausschalten.

Funktionen:
1. Tab in einem Klick schlafenlegen — Voreinstellung wählen (in 30 Minuten, heute Abend, morgen um 9:00) oder eigene Datum-Uhrzeit. Ihr Tab-Timer, Ihr Zeitplan.
2. Tabs öffnen sich automatisch pünktlich — Erinnerungen gehen selbst nach Neustarts nicht verloren.
3. Übersicht aller schlafgelegten Tabs: Zeit ändern, sofort öffnen oder abbrechen.
4. Verlauf aller schlafgelegten Tabs mit Datum und Uhrzeit.
5. Eigene Voreinstellungen: Namen und Emoji für jeden Zeitraum.
6. Desktop-Benachrichtigung und optionaler Ton, wenn ein Tab zurückkommt.
Kostenlos, ohne Konto, ohne Werbung. Oberfläche auf Englisch, Russisch, Deutsch, Spanisch und Chinesisch.

Wofür es genutzt wird: Tabs schließen und später öffnen, Tabs zum Lesen aufheben, Tab-Erinnerung setzen, Tab-Chaos aufräumen, Speicher freigeben und sich konzentrieren — eine „später lesen“-Taste für den ganzen Browser.

So geht es: auf das Erweiterungssymbol klicken → wählen, wann der Tab zurückkommen soll → der Tab schließt sich. Er öffnet sich zur gewählten Zeit automatisch.

OneClick Snooze zu Chrome hinzufügen — kostenlos. Tab jetzt schließen; er kommt genau dann zurück, wenn Sie ihn brauchen.""")

# ---------------------------------------------------------------- Spanish
reg("es",
    "Temporizador de pestañas: cerrar y reabrir",
    "Temporizador de pestañas: cierra ahora y reabre después automáticamente. Menos pestañas, más memoria. Gratis, sin cuenta.",
    """Duerme una pestaña con un clic: ciérrala ahora y se reabre automáticamente después — esta noche, mañana a las 9:00 o a la hora que elijas. OneClick Snooze es un temporizador de pestañas y extensión de «snooze» de pestañas gratis para Chrome: cierra pestañas y reábrelas después, exactamente cuando las necesitas.

Demasiadas pestañas abiertas ralentizan el navegador, consumen memoria y entierran lo importante entre el desorden. En vez de mantener pestañas abiertas «por si acaso», duérmelas: la pestaña se cierra (Chrome se alivia al instante) y vuelve según el horario — las alarmas sobreviven a los reinicios de Chrome y las pestañas vencidas se restauran al arrancar, incluso tras apagar el equipo.

Funciones:
1. Un clic para posponer una pestaña — elige un ajuste (en 30 minutos, esta noche, mañana a las 9:00) o tu hora personalizada. Tu temporizador de pestañas, tu horario.
2. Las pestañas se reabren automáticamente a tiempo — ningún recordatorio perdido, ni siquiera tras reinicios.
3. Panel de pestañas pospuestas: cambia la hora, ábrelas ahora o cancela.
4. Historial de todo lo que pospusiste, con fechas y horas.
5. Ajustes personalizados: tus propios nombres y emoji para cada franja.
6. Notificación de escritorio y aviso sonoro opcional cuando vuelve una pestaña.
Gratis, sin cuenta, sin anuncios. Interfaz en inglés, ruso, alemán, español y chino.

Para qué se usa: cerrar pestañas y reabrir después, guardar pestañas para leer más tarde, poner un recordatorio de pestaña, ordenar el lío de pestañas, liberar memoria y concentrarse — un botón de «leer más tarde» para todo el navegador.

Cómo se usa: haz clic en el icono de la extensión → elige cuándo debe volver la pestaña → la pestaña se cierra. Se reabre automáticamente a la hora elegida.

Añade OneClick Snooze a Chrome — gratis. Cierra la pestaña ahora; vuelve exactamente cuando la necesitas.""")

# ---------------------------------------------------------------- Simplified Chinese
reg("zh",
    "标签页定时器：关闭后稍后打开",
    "标签页定时器：现在关闭，稍后自动打开。清理标签页，释放内存。免费，无需登录。",
    """一键休眠标签页：现在关闭，稍后自动重新打开——今晚、明天 9:00，或你选择的任何时间。OneClick Snooze 是一款免费的标签页定时器和休眠扩展：关闭标签页，稍后再打开，需要的时候准时回来。

打开的标签页太多，浏览器会变慢、内存被占满，重要内容也会淹没在混乱中。与其“以防万一”一直开着标签页，不如让它们休眠：标签页立即关闭（Chrome 立刻变轻），并按计划回来——闹钟能挺过 Chrome 重启，过期的标签页会在启动时自动恢复，即使电脑关机后也一样。

功能:
1. 一键休眠标签页——选择预设（30 分钟后、今晚、明天 9:00）或自定义日期和时间。你的标签页定时器，你的时间表。
2. 标签页按时自动打开——即使重启也不会错过提醒。
3. 休眠标签页面板：修改时间、立即打开或取消。
4. 所有休眠记录的历史，含日期与时间。
5. 自定义预设：为每个时间段设置自己的名称和表情符号。
6. 标签页返回时的桌面通知和可选声音提醒。
免费、无账号、无广告。界面支持英、俄、德、西、中五种语言。

用途：关闭标签页稍后打开、保存稍后阅读的标签页、设置标签页提醒、清理标签页混乱、释放内存、保持专注——整个浏览器的“阅读稍后”按钮。

用法：点击扩展图标 → 选择标签页何时返回 → 标签页关闭，到时自动重新打开。

把 OneClick Snooze 添加到 Chrome——免费。现在关闭标签页，需要的时候它会准时回来。""")

# ---------------------------------------------------------------- Ukrainian
reg("uk",
    "Таймер вкладок: закрити і відкрити потім",
    "Сон вкладок і таймер вкладок: закрийте зараз, відкрийте потім. Менше вкладок — більше пам'яті. Безкоштовно, без акаунта.",
    """Відкладіть вкладку одним кліком: закрийте зараз — і вона автоматично відкриється потім: сьогодні ввечері, завтра о 9:00 або у вибраний час. OneClick Snooze — безкоштовний таймер вкладок і розширення «сон вкладок» для Chrome: закрийте вкладки й відкрийте їх потім, саме коли потрібно.

Забагато відкритих вкладок уповільнює браузер, забиває пам'ять, а важливе губиться серед зайвого. Замість того щоб тримати вкладки відкритими «на всякий випадок», відкладіть їх: вкладка закривається (Chrome одразу легший) і повертається за розкладом — нагадування переживають перезапуск Chrome, а прострочені вкладки відновлюються при старті, навіть після вимкнення комп'ютера.

Функції:
1. Відкладення вкладки одним кліком — пресет (через 30 хвилин, сьогодні ввечері, завтра о 9:00) або власний час. Ваш таймер вкладок — ваш розклад.
2. Вкладки відкриваються автоматично вчасно — нагадування не губляться навіть після перезапуску.
3. Панель відкладених вкладок: змініть час, відкрийте зараз або скасуйте.
4. Історія всіх відкладених вкладок із датами й часом.
5. Власні пресети: свої назви та емодзі для кожного часу.
6. Сповіщення на робочому столі й звукове нагадування, коли вкладка повертається.
Безкоштовно, без акаунта й реклами. Інтерфейс англійською, російською, німецькою, іспанською та китайською.

Для чого використовують: закрити вкладки й відкрити пізніше, зберегти вкладки на потім, поставити нагадування по вкладці, навести лад у вкладках, звільнити пам'ять і зосередитися — кнопка «прочитати пізніше» для всього браузера.

Як користуватися: натисніть на іконку розширення → оберіть, коли повернути вкладку → вкладка закриється. Вона відкриється автоматично у вибраний час.

Додайте OneClick Snooze до Chrome — безкоштовно. Закрийте вкладку зараз — вона повернеться саме тоді, коли потрібно.""")

# ---------------------------------------------------------------- French
reg("fr",
    "Minuteur d'onglets : fermer et rouvrir",
    "Minuteur d'onglets : fermez maintenant, rouvrez plus tard automatiquement. Moins d'onglets, plus de mémoire. Gratuit, sans compte.",
    """Mettez un onglet en veille en un clic : fermez-le maintenant, il se rouvre automatiquement plus tard — ce soir, demain à 9h, ou à l'heure de votre choix. OneClick Snooze est un minuteur d'onglets et une extension de veille d'onglets gratuite pour Chrome : fermez des onglets et rouvrez-les plus tard, exactement quand vous en avez besoin.

Trop d'onglets ouverts ralentissent le navigateur, remplissent la mémoire et noient l'important dans le désordre. Au lieu de garder des onglets ouverts « au cas où », mettez-les en veille : l'onglet se ferme (Chrome devient immédiatement plus léger) et revient selon le programme — les alarmes survivent aux redémarrages de Chrome, et les onglets en retard sont restaurés au démarrage, même après une extinction de l'ordinateur.

Fonctionnalités :
1. Un clic pour mettre en veille — choisissez un préréglage (dans 30 minutes, ce soir, demain à 9h) ou votre heure personnalisée. Votre minuteur, votre programme.
2. Les onglets se rouvrent automatiquement à l'heure — aucun rappel perdu, même après un redémarrage.
3. Tableau des onglets en veille : changez l'heure, ouvrez maintenant ou annulez.
4. Historique de tous vos onglets reportés, avec dates et heures.
5. Préréglages personnalisés : vos noms et emojis pour chaque créneau.
6. Notification bureau et rappel sonore optionnel quand un onglet revient.
Gratuit, sans compte, sans publicité. Interface en anglais, russe, allemand, espagnol et chinois.

Utilisé pour : fermer des onglets et les rouvrir plus tard, garder des onglets à lire plus tard, programmer un rappel d'onglet, ranger l'encombrement d'onglets, libérer de la mémoire et se concentrer — un bouton « à lire plus tard » pour tout votre navigateur.

Comment faire : cliquez sur l'icône de l'extension → choisissez quand l'onglet doit revenir → l'onglet se ferme. Il se rouvre automatiquement à l'heure choisie.

Ajoutez OneClick Snooze à Chrome — c'est gratuit. Fermez l'onglet maintenant ; il revient exactement quand vous en avez besoin.""")

# ---------------------------------------------------------------- Portuguese (Brazil)
reg("pt",
    "Temporizador de abas: fechar e reabrir",
    "Temporizador de abas: feche agora e reabra depois automaticamente. Menos abas, mais memória. Grátis, sem conta.",
    """Durma uma aba com um clique: feche agora e ela reabre automaticamente depois — hoje à noite, amanhã às 9h ou no horário que você escolher. OneClick Snooze é um temporizador de abas e extensão de «snooze» de abas gratuita para Chrome: feche abas e reabra-as depois, exatamente quando precisar.

Abas demais abertas deixam o navegador lento, enchem a memória e enterram o importante no desorganizado. Em vez de manter abas abertas “por garantia”, durma-as: a aba fecha (o Chrome fica mais leve na hora) e volta conforme o horário — os alarmes sobrevivem a reinícios do Chrome e abas vencidas são restauradas na inicialização, mesmo depois de desligar o computador.

Funções:
1. Um clique para adiar uma aba — escolha um predefinido (em 30 minutos, hoje à noite, amanhã às 9h) ou seu horário personalizado. Seu temporizador de abas, seu horário.
2. As abas reabrem automaticamente no horário — nenhum lembrete perdido, mesmo após reinícios.
3. Painel de abas adiadas: mude o horário, abra agora ou cancele.
4. Histórico de todas as abas adiadas, com datas e horários.
5. Predefinições personalizadas: seus nomes e emoji para cada horário.
6. Notificação na área de trabalho e lembrete sonoro opcional quando uma aba volta.
Grátis, sem conta, sem anúncios. Interface em inglês, russo, alemão, espanhol e chinês.

Para que serve: fechar abas e reabrir depois, guardar abas para ler mais tarde, definir lembrete de aba, organizar o excesso de abas, liberar memória e focar — um botão de “ler depois” para todo o navegador.

Como usar: clique no ícone da extensão → escolha quando a aba deve voltar → a aba fecha. Ela reabre automaticamente na hora escolhida.

Adicione o OneClick Snooze ao Chrome — é grátis. Feche a aba agora; ela volta exatamente quando você precisar.""")

# ---------------------------------------------------------------- Italian
reg("it",
    "Timer per schede: chiudi e riapri dopo",
    "Timer per schede: chiudi ora e riapri dopo automaticamente. Meno schede, più memoria. Gratis, senza account.",
    """Metti una scheda in sospensione con un clic: chiudila ora e si riapre automaticamente più tardi — stasera, domani alle 9:00 o all'ora che scegli. OneClick Snooze è un timer per schede e un'estensione di sospensione delle schede gratuita per Chrome: chiudi schede e riaprile dopo, esattamente quando ti servono.

Troppe schede aperte rallentano il browser, riempiono la memoria e seppelliscono le cose importanti nel disordine. Invece di tenere schede aperte “per sicurezza”, mettile in sospensione: la scheda si chiude (Chrome è subito più leggero) e torna secondo programma — le sveglie sopravvivono ai riavvii di Chrome e le schede scadute vengono ripristinate all'avvio, anche dopo lo spegnimento del computer.

Funzionalità:
1. Un clic per rimandare una scheda — scegli una preimpostazione (tra 30 minuti, stasera, domani alle 9:00) o il tuo orario personalizzato. Il tuo timer per schede, il tuo programma.
2. Le schede si riaprono automaticamente in orario — nessun promemoria perso, nemmeno dopo i riavvii.
3. Elenco delle schede rimandate: cambia l'ora, apri subito o annulla.
4. Cronologia di tutte le schede rimandate, con date e orari.
5. Preimpostazioni personalizzate: i tuoi nomi ed emoji per ogni fascia.
6. Notifica desktop e promemoria sonoro opzionale quando una scheda torna.
Gratis, senza account, senza pubblicità. Interfaccia in inglese, russo, tedesco, spagnolo e cinese.

A cosa serve: chiudere schede e riaprirle dopo, salvare schede da leggere più tardi, impostare un promemoria per una scheda, riordinare la confusione di schede, liberare memoria e concentrarsi — un pulsante “da leggere dopo” per tutto il browser.

Come si usa: clicca sull'icona dell'estensione → scegli quando deve tornare la scheda → la scheda si chiude. Si riapre automaticamente all'ora scelta.

Aggiungi OneClick Snooze a Chrome — è gratis. Chiudi la scheda ora; torna esattamente quando ti serve.""")

# ---------------------------------------------------------------- Polish
reg("pl",
    "Czasomierz kart: zamknij i otwórz później",
    "Czasomierz kart: zamknij teraz, otwórz później automatycznie. Mniej kart, więcej pamięci. Za darmo, bez konta.",
    """Uśpij kartę jednym kliknięciem: zamknij teraz — otworzy się automatycznie później: dziś wieczorem, jutro o 9:00 lub o wybranej przez ciebie godzinie. OneClick Snooze to darmowy czasomierz kart i rozszerzenie do usypiania kart dla Chrome: zamykaj karty i otwieraj je później, dokładnie wtedy, gdy ich potrzebujesz.

Za dużo otwartych kart spowalnia przeglądarkę, zapełnia pamięć i grzebie ważne rzeczy w bałaganie. Zamiast trzymać karty otwarte „na wszelki wypadek”, uśpij je: karta się zamyka (Chrome od razu jest lżejszy) i wraca według harmonogramu — alarmy przeżywają ponowne uruchomienia Chrome'a, a przeterminowane karty są przywracane przy starcie, nawet po wyłączeniu komputera.

Funkcje:
1. Jedno kliknięcie, aby odłożyć kartę — wybierz gotowy czas (za 30 minut, dziś wieczorem, jutro o 9:00) lub własny. Twój czasomierz kart, twój harmonogram.
2. Karty otwierają się automatycznie o czasie — żadne przypomnienie nie ginie nawet po ponownym uruchomieniu.
3. Panel odłożonych kart: zmień godzinę, otwórz teraz lub anuluj.
4. Historia wszystkich odłożonych kart z datami i godzinami.
5. Własne ustawienia: twoje nazwy i emoji dla każdego przedziału czasu.
6. Powiadomienie na pulpicie i opcjonalny dźwiękowy sygnał, gdy karta wraca.
Za darmo, bez konta, bez reklam. Interfejs po angielsku, rosyjsku, niemiecku, hiszpańsku i chińsku.

Do czego służy: zamknąć karty i otworzyć później, zapisać karty do przeczytania, ustawić przypomnienie o karcie, uprzątnąć bałagan kart, zwolnić pamięć i skupić się — przycisk „przeczytaj później” dla całej przeglądarki.

Jak używać: kliknij ikonę rozszerzenia → wybierz, kiedy karta ma wrócić → karta się zamyka. Otwiera się automatycznie o wybranej godzinie.

Dodaj OneClick Snooze do Chrome'a — to darmowe. Zamknij kartę teraz; wróci dokładnie wtedy, gdy jej potrzebujesz.""")

# ---------------------------------------------------------------- Turkish
reg("tr",
    "Sekme zamanlayıcı: kapat ve sonra aç",
    "Sekme zamanlayıcı: şimdi kapat, sonra otomatik aç. Daha az sekme, daha fazla bellek. Ücretsiz, hesapsız.",
    """Bir tıkla sekmeyi uyut: şimdi kapat — sonra kendiliğinden açılsın: bu akşam, yarın 9:00'da veya seçtiğin saatte. OneClick Snooze; Chrome için ücretsiz bir sekme zamanlayıcı ve sekme uyutma uzantısıdır: sekmeleri kapat, gerektiğinde sonra aç.

Çok fazla açık sekme tarayıcıyı yavaşlatır, belleği dolar ve önemliler dağınıklık içinde kaybolur. “Olur da” diye sekmeleri açık tutmak yerine uyut: sekme kapanır (Chrome hafifler) ve programa göre geri gelir — alarmlar Chrome yeniden başlatmalarını atlatır, süresi dolan sekmeler başlangıçta otomatik geri yüklenir, bilgisayar kapatılmış olsa bile.

Özellikler:
1. Tek tıkla sekmeyi erteleme — hazır zaman seç (30 dakika içinde, bu akşam, yarın 9:00'da) veya kendi saatini gir. Senin sekme zamanlayıcın, senin programın.
2. Sekmeler zamanında kendiliğinden açılır — yeniden başlatmalarda bile hatırlatma kaybolmaz.
3. Ertelenen sekmeler paneli: saati değiştir, hemen aç veya iptal et.
4. Ertelenen tüm sekmelerin tarih ve saatli geçmişi.
5. Özel hazır ayarlar: her zaman aralığı için kendi adların ve emojilerin.
6. Masaüstü bildirimi ve isteğe bağlı sesli hatırlatıcı — sekme geri geldiğinde.
Ücretsiz, hesapsız, reklamsız. Arayüz İngilizce, Rusça, Almanca, İspanyolca ve Çince.

Ne için kullanılır: sekmeleri kapatıp sonra açmak, okumak için sekmeleri saklamak, sekme hatırlatıcısı kurmak, sekme dağınıklığını temizlemek, belleği boşaltmak ve odaklanmak — tüm tarayıcın için bir “daha sonra oku” düğmesi.

Nasıl kullanılır: uzantı simgesine tıkla → sekmenin ne zaman geri geleceğini seç → sekme kapanır. Seçilen saatte kendiliğinden yeniden açılır.

OneClick Snooze'u Chrome'a ekle — ücretsiz. Sekmeyi şimdi kapat; tam ihtiyaç duyduğun anda geri gelir.""")

# ---------------------------------------------------------------- Japanese
reg("ja",
    "タブを閉じてあとで開く：タブタイマー",
    "タブタイマー：タブを閉じてあとで自動的に開く。タブ整理とメモリ節約。無料・アカウント不要。",
    """ワンクリックでタブをスヌーズ：今すぐ閉じれば、あとで自動的に開きます——今夜、明日の 9:00、または指定した任意の時刻に。OneClick Snooze は Chrome 向けの無料のタブタイマー兼タブスヌーズ拡張機能です。タブを閉じてあとで開く、必要な瞬間にちょうど戻します。

タブを開きすぎるとブラウザが遅くなり、メモリが埋まり、大事なものが散らがりの中で見失われます。「いつか見るかも」でタブを開いたままにする代わりにスヌーズしましょう。タブは閉じられ（Chrome は即座に軽くなり）、予定どおりに戻ります——アラームは Chrome の再起動を生き延び、期限切れのタブは起動時に自動復元されます。パソコンの電源を切った後でもです。

機能:
1. 1 クリックでタブをスヌーズ——プリセット（30 分後、今夜、明日 9:00）または任意の日時を選択。あなたのタブタイマー、あなたのスケジュール。
2. タブは時間どおりに自動で再開——再起動してもリマインダーは失われません。
3. スヌーズ中タブのダッシュボード——時刻の変更、今すぐ開く、キャンセルが可能。
4. スヌーズしたタブの履歴——日時つきで確認できます。
5. カスタムプリセット——時間帯ごとに名前と絵文字を自由に設定。
6. タブ復帰時のデスクトップ通知と任意のサウンドリマインダー。
無料・アカウント不要・広告なし。英語・ロシア語・ドイツ語・スペイン語・中国語の UI。

用途: タブを閉じてあとで開く、あとで読むタブを保存、タブのリマインダーを設定、タブの断捨離、メモリの解放、集中——ブラウザ全体の「あとで読む」ボタン。

使い方: 拡張アイコンをクリック → タブを戻す時刻を選択 → タブが閉じます。選んだ時刻に自動で開きます。

OneClick Snooze を Chrome に追加——無料。タブは今すぐ閉じて、必要な瞬間にちょうど戻ってきます。""")

# ---------------------------------------------------------------- Traditional Chinese (zh-TW as "tw")
reg("tw",
    "分頁定時器：關閉後稍後開啟",
    "分頁定時器：現在關閉，稍後自動開啟。整理分頁、釋放記憶體。免費，不需登入。",
    """一鍵休眠分頁：現在關閉，稍後自動重新開啟——今晚、明天 9:00，或你選擇的任何時間。OneClick Snooze 是一款免費的分頁定時器與休眠擴充功能：關閉分頁，稍後再開啟，需要的時候準時回來。

開啟的分頁太多，瀏覽器會變慢、記憶體被占滿，重要內容也會淹沒在混亂中。與其「以防萬一」一直開著分頁，不如讓它們休眠：分頁立即關閉（Chrome 立刻變輕），並按計畫回來——鬧鐘能挺過 Chrome 重新啟動，逾期的分頁會在啟動時自動還原，即使電腦關機後也一樣。

功能:
1. 一鍵休眠分頁——選擇預設（30 分鐘後、今晚、明天 9:00）或自訂日期與時間。你的分頁定時器，你的時間表。
2. 分頁按時自動開啟——即使重新啟動也不會錯過提醒。
3. 休眠分頁面板：修改時間、立即開啟或取消。
4. 所有休眠紀錄的歷史，含日期與時間。
5. 自訂預設：為每個時段設定自己的名稱和表情符號。
6. 分頁回來時的桌面通知和可選音效提醒。
免費、無帳號、無廣告。介面支援英、俄、德、西、中五種語言。

用途：關閉分頁稍後開啟、保存稍後閱讀的分頁、設定分頁提醒、清理分頁混亂、釋放記憶體、保持專注——整個瀏覽器的「閱讀稍後」按鈕。

用法：點擊擴充圖示 → 選擇分頁何時返回 → 分頁關閉，到時自動重新開啟。

把 OneClick Snooze 加入 Chrome——免費。現在關閉分頁，需要的時候它會準時回來。""")

# ---------------------------------------------------------------- Korean
reg("ko",
    "탭 타이머: 닫았다가 나중에 열기",
    "탭 타이머: 지금 닫고 나중에 자동으로 엽니다. 탭 정리와 메모리 절약. 무료, 계정 불필요.",
    """클릭 한 번으로 탭 잠자기: 지금 닫으면 나중에 자동으로 다시 열립니다 — 오늘 밤, 내일 오전 9시, 또는 원하는 시간에. OneClick Snooze는 Chrome용 무료 탭 타이머 겸 탭 잠자기 확장 프로그램입니다. 탭을 닫고 나중에 엽니다. 필요한 순간에 정확히 돌아옵니다.

탭을 너무 많이 열어 두면 브라우저가 느려지고 메모리가 가득 차며 중요한 것이 어수선함 속에서 사라집니다. '나중에 볼지도' 하고 탭을 열어 둘 대신 잠자게 하세요. 탭은 닫히고(Chrome이 바로 가벼워짐) 예정대로 돌아옵니다 — 알람은 Chrome 재시작을 견디고, 기한이 지난 탭은 시작 시 자동으로 복원됩니다. 컴퓨터를 끈 후에도 마찬가지입니다.

기능:
1. 클릭 한 번으로 탭 미루기 — 프리셋(30분 후, 오늘 밤, 내일 오전 9시) 또는 원하는 일시 지정. 당신의 탭 타이머, 당신의 일정.
2. 탭이 시간에 맞춰 자동으로 다시 열림 — 재시작 후에도 알림이 사라지지 않습니다.
3. 미뤄 둔 탭 대시보드 — 시간 변경, 지금 열기, 취소 가능.
4. 미뤄 둔 탭의 전체 기록 — 날짜와 시간 표시.
5. 사용자 지정 프리셋 — 시간대별로 이름과 이모지 설정.
6. 탭 복귀 시 데스크톱 알림과 선택적 사운드 리마인더.
무료, 계정 없음, 광고 없음. 영어·러시아어·독일어·스페인어·중국어 UI.

용도: 탭 닫고 나중에 열기, 나중에 읽을 탭 저장, 탭 알림 설정, 탭 정리, 메모리 확보, 집중 유지 — 브라우저 전체를 위한 '나중에 읽기' 버튼.

사용법: 확장 아이콘 클릭 → 탭이 돌아올 시간 선택 → 탭이 닫힙니다. 선택한 시간에 자동으로 다시 열립니다.

OneClick Snooze를 Chrome에 추가하세요 — 무료. 탭은 지금 닫고, 필요한 순간에 정확히 돌아옵니다.""")
# ---------------------------------------------------------------- Dutch
reg("nl",
    "Tabblad-timer: sluiten en later openen",
    "Tabblad-timer: nu sluiten, later automatisch openen. Minder tabbladen, meer geheugen. Gratis, zonder account.",
    """Leg een tabblad met één klik te slapen: sluit nu — en het opent later automatisch vanzelf: vanavond, morgen om 9:00 of op het tijdstip van jouw keuze. OneClick Snooze is een gratis tabblad-timer en tabblad-snooze-extensie voor Chrome: sluit tabbladen en open ze later, precies wanneer je ze nodig hebt.

Te veel open tabbladen maken je browser traag, vreten geheugen en begraven het belangrijke tussen de chaos. Houd geen tabbladen open ‘voor de zekerheid’, maar leg ze te slapen: het tabblad sluit (Chrome wordt direct lichter) en komt volgens schema terug — wekkers overleven Chrome-herstarts, en verlopen tabbladen worden bij het opstarten automatisch hersteld, zelfs na het uitschakelen van de computer.

Functies:
1. Eén klik om uit te stellen — kies een preset (over 30 minuten, vanavond, morgen om 9:00) of je eigen tijd. Jouw tabblad-timer, jouw schema.
2. Tabbladen openen automatisch op tijd — geen verloren herinneringen, zelfs na herstarts.
3. Overzicht van uitgestelde tabbladen: wijzig de tijd, open nu of annuleer.
4. Geschiedenis van alles wat je hebt uitgesteld, met datum en tijd.
5. Eigen presets: je eigen namen en emoji's voor elk tijdsblok.
6. Desktopmelding en optionele geluidsherinnering wanneer een tabblad terugkomt.
Gratis, zonder account, zonder advertenties. Interface in het Engels, Russisch, Duits, Spaans en Chinees.

Waar het voor wordt gebruikt: tabbladen sluiten en later openen, tabbladen bewaren om later te lezen, een tabblad-herinnering instellen, tabbladrommel opruimen, geheugen vrijmaken en focussen — een ‘lees later’-knop voor je hele browser.

Zo gebruik je het: klik op het extensie-icoon → kies wanneer het tabblad terug moet komen → het tabblad sluit. Het opent automatisch op de gekozen tijd.

Voeg OneClick Snooze toe aan Chrome — gratis. Sluit het tabblad nu; het komt precies wanneer je het nodig hebt.""")
# ---------------------------------------------------------------- Vietnamese
reg("vi",
    "Hẹn giờ tab: đóng và mở lại sau",
    "Hẹn giờ tab: đóng ngay, mở lại sau tự động. Ít tab hơn, giải phóng RAM. Miễn phí, không cần tài khoản.",
    """Cho tab tạm ngủ chỉ với một cú nhấp: đóng ngay lúc này — tab sẽ tự mở lại sau: tối nay, 9:00 ngày mai, hoặc vào giờ bạn chọn. OneClick Snooze là tiện ích hẹn giờ tab và đưa tab vào chế độ ngủ miễn phí cho Chrome: đóng tab và mở lại sau, đúng lúc bạn cần.

Mở quá nhiều tab làm trình duyệt chậm đi, bộ nhớ đầy ắp và những thứ quan trọng bị mất giữa đống lộn xộn. Thay vì giữ tab mở “phòng hờ”, hãy cho tab ngủ: tab đóng lại (Chrome nhẹ ngay lập tức) và trở lại theo lịch — báo thức sống sót qua mỗi lần khởi động lại Chrome, tab hết hạn được khôi phục khi mở máy, kể cả sau khi tắt máy.

Tính năng:
1. Một chạm để hẹn giờ đóng tab — chọn mẫu có sẵn (sau 30 phút, tối nay, 9:00 ngày mai) hoặc giờ tùy chỉnh. Cái hẹn giờ tab của bạn, lịch của bạn.
2. Tự mở lại đúng giờ — không bỏ lỡ lời nhắc, kể cả sau khi khởi động lại.
3. Bảng tab đang chờ: đổi giờ, mở ngay hoặc hủy.
4. Lịch sử mọi tab đã hẹn giờ, có ngày giờ đầy đủ.
5. Preset tùy chỉnh: tự đặt tên và emoji cho từng khung giờ.
6. Thông báo trên màn hình và lời nhắc âm thanh tùy chọn khi tab quay lại.
Miễn phí, không tài khoản, không quảng cáo. Giao diện tiếng Anh, Nga, Đức, Tây Ban Nha, Trung Quốc.

Dùng để: đóng tab và mở lại sau, lưu tab để đọc sau, đặt lời nhắc cho tab, dọn dẹp tab lộn xộn, giải phóng bộ nhớ và tập trung — nút “đọc sau” cho cả trình duyệt.

Cách dùng: bấm vào biểu tượng tiện ích → chọn lúc nào tab quay lại → tab đóng lại. Tự mở lại vào giờ đã chọn.

Thêm OneClick Snooze vào Chrome — miễn phí. Đóng tab ngay lúc này; tab sẽ quay lại đúng lúc bạn cần.""")
# ---------------------------------------------------------------- Indonesian
reg("id",
    "Pengatur waktu tab: tutup dan buka nanti",
    "Pengatur waktu tab: tutup sekarang, buka lagi nanti otomatis. Lebih sedikit tab, RAM lebih lega. Gratis, tanpa akun.",
    """Tidurkan tab dengan satu klik: tutup sekarang — tab terbuka lagi otomatis nanti: malam ini, besok jam 9.00, atau pada waktu pilihanmu. OneClick Snooze adalah pengatur waktu tab (tab timer) dan ekstensi peniduran tab gratis untuk Chrome: tutup tab dan buka lagi nanti, tepat saat kamu membutuhkannya.

Terlalu banyak tab terbuka membuat browser melambat, RAM penuh, dan hal penting tenggelam di antara tumpukan. Daripada membiarkan tab tetap terbuka “just in case”, tidurkan tabnya: tab ditutup (Chrome langsung lebih ringan) dan kembali sesuai jadwal — alarm bertahan setelah Chrome dimulai ulang, dan tab kedaluwarsa dipulihkan saat startup, bahkan setelah komputer dimatikan.

Fitur:
1. Klik sekali untuk menunda tab — pilih preset (30 menit lagi, malam ini, besok jam 9.00) atau waktu kustom. Pengatur waktu tab-mu, jadwalmu.
2. Tab terbuka lagi otomatis tepat waktu — pengingat tidak hilang meski setelah restart.
3. Dasbor tab yang ditunda: ubah waktu, buka sekarang, atau batalkan.
4. Riwayat semua tab yang ditunda, lengkap dengan tanggal dan jam.
5. Preset kustom: nama dan emoji sendiri untuk setiap slot waktu.
6. Notifikasi desktop dan pengingat suara opsional saat tab kembali.
Gratis, tanpa akun, tanpa iklan. Tersedia dalam bahasa Inggris, Rusia, Jerman, Spanyol, dan Mandarin.

Dipakai untuk: menutup tab dan membukanya nanti, menyimpan tab untuk dibaca nanti, mengatur pengingat tab, membersihkan tumpukan tab, membebaskan RAM, dan fokus — tombol “baca nanti” untuk seluruh browser.

Cara pakai: klik ikon ekstensi → pilih kapan tab harus kembali → tab ditutup. Tab terbuka lagi otomatis pada waktu yang dipilih.

Tambahkan OneClick Snooze ke Chrome — gratis. Tutup tab sekarang; tab kembali tepat saat kamu membutuhkannya.""")
