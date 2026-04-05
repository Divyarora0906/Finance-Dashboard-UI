/**
 * @param {Array} data 
 * @param {string} format 
 */
export const exportTransactions = (data, format = 'json') => {
  if (!data || data.length === 0) {
    alert("No data available to export!");
    return;
  }

  const fileName = `Zorvyn_Finance_${new Date().toISOString().split('T')[0]}`;
  let blob;

  if (format === 'csv') {
    const headers = ['Date', 'Category', 'Type', 'Amount (INR)'];
    
    const rows = data.map(t => [
      `"${t.date}"`, 
      `"${t.category}"`, 
      `"${t.type.toUpperCase()}"`, 
      t.amount
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  } else {
    const jsonContent = JSON.stringify(data, null, 2);
    blob = new Blob([jsonContent], { type: 'application/json' });
  }

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.${format}`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};