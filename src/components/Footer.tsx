import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-2xl font-black tracking-tight">DeepFashion</h3>
            <p className="text-xs tracking-widest uppercase font-bold text-indigo-400">Discover Your Style</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your premier B2C fashion destination for trendsetting streetwear, premium denim, and complete curated outfits.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Shop Categories</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="hover:text-white transition cursor-pointer">T-Shirts & Shirts</li>
              <li className="hover:text-white transition cursor-pointer">Jeans & Trousers</li>
              <li className="hover:text-white transition cursor-pointer">Dresses & Co-ords</li>
              <li className="hover:text-white transition cursor-pointer">Jackets & Hoodies</li>
              <li className="hover:text-white transition cursor-pointer">Footwear</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="hover:text-white transition cursor-pointer">Track Orders</li>
              <li className="hover:text-white transition cursor-pointer">Shipping & Delivery</li>
              <li className="hover:text-white transition cursor-pointer">Returns & Exchanges</li>
              <li className="hover:text-white transition cursor-pointer">Size Guide</li>
              <li className="hover:text-white transition cursor-pointer">Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe to receive exclusive style tips, early access to new arrivals, and special offers.</p>
            <form onSubmit={e => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="bg-gray-800 border border-gray-700 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl text-sm transition"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 DeepFashion Inc. All rights reserved. Discover Your Style.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-400 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 transition cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
