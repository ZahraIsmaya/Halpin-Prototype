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