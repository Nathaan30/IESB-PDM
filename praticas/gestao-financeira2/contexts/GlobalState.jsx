import { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export const MoneyContext = createContext();

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoriesData, transactionsData] = await Promise.all([
        api.listCategories(),
        api.listTransactions(),
      ]);

      setCategories(categoriesData);
      setTransactions(transactionsData);
    } catch (err) {
      console.log(err);
      setError("Falha ao carregar dados do servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTransaction = useCallback(async (data) => {
    const createdTransaction = await api.createTransaction(data);

    setTransactions((currentTransactions) => [
      createdTransaction,
      ...currentTransactions,
    ]);

    return createdTransaction;
  }, []);

  const updateTransaction = useCallback(async (id, data) => {
    const updatedTransaction = await api.updateTransaction(id, data);

    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === id ? updatedTransaction : transaction
      )
    );

    return updatedTransaction;
  }, []);

  const removeTransaction = useCallback(async (id) => {
    await api.deleteTransaction(id);

    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id)
    );
  }, []);

  const addCategory = useCallback(async (data) => {
    const createdCategory = await api.createCategory(data);

    setCategories((currentCategories) => [
      ...currentCategories,
      createdCategory,
    ]);

    return createdCategory;
  }, []);

  const removeCategory = useCallback(async (id) => {
    await api.deleteCategory(id);

    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== id)
    );
  }, []);

  return (
    <MoneyContext.Provider
      value={{
        transactions,
        categories,
        loading,
        error,
        refresh,
        addTransaction,
        updateTransaction,
        removeTransaction,
        addCategory,
        removeCategory,
        user,
        setUser,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
}