export const transactions = [
  { id: 1, type: "income", amount: 50000, category: "Salary", date: "2026-01-05", description: "Monthly Salary" },
  { id: 2, type: "expense", amount: 8000, category: "Rent", date: "2026-01-06", description: "House Rent" },
  { id: 3, type: "expense", amount: 2500, category: "Food", date: "2026-01-10", description: "Groceries" },
  { id: 4, type: "income", amount: 7000, category: "Freelance", date: "2026-01-15", description: "Client Work" },
  { id: 5, type: "expense", amount: 1500, category: "Transport", date: "2026-01-18", description: "Fuel" },

  { id: 6, type: "income", amount: 52000, category: "Salary", date: "2026-02-05", description: "Monthly Salary" },
  { id: 7, type: "expense", amount: 8000, category: "Rent", date: "2026-02-06", description: "House Rent" },
  { id: 8, type: "expense", amount: 3000, category: "Food", date: "2026-02-09", description: "Dining Out" },
  { id: 9, type: "expense", amount: 2000, category: "Shopping", date: "2026-02-12", description: "Clothes" },
  { id: 10, type: "income", amount: 5000, category: "Freelance", date: "2026-02-20", description: "Side Project" },

  { id: 11, type: "income", amount: 51000, category: "Salary", date: "2026-03-05", description: "Monthly Salary" },
  { id: 12, type: "expense", amount: 8500, category: "Rent", date: "2026-03-06", description: "House Rent" },
  { id: 13, type: "expense", amount: 3200, category: "Food", date: "2026-03-11", description: "Groceries" },
  { id: 14, type: "expense", amount: 4000, category: "Shopping", date: "2026-03-15", description: "Accessories" },
  { id: 15, type: "income", amount: 6000, category: "Freelance", date: "2026-03-22", description: "Client Work" },

  { id: 16, type: "income", amount: 53000, category: "Salary", date: "2026-04-01", description: "Monthly Salary" },
  { id: 17, type: "expense", amount: 9000, category: "Rent", date: "2026-04-01", description: "House Rent" },
  { id: 18, type: "expense", amount: 3500, category: "Food", date: "2026-04-02", description: "Groceries" },
  { id: 19, type: "expense", amount: 2500, category: "Transport", date: "2026-04-03", description: "Fuel" },
  { id: 20, type: "income", amount: 8000, category: "Freelance", date: "2026-04-04", description: "Side Project" },
];


export const categories = [
  "Salary",
  "Freelance",
  "Rent",
  "Food",
  "Transport",
  "Shopping",
];


export const getTotals = (data) => {
  if (!data) return { totalIncome: 0, totalExpenses: 0, totalBalance: 0 };

  const { income, expenses } = data.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += t.amount;
      else acc.expenses += t.amount;
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  return {
    totalIncome: income,
    totalExpenses: expenses,
    totalBalance: income - expenses,
  };
};


export const getRecentTransactions = (data, count = 5) => {
  if (!data) return [];
  return [...data]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
};

export const getDashboardStats = () => {
  const savedData = localStorage.getItem("zorvyn_transactions");
  const transactions = savedData ? JSON.parse(savedData) : [];

  const totals = transactions.reduce(
    (acc, tx) => {
      const amount = Number(tx.amount) || 0;

      if (tx.type === "income") {
        acc.income += amount;
      } else if (tx.type === "expense") {
        acc.expense += amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  return {
    totalIncome: totals.income,
    totalExpenses: totals.expense,
    totalBalance: totals.income - totals.expense,
  };
};

export const getTotalBalance = () => getDashboardStats().totalBalance;
export const getTotalIncome = () => getDashboardStats().totalIncome;
export const getTotalExpense = () => getDashboardStats().totalExpenses;