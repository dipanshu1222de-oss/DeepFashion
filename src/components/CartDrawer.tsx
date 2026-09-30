import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const discount = subtotal > 2000 ? 200 : 0;
  const finalTotal = subtotal + deliveryCharge - discount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-black text-gray-900">Your Shopping Cart</h2>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Your cart is empty</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Explore our collection and discover your style today.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-black transition shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 relative group">
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-white shrink-0 shadow-inner">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.product.name}</h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-gray-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-indigo-600 font-semibold">{item.product.brand}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: <span className="font-bold text-gray-800">{item.selectedSize}</span> • Colour: <span className="font-bold text-gray-800">{item.selectedColour}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-black text-gray-900 text-sm">₹{Number((item.product?.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}</span>
                      
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="w-7 h-7 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="w-7 h-7 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{Number(subtotal ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-gray-900">
                    {deliveryCharge === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryCharge}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-bold">-₹{Number(discount ?? 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Final Total</span>
                  <span className="text-indigo-600">₹{Number(finalTotal ?? 0).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition shadow-xl flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Checkout Guaranteed
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
