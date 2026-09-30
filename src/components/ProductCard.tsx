import React from 'react';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, colour: string) => void;
  onBuyNow: (product: Product, size: string, colour: string) => void;
}

export function ProductCard({ product, onQuickView, onAddToCart, onBuyNow }: ProductCardProps) {
  const defaultSize = product.sizes[0] || 'M';
  const defaultColour = product.colours[0] || 'Default';

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
            {product.discount}
          </span>
        )}

        {/* Stock status indicator */}
        {product.stock <= 5 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            Only {product.stock} left
          </span>
        )}

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition duration-300 px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-white/90 hover:bg-white text-gray-900 font-bold py-2.5 px-4 rounded-xl shadow-lg backdrop-blur-md flex items-center justify-center gap-2 text-xs transition"
          >
            <Eye className="w-4 h-4" /> Quick View & Select Options
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-bold uppercase tracking-wider text-indigo-600">{product.brand}</span>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-gray-900 text-sm line-clamp-1 hover:text-indigo-600 transition cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 mt-1">{product.category}</p>
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-gray-900">₹{Number(product.price ?? 0).toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">₹{Number(product.originalPrice ?? 0).toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAddToCart(product, defaultSize, defaultColour)}
              className="p-2.5 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-xl text-gray-800 transition"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
