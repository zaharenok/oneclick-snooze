# -*- coding: utf-8 -*-
"""Master table for Chrome Web Store listing. Edit here, then run build.py.

SEO rewrite (v1.4.2): title = the search query, brand lives in the description
(reference: "Auto Tab Discard (suspend)"). TITLES must stay in sync with
extName in _locales/<code>/messages.json; SHORTS with extDescription.
CTA closing lines are kept verbatim (build.py checks their presence).
"""
from pathlib import Path

TITLES, SHORTS, LONGS = {}, {}, {}


def reg(lang, title, short, long):
    TITLES[lang] = title
    SHORTS[lang] = short
    LONGS[lang] = long


# ---------------------------------------------------------------- English (default)
reg("en",
    "Tab Snooze - Save Tabs for Later & Reopen",
    "Snooze tabs in one click: close now, Chrome reopens later automatically. Save tabs for later & keep your browser clutter-free.",
    """Snooze tabs with one click: close a tab now and it automatically reopens in Chrome exactly when you need it — in 1, 3 or 6 hours, this evening, tomorrow morning, next week, or any custom date and time. Stop keeping dozens of tabs open "just for later": save tabs for later, close them, and get them back on schedule. A lightweight read-later tool and tab manager for anyone whose browser is drowning in tabs.

OneClick Snooze works like an alarm clock for your browser tabs: pick a time, the tab closes, and it comes back by itself.

Features:
1. Quick snooze — send the current tab away for 1, 3 or 6 hours.
2. Smart presets — this evening, tomorrow morning, next week, someday, or a custom date and time.
3. Automatic restore — snoozed tabs reopen on time, one after another in a calm queue, not all at once.
4. Desktop notification and a sound when a tab comes back.
5. Edit anytime — reschedule or cancel a snoozed tab before it returns.
6. Snooze list with countdown — see what is coming back and when.
7. Your own preset buttons — add custom times, disable the built-in ones.
8. Private and offline — everything stays in your browser. No account, no tracking.
9. Localized into 17 languages: English, Spanish, Portuguese, German, French, Italian, Polish, Turkish, Japanese, Korean, Chinese and more.

Add OneClick Snooze to Chrome — free. Close the tab now; it comes back exactly when you need it.""")

# ---------------------------------------------------------------- Russian
reg("ru",
    "Отложить вкладки на потом - Tab Snooze",
    "Отложите вкладки в один клик: закройте сейчас — Chrome откроет позже автоматически. Вкладки на потом, без хаоса.",
    """Отложите вкладку в один клик: закройте её сейчас, и Chrome автоматически откроет её ровно тогда, когда она понадобится — через 1, 3 или 6 часов, вечером, завтра утром, на следующей неделе или в любой выбранный день. Хватит держать десятки вкладок открытыми «на потом»: сохраните вкладки на потом, закройте их и получите обратно вовремя. Лёгкий менеджер вкладок и «прочитать позже» для всех, чей браузер тонет во вкладках.

OneClick Snooze работает как будильник для вкладок: выберите время — вкладка закроется и вернётся сама.

Возможности:
1. Быстрое откладывание — отправьте текущую вкладку на 1, 3 или 6 часов.
2. Умные пресеты — вечером, завтра утром, на следующей неделе, когда-нибудь или точная дата и время.
3. Автовозврат — отложенные вкладки открываются вовремя, по одной, в спокойной очереди, а не все сразу.
4. Уведомление на рабочем столе и звук, когда вкладка вернулась.
5. Изменение в любой момент — перенесите или отмените отложенную вкладку до её возврата.
6. Список с обратным отсчётом — видно, что и когда вернётся.
7. Свои кнопки-пресеты — добавьте удобное время, отключите лишнее.
8. Приватно и офлайн — всё остаётся в вашем браузере. Без аккаунта и слежки.
9. 17 языков интерфейса, включая русский, английский, немецкий, испанский, португальский, японский, корейский и китайский.

Добавьте OneClick Snooze в Chrome — бесплатно. Закройте вкладку сейчас — она вернётся ровно тогда, когда нужно.""")

