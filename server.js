// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
app.use(express.json());
var PORT = process.env.PORT || 3e3;
var geminiApiKey = process.env.GEMINI_API_KEY || "";
var ai = new GoogleGenAI({ apiKey: geminiApiKey });
var AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || "";
var AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
console.log("Airtable Configuration Status:");
console.log("AIRTABLE_BASE_ID present:", !!AIRTABLE_BASE_ID);
console.log("AIRTABLE_TOKEN present:", !!AIRTABLE_TOKEN);
var DB_FILE = path.join(__dirname, "data_store.json");
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error loading DB:", e);
  }
  return { users: [], orders: [], nextUserId: 1 };
}
function saveDB(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving DB:", e);
  }
}
async function inspectAirtableSchema() {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.log("Airtable credentials not configured. Using local simulation mode.");
    return;
  }
  try {
    const res = await fetch(`https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
      headers: {
        "Authorization": `Bearer ${AIRTABLE_TOKEN}`
      }
    });
    const data = await res.json();
    if (res.ok && data.tables) {
      console.log("=== AIRTABLE SCHEMA INSPECTION ===");
      data.tables.forEach((t) => {
        console.log(`Table: ${t.name} (ID: ${t.id})`);
        t.fields.forEach((f) => {
          console.log(`  - Field: "${f.name}" (${f.type})`);
        });
      });
      console.log("===================================");
    } else {
      console.error("Failed to inspect Airtable schema:", data);
    }
  } catch (err) {
    console.error("Error connecting to Airtable Meta API:", err);
  }
}
inspectAirtableSchema();
async function getNextUserId() {
  const db = loadDB();
  let maxId = db.users.reduce((max, u) => u.id > max ? u.id : max, 0);
  if (AIRTABLE_TOKEN && AIRTABLE_BASE_ID) {
    try {
      const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?maxRecords=100`, {
        headers: { "Authorization": `Bearer ${AIRTABLE_TOKEN}` }
      });
      const data = await res.json();
      if (res.ok && data.records) {
        data.records.forEach((rec) => {
          const uid = Number(rec.fields["User ID"] || rec.fields["userId"] || 0);
          if (uid > maxId) maxId = uid;
        });
      }
    } catch (e) {
      console.warn("Could not fetch max user ID from Airtable, using local DB:", e);
    }
  }
  const nextId = maxId + 1;
  db.nextUserId = Math.max(db.nextUserId, nextId + 1);
  saveDB(db);
  return nextId;
}
async function checkEmailExistsInAirtable(email) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) return false;
  try {
    const formula = encodeURIComponent(`{Email id}='${email}'`);
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula=${formula}`, {
      headers: { "Authorization": `Bearer ${AIRTABLE_TOKEN}` }
    });
    const data = await res.json();
    return res.ok && data.records && data.records.length > 0;
  } catch (e) {
    console.error("Error checking email in Airtable:", e);
    return false;
  }
}
async function createAirtableUser(userData) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    return `recLocalUser${userData.userIdNum}`;
  }
  const fieldsPayload = {
    "Email id": userData.email,
    "Name": userData.fullName,
    "Phone number": userData.phoneNumber,
    "Address": userData.address
  };
  console.log("[Signup API] Airtable request started");
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields: fieldsPayload })
  });
  console.log(`[Signup API] Airtable response status: ${res.status}`);
  const data = await res.json();
  if (res.ok && data.id) {
    console.log("[Signup API] User created successfully");
    return data.id;
  } else {
    console.error("Airtable user creation error response:", data);
    throw new Error(data.error?.message || "Failed to create user record in Airtable");
  }
}
async function findAirtableUserByEmail(email) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) return null;
  try {
    const formula = encodeURIComponent(`{Email id}='${email}'`);
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Users?filterByFormula=${formula}`, {
      headers: { "Authorization": `Bearer ${AIRTABLE_TOKEN}` }
    });
    const data = await res.json();
    if (res.ok && data.records && data.records.length > 0) {
      return data.records[0];
    }
  } catch (e) {
    console.error("Error finding Airtable user by email:", e);
  }
  return null;
}
async function createAirtableOrder(orderData) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.log("Airtable not configured. Saved to local simulation store.");
    return { success: true, airtableId: "recLocalOrder" };
  }
  const fieldsPayload = {
    "Product(s)": orderData.productsFormatted,
    "Quantity": Number(orderData.quantity),
    "Final Total Price": Number(orderData.finalTotal),
    "Delivery Address": orderData.deliveryAddress,
    "Payment Method": orderData.paymentMethod,
    "Payment Status": orderData.paymentStatus,
    "Order Status": orderData.orderStatus || "Processing"
  };
  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields: fieldsPayload })
    });
    const responseBody = await response.json();
    if (!response.ok) {
      console.error("AIRTABLE ORDER ERROR", {
        status: response.status,
        body: responseBody
      });
      return {
        success: false,
        airtableStatus: response.status,
        airtableError: {
          type: responseBody.error?.type || "UNKNOWN",
          message: responseBody.error?.message || JSON.stringify(responseBody.error || responseBody)
        }
      };
    }
    return { success: true, airtableId: responseBody.id };
  } catch (err) {
    console.error("AIRTABLE ORDER ERROR (Exception):", err.message);
    return {
      success: false,
      airtableStatus: 500,
      airtableError: {
        type: "NETWORK_OR_SERVER_ERROR",
        message: err.message || "Network error during Airtable request"
      }
    };
  }
}
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DeepFashion API is working"
  });
});
app.get("/api/airtable-schema", async (req, res) => {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    return res.json({ success: false, error: "Airtable not configured" });
  }
  try {
    const r = await fetch(`https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
      headers: { "Authorization": `Bearer ${AIRTABLE_TOKEN}` }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
var handleSignup = async (req, res) => {
  console.log("[Signup API] Request received");
  try {
    const { fullName, email, phoneNumber, address, password } = req.body;
    console.log(`[Signup API] User email: ${email}`);
    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, error: "Missing required fields (fullName, email, password)" });
    }
    const emailExistsAirtable = await checkEmailExistsInAirtable(email);
    const db = loadDB();
    const existingLocal = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (emailExistsAirtable || existingLocal) {
      return res.status(409).json({ success: false, error: "Email already registered" });
    }
    const userIdNum = await getNextUserId();
    const createdAt = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19);
    let airtableRecordId = "";
    try {
      airtableRecordId = await createAirtableUser({
        fullName,
        email,
        phoneNumber: phoneNumber || "",
        address: address || "",
        createdAt,
        userIdNum
      });
    } catch (airtableErr) {
      console.error("Airtable User creation failed:", airtableErr.message);
      return res.status(502).json({
        success: false,
        error: `Failed to create user in Airtable: ${airtableErr.message}`
      });
    }
    const newUser = {
      id: userIdNum,
      airtableRecordId,
      fullName,
      email,
      phoneNumber: phoneNumber || "",
      address: address || "",
      passwordHash: password,
      createdAt
    };
    db.users.push(newUser);
    saveDB(db);
    const { passwordHash, ...safeUser } = newUser;
    res.json({ success: true, user: safeUser, message: "Account created successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: err.message || "Server error during signup" });
  }
};
app.post("/api/signup", handleSignup);
app.post("/api/users/signup", handleSignup);
app.post("/api/users/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = loadDB();
    let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }
    if (AIRTABLE_TOKEN && AIRTABLE_BASE_ID) {
      const airtableRec = await findAirtableUserByEmail(email);
      if (airtableRec) {
        user.airtableRecordId = airtableRec.id;
        saveDB(db);
      }
    }
    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Server error during signin" });
  }
});
app.get("/api/orders/:email", (req, res) => {
  try {
    const email = req.params.email;
    const db = loadDB();
    const userOrders = db.orders.filter((o) => o.userEmail.toLowerCase() === email.toLowerCase());
    res.json({
      success: true,
      orders: userOrders,
      totalOrders: userOrders.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Error fetching orders" });
  }
});
app.post("/api/orders", async (req, res) => {
  try {
    const { userEmail, userAirtableId, products, quantity, price, finalTotal, phoneNumber, deliveryAddress, paymentMethod } = req.body;
    if (!userEmail || !products || !finalTotal) {
      return res.status(400).json({ success: false, error: "Invalid order data" });
    }
    const db = loadDB();
    const user = db.users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    let validAirtableUserId = userAirtableId;
    if (!validAirtableUserId || !validAirtableUserId.startsWith("rec")) {
      const airtableRec = await findAirtableUserByEmail(userEmail);
      if (airtableRec) {
        validAirtableUserId = airtableRec.id;
      } else if (user?.airtableRecordId && user.airtableRecordId.startsWith("rec")) {
        validAirtableUserId = user.airtableRecordId;
      }
    }
    if (!validAirtableUserId || !validAirtableUserId.startsWith("rec")) {
      return res.status(400).json({
        success: false,
        error: "Invalid order data",
        details: "Airtable user record ID not found for email"
      });
    }
    const orderIdNum = Math.floor(1e5 + Math.random() * 9e5);
    const orderIdStr = `ORD-${orderIdNum}`;
    const orderDate = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19);
    const productsFormatted = products.map(
      (p) => `${p.name}
Size: ${p.size}
Colour: ${p.colour}`
    ).join("\n---\n");
    const orderPayload = {
      orderId: orderIdStr,
      userEmail,
      userAirtableId: validAirtableUserId,
      productsFormatted,
      quantity: Number(quantity),
      price: Number(price),
      finalTotal: Number(finalTotal),
      phoneNumber: phoneNumber || "",
      deliveryAddress: deliveryAddress || "",
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      orderStatus: "Processing",
      orderDate
    };
    const airtableResult = await createAirtableOrder(orderPayload);
    if (!airtableResult.success) {
      return res.status(airtableResult.airtableStatus || 500).json({
        success: false,
        error: "Airtable order creation failed",
        status: airtableResult.airtableStatus || 500,
        airtableError: airtableResult.airtableError || {
          type: "UNKNOWN",
          message: "Unknown Airtable error"
        }
      });
    }
    const newOrder = {
      id: orderIdStr,
      orderId: orderIdStr,
      userEmail,
      userAirtableId: validAirtableUserId,
      products,
      quantity: Number(quantity),
      price: Number(price),
      finalTotal: Number(finalTotal),
      phoneNumber: phoneNumber || "",
      deliveryAddress: deliveryAddress || "",
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentStatus,
      orderStatus: orderPayload.orderStatus,
      orderDate
    };
    db.orders.push(newOrder);
    saveDB(db);
    res.json({
      success: true,
      message: "Order saved successfully",
      order: {
        orderId: orderIdStr,
        userId: validAirtableUserId
      }
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while connecting to Airtable",
      details: err.message || "Internal server error"
    });
  }
});
app.patch("/api/orders/:orderId", (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const db = loadDB();
    const order = db.orders.find((o) => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    order.orderStatus = orderStatus;
    saveDB(db);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Error updating order" });
  }
});
app.post("/api/ai/stylist", async (req, res) => {
  try {
    const { prompt, userPreferences } = req.body;
    if (!geminiApiKey) {
      return res.json({
        response: "Hello! I'm your DeepFashion AI Stylist. Since the Gemini API key is not configured, here is a quick style tip: Pair neutral tones with bold accessories for a striking look, or try an effortless monochromatic outfit for any occasion!"
      });
    }
    const modelName = "gemini-2.5-flash";
    const chatPrompt = `You are the expert AI Fashion Stylist for DeepFashion (tagline: Discover Your Style). A customer is asking: "${prompt}". User context: ${JSON.stringify(userPreferences || {})}. Give stylish, concise, and helpful fashion advice and recommend what types of clothing, colours, and outfits would suit them best.`;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: chatPrompt
    });
    res.json({ response: response.text || "Discover your unique style today with our curated collections!" });
  } catch (err) {
    console.error("AI Stylist error:", err);
    res.json({
      response: "Hello! I'm your DeepFashion AI Stylist. Here is a quick style tip: Elevate your everyday wardrobe with versatile layers, timeless tailoring, and effortless statement pieces tailored just for you!"
    });
  }
});
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== "true" }
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`DeepFashion server running on port ${PORT}`);
});
