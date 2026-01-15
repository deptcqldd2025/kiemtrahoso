// config.js - Quản lý cấu hình tập trung

// 1. Cấu hình Firebase (QLDD-2025)
const firebaseConfig = {
    apiKey: "AIzaSyALxXDNbFdXkI7XvHqiSNb1jnKjj0CbYnE",
    authDomain: "qldd-2025.firebaseapp.com",
    databaseURL: "https://qldd-2025-default-rtdb.firebaseio.com",
    projectId: "qldd-2025",
    storageBucket: "qldd-2025.firebasestorage.app",
    messagingSenderId: "84684010166",
    appId: "1:84684010166:web:bd9c3b5ae4227ee2812c17",
    measurementId: "G-7E5BDTCSEZ"
};

// 2. Admin & Script
const ADMIN_EMAIL = 'deptc.qldd2025@gmail.com';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkobBHYC86WLwPgU3nXVxXLXkxxUt3fvmsPMof8-Tww_jN3FdsELmnS2p-f0ipnqif/exec';

// 3. Danh mục Hồ sơ chuẩn
const DOC_CATEGORIES = {
    QLVH: [ { id: 'thong_so_ky_thuat', name: 'Thông số kỹ thuật ĐZ' }, { id: 'theo_doi_dong_cat', name: 'Bảng theo dõi đóng cắt' }, { id: 'theo_doi_su_co', name: 'Bảng Theo dõi Sự cố' }, { id: 'theo_doi_phu_tai', name: 'Bảng thao dõi Phụ tải' }, { id: 'theo_doi_hanh_lang', name: 'Bảng Theo dõi kỹ thuật hành lang' }, { id: 'theo_doi_dai_tu', name: 'Bảng theo dõi công tác đại tu' }, { id: 'tong_hop_ton_tai', name: 'Bảng tổng hợp tồn tại' }, { id: 'bang_phan_bo_cot', name: 'Bảng phân bố cột' }, { id: 'bang_giao_cheo', name: 'Bảng giao chéo' }, { id: 'bang_do_do_vong', name: 'Bảng đo độ võng' }, { id: 'bao_cao_nhiet_do', name: 'Bảng báo cáo nhiệt độ' }, { id: 'bao_cao_dien_tro', name: 'Bảng báo cáo điện trở' }, { id: 'ho_so_thu_tu_pha', name: 'Hồ sơ thứ tự pha' }, { id: 'hinh_anh_tru', name: 'Hình Ảnh trụ' }, { id: 'bb_ktdk_ngay', name: 'Biên bản KTĐK ngày' }, { id: 'bb_ktdk_dem', name: 'Biên bản KTĐK đêm' }, { id: 'theo_doi_nha_cong_trinh', name: 'Hồ sơ theo dõi nhà/công trình' } ],
    THIET_KE: [ { id: 'hs_mong_tru', name: 'Hồ sơ móng trụ' }, { id: 'hs_den_bu', name: 'Hồ sơ đền bù' }, { id: 'hs_nghiem_thu', name: 'Hồ sơ nghiệm thu' }, { id: 'hs_thiet_ke', name: 'Hồ sơ thiết kế' }, { id: 'hs_du_thau', name: 'Hồ sơ dự thầu' } ],
    HOAN_CONG: [ { id: 'hc_phan_mong_tru', name: 'Hồ sơ hoàn công phần móng trụ' }, { id: 'hc_phan_tru', name: 'Hồ sơ hoàn công phần trụ' }, { id: 'bv_hc_phan_mong', name: 'Bản vẽ hoàn công phần móng' }, { id: 'bv_hc_phan_tru', name: 'Bản vẽ hoàn công phần trụ' }, { id: 'bv_hc_cap', name: 'Bản vẽ hoàn công hầm cáp, tuyến cáp, mốc cáp' }, { id: 'ban_do_dien_tro', name: 'Bản đo điện trở' }, { id: 'ban_do_do_vong', name: 'Bản đo độ võng' }, { id: 'ban_quan_trac_tru', name: 'Bản quan trắc trụ' }, { id: 'toa_do_vn2000', name: 'Tọa độ VN2000 phần DDK và cáp ngầm' }, { id: 'ban_phan_bo_cot', name: 'Bản phân bố cột' }, { id: 'so_do_thu_tu_pha', name: 'Sơ đồ thứ tự pha' }, { id: 'ban_giao_cheo_gt', name: 'Bản giao chéo đường bộ, sắt, sông' }, { id: 'ban_giao_cheo_dien', name: 'Bản giao chéo lưới điện và đèn chiếu sáng' }, { id: 'tk_nha_hanh_lang', name: 'Bảng thống kê nhà trong hành lang' }, { id: 'tk_nha_25m', name: 'Bảng thống kê nhà trong phạm vị 25 mét' }, { id: 'hs_boi_thuong', name: 'Hồ sơ bồi thường' } ]
};