# ---------------------------------------------------------------- German
reg("de",
    "Tabs für später speichern (Tab Snooze)",
    "Tabs mit einem Klick schlummern lassen: jetzt schließen, Chrome öffnet sie später automatisch. Tabs für später ohne Chaos.",
    """Tabs schlummern lassen mit einem Klick: Schließen Sie einen Tab jetzt und Chrome öffnet ihn automatisch genau dann wieder, wenn Sie ihn brauchen — in 1, 3 oder 6 Stunden, heute Abend, morgen früh, nächste Woche oder zu einem selbst gewählten Termin. Schluss mit dem offenen-Tab-Chaos: Tabs für später speichern, schließen und pünktlich zurückbekommen. Ein leichter Tab-Manager und Read-Later für alle, deren Browser in Tabs untergeht.

OneClick Snooze ist ein Wecker für Browser-Tabs: Zeit wählen, Tab schließen, automatisch zurückbekommen.

Funktionen:
1. Schnelles Schlummern — den aktuellen Tab für 1, 3 oder 6 Stunden weglegen.
2. Smarte Presets — heute Abend, morgen früh, nächste Woche, irgendwann oder eigenes Datum und Uhrzeit.
3. Automatische Rückkehr — schlummernde Tabs öffnen sich pünktlich, einer nach dem anderen in ruhiger Queue.
4. Desktop-Benachrichtigung und Ton, wenn ein Tab zurückkommt.
5. Jederzeit änderbar — schlummernden Tab verschieben oder abbrechen.
6. Liste mit Countdown — sehen, was wann zurückkommt.
7. Eigene Preset-Buttons — eigene Zeiten hinzufügen, eingebaute deaktivieren.
8. Privat und offline — alles bleibt in Ihrem Browser. Kein Konto, kein Tracking.
9. In 17 Sprachen, darunter Deutsch, Englisch, Spanisch, Französisch, Italienisch, Japanisch, Koreanisch und Chinesisch.

OneClick Snooze zu Chrome hinzufügen — kostenlos. Tab jetzt schließen; er kommt genau dann zurück, wenn Sie ihn brauchen.""")

# ---------------------------------------------------------------- Spanish
reg("es",
    "Guarda pestañas para más tarde (Tab Snooze)",
    "Pospone pestañas con un clic: ciérralas ya y Chrome las reabre más tarde automáticamente. Guarda pestañas para más tarde.",
    """Pospone pestañas con un clic: cierra una pestaña ahora y Chrome la reabre automáticamente justo cuando la necesites — en 1, 3 o 6 horas, esta noche, mañana por la mañana, la próxima semana o en la fecha que elijas. Deja de mantener decenas de pestañas abiertas "para más tarde": guarda pestañas para más tarde, ciérralas y recíbelas a tiempo. Un gestor de pestañas ligero y de leer más tarde para quienes se ahogan en pestañas.

OneClick Snooze funciona como un despertador para tus pestañas: eliges la hora, la pestaña se cierra y vuelve sola.

Funciones:
1. Pospuesta rápida — manda la pestaña actual a dentro de 1, 3 o 6 horas.
2. Presets inteligentes — esta noche, mañana por la mañana, la próxima semana, algún día o fecha y hora personalizadas.
3. Restauración automática — las pestañas vuelven a tiempo, una a una en una cola tranquila.
4. Notificación de escritorio y sonido cuando vuelve una pestaña.
5. Edita cuando quieras — reprograma o cancela antes de que vuelva.
6. Lista con cuenta atrás — mira qué vuelve y cuándo.
7. Botones propios — añade tus horas, desactiva las integradas.
8. Privado y sin conexión — todo queda en tu navegador. Sin cuenta, sin rastreo.
9. En 17 idiomas: español, inglés, alemán, francés, italiano, portugués, japonés, coreano y chino.

Añade OneClick Snooze a Chrome — gratis. Cierra la pestaña ahora; vuelve exactamente cuando la necesitas.""")

