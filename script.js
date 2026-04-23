/* =====================================================
   HALPIN – script.js
   Semua logika JavaScript untuk prototype HALPIN
===================================================== */

/* ----- PAGE ROUTING ----- */
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Tampilkan PINA float hanya di halaman app (bukan landing & pina-page)
    const pina = document.getElementById('pinaFloat');
    if (pina) {
        pina.style.display = (id === 'landing' || id === 'pina-page') ? 'none' : 'flex';
    }

    // Tutup sidebar saat navigasi (mobile)
    closeSidebar();
    if (id === 'autozakat-page') {
        setTimeout(() => drawGoldChart(goldPeriod), 80);
    }
}


/* ----- MOBILE SIDEBAR ----- */
function openSidebar() {
    // Temukan sidebar di dalam halaman aktif
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;
    const sidebar = activePage.querySelector('.sidebar');
    if (sidebar) sidebar.classList.add('sidebar-open');

    // Tampilkan overlay
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.classList.add('overlay-show');

    // Cegah scroll body
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    // Tutup semua sidebar (bisa dari halaman mana saja)
    document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('sidebar-open'));

    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.classList.remove('overlay-show');

    document.body.style.overflow = '';
}

/* ----- LOGIN / REGISTER MODAL ----- */
let pendingAction = null;

function openModal(name) {
    // simpan aksi dulu (login/register)
    pendingAction = name;

    // buka terms popup
    document.getElementById('terms-modal').style.display = 'flex';
}

function closeTerms() {
    document.getElementById('terms-modal').style.display = 'none';
    pendingAction = null;
}

function acceptTerms() {
    document.getElementById('terms-modal').style.display = 'none';

    // lanjut ke dashboard
    showPage('dashboard-page');
    showToast('Selamat datang kembali, Siti Aisyah!');

    pendingAction = null;
}

// checklist semua
function toggleAllTerms(master) {
    const checkboxes = document.querySelectorAll('.tnc-checkbox');
    checkboxes.forEach(cb => cb.checked = master.checked);

    document.getElementById('agreeBtn').disabled = !master.checked;
}

// kalau user klik satu-satu
document.addEventListener("change", function () {
    const all = document.querySelectorAll('.tnc-checkbox');
    const checked = document.querySelectorAll('.tnc-checkbox:checked');
    const agreeBtn = document.getElementById('agreeBtn');
    const agreeAll = document.getElementById('agreeAll');

    if (all.length === checked.length) {
        agreeAll.checked = true;
        agreeBtn.disabled = false;
    } else {
        agreeAll.checked = false;
        agreeBtn.disabled = true;
    }
});

