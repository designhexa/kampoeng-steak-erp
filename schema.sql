-- Kampoeng Steak ERP Database Schema
-- Execute this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/mcchxknjuzldyjuhwpid/sql

-- ============================================
-- DROP ALL EXISTING TABLES (IF ANY)
-- ============================================

DROP TABLE IF EXISTS cash_flow CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS shift_reports CASCADE;
DROP TABLE IF EXISTS daily_checklists CASCADE;
DROP TABLE IF EXISTS distributions CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS outlets CASCADE;

-- ============================================
-- TABLE DEFINITIONS
-- ============================================

-- 1. Outlets Table
CREATE TABLE outlets (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'Renovation')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Employees Table
CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  salary BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Ingredients Table
CREATE TABLE ingredients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  stock BIGINT NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_stock BIGINT NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'Normal' CHECK (status IN ('Critical', 'Low', 'Normal')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Sales Table
CREATE TABLE sales (
  id BIGSERIAL PRIMARY KEY,
  outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  total BIGINT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'Debit', 'Credit', 'QRIS', 'Ewallet')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Suppliers Table
CREATE TABLE suppliers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  rating BIGINT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Purchase Orders Table
CREATE TABLE purchase_orders (
  id BIGSERIAL PRIMARY KEY,
  outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  supplier_id BIGINT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  total BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Distributions Table
CREATE TABLE distributions (
  id BIGSERIAL PRIMARY KEY,
  from_outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  to_outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  quantity BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'InTransit', 'Delivered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Daily Checklists Table
CREATE TABLE daily_checklists (
  id BIGSERIAL PRIMARY KEY,
  outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Shift Reports Table
CREATE TABLE shift_reports (
  id BIGSERIAL PRIMARY KEY,
  outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  shift_start TIMESTAMPTZ NOT NULL,
  initial_cash BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Candidates Table
CREATE TABLE candidates (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interview', 'Hired', 'Rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Promotions Table
CREATE TABLE promotions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('Percentage', 'Fixed')),
  discount_value BIGINT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Upcoming', 'Expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Assets Table
CREATE TABLE assets (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'InUse' CHECK (status IN ('InUse', 'Maintenance', 'Broken')),
  last_maintenance TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Cash Flow Table
CREATE TABLE cash_flow (
  id BIGSERIAL PRIMARY KEY,
  outlet_id BIGINT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Inflow', 'Outflow')),
  category TEXT NOT NULL,
  amount BIGINT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Users Table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('AdminPusat', 'AreaManager', 'OutletManager', 'Kasir', 'HR', 'Gudang', 'Finance')),
  outlet_id BIGINT REFERENCES outlets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for development)
-- IMPORTANT: Update these policies for production with proper authentication

CREATE POLICY "Allow all operations on outlets" ON outlets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on employees" ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on ingredients" ON ingredients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sales" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on purchase_orders" ON purchase_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on distributions" ON distributions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on daily_checklists" ON daily_checklists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on shift_reports" ON shift_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on candidates" ON candidates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on promotions" ON promotions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on assets" ON assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on cash_flow" ON cash_flow FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- DUMMY DATA (286+ Records)
-- ============================================

-- 1. Insert 18 Outlets
INSERT INTO outlets (name, area, address, status) VALUES
  ('Kampoeng Steak Jakarta Pusat', 'Jakarta', 'Jl. Sudirman No. 123, Jakarta Pusat', 'Open'),
  ('Kampoeng Steak Jakarta Selatan', 'Jakarta', 'Jl. TB Simatupang No. 45, Jakarta Selatan', 'Open'),
  ('Kampoeng Steak Bandung', 'Bandung', 'Jl. Dago No. 78, Bandung', 'Open'),
  ('Kampoeng Steak Surabaya', 'Surabaya', 'Jl. HR Muhammad No. 90, Surabaya', 'Open'),
  ('Kampoeng Steak Yogyakarta', 'Yogyakarta', 'Jl. Malioboro No. 56, Yogyakarta', 'Open'),
  ('Kampoeng Steak Semarang', 'Semarang', 'Jl. Pandanaran No. 34, Semarang', 'Open'),
  ('Kampoeng Steak Medan', 'Medan', 'Jl. Gatot Subroto No. 12, Medan', 'Open'),
  ('Kampoeng Steak Makassar', 'Makassar', 'Jl. AP Pettarani No. 67, Makassar', 'Open'),
  ('Kampoeng Steak Denpasar', 'Bali', 'Jl. Sunset Road No. 89, Denpasar', 'Open'),
  ('Kampoeng Steak Palembang', 'Palembang', 'Jl. Sudirman No. 23, Palembang', 'Open'),
  ('Kampoeng Steak Balikpapan', 'Kalimantan', 'Jl. Ahmad Yani No. 45, Balikpapan', 'Open'),
  ('Kampoeng Steak Manado', 'Sulawesi', 'Jl. Piere Tendean No. 78, Manado', 'Open'),
  ('Kampoeng Steak Pontianak', 'Kalimantan', 'Jl. Gajah Mada No. 56, Pontianak', 'Open'),
  ('Kampoeng Steak Solo', 'Solo', 'Jl. Slamet Riyadi No. 34, Solo', 'Open'),
  ('Kampoeng Steak Malang', 'Malang', 'Jl. Ijen No. 90, Malang', 'Open'),
  ('Kampoeng Steak Depok', 'Jakarta', 'Jl. Margonda Raya No. 123, Depok', 'Open'),
  ('Kampoeng Steak Tangerang', 'Jakarta', 'Jl. BSD Raya No. 45, Tangerang', 'Open'),
  ('Kampoeng Steak Bekasi', 'Jakarta', 'Jl. Ahmad Yani No. 67, Bekasi', 'Open');

-- 2. Insert 50 Employees (distributed across outlets)
INSERT INTO employees (name, outlet_id, position, salary, status) VALUES
  ('Ahmad Fauzi', 1, 'Manager', 6000000, 'Active'),
  ('Siti Nurhaliza', 1, 'Kasir', 3500000, 'Active'),
  ('Budi Santoso', 1, 'Koki', 4000000, 'Active'),
  ('Dewi Lestari', 2, 'Manager', 6000000, 'Active'),
  ('Eko Prasetyo', 2, 'Waiter', 3000000, 'Active'),
  ('Fitri Handayani', 3, 'Manager', 6000000, 'Active'),
  ('Gunawan Wijaya', 3, 'Koki', 4000000, 'Active'),
  ('Hesti Purnamasari', 4, 'Kasir', 3500000, 'Active'),
  ('Irfan Hakim', 4, 'Waiter', 3000000, 'Active'),
  ('Joko Widodo', 5, 'Manager', 6000000, 'Active'),
  ('Kartika Sari', 5, 'Koki', 4000000, 'Active'),
  ('Lutfi Agung', 6, 'Manager', 6000000, 'Active'),
  ('Maya Sari', 6, 'Kasir', 3500000, 'Active'),
  ('Nurul Hidayah', 7, 'Waiter', 3000000, 'Active'),
  ('Omar Abdullah', 7, 'Koki', 4000000, 'Active'),
  ('Putri Ayu', 8, 'Manager', 6000000, 'Active'),
  ('Qori Sandioriva', 8, 'Kasir', 3500000, 'Active'),
  ('Rudi Hartono', 9, 'Waiter', 3000000, 'Active'),
  ('Siska Meliana', 9, 'Koki', 4000000, 'Active'),
  ('Tono Suryono', 10, 'Manager', 6000000, 'Active'),
  ('Umar Bakri', 10, 'Kasir', 3500000, 'Active'),
  ('Vina Panduwinata', 11, 'Waiter', 3000000, 'Active'),
  ('Wawan Setiawan', 11, 'Koki', 4000000, 'Active'),
  ('Xavier Budi', 12, 'Manager', 6000000, 'Active'),
  ('Yanti Sukmawati', 12, 'Kasir', 3500000, 'Active'),
  ('Zaenal Abidin', 13, 'Waiter', 3000000, 'Active'),
  ('Anisa Rahman', 13, 'Koki', 4000000, 'Active'),
  ('Bambang Pamungkas', 14, 'Manager', 6000000, 'Active'),
  ('Citra Kirana', 14, 'Kasir', 3500000, 'Active'),
  ('Dedi Mizwar', 15, 'Waiter', 3000000, 'Active'),
  ('Elisa Novia', 15, 'Koki', 4000000, 'Active'),
  ('Fajar Alfian', 16, 'Manager', 6000000, 'Active'),
  ('Gina Gardena', 16, 'Kasir', 3500000, 'Active'),
  ('Hendra Wijaya', 17, 'Waiter', 3000000, 'Active'),
  ('Indah Permata', 17, 'Koki', 4000000, 'Active'),
  ('Jajang Nurjaman', 18, 'Manager', 6000000, 'Active'),
  ('Karina Salim', 18, 'Kasir', 3500000, 'Active'),
  ('Linda Putri', 1, 'Waiter', 3000000, 'Active'),
  ('Maman Suherman', 2, 'Koki', 4000000, 'Active'),
  ('Nina Zatulini', 3, 'Waiter', 3000000, 'Active'),
  ('Oki Setiana', 4, 'Koki', 4000000, 'Active'),
  ('Pasha Ungu', 5, 'Kasir', 3500000, 'Active'),
  ('Queen Rizky', 6, 'Waiter', 3000000, 'Active'),
  ('Raffi Ahmad', 7, 'Koki', 4000000, 'Active'),
  ('Syahrini', 8, 'Kasir', 3500000, 'Active'),
  ('Tulus Setiawan', 9, 'Waiter', 3000000, 'Active'),
  ('Ussy Sulistiawaty', 10, 'Koki', 4000000, 'Active'),
  ('Vicky Prasetyo', 11, 'Kasir', 3500000, 'Active'),
  ('Wulan Guritno', 12, 'Waiter', 3000000, 'Inactive'),
  ('Yasmin Napper', 13, 'Koki', 4000000, 'Active');

-- 3. Insert 10 Products
INSERT INTO products (name, category, price) VALUES
  ('Steak Wagyu A5', 'Steak', 350000),
  ('Steak Sirloin', 'Steak', 150000),
  ('Steak Tenderloin', 'Steak', 180000),
  ('Chicken Steak', 'Steak', 85000),
  ('Fish & Chips', 'Seafood', 75000),
  ('Pasta Carbonara', 'Pasta', 65000),
  ('Nasi Goreng Special', 'Rice', 50000),
  ('French Fries', 'Sides', 25000),
  ('Caesar Salad', 'Salad', 45000),
  ('Ice Lemon Tea', 'Beverage', 15000);

-- 4. Insert 20 Ingredients (distributed across outlets)
INSERT INTO ingredients (name, outlet_id, stock, unit, min_stock, status) VALUES
  ('Daging Sapi Wagyu', 1, 15, 'kg', 10, 'Normal'),
  ('Daging Sapi Sirloin', 1, 8, 'kg', 10, 'Critical'),
  ('Kentang', 1, 50, 'kg', 20, 'Normal'),
  ('Tomat', 2, 12, 'kg', 10, 'Low'),
  ('Bawang Bombay', 2, 25, 'kg', 15, 'Normal'),
  ('Keju Cheddar', 3, 10, 'kg', 8, 'Low'),
  ('Telur', 3, 100, 'butir', 50, 'Normal'),
  ('Minyak Goreng', 4, 30, 'liter', 20, 'Normal'),
  ('Garam', 4, 20, 'kg', 10, 'Normal'),
  ('Merica', 5, 5, 'kg', 10, 'Critical'),
  ('Saus BBQ', 5, 15, 'botol', 10, 'Normal'),
  ('Mayones', 6, 8, 'kg', 10, 'Critical'),
  ('Pasta Kering', 6, 25, 'kg', 15, 'Normal'),
  ('Ayam Fillet', 7, 40, 'kg', 20, 'Normal'),
  ('Ikan Dori', 7, 18, 'kg', 15, 'Normal'),
  ('Lettuce', 8, 10, 'kg', 8, 'Low'),
  ('Wortel', 8, 30, 'kg', 15, 'Normal'),
  ('Beras', 9, 100, 'kg', 50, 'Normal'),
  ('Susu Fresh', 9, 20, 'liter', 15, 'Normal'),
  ('Teh', 10, 50, 'box', 20, 'Normal');

-- 5. Insert 30 Sales (distributed across outlets and days)
INSERT INTO sales (outlet_id, total, payment_method, created_at) VALUES
  (1, 850000, 'Cash', NOW() - INTERVAL '1 day'),
  (1, 350000, 'QRIS', NOW() - INTERVAL '1 day'),
  (2, 150000, 'Debit', NOW() - INTERVAL '2 days'),
  (2, 250000, 'Credit', NOW() - INTERVAL '2 days'),
  (3, 500000, 'Ewallet', NOW() - INTERVAL '3 days'),
  (3, 180000, 'Cash', NOW() - INTERVAL '3 days'),
  (4, 420000, 'QRIS', NOW() - INTERVAL '4 days'),
  (4, 310000, 'Debit', NOW() - INTERVAL '4 days'),
  (5, 650000, 'Credit', NOW() - INTERVAL '5 days'),
  (5, 220000, 'Cash', NOW() - INTERVAL '5 days'),
  (6, 380000, 'QRIS', NOW() - INTERVAL '6 days'),
  (6, 470000, 'Ewallet', NOW() - INTERVAL '6 days'),
  (7, 290000, 'Debit', NOW() - INTERVAL '7 days'),
  (7, 530000, 'Credit', NOW() - INTERVAL '7 days'),
  (8, 410000, 'Cash', NOW() - INTERVAL '1 day'),
  (8, 350000, 'QRIS', NOW() - INTERVAL '1 day'),
  (9, 580000, 'Ewallet', NOW() - INTERVAL '2 days'),
  (9, 240000, 'Debit', NOW() - INTERVAL '2 days'),
  (10, 620000, 'Credit', NOW() - INTERVAL '3 days'),
  (10, 390000, 'Cash', NOW() - INTERVAL '3 days'),
  (11, 450000, 'QRIS', NOW() - INTERVAL '4 days'),
  (11, 330000, 'Ewallet', NOW() - INTERVAL '4 days'),
  (12, 510000, 'Debit', NOW() - INTERVAL '5 days'),
  (12, 270000, 'Credit', NOW() - INTERVAL '5 days'),
  (13, 440000, 'Cash', NOW() - INTERVAL '6 days'),
  (13, 360000, 'QRIS', NOW() - INTERVAL '6 days'),
  (14, 490000, 'Ewallet', NOW() - INTERVAL '7 days'),
  (14, 320000, 'Debit', NOW()),
  (15, 560000, 'Credit', NOW()),
  (15, 280000, 'Cash', NOW());

-- 6. Insert 5 Suppliers
INSERT INTO suppliers (name, contact, rating) VALUES
  ('PT Daging Prima', '021-12345678', 5),
  ('PT Sayur Fresh', '021-23456789', 4),
  ('CV Seafood Nusantara', '031-34567890', 5),
  ('PT Bumbu Rempah', '022-45678901', 4),
  ('UD Bahan Pokok', '024-56789012', 5);

-- 7. Insert 15 Purchase Orders
INSERT INTO purchase_orders (outlet_id, supplier_id, total, status, created_at) VALUES
  (1, 1, 15000000, 'Approved', NOW() - INTERVAL '1 day'),
  (2, 2, 5000000, 'Pending', NOW() - INTERVAL '2 days'),
  (3, 3, 8000000, 'Approved', NOW() - INTERVAL '3 days'),
  (4, 4, 3000000, 'Rejected', NOW() - INTERVAL '4 days'),
  (5, 5, 12000000, 'Approved', NOW() - INTERVAL '5 days'),
  (6, 1, 9000000, 'Pending', NOW() - INTERVAL '6 days'),
  (7, 2, 6000000, 'Approved', NOW() - INTERVAL '7 days'),
  (8, 3, 7500000, 'Pending', NOW() - INTERVAL '1 day'),
  (9, 4, 4500000, 'Approved', NOW() - INTERVAL '2 days'),
  (10, 5, 10000000, 'Pending', NOW() - INTERVAL '3 days'),
  (11, 1, 11000000, 'Approved', NOW() - INTERVAL '4 days'),
  (12, 2, 5500000, 'Rejected', NOW() - INTERVAL '5 days'),
  (13, 3, 8500000, 'Approved', NOW() - INTERVAL '6 days'),
  (14, 4, 3500000, 'Pending', NOW() - INTERVAL '7 days'),
  (15, 5, 13000000, 'Approved', NOW());

-- 8. Insert 10 Distributions
INSERT INTO distributions (from_outlet_id, to_outlet_id, ingredient_name, quantity, status, created_at) VALUES
  (1, 2, 'Daging Sapi Wagyu', 5, 'Delivered', NOW() - INTERVAL '1 day'),
  (1, 3, 'Kentang', 20, 'InTransit', NOW() - INTERVAL '2 days'),
  (2, 4, 'Tomat', 10, 'Pending', NOW() - INTERVAL '3 days'),
  (3, 5, 'Keju Cheddar', 8, 'Delivered', NOW() - INTERVAL '4 days'),
  (4, 6, 'Minyak Goreng', 15, 'InTransit', NOW() - INTERVAL '5 days'),
  (5, 7, 'Merica', 3, 'Delivered', NOW() - INTERVAL '6 days'),
  (6, 8, 'Pasta Kering', 12, 'Pending', NOW() - INTERVAL '7 days'),
  (7, 9, 'Ayam Fillet', 25, 'Delivered', NOW() - INTERVAL '1 day'),
  (8, 10, 'Lettuce', 8, 'InTransit', NOW() - INTERVAL '2 days'),
  (9, 11, 'Beras', 50, 'Pending', NOW() - INTERVAL '3 days');

-- 9. Insert 18 Daily Checklists (one for each outlet)
INSERT INTO daily_checklists (outlet_id, task, completed, created_at) VALUES
  (1, 'Cek kebersihan dapur', true, NOW()),
  (2, 'Cek suhu kulkas', false, NOW()),
  (3, 'Cek stok bahan baku', true, NOW()),
  (4, 'Cek peralatan masak', true, NOW()),
  (5, 'Cek kebersihan toilet', false, NOW()),
  (6, 'Cek kondisi meja kursi', true, NOW()),
  (7, 'Cek AC dan ventilasi', true, NOW()),
  (8, 'Cek sistem POS', false, NOW()),
  (9, 'Cek persediaan tissue', true, NOW()),
  (10, 'Cek kebersihan lantai', true, NOW()),
  (11, 'Cek kondisi piring gelas', false, NOW()),
  (12, 'Cek stok minuman', true, NOW()),
  (13, 'Cek kebersihan area kasir', true, NOW()),
  (14, 'Cek lampu penerangan', false, NOW()),
  (15, 'Cek kondisi kompor gas', true, NOW()),
  (16, 'Cek kebersihan ruang tunggu', true, NOW()),
  (17, 'Cek stok kemasan takeaway', false, NOW()),
  (18, 'Cek kondisi freezer', true, NOW());

-- 10. Insert 10 Shift Reports
INSERT INTO shift_reports (outlet_id, employee_name, shift_start, initial_cash, status, created_at) VALUES
  (1, 'Siti Nurhaliza', NOW() - INTERVAL '8 hours', 2000000, 'Closed', NOW() - INTERVAL '8 hours'),
  (2, 'Hesti Purnamasari', NOW() - INTERVAL '10 hours', 1500000, 'Closed', NOW() - INTERVAL '10 hours'),
  (3, 'Maya Sari', NOW() - INTERVAL '6 hours', 2500000, 'Open', NOW() - INTERVAL '6 hours'),
  (4, 'Qori Sandioriva', NOW() - INTERVAL '7 hours', 1800000, 'Open', NOW() - INTERVAL '7 hours'),
  (5, 'Umar Bakri', NOW() - INTERVAL '9 hours', 2200000, 'Closed', NOW() - INTERVAL '9 hours'),
  (6, 'Yanti Sukmawati', NOW() - INTERVAL '5 hours', 1600000, 'Open', NOW() - INTERVAL '5 hours'),
  (7, 'Citra Kirana', NOW() - INTERVAL '8 hours', 2100000, 'Closed', NOW() - INTERVAL '8 hours'),
  (8, 'Gina Gardena', NOW() - INTERVAL '6 hours', 1900000, 'Open', NOW() - INTERVAL '6 hours'),
  (9, 'Karina Salim', NOW() - INTERVAL '7 hours', 2300000, 'Open', NOW() - INTERVAL '7 hours'),
  (10, 'Pasha Ungu', NOW() - INTERVAL '10 hours', 1700000, 'Closed', NOW() - INTERVAL '10 hours');

-- 11. Insert 15 Candidates
INSERT INTO candidates (name, position, outlet_id, status, created_at) VALUES
  ('Andi Wijaya', 'Kasir', 1, 'Interview', NOW() - INTERVAL '5 days'),
  ('Bima Sakti', 'Koki', 2, 'Applied', NOW() - INTERVAL '3 days'),
  ('Cindy Claudia', 'Waiter', 3, 'Hired', NOW() - INTERVAL '10 days'),
  ('Dika Prasetya', 'Manager', 4, 'Interview', NOW() - INTERVAL '7 days'),
  ('Erna Sari', 'Kasir', 5, 'Applied', NOW() - INTERVAL '2 days'),
  ('Fadli Rahman', 'Koki', 6, 'Rejected', NOW() - INTERVAL '15 days'),
  ('Gita Savitri', 'Waiter', 7, 'Hired', NOW() - INTERVAL '12 days'),
  ('Hadi Santoso', 'Manager', 8, 'Interview', NOW() - INTERVAL '6 days'),
  ('Ika Natassa', 'Kasir', 9, 'Applied', NOW() - INTERVAL '4 days'),
  ('Joni Iskandar', 'Koki', 10, 'Hired', NOW() - INTERVAL '8 days'),
  ('Kiki Amalia', 'Waiter', 11, 'Interview', NOW() - INTERVAL '5 days'),
  ('Leo Kristi', 'Manager', 12, 'Applied', NOW() - INTERVAL '3 days'),
  ('Mita Nurhayati', 'Kasir', 13, 'Rejected', NOW() - INTERVAL '20 days'),
  ('Nanda Arsyinta', 'Koki', 14, 'Hired', NOW() - INTERVAL '9 days'),
  ('Oka Antara', 'Waiter', 15, 'Interview', NOW() - INTERVAL '6 days');

-- 12. Insert 5 Promotions
INSERT INTO promotions (name, discount_type, discount_value, start_date, end_date, status, created_at) VALUES
  ('Promo Akhir Tahun', 'Percentage', 25, NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', 'Active', NOW() - INTERVAL '10 days'),
  ('Diskon Weekday', 'Fixed', 50000, NOW() - INTERVAL '5 days', NOW() + INTERVAL '30 days', 'Active', NOW() - INTERVAL '5 days'),
  ('Flash Sale Steak', 'Percentage', 30, NOW() + INTERVAL '5 days', NOW() + INTERVAL '15 days', 'Upcoming', NOW()),
  ('Promo Valentine', 'Fixed', 100000, NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days', 'Expired', NOW() - INTERVAL '60 days'),
  ('Buy 1 Get 1', 'Percentage', 50, NOW() - INTERVAL '3 days', NOW() + INTERVAL '25 days', 'Active', NOW() - INTERVAL '3 days');

-- 13. Insert 30 Assets (distributed across outlets)
INSERT INTO assets (name, outlet_id, status, last_maintenance, created_at) VALUES
  ('Kompor Gas 4 Tungku', 1, 'InUse', NOW() - INTERVAL '30 days', NOW() - INTERVAL '180 days'),
  ('Kulkas Display', 1, 'InUse', NOW() - INTERVAL '15 days', NOW() - INTERVAL '200 days'),
  ('Mesin Kasir POS', 1, 'InUse', NOW() - INTERVAL '60 days', NOW() - INTERVAL '150 days'),
  ('AC Split 2 PK', 2, 'Maintenance', NOW() - INTERVAL '5 days', NOW() - INTERVAL '300 days'),
  ('Freezer', 2, 'InUse', NOW() - INTERVAL '20 days', NOW() - INTERVAL '250 days'),
  ('Kompor Gas 6 Tungku', 3, 'InUse', NOW() - INTERVAL '45 days', NOW() - INTERVAL '190 days'),
  ('Kulkas 2 Pintu', 3, 'Broken', NOW() - INTERVAL '90 days', NOW() - INTERVAL '400 days'),
  ('Oven Listrik', 4, 'InUse', NOW() - INTERVAL '30 days', NOW() - INTERVAL '220 days'),
  ('Mesin Cuci Piring', 4, 'InUse', NOW() - INTERVAL '25 days', NOW() - INTERVAL '180 days'),
  ('AC Central', 5, 'InUse', NOW() - INTERVAL '40 days', NOW() - INTERVAL '350 days'),
  ('Kompor Gas 4 Tungku', 6, 'InUse', NOW() - INTERVAL '35 days', NOW() - INTERVAL '175 days'),
  ('Kulkas Display', 6, 'Maintenance', NOW() - INTERVAL '10 days', NOW() - INTERVAL '210 days'),
  ('Mesin Kasir POS', 7, 'InUse', NOW() - INTERVAL '50 days', NOW() - INTERVAL '160 days'),
  ('AC Split 2 PK', 7, 'InUse', NOW() - INTERVAL '30 days', NOW() - INTERVAL '280 days'),
  ('Freezer', 8, 'InUse', NOW() - INTERVAL '20 days', NOW() - INTERVAL '240 days'),
  ('Kompor Gas 6 Tungku', 8, 'InUse', NOW() - INTERVAL '40 days', NOW() - INTERVAL '195 days'),
  ('Kulkas 2 Pintu', 9, 'InUse', NOW() - INTERVAL '25 days', NOW() - INTERVAL '230 days'),
  ('Oven Listrik', 9, 'InUse', NOW() - INTERVAL '35 days', NOW() - INTERVAL '215 days'),
  ('Mesin Cuci Piring', 10, 'Broken', NOW() - INTERVAL '120 days', NOW() - INTERVAL '500 days'),
  ('AC Central', 10, 'InUse', NOW() - INTERVAL '45 days', NOW() - INTERVAL '340 days'),
  ('Kompor Gas 4 Tungku', 11, 'InUse', NOW() - INTERVAL '30 days', NOW() - INTERVAL '185 days'),
  ('Kulkas Display', 11, 'InUse', NOW() - INTERVAL '15 days', NOW() - INTERVAL '205 days'),
  ('Mesin Kasir POS', 12, 'InUse', NOW() - INTERVAL '55 days', NOW() - INTERVAL '155 days'),
  ('AC Split 2 PK', 12, 'Maintenance', NOW() - INTERVAL '8 days', NOW() - INTERVAL '290 days'),
  ('Freezer', 13, 'InUse', NOW() - INTERVAL '22 days', NOW() - INTERVAL '245 days'),
  ('Kompor Gas 6 Tungku', 13, 'InUse', NOW() - INTERVAL '42 days', NOW() - INTERVAL '192 days'),
  ('Kulkas 2 Pintu', 14, 'InUse', NOW() - INTERVAL '28 days', NOW() - INTERVAL '235 days'),
  ('Oven Listrik', 14, 'InUse', NOW() - INTERVAL '38 days', NOW() - INTERVAL '218 days'),
  ('Mesin Cuci Piring', 15, 'InUse', NOW() - INTERVAL '32 days', NOW() - INTERVAL '188 days'),
  ('AC Central', 15, 'InUse', NOW() - INTERVAL '48 days', NOW() - INTERVAL '345 days');

-- 14. Insert 50 Cash Flow Records
INSERT INTO cash_flow (outlet_id, type, category, amount, description, created_at) VALUES
  (1, 'Inflow', 'Sales', 1200000, 'Penjualan harian', NOW() - INTERVAL '1 day'),
  (1, 'Outflow', 'Purchase', 500000, 'Pembelian bahan baku', NOW() - INTERVAL '1 day'),
  (2, 'Inflow', 'Sales', 850000, 'Penjualan harian', NOW() - INTERVAL '2 days'),
  (2, 'Outflow', 'Salary', 3000000, 'Gaji karyawan', NOW() - INTERVAL '2 days'),
  (3, 'Inflow', 'Sales', 1500000, 'Penjualan harian', NOW() - INTERVAL '3 days'),
  (3, 'Outflow', 'Rent', 5000000, 'Sewa tempat bulanan', NOW() - INTERVAL '3 days'),
  (4, 'Inflow', 'Sales', 950000, 'Penjualan harian', NOW() - INTERVAL '4 days'),
  (4, 'Outflow', 'Utilities', 1200000, 'Listrik dan air', NOW() - INTERVAL '4 days'),
  (5, 'Inflow', 'Sales', 1350000, 'Penjualan harian', NOW() - INTERVAL '5 days'),
  (5, 'Outflow', 'Purchase', 800000, 'Pembelian bahan baku', NOW() - INTERVAL '5 days'),
  (6, 'Inflow', 'Sales', 1100000, 'Penjualan harian', NOW() - INTERVAL '6 days'),
  (6, 'Outflow', 'Maintenance', 2500000, 'Perbaikan AC', NOW() - INTERVAL '6 days'),
  (7, 'Inflow', 'Sales', 980000, 'Penjualan harian', NOW() - INTERVAL '7 days'),
  (7, 'Outflow', 'Purchase', 650000, 'Pembelian bahan baku', NOW() - INTERVAL '7 days'),
  (8, 'Inflow', 'Sales', 1250000, 'Penjualan harian', NOW() - INTERVAL '1 day'),
  (8, 'Outflow', 'Salary', 3500000, 'Gaji karyawan', NOW() - INTERVAL '1 day'),
  (9, 'Inflow', 'Sales', 1400000, 'Penjualan harian', NOW() - INTERVAL '2 days'),
  (9, 'Outflow', 'Rent', 4500000, 'Sewa tempat bulanan', NOW() - INTERVAL '2 days'),
  (10, 'Inflow', 'Sales', 1050000, 'Penjualan harian', NOW() - INTERVAL '3 days'),
  (10, 'Outflow', 'Utilities', 1100000, 'Listrik dan air', NOW() - INTERVAL '3 days'),
  (11, 'Inflow', 'Sales', 1300000, 'Penjualan harian', NOW() - INTERVAL '4 days'),
  (11, 'Outflow', 'Purchase', 700000, 'Pembelian bahan baku', NOW() - INTERVAL '4 days'),
  (12, 'Inflow', 'Sales', 920000, 'Penjualan harian', NOW() - INTERVAL '5 days'),
  (12, 'Outflow', 'Maintenance', 1800000, 'Perbaikan kulkas', NOW() - INTERVAL '5 days'),
  (13, 'Inflow', 'Sales', 1180000, 'Penjualan harian', NOW() - INTERVAL '6 days'),
  (13, 'Outflow', 'Purchase', 550000, 'Pembelian bahan baku', NOW() - INTERVAL '6 days'),
  (14, 'Inflow', 'Sales', 1450000, 'Penjualan harian', NOW() - INTERVAL '7 days'),
  (14, 'Outflow', 'Salary', 3200000, 'Gaji karyawan', NOW() - INTERVAL '7 days'),
  (15, 'Inflow', 'Sales', 1600000, 'Penjualan harian', NOW()),
  (15, 'Outflow', 'Rent', 5500000, 'Sewa tempat bulanan', NOW()),
  (1, 'Inflow', 'Sales', 1150000, 'Penjualan harian', NOW() - INTERVAL '8 days'),
  (2, 'Outflow', 'Purchase', 600000, 'Pembelian bahan baku', NOW() - INTERVAL '9 days'),
  (3, 'Inflow', 'Sales', 1320000, 'Penjualan harian', NOW() - INTERVAL '10 days'),
  (4, 'Outflow', 'Utilities', 950000, 'Listrik dan air', NOW() - INTERVAL '11 days'),
  (5, 'Inflow', 'Sales', 1280000, 'Penjualan harian', NOW() - INTERVAL '12 days'),
  (6, 'Outflow', 'Purchase', 750000, 'Pembelian bahan baku', NOW() - INTERVAL '13 days'),
  (7, 'Inflow', 'Sales', 1090000, 'Penjualan harian', NOW() - INTERVAL '14 days'),
  (8, 'Outflow', 'Maintenance', 2200000, 'Perbaikan kompor', NOW() - INTERVAL '15 days'),
  (9, 'Inflow', 'Sales', 1380000, 'Penjualan harian', NOW() - INTERVAL '16 days'),
  (10, 'Outflow', 'Purchase', 680000, 'Pembelian bahan baku', NOW() - INTERVAL '17 days'),
  (11, 'Inflow', 'Sales', 1220000, 'Penjualan harian', NOW() - INTERVAL '18 days'),
  (12, 'Outflow', 'Salary', 3100000, 'Gaji karyawan', NOW() - INTERVAL '19 days'),
  (13, 'Inflow', 'Sales', 1490000, 'Penjualan harian', NOW() - INTERVAL '20 days'),
  (14, 'Outflow', 'Rent', 4800000, 'Sewa tempat bulanan', NOW() - INTERVAL '21 days'),
  (15, 'Inflow', 'Sales', 1560000, 'Penjualan harian', NOW() - INTERVAL '22 days'),
  (1, 'Outflow', 'Utilities', 1050000, 'Listrik dan air', NOW() - INTERVAL '23 days'),
  (2, 'Inflow', 'Sales', 1170000, 'Penjualan harian', NOW() - INTERVAL '24 days'),
  (3, 'Outflow', 'Purchase', 820000, 'Pembelian bahan baku', NOW() - INTERVAL '25 days'),
  (4, 'Inflow', 'Sales', 1340000, 'Penjualan harian', NOW() - INTERVAL '26 days'),
  (5, 'Outflow', 'Maintenance', 1950000, 'Perbaikan mesin kasir', NOW() - INTERVAL '27 days');

-- 15. Insert 1 Admin User
INSERT INTO users (name, email, role, outlet_id, created_at) VALUES
  ('Admin Pusat', 'admin@kampoengsteak.com', 'AdminPusat', NULL, NOW());

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_employees_outlet_id ON employees(outlet_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_outlet_id ON ingredients(outlet_id);
CREATE INDEX IF NOT EXISTS idx_sales_outlet_id ON sales(outlet_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_outlet_id ON purchase_orders(outlet_id);
CREATE INDEX IF NOT EXISTS idx_distributions_from_outlet ON distributions(from_outlet_id);
CREATE INDEX IF NOT EXISTS idx_distributions_to_outlet ON distributions(to_outlet_id);
CREATE INDEX IF NOT EXISTS idx_daily_checklists_outlet_id ON daily_checklists(outlet_id);
CREATE INDEX IF NOT EXISTS idx_shift_reports_outlet_id ON shift_reports(outlet_id);
CREATE INDEX IF NOT EXISTS idx_candidates_outlet_id ON candidates(outlet_id);
CREATE INDEX IF NOT EXISTS idx_assets_outlet_id ON assets(outlet_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_outlet_id ON cash_flow(outlet_id);
CREATE INDEX IF NOT EXISTS idx_users_outlet_id ON users(outlet_id);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Total records created: 286+
-- 18 Outlets, 50 Employees, 10 Products, 20 Ingredients
-- 30 Sales, 5 Suppliers, 15 Purchase Orders, 10 Distributions
-- 18 Daily Checklists, 10 Shift Reports, 15 Candidates
-- 5 Promotions, 30 Assets, 50 Cash Flow, 1 User
-- ============================================
