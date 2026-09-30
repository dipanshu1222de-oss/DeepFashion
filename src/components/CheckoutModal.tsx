import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { CartItem, User } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: User | null;
  onOrderSuccess: (orderData: any) => void;
  onOpenAuth: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  user,
  onOrderSuccess,
  onOpenAuth
}: CheckoutModalProps) {
  if (!isOpen) return null;

  // If not logged in, prompt sign in
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <UserIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-gray-900">Sign In Required</h3>
          <p className="text-sm text-gray-600">
            Please sign in or create an account to complete your order and save it to your profile.
          </p>
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition shadow-lg"
          >
            Sign In / Sign Up Now
          </button>
        </div>
      </div>
    );
  }

  const [fullName, setFullName] = useState(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '+1 555 0199');
  const [deliveryAddress, setDeliveryAddress] = useState(user.address || '123 Fashion Ave, Apt 4B');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'Card' | 'NetBanking'>('COD');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = subtotal > 999 ? 0 : 99;
  const discount = subtotal > 2000 ? 200 : 0;
  const finalTotal = subtotal + deliveryCharge - discount;

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !deliveryAddress) {
      setError('Please provide your phone number and delivery address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        userEmail: user.email,
        userAirtableId: user.airtableRecordId,
        products: cart.map(item => ({
          name: item.product.name,
          size: item.selectedSize,
          colour: item.selectedColour,
          price: item.product.price,
          quantity: item.quantity
        })),
        quantity: cart.reduce((sum, i) => sum + i.quantity, 0),
        price: subtotal,
        finalTotal: finalTotal,
        phoneNumber,
        deliveryAddress,
        paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod === 'UPI' ? 'UPI' : paymentMethod === 'Card' ? 'Credit/Debit Card' : 'Net Banking'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.airtableError?.message 
          ? `${data.airtableError.type}: ${data.airtableError.message}` 
          : data.details || data.error || 'Failed to place order';
        throw new Error(errorMsg);
      }

      setConfirmedOrder(data.order);
      onOrderSuccess(data.order);
    } catch (err: any) {
      setError(err.message || 'Error processing order');
    } finally {
      setLoading(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Order Confirmed Successfully</span>
            <h2 className="text-2xl font-black text-gray-900 mt-1">Thank You for Shopping!</h2>
            <p className="text-sm text-gray-500 mt-1">Your order has been placed and saved to your profile.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 border border-gray-100 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-bold text-gray-900">{confirmedOrder.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-bold text-gray-900">{confirmedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Final Total:</span>
              <span className="font-black text-indigo-600">₹{Number(confirmedOrder?.finalTotal ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="font-medium text-gray-800 text-right max-w-[220px] truncate">{confirmedOrder.deliveryAddress}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition shadow-xl"
          >
            View My Orders & Track Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative border border-gray-100 my-8">
        
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-lg font-black text-gray-900">Checkout & Payment</h2>
            <p className="text-xs text-gray-500">Complete your order securely</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleConfirmOrder} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Delivery Details Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Delivery Information (Pre-filled from Profile)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> Select Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
                { id: 'UPI', label: 'UPI / QR', icon: '📱' },
                { id: 'Card', label: 'Card', icon: '💳' },
                { id: 'NetBanking', label: 'Net Banking', icon: '🏦' }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                    paymentMethod === method.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-md ring-2 ring-indigo-600/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-xs font-bold">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary Calculation */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 text-sm mb-3">Order Summary Calculation</h4>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Items Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="font-bold text-gray-900">₹{Number(subtotal ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Charge</span>
              <span className="font-bold text-gray-900">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Promotional Discount</span>
                <span className="font-bold">-₹{Number(discount ?? 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-200">
              <span>Final Total Amount</span>
              <span className="text-indigo-600">₹{Number(finalTotal ?? 0).toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              `Confirm Order & Pay ₹${Number(finalTotal ?? 0).toLocaleString()}`
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
