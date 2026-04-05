import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { transactions as mockData } from "../data/mockData";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(mockData);

  const [role, setRole] = useState("admin");

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDark]);

  const insights = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const categories = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const highestCategory = Object.keys(categories).reduce(
      (a, b) => (categories[a] > categories[b] ? a : b),
      "N/A",
    );

    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      highestSpendingCategory: highestCategory,
      categoryData: categories,
    };
  }, [transactions]);

  const addTransaction = (tx) =>
    setTransactions((prev) => [{ ...tx, id: Date.now() }, ...prev]);
  const deleteTransaction = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  const updateTransaction = (id, updatedTx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updatedTx, id } : t)),
    );
  };
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.backgroundColor = "#050914"; // Your deep dark color
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#f8fafc"; // Light slate color
    }
  }, [isDark]);

  return (
    <AppContext.Provider
      value={{
        transactions,
        role,
        setRole,
        isDark,
        setIsDark,
        insights,
        addTransaction,
        deleteTransaction,
        updateTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
