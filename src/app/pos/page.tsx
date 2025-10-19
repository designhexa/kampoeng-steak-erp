'use client';

import React, { useState, useMemo } from 'react';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface CartItem {
  product: Product;
  quantity: number;
}

export default function POSPage() {
  const { products, outlets, loading, refreshData } = useSupabase();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedOutlet, setSelectedOutlet] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Debit' | 'Credit' | 'QRIS' | 'Ewallet'>('Cash');

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  }, [cart]);

  const addToCart = (product: Product): void => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(
        cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, delta: number): void => {
    setCart(
      cart
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number): void => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const handleCheckout = async (): Promise<void> => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }

    try {
      const { error } = await supabase.from('sales').insert({
        outlet_id: selectedOutlet,
        cashier_name: 'Kasir', // Placeholder until we implement authentication
        total: cartTotal,
        payment_method: paymentMethod,
      });

      if (error) throw error;

      setCart([]);
      await refreshData();
      alert('Transaksi berhasil!');
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Gagal membuat transaksi');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]/70">Loading POS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[73px] flex items-center justify-between border-b border-blue-200 bg-white/80 backdrop-blur-sm px-4 md:px-6 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Point of Sale</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{products.length} produk tersedia</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#163681]">Produk</CardTitle>
                  <Input
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-2 border-blue-200 focus:border-[#163681]"
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="rounded-lg border-2 border-blue-200 p-4 text-left transition-colors hover:border-[#163681] hover:bg-blue-50"
                      >
                        <h3 className="font-semibold text-[#163681]">{product.name}</h3>
                        <p className="mt-1 text-sm text-[#163681]/70">{product.category}</p>
                        <p className="mt-2 text-lg font-bold text-[#163681]">
                          Rp {Number(product.price).toLocaleString('id-ID')}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#163681]">
                    <ShoppingCart className="h-5 w-5" />
                    Keranjang
                  </CardTitle>
                  <div className="mt-2">
                    <Select value={selectedOutlet.toString()} onValueChange={(value) => setSelectedOutlet(parseInt(value))}>
                      <SelectTrigger className="border-blue-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {outlets.map((outlet) => (
                          <SelectItem key={outlet.id} value={outlet.id.toString()}>
                            {outlet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-center text-[#163681]/60 py-8">Keranjang kosong</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="rounded-lg border border-blue-200 p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-[#163681]">{item.product.name}</h4>
                              <p className="text-sm text-[#163681]/70">
                                Rp {Number(item.product.price).toLocaleString('id-ID')}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="rounded-full bg-blue-200 p-1 hover:bg-blue-300"
                              >
                                <Minus className="h-4 w-4 text-[#163681]" />
                              </button>
                              <span className="w-8 text-center font-medium text-[#163681]">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="rounded-full bg-blue-200 p-1 hover:bg-blue-300"
                              >
                                <Plus className="h-4 w-4 text-[#163681]" />
                              </button>
                            </div>
                            <p className="font-semibold text-[#163681]">
                              Rp {(Number(item.product.price) * item.quantity).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="border-t border-blue-200 pt-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-[#163681]">Metode Pembayaran</label>
                          <Select value={paymentMethod} onValueChange={(value: 'Cash' | 'Debit' | 'Credit' | 'QRIS' | 'Ewallet') => setPaymentMethod(value)}>
                            <SelectTrigger className="mt-1 border-blue-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Debit">Debit</SelectItem>
                              <SelectItem value="Credit">Credit</SelectItem>
                              <SelectItem value="QRIS">QRIS</SelectItem>
                              <SelectItem value="Ewallet">E-Wallet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-[#163681]">Total</span>
                          <span className="text-2xl font-bold text-[#163681]">
                            Rp {cartTotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <Button
                          onClick={handleCheckout}
                          className="w-full bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]"
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
