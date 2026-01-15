// layout.js - Tự động hóa giao diện & Auth

// --- 1. HÀM KHỞI TẠO GIAO DIỆN ---
function initAppLayout(pageTitle) {
    // A. Render Loading
    if (!document.getElementById('loadingOverlay')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="loadingOverlay">
                <div class="spinner-border text-primary"></div>
                <p class="mt-3 fw-bold" id="loadingText">Đang tải...</p>
            </div>
        `);
    }

    // B. Render Login
    if (!document.getElementById('loginScreen')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="loginScreen">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="80" class="mb-4">
                <h4 class="mb-3 text-primary fw-bold">Sổ Tay Đường Dây</h4>
                <button class="btn btn-outline-dark btn-lg px-4" onclick="handleLogin()">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" class="me-2"> Đăng nhập
                </button>
                <small class="mt-4 text-muted">Version 5.0</small>
            </div>
        `);
    }

    // C. Render Sidebar Menu
    const menuHTML = `
        <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebarMenu">
            <div class="offcanvas-header bg-primary text-white">
                <h5 class="offcanvas-title">Menu Hệ Thống</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
                <div class="text-center mb-4">
                    <img id="menuAvatar" src="" style="width:60px;height:60px;border-radius:50%;object-fit:cover">
                    <div class="fw-bold mt-2" id="menuUserName">Khách</div>
                    <div class="small text-muted" id="menuUserRole">...</div>
                    <button class="btn btn-sm btn-outline-danger mt-2" onclick="handleLogout()">Đăng xuất</button>
                </div>
                <div class="list-group list-group-flush">
                    <a href="index.html" class="list-group-item list-group-item-action ${isPage('index.html') ? 'active' : ''}"><i class="fas fa-home me-2"></i> Trang chủ (Kiểm tra)</a>
                    <a href="chart.html" class="list-group-item list-group-item-action ${isPage('chart.html') ? 'active' : ''}"><i class="fas fa-chart-line me-2"></i> Thống kê & Báo cáo</a>
                    <a href="huong_dan.html" target="_blank" class="list-group-item list-group-item-action"><i class="fas fa-book me-2"></i> Hướng dẫn sử dụng</a>
                    <a id="btnAdminMenu" href="user.html" class="list-group-item list-group-item-action d-none text-danger fw-bold ${isPage('user.html') ? 'active' : ''}"><i class="fas fa-users-cog me-2"></i> Quản lý Nhân sự</a>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('afterbegin', menuHTML);

    // D. Render Header
    const headerHTML = `
        <div class="app-header">
            <button class="menu-btn" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu"><i class="fas fa-bars"></i></button>
            <h6 class="m-0 fw-bold">${pageTitle}</h6>
            <div style="width: 24px;"></div> </div>`;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // E. Render Footer (Bottom Navigation)
    const footerHTML = `
        <div class="app-footer">
            <a href="index.html" class="nav-item-link ${isPage('index.html') ? 'active' : ''}">
                <i class="fas fa-home"></i> Trang chủ
            </a>
            <a href="chart.html" class="nav-item-link ${isPage('chart.html') ? 'active' : ''}">
                <i class="fas fa-chart-pie"></i> Thống kê
            </a>
            <a href="#" class="nav-item-link" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu">
                <i class="fas fa-bars"></i> Menu
            </a>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// Helper: Check current page
function isPage(name) { return window.location.pathname.includes(name) || (name === 'index.html' && window.location.pathname.endsWith('/')); }

// --- 2. XỬ LÝ AUTH DÙNG CHUNG ---
function initAuth(onUserLoaded) {
    showLoading(true, "Đang xác thực...");
    auth.onAuthStateChanged(user => {
        if (user) {
            document.getElementById('loginScreen').style.display = 'none';
            // Load Role
            const userKey = user.email.replace(/\./g, '_');
            db.ref('app_users/' + userKey).on('value', snap => {
                const uData = snap.val();
                if (uData) {
                    updateMenu(user, uData);
                    if (onUserLoaded) onUserLoaded(user, uData); // Callback về trang con
                } else {
                    // New User
                    db.ref('app_users/' + userKey).set({ email: user.email, real_name: user.displayName, photo: user.photoURL, group: 0 });
                }
                showLoading(false);
            });
        } else {
            currentUser = null;
            document.getElementById('loginScreen').style.display = 'flex';
            showLoading(false);
        }
    });
}

function updateMenu(user, uData) {
    const img = document.getElementById('menuAvatar');
    if(img) img.src = user.photoURL;
    
    const nameEl = document.getElementById('menuUserName');
    if(nameEl) nameEl.innerText = uData.real_name || user.displayName;

    const grp = uData.group !== undefined ? uData.group : 0;
    let roleTxt = grp == 5 ? "Lãnh đạo (Admin)" : (grp == 0 ? "Khách (Chỉ xem)" : `Tổ ${grp}`);
    const roleEl = document.getElementById('menuUserRole');
    if(roleEl) roleEl.innerText = roleTxt;

    // Show Admin Menu
    if (grp == 5 || user.email === ADMIN_EMAIL) {
        const btnAdmin = document.getElementById('btnAdminMenu');
        if(btnAdmin) btnAdmin.classList.remove('d-none');
    }
}

function showLoading(show, text="Đang xử lý...") {
    const el = document.getElementById('loadingOverlay');
    if(el) {
        document.getElementById('loadingText').innerText = text;
        el.style.display = show ? 'block' : 'none';
    }
}

function handleLogin() { auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); }
function handleLogout() { auth.signOut().then(() => window.location.href = "index.html"); }
