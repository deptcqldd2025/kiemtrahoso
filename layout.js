// layout.js - Quản lý Giao diện & Auth

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let currentUser = null;
let currentUserRole = 0; // Mặc định nhóm 0

// 1. TỰ ĐỘNG VẼ UI KHI TRANG LOAD
document.addEventListener('DOMContentLoaded', () => {
    renderBaseUI();
    checkAuth();
});

function renderBaseUI() {
    // --- LOGIN SCREEN ---
    if (!document.getElementById('loginScreen')) {
        const loginDiv = document.createElement('div');
        loginDiv.id = 'loginScreen';
        loginDiv.innerHTML = `
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="80" class="mb-4">
            <h4 class="mb-3 text-primary fw-bold">Sổ Tay Đường Dây</h4>
            <button class="btn btn-outline-dark btn-lg px-4" onclick="handleLogin()">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" class="me-2"> Đăng nhập
            </button>
            <small class="mt-4 text-muted">Version 5.0 (Modular)</small>
        `;
        document.body.appendChild(loginDiv);
    }

    // --- LOADING OVERLAY ---
    if (!document.getElementById('loadingOverlay')) {
        const loadDiv = document.createElement('div');
        loadDiv.id = 'loadingOverlay';
        loadDiv.innerHTML = `<div class="spinner-border text-primary" role="status"></div><p class="mt-3 fw-bold" id="loadingText">Đang tải...</p>`;
        document.body.appendChild(loadDiv);
    }

    // --- HEADER (Nếu trang có div #app-header-placeholder) ---
    const headerPlace = document.getElementById('app-header-placeholder');
    if (headerPlace) {
        headerPlace.innerHTML = `
            <div class="app-header">
                <button class="menu-btn" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu"><i class="fas fa-bars"></i></button>
                <h6 class="m-0 fw-bold" id="pageTitle">Sổ Tay QLDD</h6>
                <div style="width: 24px;"></div>
            </div>
        `;
    }

    // --- SIDEBAR MENU ---
    const menuDiv = document.createElement('div');
    menuDiv.className = 'offcanvas offcanvas-start';
    menuDiv.tabIndex = -1;
    menuDiv.id = 'sidebarMenu';
    menuDiv.innerHTML = `
        <div class="offcanvas-header bg-primary text-white"><h5 class="offcanvas-title">Menu</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button></div>
        <div class="offcanvas-body">
            <div class="text-center mb-4">
                <img id="menuAvatar" src="" style="width:60px;height:60px;border-radius:50%;background:#eee">
                <div class="fw-bold mt-2" id="menuName">...</div>
                <div class="small text-muted" id="menuRole">Loading...</div>
                <button class="btn btn-sm btn-outline-danger mt-2" onclick="handleLogout()">Đăng xuất</button>
            </div>
            <div class="list-group list-group-flush" id="menuList">
                <a href="index.html" class="list-group-item list-group-item-action"><i class="fas fa-home me-2"></i> Trang chủ (Hồ sơ)</a>
                <a href="chart.html" class="list-group-item list-group-item-action"><i class="fas fa-chart-line me-2"></i> Thống kê</a>
                <a href="huong_dan.html" class="list-group-item list-group-item-action"><i class="fas fa-book me-2"></i> Hướng dẫn</a>
                </div>
        </div>
    `;
    document.body.appendChild(menuDiv);
}

// 2. XỬ LÝ AUTH CHUNG
function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            document.getElementById('loginScreen').style.display = 'none';
            showLoading(true, "Đang xác thực...");
            
            // Lấy thông tin Role
            const safeKey = user.email.replace(/\./g, '_');
            db.ref('app_users/' + safeKey).on('value', snap => {
                const uData = snap.val();
                if(uData) {
                    currentUserRole = uData.group !== undefined ? uData.group : 0;
                    updateMenuInfo(uData);
                    // Callback về trang riêng (nếu có hàm onAuthSuccess)
                    if (typeof window.onAuthSuccess === 'function') window.onAuthSuccess(user, uData);
                } else {
                    // User mới -> Đăng ký
                    db.ref('app_users/' + safeKey).set({
                        email: user.email, real_name: user.displayName, photo: user.photoURL, group: 0, last_login: new Date().toISOString()
                    });
                }
                showLoading(false);
            });
        } else {
            document.getElementById('loginScreen').style.display = 'flex';
            if(document.getElementById('mainContent')) document.getElementById('mainContent').style.display = 'none';
        }
    });
}

function updateMenuInfo(uData) {
    document.getElementById('menuName').innerText = uData.real_name || currentUser.displayName;
    document.getElementById('menuAvatar').src = currentUser.photoURL;
    
    let roleTxt = `Nhóm ${currentUserRole}`;
    if (currentUserRole == 5) roleTxt = "Lãnh đạo / Admin (5)";
    if (currentUserRole == 0) roleTxt = "Chỉ xem (0)";
    document.getElementById('menuRole').innerText = roleTxt;

    // Inject Admin Menu
    const menuList = document.getElementById('menuList');
    const adminLink = document.getElementById('adminLink');
    
    if ((currentUserRole == 5 || currentUser.email === ADMIN_EMAIL) && !adminLink) {
        const a = document.createElement('a');
        a.id = 'adminLink';
        a.href = 'user.html';
        a.className = 'list-group-item list-group-item-action text-danger fw-bold';
        a.innerHTML = '<i class="fas fa-users-cog me-2"></i> Quản lý Nhân sự';
        menuList.appendChild(a);
    }
}

// 3. UTILS CHUNG
function showLoading(show, text="Đang xử lý...") {
    const el = document.getElementById('loadingOverlay');
    if(el) {
        document.getElementById('loadingText').innerText = text;
        el.style.display = show ? 'block' : 'none';
    }
}

function handleLogin() { auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); }
function handleLogout() { auth.signOut().then(() => location.reload()); }
function getSafeName(email) { return email.split('@')[0]; } // Fallback name