# ---------------------------------------------------------------- Simplified Chinese
reg("zh",
    "标签页休眠 - 稍后阅读,定时自动打开",
    "一键休眠标签页：现在关闭，Chrome 稍后自动重新打开。稍后阅读，保持浏览器整洁。",
    """一键休眠标签页：现在关闭标签页，Chrome 会在您需要的时间自动重新打开——1、3 或 6 小时后、今晚、明早、下周或您选的任意日期。别再让几十个标签页挂着“稍后再看”：把标签页存起来，放心关闭，按时取回。轻量的标签页管理器＋稍后阅读工具，适合被标签页淹没的您。

OneClick Snooze 就像标签页的闹钟：选好时间，标签页关闭，到点自己回来。

功能：
1. 快速休眠 — 把当前标签页放到 1、3 或 6 小时后。
2. 智能预设 — 今晚、明早、下周、改天或自定义日期时间。
3. 自动恢复 — 休眠的标签页按时按序逐个打开，不会一哄而上。
4. 标签页回来时的桌面通知和提示音。
5. 随时编辑 — 在返回前重新安排或取消。
6. 带倒计时的休眠列表 — 清楚看到什么时间回来。
7. 自定义预设按钮 — 添加自己的时间，停用内置项。
8. 隐私且离线 — 一切都留在您的浏览器里。无账号、无跟踪。
9. 支持 17 种语言，包括中文、英语、日语、韩语、德语、法语、西班牙语、葡萄牙语等。

把 OneClick Snooze 添加到 Chrome——免费。现在关闭标签页，需要的时候它会准时回来。""")

# ---------------------------------------------------------------- Ukrainian
reg("uk",
    "Відкласти вкладки на потім - Tab Snooze",
    "Відкладіть вкладки в один клік: закрийте зараз — Chrome відкриє пізніше автоматично. Вкладки на потім, без хаосу.",
    """Відкладіть вкладку в один клік: закрийте її зараз, і Chrome автоматично відкриє її саме тоді, коли вона знадобиться — через 1, 3 або 6 годин, увечері, завтра вранці, наступного тижня чи в будь-який обраний день. Хватить тримати десятки вкладок відкритими «на потім»: збережіть вкладки на потім, закрийте їх і отримайте назад вчасно. Легкий менеджер вкладок і «прочитати пізніше» для всіх, чиї браузери тонуть у вкладках.

OneClick Snooze працює як будильник для вкладок: оберіть час — вкладка закриється і повернеться сама.

Можливості:
1. Швидке відкладання — відправте поточну вкладку на 1, 3 або 6 годин.
2. Розумні пресети — увечері, завтра вранці, наступного тижня, колись або точні дата й час.
3. Автоповернення — відкладені вкладки відкриваються вчасно, по одній, у спокійній черзі, а не всі одразу.
4. Повідомлення на робочому столі та звук, коли вкладка повернулася.
5. Зміна будь-коли — перенесіть або скасуйте відкладену вкладку до її повернення.
6. Список із зворотним відліком — видно, що і коли повернеться.
7. Свої кнопки-пресети — додайте зручний час, вимкніть зайве.
8. Приватно й офлайн — усе залишається у вашому браузері. Без акаунта й стеження.
9. 17 мов інтерфейсу, зокрема українська, англійська, німецька, іспанська, португальська, японська, корейська та китайська.

Додайте OneClick Snooze до Chrome — безкоштовно. Закрийте вкладку зараз — вона повернеться саме тоді, коли потрібно.""")

