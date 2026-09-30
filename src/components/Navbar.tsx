import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User as UserIcon, Sparkles, Menu, X, Package, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenAIStylist: () => void;
  onNavigateOrders: () => void;
  onNavigateHome: () => void;
  onSignOut: () => void;
}

export function Navbar({
  user,
  cartCount,
  wishlistCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenCart,
  onOpenAuth,
  onOpenAIStylist,
  onNavigateOrders,
  onNavigateHome,
  onSignOut
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const categories = [
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
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gray-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span>✨ Discover Your Style • Free Express Shipping on Orders Over ₹999</span>
        <button 
          onClick={onOpenAIStylist}
          className="ml-2 inline-flex items-center gap-1 bg-indigo-600 px-2 py-0.5 rounded-full text-[11px] font-bold hover:bg-indigo-500 transition"
        >
          <Sparkles className="w-3 h-3" /> AI Stylist
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button 
              onClick={onNavigateHome}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <h1 className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-indigo-600 transition">
                DeepFashion
              </h1>
              <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">
                Discover Your Style
              </p>
            </button>

            {/* Desktop Categories Dropdown */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition"
              >
                Categories
                <span className="text-xs">▼</span>
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoriesOpen(false);
                        onNavigateHome();
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition ${
                        selectedCategory === cat 
                          ? 'bg-indigo-50 text-indigo-600 font-bold' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for clothes, brands, outfits..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            <button
              onClick={onOpenAIStylist}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold transition shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              AI Stylist
            </button>

            {user && (
              <button
                onClick={onNavigateOrders}
                className="relative p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition"
                title="My Orders"
              >
                <Package className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 border border-gray-200 rounded-full hover:border-gray-300 transition bg-gray-50"
                >
                  <span className="text-xs font-bold text-gray-800 max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                    <div className="px-4 pb-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      <p className="text-[11px] text-indigo-600 font-semibold mt-1">User ID: #{user.id}</p>
                    </div>

                    <button
                      onClick={() => { onNavigateOrders(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                    >
                      <Package className="w-4 h-4 text-gray-400" /> My Orders
                    </button>

                    <button
                      onClick={() => { onSignOut(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-400" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold transition shadow-md shadow-gray-900/10"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for clothes, brands..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2">
          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider px-3 pt-2">Categories</p>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setMobileMenuOpen(false);
                onNavigateHome();
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                selectedCategory === cat ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
