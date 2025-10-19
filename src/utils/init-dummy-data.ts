'use client';

import { Timestamp } from 'spacetimedb';
import { Database } from '@/lib/supabase/types';

// Define const enums based on the database types
export const enum OutletStatus {
  Open = 'Open',
  Closed = 'Closed',
  Renovation = 'Renovation'
}

export const enum EmploymentStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export const enum CandidateStatus {
  Applied = 'Applied',
  Interview = 'Interview',
  Hired = 'Hired',
  Rejected = 'Rejected'
}

export const enum AssetStatus {
  InUse = 'InUse',
  Maintenance = 'Maintenance',
  Broken = 'Broken'
}

export const enum TransferStatus {
  Pending = 'Pending',
  InTransit = 'InTransit',
  Delivered = 'Delivered'
}

export const enum DiscountType {
  Percentage = 'Percentage',
  Fixed = 'Fixed'
}

type DbConnection = {
  reducers: {
    createOutlet: (name: string, area: string, address: string, status: Database['public']['Tables']['outlets']['Row']['status']) => void;
    addSupplier: (name: string, contact: string, address: string, rating: number) => void;
    createProduct: (name: string, category: string, price: bigint, desc: string) => void;
    addIngredient: (name: string, unit: string, minStock: bigint, currentStock: bigint, outletId: bigint) => void;
    createEmployee: (name: string, position: string, outletId: bigint, salary: bigint, status: Database['public']['Tables']['employees']['Row']['status'], joinDate: Timestamp) => void;
    addCandidate: (name: string, email: string, phone: string, position: string, status: Database['public']['Tables']['candidates']['Row']['status'], outletId: bigint, applyDate: Timestamp) => void;
    addAsset: (name: string, outletId: bigint, purchaseDate: Timestamp, lastMaintenance: Timestamp, status: Database['public']['Tables']['assets']['Row']['status']) => void;
    createPromotion: (name: string, type: Database['public']['Tables']['promotions']['Row']['discount_type'], amount: bigint, startDate: Timestamp, endDate: Timestamp, outletIds: string) => void;
    createTransfer: (fromOutlet: bigint, toOutlet: bigint, ingredientId: bigint, amount: bigint, status: Database['public']['Tables']['distributions']['Row']['status'], requestedBy: bigint, requestDate: Timestamp) => void;
    createDailyChecklist: (outletId: bigint, checkDate: Timestamp, employeeId: bigint, notes: string) => void;
    createShift: (employeeId: bigint, outletId: bigint, startTime: Timestamp, endTime: Timestamp, scheduleDate: Timestamp) => void;
  };
};

/**
 * Initialize dummy data for Kampoeng Steak ERP System
 * This creates sample outlets, employees, ingredients, sales, and more
 */
