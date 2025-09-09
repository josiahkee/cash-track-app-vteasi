
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Transaction, TransactionType } from '../data/types';
import { getTransactions, saveTransactions, resetTransactions } from '../data/storage';

const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list = await getTransactions();
      console.log('Loaded transactions', list.length);
      setTransactions(list);
      setLoading(false);
    })();
  }, []);

  const addTransaction = useCallback(async (type: TransactionType, amount: number, description: string, date: Date) => {
    const signed = type === 'income' ? Math.abs(amount) : -Math.abs(amount);
    const newTx: Transaction = {
      id: genId(),
      type,
      amount: signed,
      description: description.trim(),
      date: date.toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await saveTransactions(updated);
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await saveTransactions(updated);
  }, [transactions]);

  const clearAll = useCallback(async () => {
    setTransactions([]);
    await resetTransactions();
  }, []);

  const balance = useMemo(() => transactions.reduce((sum, t) => sum + t.amount, 0), [transactions]);

  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const monthly = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        if (t.amount >= 0) income += t.amount;
        else expense += -t.amount;
      }
    });
    return { income, expense };
  }, [transactions, month, year]);

  return {
    transactions,
    loading,
    balance,
    monthly,
    addTransaction,
    deleteTransaction,
    clearAll,
  };
}
