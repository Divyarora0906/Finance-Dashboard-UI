import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transaction';
import TransactionModal from './components/ui/AddTransactionModal';
import { transactions as mockData } from './data/mockData';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("zorvyn_transactions");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : mockData;
    }
    return mockData;
  });

  useEffect(() => {
    localStorage.setItem("zorvyn_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleSaveTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050914] transition-colors duration-500 overflow-x-hidden relative">
      <Navbar 
        onAction={() => setIsModalOpen(true)} 
        toggleSidebar={() => setIsSidebarOpen(true)} 
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="w-full lg:pl-60 pt-0 md:pt-5 transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard transactions={transactions} />} 
            />
            <Route 
              path="/transactions" 
              element={
                <Transactions 
                  transactions={transactions} 
                  onDelete={handleDeleteTransaction}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTransaction}
        categories={["Salary", "Food", "Rent", "Tech", "Transport", "Shopping", "Freelance"]}
      />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;