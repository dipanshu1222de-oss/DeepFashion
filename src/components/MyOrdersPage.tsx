import React, { useEffect, useState } from 'react';
import { Package, ArrowLeft, Clock, CheckCircle2, Truck, AlertCircle, Ban } from 'lucide-react';
import { User, Order } from '../types';

interface MyOrdersPageProps {
  user: User | null;
  onBackHome: () => void;
  onOpenAuth: () => void;
}

export function MyOrdersPage({ user, onBackHome, onOpenAuth }: MyOrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        throw new Error(data.error || 'Failed to fetch orders');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: 'Cancelled' })
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert('Failed to cancel order.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Sign In to View Your Orders</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Please sign in to track your order history and shipments.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition shadow-lg"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const statuses = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shopping
          </button>
          <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Signed in as <span className="font-bold text-gray-800">{user.email}</span> • Total Orders: <span className="text-indigo-600 font-black">{orders.length}</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-2xl">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-gray-50 rounded-3xl border border-gray-100">
          <Package className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="font-bold text-gray-900 text-lg">No orders placed yet</h3>
          <p className="text-sm text-gray-500">Your successful orders will appear here.</p>
          <button
            onClick={onBackHome}
            className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-black transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatusIndex = statuses.indexOf(order.orderStatus);
            const isCancelled = order.orderStatus === 'Cancelled';

            return (
              <div key={order.orderId} className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Order ID: {order.orderId}</span>
                    <p className="text-xs text-gray-400 mt-0.5">Placed on {order.orderDate}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Final Total</span>
                      <span className="text-lg font-black text-gray-900">₹{Number(order?.finalTotal ?? 0).toLocaleString()}</span>
                    </div>

                    {!isCancelled && order.orderStatus === 'Order Placed' && (
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" /> Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Products List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Products</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.products.map((p, pIdx) => (
                      <div key={pIdx} className="bg-gray-50 rounded-2xl p-4 flex flex-col justify-between border border-gray-100">
                        <div>
                          <h5 className="font-bold text-gray-900 text-sm">{p.name}</h5>
                          <div className="flex gap-3 text-xs text-gray-600 mt-1">
                            <span>Size: <strong className="text-gray-900">{p.size}</strong></span>
                            <span>Colour: <strong className="text-gray-900">{p.colour}</strong></span>
                            <span>Qty: <strong className="text-gray-900">{p.quantity}</strong></span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200/60 flex justify-between text-xs">
                          <span className="text-gray-500">Price: ₹{Number(p?.price ?? 0).toLocaleString()}</span>
                          <span className="font-bold text-gray-900">Total: ₹{Number((p?.price ?? 0) * (p?.quantity ?? 1)).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Payment Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/60 rounded-2xl p-4 text-xs text-gray-600">
                  <div>
                    <strong className="text-gray-900 block mb-1">Delivery Address:</strong>
                    <p>{order.deliveryAddress}</p>
                    <p className="mt-1">Phone: {order.phoneNumber}</p>
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-1">Payment:</strong>
                    <p>{order.paymentMethod} • <span className="font-bold text-emerald-600">{order.paymentStatus}</span></p>
                  </div>
                </div>

                {/* Order Status Timeline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Order Status Progression</h4>
                  {isCancelled ? (
                    <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2">
                      <Ban className="w-4 h-4" /> This order has been cancelled.
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      {statuses.map((status, idx) => {
                        const isCompleted = currentStatusIndex >= idx;
                        const isCurrent = currentStatusIndex === idx;

                        return (
                          <div key={status} className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                              isCurrent 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : isCompleted 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                              <span>{status}</span>
                            </div>
                            {idx < statuses.length - 1 && (
                              <div className={`hidden sm:block w-4 h-0.5 ${currentStatusIndex > idx ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
