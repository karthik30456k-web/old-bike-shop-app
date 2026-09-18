# 🏍️ Veloce Wheels - Used Bike Showroom Management System (ERP & Customer Discovery)

An end-to-end showroom management and customer portal for used two-wheelers.

## 👥 Multi-Role Workflows Included:
1. **Admin / Showroom Owner**:
   - Complete showroom command center & financial analytics
   - True Profit Engine: `Purchase Price + Refurbishment (Services, Parts, Detailing, Transport) = True Cost vs. Sales Revenue`
   - Inventory tracking, staff overview, sales reports, and customer records.
2. **Staff / Sales Executive**:
   - Vehicle intake & seller KYC documentation
   - **14-Point Mechanical & Safety Inspection** with instant pass/fail grading and official certificate issuing
   - **Customer Enquiry Pipeline (Interactive Kanban)**: `New Enquiry → Contacted → Interested → Test Ride → Negotiation → Booking → Sold / Lost`
   - Test ride scheduling, accompaniment logging, and rider feedback
   - Token booking advance collection (automatically flips stock status to `Reserved`)
   - Final sale billing with RTO documentation and printable tax invoice (flips status to `Sold`).
3. **Customer Discovery Portal (Web + Mobile Responsive)**:
   - Browse certified pre-owned bikes with high-res photos, year, KM driven, and drive-away pricing
   - Filter by brand (Royal Enfield, Yamaha, KTM, Honda, TVS, Bajaj, Suzuki) and budget range
   - View 14-point inspection health score (Engine, Brakes, Battery, Tyres, Suspension)
   - Instant "Request Free Test Ride", "Reserve with Token ₹5,000", and "WhatsApp Showroom" buttons.

---

## 🏗️ Architecture & Project Structure

```
old bike shop app/
├── backend/                       # Node.js + Express + PostgreSQL REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # PostgreSQL client with embedded storage fallback
│   │   ├── controllers/           # Auth, Bikes, Inspections, Purchases, Enquiries, etc.
│   │   ├── routes/api.js          # REST routes mounted at /api/...
│   │   ├── db/
│   │   │   ├── schema.sql         # Full PostgreSQL tables schema
│   │   │   └── seedData.js        # 10+ realistic bikes, enquiries, test rides & expenses
│   │   └── server.js              # Express API server (port 5000)
│   ├── standalone-server.js       # Pure Node.js zero-dependency runner
│   ├── package.json
│   └── .env
│
├── frontend/                      # React + Vite Application
│   ├── src/
│   │   ├── theme/
│   │   │   ├── theme.css          # Design tokens & color variables
│   │   │   └── ThemeContext.jsx   # Theme & role state manager (Amber, Cyan, Crimson, Emerald)
│   │   ├── components/
│   │   │   ├── common/            # Reusable components: FormField, TextInput, NumberInput,
│   │   │   │                      # SelectDropdown, Button, Card, Badge, Modal, DataTable,
│   │   │   │                      # Tabs, InspectionRating
│   │   │   └── layout/            # Navbar, Sidebar, MobileNav
│   │   ├── views/                 # Dashboard, Inventory, Purchase, Inspection, Pipeline,
│   │   │                          # TestRides, Bookings, Sales, Expenses, Customers, Catalog
│   │   ├── services/api.js        # API service client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
```

---

## 🚀 How to Run the Application

### 1. Start the Backend API Server
Open a terminal in the `backend/` folder:
```bash
cd backend
npm install
npm start
```
> **Note**: The backend connects to PostgreSQL via `.env`. If your PostgreSQL database is still being configured, it automatically operates on an active local database engine so you can test all features right away without any database downtime!
>
> **Instant Zero-Dependency Mode**: You can also launch the backend without running npm install using:
> ```bash
> cd backend
> node standalone-server.js
> ```

### 2. Start the Frontend React App
Open another terminal in the `frontend/` folder:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🎨 Theme & Role Switcher
- **Switch Roles**: In the top navigation bar, click between **👑 Admin / Owner**, **💼 Staff / Sales**, and **🛵 Customer View**.
- **Mobile Mode**: Click the **Mobile View** button in the header to simulate the phone screen used by showroom field staff and mobile customers!
- **Color Palettes**: Click the color dots in the header to switch between **Amber Gold**, **Electric Cyan**, **Racing Crimson**, **Emerald Forest**, and **Royal Indigo**.
- **Dark/Light Mode**: Toggle the sun/moon icon for sleek showroom dark mode or clean paper light mode.

---

## 🗄️ PostgreSQL Database Setup (Optional)
To connect your existing PostgreSQL database:
1. Open `backend/.env` and set your credentials:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/bikeshowroom_db
   ```
2. Create the database in psql:
   ```sql
   CREATE DATABASE bikeshowroom_db;
   ```
3. Run the schema file:
   ```bash
   psql -U postgres -d bikeshowroom_db -f src/db/schema.sql
   ```