# ---------------------------------------------------------------- French
reg("fr",
    "Enregistrer des onglets pour plus tard",
    "Mettez un onglet en veille en un clic : fermez-le, Chrome le rouvre plus tard automatiquement. Enregistrez pour plus tard.",
    """Mettez un onglet en veille en un clic : fermez-le maintenant et Chrome le rouvre automatiquement au moment choisi — dans 1, 3 ou 6 heures, ce soir, demain matin, la semaine prochaine ou à la date de votre choix. Arrêtez de garder des dizaines d'onglets ouverts « pour plus tard » : enregistrez les onglets pour plus tard, fermez-les et récupérez-les à l'heure. Un gestionnaire d'onglets léger et un outil read-later pour les navigateurs noyés d'onglets.

OneClick Snooze, c'est un réveil pour vos onglets : choisissez l'heure, l'onglet se ferme et revient tout seul.

Fonctionnalités :
1. Mise en veille rapide — envoyez l'onglet actuel dans 1, 3 ou 6 heures.
2. Présélections intelligentes — ce soir, demain matin, la semaine prochaine, un jour ou date et heure personnalisées.
3. Restauration automatique — les onglets reviennent à l'heure, un par un dans une file tranquille.
4. Notification bureau et son au retour d'un onglet.
5. Modifiable à tout moment — reprogrammez ou annulez avant le retour.
6. Liste avec compte à rebours — voyez ce qui revient et quand.
7. Vos propres boutons — ajoutez vos horaires, désactivez ceux d'origine.
8. Privé et hors ligne — tout reste dans votre navigateur. Sans compte, sans pistage.
9. Traduit en 17 langues : français, anglais, allemand, espagnol, italien, portugais, japonais, coréen, chinois...

Ajoutez OneClick Snooze à Chrome — c'est gratuit. Fermez l'onglet maintenant ; il revient exactement quand vous en avez besoin.""")

# ---------------------------------------------------------------- Portuguese (Brazil)
reg("pt",
    "Salve abas para depois - Tab Snooze",
    "Adie abas com um clique: feche agora, o Chrome reabre depois automaticamente. Salve abas para depois, sem bagunça.",
    """Adie abas com um clique: feche uma aba agora e o Chrome reabre automaticamente na hora certa — em 1, 3 ou 6 horas, hoje à noite, amanhã de manhã, semana que vem ou na data que você escolher. Pare de deixar dezenas de abas abertas "para depois": salve abas para depois, feche-as e receba-as de volta na hora. Um gerenciador de abas leve e de ler depois para quem se afoga em abas.

O OneClick Snooze é um despertador para as suas abas: escolha o horário, a aba fecha e volta sozinha, sem bagunça.

Recursos:
1. Adiamento rápido — mande a aba atual para 1, 3 ou 6 horas.
2. Presets inteligentes — hoje à noite, amanhã de manhã, semana que vem, algum dia ou data e hora personalizadas.
3. Restauração automática — as abas voltam na hora certa, uma a uma, numa fila tranquila.
4. Notificação na área de trabalho e som quando a aba volta.
5. Edite quando quiser — reagende ou cancele antes de voltar.
6. Lista com contagem regressiva — veja o que volta e quando.
7. Botões próprios — adicione seus horários, desative os integrados.
8. Privado e offline — tudo fica no seu navegador. Sem conta, sem rastreamento.
9. Em 17 idiomas: português, inglês, espanhol, alemão, francês, italiano, japonês, coreano e chinês.

Adicione o OneClick Snooze ao Chrome — é grátis. Feche a aba agora; ela volta exatamente quando você precisar.""")

# ---------------------------------------------------------------- Italian
reg("it",
    "Salva schede per dopo (Tab Snooze)",
    "Metti in pausa le schede con un clic: chiudi ora, Chrome le riapre dopo automaticamente. Salva schede per dopo, senza caos.",
    """Metti in pausa una scheda con un clic: chiudila ora e Chrome la riapre automaticamente al momento giusto — tra 1, 3 o 6 ore, stasera, domani mattina, la prossima settimana o alla data che scegli. Smetti di tenere aperte decine di schede "per dopo": salva le schede per dopo, chiudile e ritrovale all'ora esatta. Un gestore di schede leggero e di qualità per leggere dopo, per chi affoga tra le schede.

OneClick Snooze è una sveglia per le tue schede: scegli l'ora, la scheda si chiude e torna da sola.

Funzioni:
1. Pausa rapida — manda la scheda attuale tra 1, 3 o 6 ore.
2. Preset intelligenti — stasera, domani mattina, prossima settimana, un giorno qualsiasi o data e ora personalizzate.
3. Ripristino automatico — le schede tornano in orario, una alla volta in una coda tranquilla.
4. Notifica sul desktop e suono al ritorno di una scheda.
5. Modifica quando vuoi — riprogramma o annulla prima del ritorno.
6. Elenco con conto alla rovescia — vedi cosa torna e quando.
7. Pulsanti tuoi — aggiungi orari personalizzati, disattiva quelli predefiniti.
8. Privato e offline — tutto resta nel tuo browser. Senza account, senza tracciamento.
9. In 17 lingue: italiano, inglese, tedesco, spagnolo, francese, portoghese, giapponese, coreano e cinese.

Aggiungi OneClick Snooze a Chrome — è gratis. Chiudi la scheda ora; torna esattamente quando ti serve.""")

