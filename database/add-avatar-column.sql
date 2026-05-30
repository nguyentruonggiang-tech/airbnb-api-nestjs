USE airbnb_db;

ALTER TABLE nguoi_dung
  ADD COLUMN avatar TEXT NULL AFTER gender;
