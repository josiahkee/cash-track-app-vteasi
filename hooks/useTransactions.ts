
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Account, Transaction, TransactionType } from '../data/types';
import {
  ensureDefaultAccount,
  getTransactions,
  saveTransactions,
  resetTransactions,
  setSelectedAccountId,
  getSelectedAccountId,
  getAccounts,
  createAccount as createAccountStorage,
  deleteAccount as deleteAccountStorage,
  renameAccount as renameAccountStorage,
} from '../data/storage';

const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function useTransactions() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedIdState] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { accounts: accs, selectedId } = await ensureDefaultAccount();
      setAccounts(accs);
      setSelectedIdState(selectedId);
      const list = await getTransactions(selectedId);
      console.log('Loaded transactions for account', selectedId, list.length);
      setTransactions(list);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedAccountId) return;
      const list = await getTransactions(selectedAccountId);
      setTransactions(list);
    })();
  }, [selectedAccountId]);

  const switchAccount = useCallback(async (id: string) => {
    setSelectedIdState(id);
    await setSelectedAccountId(id);
  }, []);

  const refreshAccounts = useCallback(async () => {
    const accs = await getAccounts();
    setAccounts(accs);
    const sel = await getSelectedAccountId();
    setSelectedIdState(sel);
  }, []);

  const addTransaction = useCallback(async (type: TransactionType, amount: number, description: string, date: Date) => {
    if (!selectedAccountId) return;
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
    await saveTransactions(selectedAccountId, updated);
  }, [transactions, selectedAccountId]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!selectedAccountId) return;
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await saveTransactions(selectedAccountId, updated);
  }, [transactions, selectedAccountId]);

  const clearAll = useCallback(async () => {
    if (!selectedAccountId) return;
    setTransactions([]);
    await resetTransactions(selectedAccountId);
  }, [selectedAccountId]);

  const createAccount = useCallback(async (name: string) => {
    const acc = await createAccountStorage(name);
    await refreshAccounts();
    await switchAccount(acc.id);
  }, [refreshAccounts, switchAccount]);

  const deleteAccount = useCallback(async (id: string) => {
    const result = await deleteAccountStorage(id);
    setAccounts(result.accounts);
    setSelectedIdState(result.selectedId);
  }, []);

  const renameAccount = useCallback(async (id: string, name: string) => {
    const updated = await renameAccountStorage(id, name);
    setAccounts(updated);
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

  const selectedAccount = useMemo(() => accounts.find(a => a.id === selectedAccountId) || null, [accounts, selectedAccountId]);

  return {
    accounts,
    selectedAccount,
    selectedAccountId,
    switchAccount,

    transactions,
    loading,
    balance,
    monthly,

    addTransaction,
    deleteTransaction,
    clearAll,

    createAccount,
    deleteAccount,
    renameAccount,
  };
}