# ---------------------------------------------------------------- Polish
reg("pl",
    "Zapisz karty na później (Tab Snooze)",
    "Odkładaj karty jednym kliknięciem: zamknij teraz, Chrome otworzy je później automatycznie. Karty na później, bez bałaganu.",
    """Odkładaj karty jednym kliknięciem: zamknij kartę teraz, a Chrome otworzy ją ponownie dokładnie wtedy, gdy będzie potrzebna — za 1, 3 lub 6 godzin, dziś wieczorem, jutro rano, w przyszłym tygodniu albo w dowolnym terminie. Przestań trzymać dziesiątki otwartych kart "na później": zapisz karty na później, zamknij je i odbierz na czas. Lekki menedżer kart i czytaj później dla wszystkich, którzy topią się w kartach.

OneClick Snooze to budzik dla kart przeglądarki: wybierasz godzinę, karta się zamyka i wraca sama.

Funkcje:
1. Szybkie odkładanie — wyślij bieżącą kartę za 1, 3 lub 6 godzin.
2. Inteligentne presety — dziś wieczorem, jutro rano, przyszły tydzień, kiedyś lub własna data i godzina.
3. Automatyczny powrót — odkładane karty otwierają się na czas, jedna po drugiej, w spokojnej kolejce.
4. Powiadomienie na pulpicie i dźwięk, gdy karta wróci.
5. Edycja w każdej chwili — zmień termin lub anuluj przed powrotem.
6. Lista z odliczaniem — widać, co i kiedy wróci.
7. Własne przyciski presetów — dodaj swoje godziny, wyłącz zbędne.
8. Prywatnie i offline — wszystko zostaje w przeglądarce. Bez konta i śledzenia.
9. 17 języków: polski, angielski, niemiecki, hiszpański, francuski, włoski, portugalski, japoński, koreański i chiński.

Dodaj OneClick Snooze do Chrome'a — to darmowe. Zamknij kartę teraz; wróci dokładnie wtedy, gdy jej potrzebujesz.""")

# ---------------------------------------------------------------- Turkish
reg("tr",
    "Sekmeyi sonra aç - Sonra oku (Tab Snooze)",
    "Sekmeleri tek tıkla ertele: şimdi kapat, Chrome sonra otomatik olarak yeniden açar. Sekmeyi sonra okumak için kaydet.",
    """Sekmeyi tek tıkla erteleyin: sekmeyi şimdi kapatın, Chrome tam ihtiyacınız olduğu anda otomatik olarak yeniden açsın — 1, 3 veya 6 saat sonra, bu akşam, yarın sabah, gelecek hafta ya da seçeceğiniz herhangi bir tarihte. Onlarca sekmeyi "sonrası için" açık tutmayı bırakın: sekmeyi sonra okumak için kaydedin, kapatın, zamanı gelince geri gelsin. Sekmelerde boğulanlar için hafif bir sekme yöneticisi ve sonra oku aracı.

OneClick Snooze sekmeleriniz için bir çalar saattir: saati seçin, sekme kapanır ve kendiliğinden geri gelir.

Özellikler:
1. Hızlı erteleme — mevcut sekmeyi 1, 3 veya 6 saatiye gönderin.
2. Akıllı hazırlıklar — bu akşam, yarın sabah, gelecek hafta, ilerki bir zaman ya da özel tarih ve saat.
3. Otomatik geri açılma — ertelenen sekmeler zamanında, sakin bir sırayla tek tek açılır.
4. Sekme geri geldiğinde masaüstü bildirimi ve ses.
5. Dilediğiniz an düzenleyin — dönmeden önce yeniden planlayın veya iptal edin.
6. Geri sayımlı liste — neyin ne zaman döneceğini görün.
7. Kendi düğmeleriniz — özel saatler ekleyin, hazır olanları kapatın.
8. Özel ve çevrimdışı — her şey tarayıcınızda kalır. Hesap yok, izleme yok.
9. 17 dil: Türkçe, İngilizce, Almanca, İspanyolca, Fransızca, İtalyanca, Portekizce, Japonca, Korece ve Çince.

OneClick Snooze'u Chrome'a ekle — ücretsiz. Sekmeyi şimdi kapat; tam ihtiyaç duyduğun anda geri gelir.""")