/* ----- TOAST NOTIFICATION ----- */
function showToast(msg) {
    const t = document.getElementById('toastNotif');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

/* ----- MARKETPLACE FILTER CHIP ----- */
function setFilter(el) {
    // Hanya reset chip di dalam kontainer yang sama
    const parent = el.closest('.mkt-filters');
    if (parent) {
        parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    }
    el.classList.add('active');
}

/* ----- CHART TAB (Dompet) ----- */
function setChartTab(el) {
    const parent = el.closest('.chart-tabs');
    if (parent) {
        parent.querySelectorAll('.chart-tab').forEach(c => c.classList.remove('active'));
    }
    el.classList.add('active');
    showToast('Menampilkan data ' + el.textContent + '...');
}

/* ----- PENGATURAN TABS ----- */
function switchSetTab(btn, tabId) {
    // Nonaktifkan semua tab button
    document.querySelectorAll('.set-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // Sembunyikan semua konten tab
    document.querySelectorAll('.set-tab-content').forEach(c => c.style.display = 'none');
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
}

/* ----- TOGGLE SWITCH (Keamanan 2FA) ----- */
function toggleSwitch(el) {
    el.classList.toggle('on');
    const isOn = el.classList.contains('on');
    showToast(isOn ? '2FA berhasil diaktifkan ✓' : '2FA dinonaktifkan');
}

/* ----- PINA CHAT ----- */
// Respons otomatis PINA berdasarkan kata kunci
const pinaResponses = [
    {
        keywords: ['haul', 'tahun', 'kepemilikan'],
        answer: 'Haul adalah syarat zakat di mana harta harus dimiliki penuh selama 12 bulan Hijriah (qamariah) sebelum wajib dizakati.'
    },
    {
        keywords: ['nisab', 'batas', 'minimal'],
        answer: 'Nisab zakat mal setara 85 gram emas. Jika total aset investasi Anda telah melampaui nilai tersebut, maka wajib zakat 2,5%.'
    },
    {
        keywords: ['yield', 'hasil', 'return', 'keuntungan'],
        answer: 'Yield properti HALPIN rata-rata 8–12% p.a. dari distribusi sewa. Yield dihitung dari pendapatan sewa bersih dibagi nilai token yang Anda miliki.'
    },
    {
        keywords: ['token', 'beli', 'cara', 'investasi'],
        answer: 'Cara beli token: pilih properti di Marketplace → klik Beli Token → tentukan jumlah token → konfirmasi pembayaran. Minimum pembelian Rp 100.000 (1 token).'
    },
    {
        keywords: ['zakat', 'potong', 'otomatis'],
        answer: 'Auto Zakat HALPIN memotong 2,5% dari setiap distribusi sewa secara otomatis via Smart Contract, lalu langsung disalurkan ke BAZNAS resmi.'
    },
    {
        keywords: ['halal', 'syariah', 'hukum', 'fiqih'],
        answer: 'Semua properti di HALPIN telah divalidasi oleh Dewan Pengawas Syariah. Akad yang digunakan adalah Musyarakah (bagi hasil) yang sesuai fiqih muamalah.'
    },
    {
        keywords: ['baznas', 'lembaga', 'salur'],
        answer: 'BAZNAS (Badan Amil Zakat Nasional) adalah lembaga resmi negara yang mengelola zakat. HALPIN bermitra resmi dengan BAZNAS untuk penyaluran Auto Zakat.'
    }
];

function sendPinaMsg() {
    const input = document.getElementById('pinaInput');
    if (!input || !input.value.trim()) return;

    const userMsg = input.value.trim();
    const messagesEl = document.getElementById('pinaMessages');

    // Tambah bubble user
    const userBubble = document.createElement('div');
    userBubble.className = 'msg-bubble msg-user';
    userBubble.textContent = userMsg;
    messagesEl.appendChild(userBubble);
    input.value = '';

    // Scroll ke bawah
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Cari jawaban PINA
    const lower = userMsg.toLowerCase();
    let answer = 'Terima kasih pertanyaannya! Untuk saat ini saya masih belajar. Coba tanya tentang: haul, nisab, yield, token, zakat otomatis, atau kehalalan produk HALPIN 😊';
    for (const r of pinaResponses) {
        if (r.keywords.some(k => lower.includes(k))) {
            answer = r.answer;
            break;
        }
    }

    // Delay sebelum PINA menjawab
    setTimeout(() => {
        const botBubble = document.createElement('div');
        botBubble.className = 'msg-bubble msg-bot';
        botBubble.textContent = answer;
        messagesEl.appendChild(botBubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 700);
}

/* ----- INIT ----- */
document.addEventListener('DOMContentLoaded', () => {
    // Sembunyikan PINA float saat pertama load (di landing)
    const pina = document.getElementById('pinaFloat');
    if (pina) pina.style.display = 'none';
});
/* ─────────────── KALKULATOR PROYEKSI (1 token = Rp 10.000) ─────────────── */
let calcDuration = 1;

function formatRupiah(num) {
    const n = Math.round(num);
    if (n >= 1_000_000_000) return 'Rp ' + (n / 1_000_000_000).toLocaleString('id-ID', {maximumFractionDigits:2}) + ' M';
    if (n >= 1_000_000)     return 'Rp ' + (n / 1_000_000).toLocaleString('id-ID', {maximumFractionDigits:2}) + ' Jt';
    return 'Rp ' + n.toLocaleString('id-ID');
}

function runCalc() {
    const amountInput = document.getElementById('calcAmount');
    const slider      = document.getElementById('calcSlider');
    const select      = document.getElementById('calcSelect');
    if (!amountInput || !select) return;

    const amount = Math.max(10000, parseInt(amountInput.value) || 0);
    const TOKEN_PRICE = 10000;

    // 🔥 PARAMETER ZAKAT
    const GOLD_PRICE = 1200000; // harga emas per gram (bisa kamu ubah / API)
    const NISAB = 85 * GOLD_PRICE;

    const token = Math.floor(amount / TOKEN_PRICE);

    // Sync slider
    if (slider) {
        slider.value = Math.min(amount, 500000000);
        const pct = ((Math.min(amount, 500000000) - 10000) / (500000000 - 10000) * 100).toFixed(1);
        slider.style.background = `linear-gradient(to right, var(--green-main) ${pct}%, #e0e0e0 ${pct}%)`;
    }

    const ery    = parseFloat(select.value) / 100;

    // ✅ PERHITUNGAN BENAR
    const yield_ = amount * ery * calcDuration;
    const totalAset = amount + yield_;

    let zakat = 0;
    let zakatToken = 0;
    let zakatText = '';

    // ✅ CEK NISAB
    if (totalAset >= NISAB) {
        zakat = totalAset * 0.025;
        zakatToken = Math.floor(zakat / TOKEN_PRICE);
        zakatText = formatRupiah(zakat) + ` (~${zakatToken.toLocaleString('id-ID')} Token)`;
    } else {
        zakat = 0;
        zakatText = 'Belum wajib zakat';
    }

    const bersih = yield_ - zakat;
    const total  = amount + bersih;

    const eryPct = Math.min((ery / 0.12) * 100, 100).toFixed(0);

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set('calcTokenInfo', `= ${token.toLocaleString('id-ID')} Token`);
    set('calcResDesc',   `Investasi ${formatRupiah(amount)} selama ${calcDuration} tahun`);
    set('calcResToken',  `= ${token.toLocaleString('id-ID')} Token`);
    set('calcYieldVal',  formatRupiah(yield_));
    set('calcYieldSub',  `dalam ${calcDuration} tahun`);

    // 🔥 HASIL ZAKAT BARU
    set('calcZakatVal',  zakatText);

    set('calcBersihVal', formatRupiah(bersih));
    set('calcBersihSub', `setelah zakat ${calcDuration} tahun`);
    set('calcTotalVal',  formatRupiah(total));
    set('calcTotalSub',  `modal + bersih ${calcDuration}th`);
    set('calcEryVal',    `${(ery * 100).toFixed(1)}%`);

    const eryBar = document.getElementById('calcEryBar');
    if (eryBar) eryBar.style.width = eryPct + '%';
}

function syncSlider(sliderEl) {
    const input = document.getElementById('calcAmount');
    if (input) input.value = sliderEl.value;
    const pct = ((sliderEl.value - sliderEl.min) / (sliderEl.max - sliderEl.min) * 100).toFixed(1);
    sliderEl.style.background = `linear-gradient(to right, var(--green-main) ${pct}%, #e0e0e0 ${pct}%)`;
    runCalc();
}

function setDuration(btn, years) {
    calcDuration = years;
    document.querySelectorAll('.calc-dur-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    runCalc();
}

/* ─────────────── GRAFIK HARGA EMAS ─────────────── */
let goldPeriod = '1M';
let goldCtx = null;
let goldChartInstance = null;

// Data simulasi harga emas Antam per gram (IDR)
const goldData = {
    '1M': {
        labels: ['1 Mar','5 Mar','10 Mar','15 Mar','20 Mar','25 Mar','1 Apr'],
        prices: [1541000, 1548000, 1555000, 1562000, 1558000, 1571000, 1587000]
    },
    '3M': {
        labels: ['Jan','Feb','Mar'],
        prices: [1498000, 1531000, 1587000],
        detailed: [
            1498000,1502000,1507000,1512000,1518000,1510000,1521000,1525000,1519000,1531000,
            1535000,1528000,1540000,1548000,1555000,1562000,1558000,1571000,1580000,1587000
        ]
    },
    '6M': {
        labels: ['Okt','Nov','Des','Jan','Feb','Mar'],
        prices: [1420000, 1445000, 1468000, 1498000, 1531000, 1587000],
        detailed: [
            1420000,1425000,1432000,1440000,1435000,1445000,1450000,1458000,1452000,1468000,
            1472000,1465000,1480000,1488000,1492000,1498000,1505000,1510000,1519000,1531000,
            1535000,1528000,1540000,1548000,1555000,1562000,1558000,1571000,1580000,1587000
        ]
    },
    '1Y': {
        labels: ['Apr\'25','Jun','Agu','Okt','Des','Feb','Apr\'26'],
        prices: [1310000, 1345000, 1390000, 1420000, 1468000, 1531000, 1587000],
        detailed: [
            1310000,1318000,1325000,1330000,1345000,1352000,1360000,1368000,1375000,1390000,
            1398000,1405000,1412000,1420000,1428000,1435000,1442000,1452000,1458000,1468000,
            1472000,1480000,1488000,1498000,1505000,1515000,1522000,1531000,1545000,1558000,
            1565000,1572000,1580000,1587000
        ]
    }
};

const NISAB_GRAM = 85;
const GOLD_PRICE = 1587000;
const NISAB_TOTAL = NISAB_GRAM * GOLD_PRICE;

function drawGoldChart(period) {
    const canvas = document.getElementById('goldChartCanvas');
    if (!canvas) return;

    const data   = goldData[period];
    const prices = data.detailed || data.prices;
    const n      = prices.length;

    // Canvas sizing
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const W    = rect.width;
    const H    = 260;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const pad = { top: 24, right: 24, bottom: 40, left: 80 };
    const cW  = W - pad.left - pad.right;
    const cH  = H - pad.top  - pad.bottom;

    const minP = Math.min(...prices) * 0.998;
    const maxP = Math.max(...prices) * 1.002;

    const xOf = i => pad.left + (i / (n - 1)) * cW;
    const yOf = v => pad.top + cH - ((v - minP) / (maxP - minP)) * cH;

    ctx.clearRect(0, 0, W, H);

    // ── Grid lines ──
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= 4; i++) {
        const y = pad.top + (cH / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cW, y); ctx.stroke();
        const val = maxP - ((maxP - minP) / 4) * i;
        ctx.fillStyle = '#bbb';
        ctx.font = '10px Poppins, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Rp ' + (val / 1000).toFixed(0) + 'rb', pad.left - 6, y + 4);
    }

    // ── Nisab line ──
    const nisabY = yOf(GOLD_PRICE);
    ctx.save();
    ctx.strokeStyle = '#E07B39';
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(pad.left, nisabY); ctx.lineTo(pad.left + cW, nisabY); ctx.stroke();
    ctx.restore();
    ctx.fillStyle   = '#E07B39';
    ctx.font        = 'bold 10px Poppins, sans-serif';
    ctx.textAlign   = 'left';
    ctx.fillText('Nisab/gr', pad.left + 4, nisabY - 5);

    // ── Gradient fill ──
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + cH);
    grad.addColorStop(0,   'rgba(45,106,79,0.22)');
    grad.addColorStop(1,   'rgba(45,106,79,0)');
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(prices[0]));
    for (let i = 1; i < n; i++) ctx.lineTo(xOf(i), yOf(prices[i]));
    ctx.lineTo(xOf(n - 1), pad.top + cH);
    ctx.lineTo(xOf(0),     pad.top + cH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // ── Line ──
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(prices[0]));
    for (let i = 1; i < n; i++) ctx.lineTo(xOf(i), yOf(prices[i]));
    ctx.strokeStyle = '#2D6A4F';
    ctx.lineWidth   = 2.5;
    ctx.lineJoin    = 'round';
    ctx.stroke();

    // ── Last point dot ──
    const lx = xOf(n - 1);
    const ly = yOf(prices[n - 1]);
    ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#2D6A4F'; ctx.fill();
    ctx.beginPath(); ctx.arc(lx, ly, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(45,106,79,0.18)'; ctx.fill();

    // ── X-axis labels ──
    ctx.fillStyle  = '#aaa';
    ctx.font       = '10px Poppins, sans-serif';
    ctx.textAlign  = 'center';
    const labelsArr = data.labels;
    labelsArr.forEach((lbl, i) => {
        const xi = pad.left + (i / (labelsArr.length - 1)) * cW;
        ctx.fillText(lbl, xi, H - 10);
    });
}

function setGoldPeriod(btn, period) {
    goldPeriod = period;
    document.querySelectorAll('.gold-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    drawGoldChart(period);
}

/* ─── Init kalkulator & chart saat DOM siap ─── */
document.addEventListener('DOMContentLoaded', () => {
    runCalc();

    // Draw gold chart jika halaman auto zakat aktif saat load
    const azPage = document.getElementById('autozakat-page');
    if (azPage) drawGoldChart('1M');

    // Redraw on resize
    window.addEventListener('resize', () => {
        if (document.getElementById('autozakat-page')?.classList.contains('active')) {
            drawGoldChart(goldPeriod);
        }
    });
});

function confirmLogout() {
    document.getElementById("logoutModal").style.display = "flex";
}

function closeLogout() {
    document.getElementById("logoutModal").style.display = "none";
}

function logoutNow() {
    // arahkan ke landing / login
    showPage('landing');

    // tutup modal
    closeLogout();
}

