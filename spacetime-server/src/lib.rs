use spacetimedb::{table, reducer, ReducerContext, Identity, Table, Timestamp};
use spacetimedb::SpacetimeType;
use spacetimedb::TimeDuration;
use std::time::Duration;

// Enums and shared types

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum OutletStatus {
    Open,
    Closed,
    Renovation,
    Planned,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum UserRole {
    AdminPusat,
    AreaManager,
    OutletManager,
    Kasir,
    HR,
    Gudang,
    Finance,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum EmploymentStatus {
    Active,
    Inactive,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum PaymentMethod {
    Cash,
    Card,
    EWallet,
    Transfer,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum POStatus {
    Created,
    Ordered,
    Received,
    Cancelled,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum DistributionStatus {
    Pending,
    InTransit,
    Delivered,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum DiscountType {
    Percentage,
    FixedAmount,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum AssetStatus {
    InUse,
    Maintenance,
    Broken,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum CashFlowType {
    Inflow,
    Outflow,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum CandidateStatus {
    Applied,
    Interview,
    Hired,
    Rejected,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum IngredientStatus {
    Active,
    Inactive,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum ShiftStatus {
    Open,
    Closed,
}

#[derive(SpacetimeType, Clone, Debug, PartialEq)]
pub enum PromotionStatus {
    Draft,
    Active,
    Ended,
}

// Input helper types

#[derive(SpacetimeType, Clone, Debug)]
pub struct SaleItemInput {
    pub product_id: u64,
    pub quantity: i32,
    // price per unit in cents
    pub price: i64,
}

#[derive(SpacetimeType, Clone, Debug)]
pub struct PurchaseOrderItemInput {
    pub ingredient_id: u64,
    pub quantity: i64,
    // price per unit in cents
    pub price: i64,
}

// Tables

#[table(name = outlets, public)]
#[derive(Clone)]
pub struct Outlet {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub name: String,
    pub area: String,
    pub address: String,
    pub status: OutletStatus,
}

#[table(name = users, public)]
#[derive(Clone)]
pub struct User {
    #[primary_key]
    pub id: Identity,
    pub username: String,
    pub role: UserRole,
    pub outlet_id: Option<u64>,
}

#[table(name = employees, public, index(name = emp_outlet_idx, btree(columns = [outlet_id])))]
#[derive(Clone)]
pub struct Employee {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub name: String,
    pub position: String,
    pub outlet_id: u64,
    // salary in cents
    pub salary: i64,
    pub status: EmploymentStatus,
}

#[table(name = products, public, index(name = prod_outlet_idx, btree(columns = [outlet_id])))]
#[derive(Clone)]
pub struct Product {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub name: String,
    pub category: String,
    // price in cents
    pub price: i64,
    pub outlet_id: u64,
}

#[table(name = ingredients, public, index(name = ing_outlet_idx, btree(columns = [outlet_id])))]
#[derive(Clone)]
pub struct Ingredient {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub name: String,
    pub unit: String,
    pub min_stock: i64,
    pub stock: i64,
    pub outlet_id: u64,
    pub status: IngredientStatus,
}

#[table(name = suppliers, public)]
#[derive(Clone)]
pub struct Supplier {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub name: String,
    pub contact: String,
    pub rating: i32,
}

#[table(name = sales, public, index(name = sales_outlet_time_idx, btree(columns = [outlet_id, date])))]
#[derive(Clone)]
pub struct Sale {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub outlet_id: u64,
    // total in cents
    pub total: i64,
    pub payment_method: PaymentMethod,
    pub date: Timestamp,
}

#[table(name = sale_items, public, index(name = saleitems_sale_idx, btree(columns = [sale_id])))]
#[derive(Clone)]
pub struct SaleItem {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub sale_id: u64,
    pub product_id: u64,
    pub quantity: i32,
    // price per unit in cents
    pub price: i64,
}

#[table(name = purchase_orders, public, index(name = po_outlet_idx, btree(columns = [outlet_id])))]
#[derive(Clone)]
pub struct PurchaseOrder {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub outlet_id: u64,
    pub supplier_id: u64,
    // total in cents
    pub total: i64,
    pub status: POStatus,
    pub date: Timestamp,
}

#[table(name = purchase_order_items, public, index(name = poi_po_idx, btree(columns = [purchase_order_id])))]
#[derive(Clone)]
pub struct PurchaseOrderItem {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub purchase_order_id: u64,
    pub ingredient_id: u64,
    pub quantity: i64,
    // price per unit in cents
    pub price: i64,
}

#[table(name = distributions, public, index(name = dist_outlet_idx, btree(columns = [from_outlet_id, to_outlet_id])))]
#[derive(Clone)]
pub struct Distribution {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub from_outlet_id: u64,
    pub to_outlet_id: u64,
    pub ingredient_id: u64,
    pub quantity: i64,
    pub status: DistributionStatus,
    pub date: Timestamp,
}

#[table(name = daily_checklists, public, index(name = checklist_outlet_idx, btree(columns = [outlet_id])))]
#[derive(Clone)]
pub struct DailyChecklist {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub outlet_id: u64,
    pub checklist_name: String,
    pub is_completed: bool,
    pub date: Timestamp,
}

#[table(name = shift_reports, public, index(name = shift_outlet_idx, btree(columns = [outlet_id])))]
#[derive(Clone)]
pub struct ShiftReport {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub outlet_id: u64,
    pub employee_id: u64,
    pub shift_start: Timestamp,
    pub shift_end: Timestamp,
    // in cents
    pub initial_cash: i64,
    pub final_cash: i64,
    pub status: ShiftStatus,
}

#[table(name = candidates, public)]
#[derive(Clone)]
pub struct Candidate {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub name: String,
    pub position: String,
    pub phone: String,
    pub email: String,
    pub status: CandidateStatus,
}

#[table(name = promotions, public)]
#[derive(Clone)]
pub struct Promotion {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub name: String,
    pub discount_type: DiscountType,
    // if Percentage, use basis points (e.g. 1000 = 10%); if FixedAmount, cents
    pub discount_value: i64,
    pub start_date: Timestamp,
    pub end_date: Timestamp,
    pub status: PromotionStatus,
}

#[table(name = assets, public, index(name = assets_outlet_idx, btree(columns = [outlet_id])))]
#[derive(Clone)]
pub struct Asset {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub outlet_id: u64,
    pub name: String,
    pub category: String,
    pub status: AssetStatus,
    pub last_maintenance: Timestamp,
}

#[table(name = cash_flow, public, index(name = cashflow_outlet_idx, btree(columns = [outlet_id])))]
#[derive(Clone)]
pub struct CashFlow {
    #[primary_key]
    #[auto_inc]
    pub id: u64,
    pub outlet_id: u64,
    pub ctype: CashFlowType,
    pub category: String,
    pub amount: i64, // in cents
    pub date: Timestamp,
    pub description: String,
}

// Reducers

#[reducer(init)]
pub fn init(ctx: &ReducerContext) -> Result<(), String> {
    // Time helpers
    let now = ctx.timestamp;
    let days = |d: i64| TimeDuration::from_duration(Duration::from_secs((d * 86400) as u64));
    let hours = |h: i64| TimeDuration::from_duration(Duration::from_secs((h * 3600) as u64));
    let safe_sub = |ts: Timestamp, dur: TimeDuration| ts.checked_sub(dur).unwrap_or(ts);
    let safe_add = |ts: Timestamp, dur: TimeDuration| ts.checked_add(dur).unwrap_or(ts);

    // 1) Outlets (18)
    let outlet_names = [
        "Kampoeng Steak Jakarta Pusat",
        "Kampoeng Steak Jakarta Barat",
        "Kampoeng Steak Tangerang",
        "Kampoeng Steak Bekasi",
        "Kampoeng Steak Bogor",
        "Kampoeng Steak Depok",
        "Kampoeng Steak Bandung",
        "Kampoeng Steak Surabaya",
        "Kampoeng Steak Semarang",
        "Kampoeng Steak Yogyakarta",
        "Kampoeng Steak Medan",
        "Kampoeng Steak Palembang",
        "Kampoeng Steak Makassar",
        "Kampoeng Steak Bali",
        "Kampoeng Steak Malang",
        "Kampoeng Steak Solo",
        "Kampoeng Steak Pekanbaru",
        "Kampoeng Steak Balikpapan",
    ];
    for (i, name) in outlet_names.iter().enumerate() {
        let area = name.split_whitespace().last().unwrap_or("Area").to_string();
        let address = format!("Jl. Utama No. {}, {}", i + 1, area);
        ctx.db.outlets().insert(Outlet {
            id: 0,
            name: name.to_string(),
            area,
            address,
            status: OutletStatus::Open,
        });
    }

    // Collect outlet ids
    let outlet_ids: Vec<u64> = ctx.db.outlets().iter().map(|o| o.id).collect();
    let outlet_count = outlet_ids.len();

    // 2) Suppliers (5)
    let suppliers = [
        ("PT Daging Prima", "021-5551234"),
        ("PT Sayur Fresh", "021-5555678"),
        ("PT Bumbu Nusantara", "021-7771111"),
        ("PT Minuman Sejuk", "021-8882222"),
        ("PT Kemasan Jaya", "021-9993333"),
    ];
    for (i, (name, contact)) in suppliers.iter().enumerate() {
        ctx.db.suppliers().insert(Supplier {
            id: 0,
            name: (*name).to_string(),
            contact: (*contact).to_string(),
            rating: 4 + ((i % 2) as i32), // 4-5 stars
        });
    }
    let supplier_ids: Vec<u64> = ctx.db.suppliers().iter().map(|s| s.id).collect();

    // 3) Products (10)
    let products = [
        ("Steak Wagyu", "Makanan", 185_000),
        ("Steak Sirloin", "Makanan", 95_000),
        ("Steak Tenderloin", "Makanan", 115_000),
        ("Chicken Steak", "Makanan", 55_000),
        ("Fish & Chips", "Makanan", 48_000),
        ("Pasta Carbonara", "Makanan", 45_000),
        ("French Fries", "Makanan", 20_000),
        ("Orange Juice", "Minuman", 18_000),
        ("Iced Tea", "Minuman", 10_000),
        ("Coffee", "Minuman", 22_000),
    ];
    for (i, (name, cat, price_rp)) in products.iter().enumerate() {
        let outlet_id = outlet_ids[i % outlet_count];
        ctx.db.products().insert(Product {
            id: 0,
            name: (*name).to_string(),
            category: (*cat).to_string(),
            price: (*price_rp as i64) * 100,
            outlet_id,
        });
    }
    let product_ids: Vec<u64> = ctx.db.products().iter().map(|p| p.id).collect();

    // 4) Ingredients (20) distributed across outlets
    let ingredients = [
        ("Daging Sapi", "kg"),
        ("Daging Ayam", "kg"),
        ("Ikan", "kg"),
        ("Kentang", "kg"),
        ("Bawang", "kg"),
        ("Tomat", "kg"),
        ("Keju", "kg"),
        ("Susu", "L"),
        ("Telur", "pcs"),
        ("Tepung", "kg"),
        ("Minyak", "L"),
        ("Garam", "kg"),
        ("Merica", "kg"),
        ("Saus", "L"),
        ("Pasta", "kg"),
        ("Kopi", "kg"),
        ("Teh", "kg"),
        ("Jus Jeruk", "L"),
        ("Es Batu", "kg"),
        ("Gula", "kg"),
    ];
    for (i, (name, unit)) in ingredients.iter().enumerate() {
        let outlet_id = outlet_ids[i % outlet_count];
        let min = 10 + (i as i64 % 10) * 5;
        let cur = min + 20 + (i as i64 % 5) * 10;
        ctx.db.ingredients().insert(Ingredient {
            id: 0,
            name: (*name).to_string(),
            unit: (*unit).to_string(),
            min_stock: min,
            stock: cur,
            outlet_id,
            status: IngredientStatus::Active,
        });
    }
    let ingredient_ids: Vec<u64> = ctx.db.ingredients().iter().map(|g| g.id).collect();

    // 5) Employees (50)
    let positions = ["Manager", "Koki", "Kasir", "Waiter"];
    for i in 0..50 {
        let outlet_id = outlet_ids[i as usize % outlet_count];
        let pos = positions[i as usize % positions.len()].to_string();
        let salary = match pos.as_str() {
            "Manager" => 6_000_000i64,
            "Koki" => 4_000_000i64,
            "Kasir" => 3_500_000i64,
            _ => 3_000_000i64,
        } * 100; // cents
        ctx.db.employees().insert(Employee {
            id: 0,
            name: format!("Karyawan {}", i + 1),
            position: pos,
            outlet_id,
            salary,
            status: EmploymentStatus::Active,
        });
    }
    let employee_ids: Vec<u64> = ctx.db.employees().iter().map(|e| e.id).collect();

    // 6) Sales (30) with items
    for i in 0..30 {
        let outlet_id = outlet_ids[i as usize % outlet_count];
        let ts = safe_sub(now, days((i as i64 % 30) + 1)).checked_add(hours((i % 8) as i64)).unwrap_or(now);
        let mut total = 0i64;
        let sale = ctx.db.sales().insert(Sale {
            id: 0,
            outlet_id,
            total: 0,
            payment_method: match i % 4 {
                0 => PaymentMethod::Cash,
                1 => PaymentMethod::Card,
                2 => PaymentMethod::EWallet,
                _ => PaymentMethod::Transfer,
            },
            date: ts,
        });
        let item_count: usize = 1 + (i as usize % 3);
        for j in 0..item_count {
            let prod_id = product_ids[(i as usize + j) % product_ids.len()];
            if let Some(prod) = ctx.db.products().id().find(prod_id) {
                let qty: i32 = 1 + (j as i32);
                total = total.saturating_add(prod.price.saturating_mul(qty as i64));
                ctx.db.sale_items().insert(SaleItem {
                    id: 0,
                    sale_id: sale.id,
                    product_id: prod.id,
                    quantity: qty,
                    price: prod.price,
                });
            }
        }
        if let Some(mut s) = ctx.db.sales().id().find(sale.id) {
            s.total = total;
            ctx.db.sales().id().update(s);
        }
    }

    // 7) Purchase Orders (15) with items
    for i in 0..15 {
        let outlet_id = outlet_ids[i as usize % outlet_count];
        let supplier_id = supplier_ids[i as usize % supplier_ids.len()];
        let status = match i % 4 {
            0 => POStatus::Created,
            1 => POStatus::Ordered,
            2 => POStatus::Received,
            _ => POStatus::Cancelled,
        };
        let total = (500_000i64 + ((i % 10) as i64) * 75_000) * 100;
        let po = ctx.db.purchase_orders().insert(PurchaseOrder {
            id: 0,
            outlet_id,
            supplier_id,
            total,
            status,
            date: safe_sub(now, days(40 - (i as i64 % 30))),
        });
        // Add 1-3 items from ingredients
        let item_count = 1 + (i % 3);
        for j in 0..item_count {
            let ing_id = ingredient_ids[(i as usize + j as usize) % ingredient_ids.len()];
            let qty = 5 + (j as i64) * 3;
            let price = 25_000i64 * 100 + (j as i64) * 5_000 * 100;
            ctx.db.purchase_order_items().insert(PurchaseOrderItem {
                id: 0,
                purchase_order_id: po.id,
                ingredient_id: ing_id,
                quantity: qty,
                price,
            });
        }
    }

    // 8) Distributions (10)
    for i in 0..10 {
        let from_outlet_id = outlet_ids[i as usize % outlet_count];
        let to_outlet_id = outlet_ids[(i as usize + 1) % outlet_count];
        let ingredient_id = ingredient_ids[i as usize % ingredient_ids.len()];
        let quantity = 5 + (i as i64 % 10);
        let status = match i % 3 {
            0 => DistributionStatus::Pending,
            1 => DistributionStatus::InTransit,
            _ => DistributionStatus::Delivered,
        };
        ctx.db.distributions().insert(Distribution {
            id: 0,
            from_outlet_id,
            to_outlet_id,
            ingredient_id,
            quantity,
            status,
            date: safe_sub(now, days(20 - (i as i64 % 15))),
        });
    }

    // 9) Daily Checklists (18) one per outlet
    for (i, oid) in outlet_ids.iter().enumerate() {
        ctx.db.daily_checklists().insert(DailyChecklist {
            id: 0,
            outlet_id: *oid,
            checklist_name: "Buka toko, cek kebersihan, stok bahan, mesin kasir".to_string(),
            is_completed: (i % 2 == 0),
            date: safe_sub(now, days((i as i64 % 10))),
        });
    }

    // 10) Shift Reports (10)
    for i in 0..10 {
        let outlet_id = outlet_ids[i as usize % outlet_count];
        let employee_id = employee_ids[i as usize % employee_ids.len()];
        let shift_start = safe_sub(now, days((i as i64 % 20)));
        let shift_end = safe_add(shift_start, hours(8));
        let initial_cash = (1_000_000i64 + (i as i64) * 100_000) * 100;
        let final_cash = initial_cash.saturating_add(500_000i64 * 100);
        let status = if i % 3 == 0 { ShiftStatus::Open } else { ShiftStatus::Closed };
        ctx.db.shift_reports().insert(ShiftReport {
            id: 0,
            outlet_id,
            employee_id,
            shift_start,
            shift_end,
            initial_cash,
            final_cash: if status == ShiftStatus::Open { 0 } else { final_cash },
            status,
        });
    }

    // 11) Candidates (15)
    for i in 0..15 {
        let st = match i % 4 {
            0 => CandidateStatus::Applied,
            1 => CandidateStatus::Interview,
            2 => CandidateStatus::Hired,
            _ => CandidateStatus::Rejected,
        };
        ctx.db.candidates().insert(Candidate {
            id: 0,
            name: format!("Pelamar {}", i + 1),
            position: positions[i as usize % positions.len()].to_string(),
            phone: format!("08{:09}", 111111111 + i),
            email: format!("pelamar{}@mail.com", i + 1),
            status: st,
        });
    }

    // 12) Promotions (5)
    for i in 0..5 {
        let (start_date, end_date) = if i == 0 {
            (safe_sub(now, days(5)), safe_add(now, days(5)))
        } else if i == 1 {
            (safe_add(now, days(5)), safe_add(now, days(15)))
        } else {
            let start = safe_sub(now, days(20 + (i as i64 * 3)));
            let end = safe_sub(now, days(10 + (i as i64 * 2)));
            (start, end)
        };
        ctx.db.promotions().insert(Promotion {
            id: 0,
            name: format!("Promo Spesial {}", i + 1),
            discount_type: if i % 2 == 0 { DiscountType::Percentage } else { DiscountType::FixedAmount },
            discount_value: if i % 2 == 0 { 1000 } else { 10_000 * 100 }, // 10% or Rp10.000
            start_date,
            end_date,
            status: if i == 0 { PromotionStatus::Active } else { PromotionStatus::Ended },
        });
    }

    // 13) Assets (30)
    let asset_names = ["Kompor", "Kulkas", "AC", "Meja", "Kursi", "Wastafel"];
    let asset_cats = ["Dapur", "Pendingin", "HVAC", "Furnitur", "Furnitur", "Sanitasi"];
    for i in 0..30 {
        let outlet_id = outlet_ids[i as usize % outlet_count];
        let idx = i as usize % asset_names.len();
        let last_maint = safe_sub(now, days(15 - (i as i64 % 10)));
        let status = match i % 5 {
            1 => AssetStatus::Maintenance,
            2 => AssetStatus::Broken,
            _ => AssetStatus::InUse,
        };
        ctx.db.assets().insert(Asset {
            id: 0,
            outlet_id,
            name: asset_names[idx].to_string(),
            category: asset_cats[idx].to_string(),
            status,
            last_maintenance: last_maint,
        });
    }

    // 14) CashFlow (50)
    let categories = ["Sales", "Purchase", "Salary", "Rent", "Utilities"];
    for i in 0..50 {
        let outlet_id = outlet_ids[i as usize % outlet_count];
        let ctype = if i % 2 == 0 { CashFlowType::Inflow } else { CashFlowType::Outflow };
        let amount = (200_000i64 + ((i % 10) as i64) * 50_000) * 100;
        ctx.db.cash_flow().insert(CashFlow {
            id: 0,
            outlet_id,
            ctype,
            category: categories[i as usize % categories.len()].to_string(),
            amount,
            date: safe_sub(now, days((i as i64 % 60))),
            description: "Catatan kas harian".to_string(),
        });
    }

    // 15) Users (seed 1 Admin - no conditional checks)
    ctx.db.users().insert(User {
        id: ctx.identity(),
        username: "admin_pusat".to_string(),
        role: UserRole::AdminPusat,
        outlet_id: None,
    });

    Ok(())
}

// Outlet management

#[reducer]
pub fn create_outlet(
    ctx: &ReducerContext,
    name: String,
    area: String,
    address: String,
) -> Result<(), String> {
    ctx.db.outlets().insert(Outlet {
        id: 0,
        name,
        area,
        address,
        status: OutletStatus::Open,
    });
    Ok(())
}

#[reducer]
pub fn update_outlet(
    ctx: &ReducerContext,
    id: u64,
    name: String,
    area: String,
    address: String,
    status: OutletStatus,
) -> Result<(), String> {
    if let Some(mut o) = ctx.db.outlets().id().find(id) {
        o.name = name;
        o.area = area;
        o.address = address;
        o.status = status;
        ctx.db.outlets().id().update(o);
        Ok(())
    } else {
        Err("Outlet not found".into())
    }
}

#[reducer]
pub fn delete_outlet(ctx: &ReducerContext, id: u64) -> Result<(), String> {
    ctx.db.outlets().id().delete(id);
    Ok(())
}

// Employee management

#[reducer]
pub fn create_employee(
    ctx: &ReducerContext,
    name: String,
    position: String,
    outlet_id: u64,
    salary: i64,
    status: EmploymentStatus,
) -> Result<(), String> {
    ctx.db.employees().insert(Employee {
        id: 0,
        name,
        position,
        outlet_id,
        salary,
        status,
    });
    Ok(())
}

#[reducer]
pub fn update_employee_status(
    ctx: &ReducerContext,
    employee_id: u64,
    status: EmploymentStatus,
) -> Result<(), String> {
    if let Some(mut e) = ctx.db.employees().id().find(employee_id) {
        e.status = status.clone();
        ctx.db.employees().id().update(e);
        Ok(())
    } else {
        Err("Employee not found".into())
    }
}

// Inventory

#[reducer]
pub fn add_product(
    ctx: &ReducerContext,
    name: String,
    category: String,
    price: i64,
    outlet_id: u64,
) -> Result<(), String> {
    ctx.db.products().insert(Product {
        id: 0,
        name,
        category,
        price,
        outlet_id,
    });
    Ok(())
}

#[reducer]
pub fn add_ingredient(
    ctx: &ReducerContext,
    name: String,
    unit: String,
    min_stock: i64,
    stock: i64,
    outlet_id: u64,
    status: IngredientStatus,
) -> Result<(), String> {
    ctx.db.ingredients().insert(Ingredient {
        id: 0,
        name,
        unit,
        min_stock,
        stock,
        outlet_id,
        status,
    });
    Ok(())
}

#[reducer]
pub fn update_inventory(
    ctx: &ReducerContext,
    ingredient_id: u64,
    new_stock: i64,
) -> Result<(), String> {
    if let Some(mut ing) = ctx.db.ingredients().id().find(ingredient_id) {
        ing.stock = new_stock;
        ctx.db.ingredients().id().update(ing);
        Ok(())
    } else {
        Err("Ingredient not found".into())
    }
}

// Purchasing

#[reducer]
pub fn add_supplier(
    ctx: &ReducerContext,
    name: String,
    contact: String,
    rating: i32,
) -> Result<(), String> {
    ctx.db.suppliers().insert(Supplier {
        id: 0,
        name,
        contact,
        rating,
    });
    Ok(())
}

#[reducer]
pub fn create_purchase_order(
    ctx: &ReducerContext,
    outlet_id: u64,
    supplier_id: u64,
    total: i64,
    date: Timestamp,
    items: Vec<PurchaseOrderItemInput>,
) -> Result<(), String> {
    let po = ctx.db.purchase_orders().insert(PurchaseOrder {
        id: 0,
        outlet_id,
        supplier_id,
        total,
        status: POStatus::Created,
        date,
    });
    for it in items {
        ctx.db.purchase_order_items().insert(PurchaseOrderItem {
            id: 0,
            purchase_order_id: po.id,
            ingredient_id: it.ingredient_id,
            quantity: it.quantity,
            price: it.price,
        });
    }
    Ok(())
}

#[reducer]
pub fn approve_purchase_order(ctx: &ReducerContext, po_id: u64) -> Result<(), String> {
    if let Some(mut po) = ctx.db.purchase_orders().id().find(po_id) {
        po.status = POStatus::Ordered;
        ctx.db.purchase_orders().id().update(po);
        Ok(())
    } else {
        Err("Purchase order not found".into())
    }
}

#[reducer]
pub fn reject_purchase_order(ctx: &ReducerContext, po_id: u64) -> Result<(), String> {
    if let Some(mut po) = ctx.db.purchase_orders().id().find(po_id) {
        po.status = POStatus::Cancelled;
        ctx.db.purchase_orders().id().update(po);
        Ok(())
    } else {
        Err("Purchase order not found".into())
    }
}

// Distribution

#[reducer]
pub fn request_distribution(
    ctx: &ReducerContext,
    from_outlet_id: u64,
    to_outlet_id: u64,
    ingredient_id: u64,
    quantity: i64,
    date: Timestamp,
) -> Result<(), String> {
    if from_outlet_id == to_outlet_id {
        return Err("from_outlet_id and to_outlet_id must differ".into());
    }
    ctx.db.distributions().insert(Distribution {
        id: 0,
        from_outlet_id,
        to_outlet_id,
        ingredient_id,
        quantity,
        status: DistributionStatus::Pending,
        date,
    });
    Ok(())
}

#[reducer]
pub fn mark_distribution_delivered(ctx: &ReducerContext, distribution_id: u64) -> Result<(), String> {
    if let Some(mut d) = ctx.db.distributions().id().find(distribution_id) {
        d.status = DistributionStatus::Delivered;
        ctx.db.distributions().id().update(d);
        Ok(())
    } else {
        Err("Distribution not found".into())
    }
}

// Operations

#[reducer]
pub fn create_daily_checklist(
    ctx: &ReducerContext,
    outlet_id: u64,
    checklist_name: String,
    date: Timestamp,
) -> Result<(), String> {
    ctx.db.daily_checklists().insert(DailyChecklist {
        id: 0,
        outlet_id,
        checklist_name,
        is_completed: false,
        date,
    });
    Ok(())
}

#[reducer]
pub fn update_checklist_status(
    ctx: &ReducerContext,
    checklist_id: u64,
    is_completed: bool,
) -> Result<(), String> {
    if let Some(mut c) = ctx.db.daily_checklists().id().find(checklist_id) {
        c.is_completed = is_completed;
        ctx.db.daily_checklists().id().update(c);
        Ok(())
    } else {
        Err("Checklist not found".into())
    }
}

#[reducer]
pub fn open_shift(
    ctx: &ReducerContext,
    outlet_id: u64,
    employee_id: u64,
    shift_start: Timestamp,
    initial_cash: i64,
) -> Result<(), String> {
    ctx.db.shift_reports().insert(ShiftReport {
        id: 0,
        outlet_id,
        employee_id,
        shift_start,
        shift_end: shift_start,
        initial_cash,
        final_cash: 0,
        status: ShiftStatus::Open,
    });
    Ok(())
}

// HR

#[reducer]
pub fn add_candidate(
    ctx: &ReducerContext,
    name: String,
    position: String,
    phone: String,
    email: String,
) -> Result<(), String> {
    ctx.db.candidates().insert(Candidate {
        id: 0,
        name,
        position,
        phone,
        email,
        status: CandidateStatus::Applied,
    });
    Ok(())
}

#[reducer]
pub fn update_candidate_status(
    ctx: &ReducerContext,
    candidate_id: u64,
    status: CandidateStatus,
) -> Result<(), String> {
    if let Some(mut c) = ctx.db.candidates().id().find(candidate_id) {
        c.status = status.clone();
        ctx.db.candidates().id().update(c);
        Ok(())
    } else {
        Err("Candidate not found".into())
    }
}

// Promotions

#[reducer]
pub fn create_promotion(
    ctx: &ReducerContext,
    name: String,
    discount_type: DiscountType,
    discount_value: i64,
    start_date: Timestamp,
    end_date: Timestamp,
    status: PromotionStatus,
) -> Result<(), String> {
    ctx.db.promotions().insert(Promotion {
        id: 0,
        name,
        discount_type,
        discount_value,
        start_date,
        end_date,
        status,
    });
    Ok(())
}

// Assets

#[reducer]
pub fn add_asset(
    ctx: &ReducerContext,
    outlet_id: u64,
    name: String,
    category: String,
    last_maintenance: Timestamp,
) -> Result<(), String> {
    ctx.db.assets().insert(Asset {
        id: 0,
        outlet_id,
        name,
        category,
        status: AssetStatus::InUse,
        last_maintenance,
    });
    Ok(())
}

#[reducer]
pub fn update_asset_status(
    ctx: &ReducerContext,
    asset_id: u64,
    status: AssetStatus,
    last_maintenance: Timestamp,
) -> Result<(), String> {
    if let Some(mut a) = ctx.db.assets().id().find(asset_id) {
        a.status = status.clone();
        a.last_maintenance = last_maintenance;
        ctx.db.assets().id().update(a);
        Ok(())
    } else {
        Err("Asset not found".into())
    }
}

// Users

#[reducer]
pub fn create_user(
    ctx: &ReducerContext,
    username: String,
    role: UserRole,
    outlet_id: Option<u64>,
) -> Result<(), String> {
    let user_id: Identity = ctx.sender;
    if ctx.db.users().id().find(&user_id).is_some() {
        return Err("User with this identity already exists".into());
    }
    ctx.db.users().insert(User {
        id: user_id,
        username,
        role,
        outlet_id,
    });
    Ok(())
}

// Sales

#[reducer]
pub fn record_sale(
    ctx: &ReducerContext,
    outlet_id: u64,
    items: Vec<SaleItemInput>,
    payment_method: PaymentMethod,
    date: Timestamp,
) -> Result<(), String> {
    if items.is_empty() {
        return Err("Sale must have at least one item".into());
    }
    let mut total: i64 = 0;
    for it in &items {
        total = total.saturating_add(it.price.saturating_mul(it.quantity as i64));
    }
    let sale = ctx.db.sales().insert(Sale {
        id: 0,
        outlet_id,
        total,
        payment_method,
        date,
    });
    for it in items {
        ctx.db.sale_items().insert(SaleItem {
            id: 0,
            sale_id: sale.id,
            product_id: it.product_id,
            quantity: it.quantity,
            price: it.price,
        });
    }
    Ok(())
}