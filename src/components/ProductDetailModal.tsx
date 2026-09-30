import React, { useState } from 'react';
import { X, Star, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, colour: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, colour: string, quantity: number) => void;
}

export function ProductDetailModal({ product, onClose, onAddToCart, onBuyNow }: ProductDetailModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColour, setSelectedColour] = useState(product.colours[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColour, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSize, selectedColour, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-gray-100 my-8 animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-900 rounded-full bg-white/80 backdrop-blur-md shadow hover:bg-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Images Section */}
          <div className="p-6 bg-gray-50 flex flex-col justify-between">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-inner mb-4">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition ${
                      activeImageIndex === idx ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="p-6 lg:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{product.brand}</span>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400">({product.reviewsCount})</span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-2">{product.name}</h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-gray-900">₹{Number(product.price ?? 0).toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{Number(product.originalPrice ?? 0).toLocaleString()}</span>
                )}
                {product.discount && (
                  <span className="bg-red-50 text-red-600 font-bold text-xs px-2 py-0.5 rounded">
                    {product.discount}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              {/* Sizes Selection */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Select Size: <span className="text-indigo-600 font-black">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colour Selection */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Select Colour: <span className="text-indigo-600 font-black">{selectedColour}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map(colour => (
                    <button
                      key={colour}
                      onClick={() => setSelectedColour(colour)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                        selectedColour === colour
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {colour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Quantity</label>
                <div className="flex items-center w-32 border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 py-2.5 text-gray-600 hover:bg-gray-200 font-bold transition"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 py-2.5 text-gray-600 hover:bg-gray-200 font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Details & Info Tabs Content */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-500 mb-6">
                <p><strong>Material:</strong> {product.material}</p>
                <p><strong>Care:</strong> {product.careInstructions}</p>
                <div className="flex items-center gap-4 pt-2 text-gray-700">
                  <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-indigo-600" /> {product.deliveryInfo}</span>
                  <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4 text-indigo-600" /> {product.returnInfo}</span>
                </div>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-600/20"
              >
                <Zap className="w-4 h-4 fill-white" /> Buy Now
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