# ---------------------------------------------------------------- Japanese
reg("ja",
    "あとで読む・タブを後で開く (Tab Snooze)",
    "ワンクリックでタブをスヌーズ：今閉じて、Chrome が後で自動的に開きます。あとで読む、タブ整理。",
    """ワンクリックでタブをスヌーズ：今すぐ閉じたタブが、必要な瞬間に Chrome が自動的に開き直します——1・3・6 時間後、今夜、明日の朝、来週、好きな日時に。あとで読むタブを開きっぱなしにするのはもうやめましょう。タブを保存して閉じておけば、時間になれば勝手に戻ります。タブに埋もれた人向けの軽量タブマネージャ＋あとで読むツール。

OneClick Snooze はタブの目覚まし時計です：時間を選べば、タブは閉じて、自分で戻ってきます。

機能：
1. クイックスヌーズ — 現在のタブを 1・3・6 時間後に送る。
2. スマートプリセット — 今夜、明日の朝、来週、いつか、カスタム日時。
3. 自動復元 — スヌーズ中のタブは時間どおりに、静かなキューで 1 枚ずつ開く。
4. タブが戻ったらデスクトップ通知とサウンド。
5. いつでも編集 — 戻る前に時刻変更やキャンセルが可能。
6. カウントダウン付きリスト — 何がいつ戻るかひと目でわかる。
7. 独自のプリセットボタン — 自分の時間を追加、内蔵のものは無効化も。
8. プライベート＆オフライン — すべて自分のブラウザの中。アカウント不要、トラッキングなし。
9. 17 言語対応：日本語、英語、ドイツ語、スペイン語、フランス語、イタリア語、ポルトガル語、韓国語、中国語など。

OneClick Snooze を Chrome に追加——無料。タブは今すぐ閉じて、必要な瞬間にちょうど戻ってきます。""")

# ---------------------------------------------------------------- Traditional Chinese (zh-TW as "tw")
reg("tw",
    "分頁休眠 - 稍後閱讀,稍後自動開啟",
    "一鍵休眠分頁：現在關閉，Chrome 稍後自動重新開啟。稍後閱讀，保持瀏覽器整潔。",
    """一鍵休眠分頁：現在關閉分頁，Chrome 會在您需要的時間自動重新開啟——1、3 或 6 小時後、今晚、明早、下週或自訂日期。別再讓幾十個分頁開著「稍後再看」：把分頁存起來，放心關閉，準時取回。為被分頁淹沒的人準備的輕量分頁管理器＋稍後閱讀工具。

OneClick Snooze 就是分頁的鬧鐘：選好時間，分頁關閉，到點自己回來。

功能：
1. 快速休眠 — 把目前的分頁放到 1、3 或 6 小時後。
2. 智慧預設 — 今晚、明早、下週、改天或自訂日期時間。
3. 自動恢復 — 休眠的分頁準時依序逐一開啟，不會一次全開。
4. 分頁回來時的桌面通知與提示音。
5. 隨時編輯 — 回來前可重新安排或取消。
6. 倒數計時清單 — 清楚看到什麼時候回來。
7. 自訂預設按鈕 — 加入自己的時間，停用內建項目。
8. 隱私且離線 — 一切都留在你的瀏覽器裡。無帳號、無追蹤。
9. 支援 17 種語言：繁體中文、英文、日文、韓文、德文、法文、西班牙文、葡萄牙文等。

把 OneClick Snooze 加入 Chrome——免費。現在關閉分頁，需要的時候它會準時回來。""")

