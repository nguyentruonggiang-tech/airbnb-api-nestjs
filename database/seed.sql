USE airbnb_db;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE binh_luan;
TRUNCATE TABLE dat_phong;
TRUNCATE TABLE phong;
TRUNCATE TABLE vi_tri;
TRUNCATE TABLE nguoi_dung;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO nguoi_dung (name, email, pass_word, phone, birth_day, gender, role) VALUES
('Admin Airbnb', 'admin@gmail.com', '$2b$10$wjihJlEvLYlb5d4d71fPD.KhJYGCy.PbhqaHp8T7m/GYzQSOn5Kxm', '0901000001', '1990-01-15', 'Nam', 'ADMIN'),
('Nguyen Van A', 'user1@gmail.com', '$2b$10$wjihJlEvLYlb5d4d71fPD.KhJYGCy.PbhqaHp8T7m/GYzQSOn5Kxm', '0902000002', '1995-06-20', 'Nam', 'USER'),
('Tran Thi B', 'user2@gmail.com', '$2b$10$wjihJlEvLYlb5d4d71fPD.KhJYGCy.PbhqaHp8T7m/GYzQSOn5Kxm', '0903000003', '1998-03-10', 'Nữ', 'USER'),
('Le Van C', 'user3@gmail.com', '$2b$10$wjihJlEvLYlb5d4d71fPD.KhJYGCy.PbhqaHp8T7m/GYzQSOn5Kxm', '0904000004', '1992-11-25', 'Nam', 'USER');

INSERT INTO vi_tri (ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh) VALUES
('Quận 1', 'Hồ Chí Minh', 'Việt Nam', 'img/locations/q1.jpg'),
('Ba Đình', 'Hà Nội', 'Việt Nam', 'img/locations/badinh.jpg'),
('Hải Châu', 'Đà Nẵng', 'Việt Nam', 'img/locations/haichau.jpg'),
('Sơn Trà', 'Đà Nẵng', 'Việt Nam', 'img/locations/sonta.jpg'),
('Nha Trang', 'Khánh Hòa', 'Việt Nam', 'img/locations/nhatrang.jpg');

INSERT INTO phong (
  ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien,
  may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui,
  hinh_anh, ma_vi_tri
) VALUES
('Căn hộ view thành phố', 4, 2, 2, 1, 'Căn hộ tiện nghi gần trung tâm.', 850000, 1, 1, 1, 1, 1, 1, 0, 0, 1, 'img/rooms/q1-01.jpg', 1),
('Studio gần Bến Thành', 2, 1, 1, 1, 'Phòng nhỏ gọn, phù hợp cặp đôi.', 450000, 1, 0, 1, 1, 1, 1, 0, 0, 0, 'img/rooms/q1-02.jpg', 1),
('Nhà phố cổ Hà Nội', 6, 3, 3, 2, 'Không gian rộng, gần Hồ Gươm.', 1200000, 1, 1, 1, 1, 1, 1, 1, 0, 1, 'img/rooms/hn-01.jpg', 2),
('Homestay Ba Đình', 3, 1, 2, 1, 'Homestay ấm cúng, có bếp nhỏ.', 550000, 1, 1, 1, 1, 1, 1, 0, 0, 0, 'img/rooms/hn-02.jpg', 2),
('Biệt thự view biển', 8, 4, 4, 3, 'Biệt thự sang trọng gần biển.', 3500000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'img/rooms/dn-01.jpg', 3),
('Căn hộ cao cấp Sơn Trà', 5, 2, 3, 2, 'View biển đẹp, đầy đủ tiện ích.', 1800000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'img/rooms/dn-02.jpg', 4),
('Phòng khách sạn Nha Trang', 2, 1, 1, 1, 'Gần biển, thuận tiện đi lại.', 600000, 1, 1, 1, 1, 1, 0, 1, 1, 0, 'img/rooms/nt-01.jpg', 5);

INSERT INTO dat_phong (ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat) VALUES
(1, '2026-06-01', '2026-06-05', 2, 2),
(3, '2026-07-10', '2026-07-15', 4, 2),
(5, '2026-08-01', '2026-08-07', 6, 3),
(2, '2026-05-20', '2026-05-22', 2, 4),
(7, '2026-09-01', '2026-09-04', 2, 3);

INSERT INTO binh_luan (ma_phong, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan) VALUES
(1, 2, '2026-01-10 14:30:00', 'Phòng đẹp, sạch sẽ, vị trí tốt.', 5),
(1, 3, '2026-01-12 09:15:00', 'Giá hợp lý, wifi ổn định.', 4),
(3, 2, '2026-02-01 18:00:00', 'Không gian rộng rãi, phù hợp gia đình.', 5),
(5, 3, '2026-02-15 11:20:00', 'View biển tuyệt vời.', 5),
(5, 4, '2026-02-20 16:45:00', 'Host nhiệt tình, check-in nhanh.', 4),
(2, 4, '2026-03-01 10:00:00', 'Phòng nhỏ nhưng đầy đủ tiện nghi.', 3),
(7, 3, '2026-03-05 08:30:00', 'Gần biển, giá phải chăng.', 4);
