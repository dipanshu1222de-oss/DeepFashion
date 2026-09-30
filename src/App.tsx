import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MyOrdersPage } from './components/MyOrdersPage';
import { AIStylistModal } from './components/AIStylistModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { mockProducts } from './data/mockProducts';
import { Product, CartItem, User } from './types';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('deepfashion_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [activeTab, setActiveTab] = useState<'home' | 'orders'>('home');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [aiStylistOpen, setAiStylistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('deepfashion_user', JSON.stringify(loggedInUser));
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('deepfashion_user');
    setActiveTab('home');
  };

  const handleAddToCart = (product: Product, size: string, colour: string, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColour === colour
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColour: colour, quantity }];
    });
    setCartOpen(true);
  };

  const handleBuyNow = (product: Product, size: string, colour: string, quantity = 1) => {
    handleAddToCart(product, size, colour, quantity);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Filter and Sort Products
  const filteredProducts = mockProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      
      <Navbar
        user={user}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenAIStylist={() => setAiStylistOpen(true)}
        onNavigateOrders={() => setActiveTab('orders')}
        onNavigateHome={() => setActiveTab('home')}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        {activeTab === 'orders' ? (
          <MyOrdersPage
            user={user}
            onBackHome={() => setActiveTab('home')}
            onOpenAuth={() => setAuthOpen(true)}
          />
        ) : (
          <>
            <Hero
              onShopNow={() => {
                const element = document.getElementById('product-catalog');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAIStylist={() => setAiStylistOpen(true)}
            />

            {/* Categories Quick Bar */}
            <div className="bg-gray-50 border-b border-gray-100 py-4 overflow-x-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-3 min-w-max">
                {[
                  'All',
                  'T-Shirts',
                  'Shirts',
                  'Jeans',
                  'Trousers',
                  'Dresses',
                  'Jackets',
                  'Hoodies',
                  'Shoes',
                  'Complete Outfits'
                ].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition shadow-xs ${
                      selectedCategory === cat
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Section */}
            <div id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {selectedCategory === 'All' ? 'Featured Collection' : selectedCategory}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Showing {filteredProducts.length} premium fashion items
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 w-full sm:w-auto">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-bold text-gray-700">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      className="bg-transparent text-xs font-bold text-gray-900 outline-none cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your search query or category filter.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={p => setSelectedProduct(p)}
                      onAddToCart={(p, s, c) => handleAddToCart(p, s, c, 1)}
                      onBuyNow={(p, s, c) => handleBuyNow(p, s, c, 1)}
                    />
                  ))}
                </div>
              )}

            </div>
          </>
        )}
      </main>

      <Footer />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, s, c, q) => handleAddToCart(p, s, c, q)}
        onBuyNow={(p, s, c, q) => handleBuyNow(p, s, c, q)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        user={user}
        onOrderSuccess={() => {
          setCart([]);
        }}
        onOpenAuth={() => setAuthOpen(true)}
      />

      <AIStylistModal
        isOpen={aiStylistOpen}
        onClose={() => setAiStylistOpen(false)}
        user={user}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