# ---------------------------------------------------------------- Korean
reg("ko",
    "나중에 열 탭 저장 - 탭 스누즈 (Tab Snooze)",
    "한 번의 클릭으로 탭 스누즈: 지금 닫으면 Chrome이 나중에 자동으로 다시 엽니다. 나중에 읽을 탭 저장.",
    """한 번의 클릭으로 탭 스누즈: 탭을 지금 닫으면 Chrome이 필요한 순간에 자동으로 다시 열어 줍니다 — 1·3·6시간 후, 오늘 저녁, 내일 아침, 다음 주 또는 원하는 날짜에. '나중에 읽으려고' 수십 개의 탭을 열어 두는 것을 그만하세요: 탭을 저장해 닫아 두고, 시간이 되면 제자리로 돌아옵니다. 탭에 파묻힌 분들을 위한 가벼운 탭 관리자 + 나중에 읽기 도구.

OneClick Snooze는 탭을 위한 알람 시계입니다: 시간을 고르면 탭이 닫히고 스스로 돌아옵니다.

기능:
1. 빠른 스누즈 — 현재 탭을 1·3·6시간 후로 보내기.
2. 스마트 프리셋 — 오늘 저녁, 내일 아침, 다음 주, 언젠가 또는 직접 지정한 날짜와 시간.
3. 자동 복원 — 스누즈된 탭이 시간에 맞춰 차례로 하나씩 열립니다.
4. 탭이 돌아오면 데스크톱 알림과 소리.
5. 언제든 편집 — 돌아오기 전에 일정 변경 또는 취소.
6. 카운트다운 목록 — 무엇이 언제 돌아오는지 한눈에.
7. 나만의 프리셋 버튼 — 원하는 시간 추가, 기본 항목 끄기.
8. 프라이버시·오프라인 — 모든 것은 내 브라우저 안에. 계정 없음, 추적 없음.
9. 17개 언어 지원: 한국어, 영어, 독일어, 스페인어, 프랑스어, 이탈리아어, 포르투갈어, 일본어, 중국어 등.

OneClick Snooze를 Chrome에 추가하세요 — 무료. 탭은 지금 닫고, 필요한 순간에 정확히 돌아옵니다.""")

# ---------------------------------------------------------------- Dutch
reg("nl",
    "Tabs voor later opslaan (Tab Snooze)",
    "Laat tabbladen slapen met één klik: sluit nu, Chrome opent ze later automatisch. Tabs voor later, zonder rommel.",
    """Laat tabbladen slapen met één klik: sluit een tabblad nu en Chrome opent het automatisch precies wanneer u het nodig hebt — over 1, 3 of 6 uur, vanavond, morgenochtend, volgende week of op elke datum die u kiest. Houd geen tientallen tabbladen meer open "voor later": sla tabs voor later op, sluit ze en krijg ze op tijd terug. Een lichte tabbladbeheerder en lees-later-tool voor wie verdrinkt in tabbladen.

OneClick Snooze is een wekker voor je browsertabbladen: kies een tijd, het tabblad sluit en komt vanzelf terug.

Functies:
1. Snel sluimeren — leg het huidige tabblad 1, 3 of 6 uur weg.
2. Slimme presets — vanavond, morgenochtend, volgende week, ooit of eigen datum en tijd.
3. Automatisch terug — sluimerende tabbladen openen op tijd, één voor één in een rustige wachtrij.
4. Bureaubladmelding en geluid wanneer een tabblad terugkomt.
5. Altijd aanpasbaar — verplaats of annuleer vóór de terugkeer.
6. Lijst met aftellen — zie wat wanneer terugkomt.
7. Eigen preset-knoppen — voeg tijden toe, schakel ingebouwde uit.
8. Privé en offline — alles blijft in je browser. Geen account, geen tracking.
9. In 17 talen, waaronder Nederlands, Engels, Duits, Spaans, Frans, Japans, Koreaans en Chinees.

Voeg OneClick Snooze toe aan Chrome — gratis. Sluit het tabblad nu; het komt precies wanneer je het nodig hebt.""")

