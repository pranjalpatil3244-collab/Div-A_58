import { useState } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const addExpense = (e) => {
    e.preventDefault();

    if (!name || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = {
      id: Date.now(),
      name: name,
      category: category,
      amount: Number(amount),
      date: date,
    };

    setExpenses([...expenses, newExpense]);

    setName("");
    setCategory("Food");
    setAmount("");
    setDate("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const categoryTotal = (categoryName) => {
    return expenses
      .filter((expense) => expense.category === categoryName)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <div className="container">
      <h1>Personal Expense Tracker</h1>
      <p className="subtitle">Record and analyze your personal expenses</p>

      {/* Expense Form */}
      <div className="card">
        <h2>Add Expense</h2>

        <form onSubmit={addExpense}>
          <input
            type="text"
            placeholder="Expense Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Education</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button type="submit">Add Expense</button>
        </form>
      </div>

      {/* Summary */}
      <div className="summary">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p>₹{totalExpense}</p>
        </div>

        <div className="summary-card">
          <h3>Food</h3>
          <p>₹{categoryTotal("Food")}</p>
        </div>

        <div className="summary-card">
          <h3>Travel</h3>
          <p>₹{categoryTotal("Travel")}</p>
        </div>

        <div className="summary-card">
          <h3>Shopping</h3>
          <p>₹{categoryTotal("Shopping")}</p>
        </div>
      </div>

      {/* Expense List */}
      <div className="card">
        <h2>Expense History</h2>

        {expenses.length === 0 ? (
          <p className="empty">No expenses added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.name}</td>
                  <td>{expense.category}</td>
                  <td>₹{expense.amount}</td>
                  <td>{expense.date}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;