export async function initializeDummyData(connection: DbConnection): Promise<void> {
  try {
    console.log('🌱 Initializing dummy data...');
    
    // Wait a bit for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create 18 outlets
    const outletNames = [
      'Kampoeng Steak Bandung Pusat',
      'Kampoeng Steak Jakarta Selatan',
      'Kampoeng Steak Surabaya',
      'Kampoeng Steak Medan',
      'Kampoeng Steak Yogyakarta',
      'Kampoeng Steak Semarang',
      'Kampoeng Steak Malang',
      'Kampoeng Steak Solo',
      'Kampoeng Steak Bali',
      'Kampoeng Steak Makassar',
      'Kampoeng Steak Bandung Timur',
      'Kampoeng Steak Jakarta Barat',
      'Kampoeng Steak Jakarta Utara',
      'Kampoeng Steak Bogor',
      'Kampoeng Steak Depok',
      'Kampoeng Steak Tangerang',
      'Kampoeng Steak Bekasi',
      'Kampoeng Steak Cirebon'
    ];

    const areas = ['Jabodetabek', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Sumatera', 'Bali', 'Sulawesi'];

    for (let i = 0; i < outletNames.length; i++) {
      connection.reducers.createOutlet(
        outletNames[i],
        areas[i % areas.length],
        `Jl. ${outletNames[i]} No. ${i + 10}, Indonesia`,
        OutletStatus.Open
      );
    }
    
    console.log('✅ Created 18 outlets');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Products
    const products = [
      { name: 'Sirloin Steak 200g', category: 'Steak', price: 8500000, desc: 'Premium sirloin beef' },
      { name: 'Tenderloin Steak 200g', category: 'Steak', price: 9500000, desc: 'Premium tenderloin beef' },
      { name: 'Rib Eye Steak 250g', category: 'Steak', price: 10500000, desc: 'Juicy rib eye steak' },
      { name: 'T-Bone Steak 300g', category: 'Steak', price: 12500000, desc: 'Classic T-bone steak' },
      { name: 'Chicken Steak', category: 'Steak', price: 4500000, desc: 'Grilled chicken steak' },
      { name: 'Fish Steak', category: 'Steak', price: 5500000, desc: 'Grilled fish steak' },
      { name: 'French Fries', category: 'Side', price: 2000000, desc: 'Crispy french fries' },
      { name: 'Mashed Potato', category: 'Side', price: 2500000, desc: 'Creamy mashed potato' },
      { name: 'Mushroom Soup', category: 'Soup', price: 2500000, desc: 'Creamy mushroom soup' },
      { name: 'Iced Tea', category: 'Beverage', price: 1000000, desc: 'Refreshing iced tea' }
    ];

    for (const product of products) {
      connection.reducers.createProduct(product.name, product.category, BigInt(product.price), product.desc);
    }
    
    console.log('✅ Created 10 products');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Suppliers
    const suppliers = [
      { name: 'PT Daging Prima', contact: '0812-3456-7890', address: 'Jakarta', rating: 5 },
      { name: 'CV Sayur Segar', contact: '0813-4567-8901', address: 'Bandung', rating: 4 },
      { name: 'UD Bumbu Nusantara', contact: '0814-5678-9012', address: 'Surabaya', rating: 4 },
      { name: 'PT Food Distributor', contact: '0815-6789-0123', address: 'Jakarta', rating: 5 }
    ];

    for (const supplier of suppliers) {
      connection.reducers.addSupplier(supplier.name, supplier.contact, supplier.address, supplier.rating);
    }
    
    console.log('✅ Created 4 suppliers');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Ingredients for first 3 outlets
    const ingredients = [
      { name: 'Daging Sapi Sirloin', unit: 'kg', minStock: BigInt(20), currentStock: BigInt(50) },
      { name: 'Daging Sapi Tenderloin', unit: 'kg', minStock: BigInt(15), currentStock: BigInt(30) },
      { name: 'Daging Ayam', unit: 'kg', minStock: BigInt(30), currentStock: BigInt(60) },
      { name: 'Kentang', unit: 'kg', minStock: BigInt(50), currentStock: BigInt(100) },
      { name: 'Bawang Putih', unit: 'kg', minStock: BigInt(10), currentStock: BigInt(25) },
      { name: 'Bawang Bombay', unit: 'kg', minStock: BigInt(10), currentStock: BigInt(20) },
      { name: 'Saus BBQ', unit: 'L', minStock: BigInt(5), currentStock: BigInt(15) },
      { name: 'Saus Mushroom', unit: 'L', minStock: BigInt(5), currentStock: BigInt(12) },
      { name: 'Garam', unit: 'kg', minStock: BigInt(5), currentStock: BigInt(10) },
      { name: 'Merica', unit: 'kg', minStock: BigInt(3), currentStock: BigInt(8) }
    ];

    for (let outletId = 1; outletId <= 3; outletId++) {
      for (const ingredient of ingredients) {
        connection.reducers.addIngredient(
          ingredient.name,
          ingredient.unit,
          ingredient.minStock,
          ingredient.currentStock,
          BigInt(outletId)
        );
      }
    }
    
    console.log('✅ Created ingredients for 3 outlets');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Employees for first 3 outlets
    const positions = ['Manager', 'Kasir', 'Koki', 'Waiter', 'Supervisor'];
    const names = [
      'Ahmad Fauzi', 'Budi Santoso', 'Citra Dewi', 'Dani Pratama', 'Eka Putri',
      'Fajar Ramadhan', 'Gita Sari', 'Hendra Wijaya', 'Indah Lestari', 'Joko Susilo'
    ];

    for (let outletId = 1; outletId <= 3; outletId++) {
      for (let i = 0; i < 5; i++) {
        connection.reducers.createEmployee(
          names[(outletId * 5 + i) % names.length],
          positions[i],
          BigInt(outletId),
          BigInt((4000000 + i * 1000000) * 100), // 4-8 juta
          EmploymentStatus.Active,
          Timestamp.now()
        );
      }
    }
    
    console.log('✅ Created 15 employees');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Candidates
    const candidateNames = ['Ali Rahman', 'Bella Safitri', 'Candra Kusuma', 'Dinda Ayu', 'Eko Prasetyo'];
    for (let i = 0; i < candidateNames.length; i++) {
      connection.reducers.addCandidate(
        candidateNames[i],
        `${candidateNames[i].toLowerCase().replace(' ', '.')}@email.com`,
        `081234567${80 + i}`,
        positions[i % positions.length],
        i < 2 ? CandidateStatus.Applied : i < 4 ? CandidateStatus.Interview : CandidateStatus.Hired,
        BigInt((i % 3) + 1),
        Timestamp.now()
      );
    }
    
    console.log('✅ Created 5 candidates');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Assets for first 2 outlets
    const assetNames = ['Kompor Gas 6 Tungku', 'Kulkas Display', 'Freezer Daging', 'Meja Kasir', 'AC 2 PK'];
    for (let outletId = 1; outletId <= 2; outletId++) {
      for (let i = 0; i < assetNames.length; i++) {
        connection.reducers.addAsset(
          assetNames[i],
          BigInt(outletId),
          Timestamp.now(),
          Timestamp.now(),
          i === 2 ? AssetStatus.Maintenance : AssetStatus.InUse
        );
      }
    }
    
    console.log('✅ Created 10 assets');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Promotions
    connection.reducers.createPromotion(
      'Diskon Weekend 20%',
      DiscountType.Percentage,
      BigInt(20),
      Timestamp.now(),
      Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      '1,2,3'
    );
    
    connection.reducers.createPromotion(
      'Promo Ultah - Potongan Rp 50.000',
      DiscountType.Fixed,
      BigInt(5000000),
      Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
      Timestamp.fromDate(new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)),
      '1,2,3,4,5'
    );
    
    console.log('✅ Created 2 promotions');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Inventory Transfers
    connection.reducers.createTransfer(
      BigInt(1),
      BigInt(2),
      BigInt(1),
      BigInt(5),
      TransferStatus.Pending,
      BigInt(1),
      Timestamp.now()
    );
    
    connection.reducers.createTransfer(
      BigInt(1),
      BigInt(3),
      BigInt(4),
      BigInt(10),
      TransferStatus.Delivered,
      BigInt(1),
      Timestamp.now()
    );
    
    console.log('✅ Created 2 inventory transfers');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Daily Checklists
    for (let outletId = 1; outletId <= 3; outletId++) {
      connection.reducers.createDailyChecklist(
        BigInt(outletId),
        Timestamp.now(),
        BigInt(outletId),
        'Kebersihan OK, Suhu kulkas normal, Peralatan lengkap'
      );
    }
    
    console.log('✅ Created 3 daily checklists');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create Shifts
    for (let i = 1; i <= 5; i++) {
      const startTime = new Date();
      startTime.setHours(8, 0, 0, 0);
      const endTime = new Date();
      endTime.setHours(16, 0, 0, 0);
      
      connection.reducers.createShift(
        BigInt(i),
        BigInt(Math.floor((i - 1) / 5) + 1),
        Timestamp.fromDate(startTime),
        Timestamp.fromDate(endTime),
        Timestamp.now()
      );
    }
    
    console.log('✅ Created 5 shifts');
    
    console.log('🎉 Dummy data initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing dummy data:', error);
    throw error;
  }
}