# ---------------------------------------------------------------- Vietnamese
reg("vi",
    "Lưu tab để đọc sau (Tab Snooze)",
    "Tạm ẩn tab bằng một cú nhấp: đóng ngay, Chrome sẽ tự mở lại sau. Lưu tab để đọc sau, không lộn xộn.",
    """Tạm ẩn tab bằng một cú nhấp: đóng tab ngay bây giờ và Chrome sẽ tự mở lại đúng lúc bạn cần — sau 1, 3 hoặc 6 giờ, tối nay, sáng mai, tuần sau hoặc bất kỳ ngày nào bạn chọn. Đừng giữ hàng chục tab mở "để đọc sau" nữa: lưu tab để đọc sau, đóng lại và nhận lại đúng giờ. Trình quản lý tab nhẹ và công cụ đọc sau cho ai đang chìm trong tab.

OneClick Snooze như chiếc đồng hồ báo thức cho tab: chọn thời điểm, tab đóng lại và tự quay về.

Tính năng:
1. Tạm ẩn nhanh — gửi tab hiện tại sang sau 1, 3 hoặc 6 giờ.
2. Mẫu thông minh — tối nay, sáng mai, tuần sau, một lúc nào đó hoặc ngày giờ tùy chọn.
3. Tự khôi phục — tab được hẹn mở đúng giờ, lần lượt từng cái trong hàng đợi yên tĩnh.
4. Thông báo trên máy tính và âm thanh khi tab quay lại.
5. Sửa bất cứ lúc nào — đổi giờ hoặc hủy trước khi tab trở lại.
6. Danh sách đếm ngược — thấy rõ gì sẽ quay lại và khi nào.
7. Nút mẫu của riêng bạn — thêm giờ tùy chọn, tắt mẫu có sẵn.
8. Riêng tư và ngoại tuyến — mọi thứ ở lại trong trình duyệt của bạn. Không tài khoản, không theo dõi.
9. 17 ngôn ngữ: tiếng Việt, Anh, Đức, Tây Ban Nha, Pháp, Ý, Bồ Đào Nha, Nhật, Hàn và Trung.

Thêm OneClick Snooze vào Chrome — miễn phí. Đóng tab ngay lúc này; tab sẽ quay lại đúng lúc bạn cần.""")

# ---------------------------------------------------------------- Indonesian
reg("id",
    "Simpan tab untuk nanti (Tab Snooze)",
    "Tidurkan tab dengan satu klik: tutup sekarang, Chrome membukanya lagi nanti secara otomatis. Simpan tab untuk nanti.",
    """Tidurkan tab dengan satu klik: tutup tab sekarang dan Chrome membukanya kembali otomatis tepat saat Anda membutuhkannya — 1, 3 atau 6 jam lagi, malam ini, besok pagi, minggu depan, atau tanggal apa pun pilihan Anda. Berhenti membiarkan puluhan tab terbuka "untuk nanti": simpan tab untuk nanti, tutup, dan dapatkan kembali tepat waktu. Pengelola tab ringan dan alat baca nanti untuk yang tenggelam dalam tab.

OneClick Snooze seperti jam weker untuk tab browser Anda: pilih waktunya, tab tertutup dan kembali sendiri.

Fitur:
1. Tidur cepat — kirim tab aktif ke 1, 3 atau 6 jam lagi.
2. Preset pintar — malam ini, besok pagi, minggu depan, kapan saja atau tanggal dan waktu khusus.
3. Pemulihan otomatis — tab yang ditidurkan terbuka tepat waktu, satu per satu dalam antrean yang tenang.
4. Notifikasi desktop dan suara saat tab kembali.
5. Sunting kapan saja — atur ulang atau batalkan sebelum kembali.
6. Daftar dengan hitung mundur — lihat apa yang kembali dan kapan.
7. Tombol preset milik Anda — tambahkan waktu sendiri, matikan bawaan.
8. Privat dan offline — semuanya tetap di browser Anda. Tanpa akun, tanpa pelacakan.
9. 17 bahasa: Indonesia, Inggris, Jerman, Spanyol, Prancis, Italia, Jepang, Korea dan Mandarin.

Tambahkan OneClick Snooze ke Chrome — gratis. Tutup tab sekarang; tab kembali tepat saat kamu membutuhkannya.""")
