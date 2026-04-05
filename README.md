# Finance Dashboard UI — Submission

##  Overview
A high-performance, interactive financial tracking interface built to demonstrate modern frontend architecture, state management, and data visualization. This project bridges the gap between a UI assignment and a production-ready tool by implementing **Local Storage Persistence** and **Custom Event-Driven State Synchronization**.


## Key Features

### 1. Unified Command Center (Dashboard)
* **Dynamic Summary Cards:** Real-time calculation of Total Balance, Monthly Income, and Total Expenses.
* **Balance Trend (Area Chart):** A time-based visualization using `Recharts` with custom linear gradients to track financial health over months.
* **Spending Breakdown (Donut Chart):** An interactive categorical breakdown that calculates percentages and total spending dynamically.

### 2. Intelligent Transaction Management
* **Full CRUD Simulation:** Users can add transactions via a modern modal interface.
* **Smart Filtering:** Filter transactions by category or type (Income/Expense).
* **Search & Sort:** Instantly find transactions by description or sort by date/amount.

### 3. Simulation of Role-Based Access Control (RBAC)
* **Admin Mode:** Full access to add, edit, and delete transactions.
* **Viewer Mode:** Read-only access where action buttons (like "Create Entry") are hidden, simulating a restricted corporate environment.

### 4. Advanced Technical Polish
* **Data Persistence:** Uses `localStorage` (`zorvyn_transactions`) to ensure data remains available after page refreshes.
* **Real-Time Sync:** Implemented a custom event listener system (`local-storage-update`) ensuring that when a transaction is added, all charts (Pie, Area, and Tables) update instantly without a page reload.
* **Premium Dark Mode:** A tailor-made "Midnight" theme with glassmorphism effects and optimized chart colors for low-light environments.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React.js** | UI Logic & Component Architecture |
| **Tailwind CSS** | Modern Styling & Responsive Design |
| **Recharts** | Data Visualization & Animations |
| **Lucide React** | Consistent, Scalable Iconography |
| **React Router** | Client-side Navigation |
| **Local Storage** | Client-side Database Simulation |

---

##  Project Structure

```text
src/
├── components/
│   ├── layout/        # Sidebar, Navbar (Navigation & RBAC logic)
│   ├── ui/            # Reusable Modals, Buttons, Custom Inputs
│   └── charts/        # Recharts implementations (PieChart, AreaChart)
├── pages/
│   ├── Dashboard      # Main overview & Analytics
│   └── Transactions   # Data table, Search, & Filtering
├── data/              # Initial Mock Data
└── App.jsx            # Global State management & Routing

Setup Instructions
Clone the repository:

Bash
git clone [https://github.com/yourusername/finance-dashboard.git](https://github.com/yourusername/finance-dashboard.git)
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Open the browser:
Navigate to http://localhost:5173

Approach & Insights
Performance: Utilized useMemo for heavy data processing (grouping transactions by month) to ensure the UI remains buttery smooth even with large datasets.

UX-First Design: Instead of standard borders, I used a backdrop-blur and subtle white/5 borders to create a modern, "SaaS" feel that prioritizes data readability.

Scalability: The state is lifted to the App.jsx level, making it easy to swap the localStorage logic with a real MERN backend (MongoDB/Express) in the future.

Developed with 💙 by Divy Arora Submitted for Finance Dashboard UI Assignment — April 2026