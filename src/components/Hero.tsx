import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onOpenAIStylist: () => void;
}

export function Hero({ onShopNow, onOpenAIStylist }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-white overflow-hidden py-16 lg:py-24">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              New Autumn/Winter Collection 2026
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Your Style</span> with DeepFashion
            </h1>

            <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 font-normal">
              Explore trendsetting streetwear, premium denim, elegant dresses, and complete outfits crafted for the modern individual.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onShopNow}
                className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-full transition shadow-xl flex items-center gap-2 group"
              >
                Shop Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={onOpenAIStylist}
                className="px-8 py-4 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-white font-bold rounded-full transition backdrop-blur-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-300" />
                Ask AI Stylist
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-800/80 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-indigo-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Express Shipping</h4>
                  <p className="text-[11px] text-gray-400">On all orders</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-indigo-400">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Easy Returns</h4>
                  <p className="text-[11px] text-gray-400">30-day policy</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-indigo-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Secure Payment</h4>
                  <p className="text-[11px] text-gray-400">100% Protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Images Showcase */}
          <div className="relative">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none h-[420px] sm:h-[480px]">
              <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
                  alt="Fashion model"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 z-10">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
                  alt="Streetwear outfit"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
