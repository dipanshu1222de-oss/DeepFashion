export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'T-Shirts' | 'Shirts' | 'Jeans' | 'Trousers' | 'Dresses' | 'Jackets' | 'Hoodies' | 'Shoes' | 'Complete Outfits';
  price: number;
  originalPrice?: number;
  discount: string; // e.g., "25% OFF"
  rating: number;
  reviewsCount: number;
  images: string[];
  sizes: string[];
  colours: string[];
  stock: number;
  description: string;
  material: string;
  careInstructions: string;
  deliveryInfo: string;
  returnInfo: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isOffer?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColour: string;
  quantity: number;
}

export interface User {
  id: number;
  airtableRecordId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderId: string;
  userEmail: string;
  userAirtableId: string;
  products: Array<{ name: string; size: string; colour: string; price: number; quantity: number }>;
  quantity: number;
  price: number;
  finalTotal: number;
  phoneNumber: string;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: 'Order Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  orderDate: string;
}
