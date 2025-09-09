
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, Transaction } from './types';

const ACCOUNTS_KEY = 'accounts_v1';
const SELECTED_ACCOUNT_KEY = 'selected_account_v1';
const TX_PREFIX = 'transactions_v2:'; // per-account

const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.log('readJSON error', key, e);
    return fallback;
  }
}

async function writeJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log('writeJSON error', key, e);
  }
}

export async function getAccounts(): Promise<Account[]> {
  const accounts = await readJSON<Account[]>(ACCOUNTS_KEY, []);
  return Array.isArray(accounts) ? accounts : [];
}

export async function saveAccounts(accounts: Account[]): Promise<void> {
  await writeJSON(ACCOUNTS_KEY, accounts);
}

export async function getSelectedAccountId(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(SELECTED_ACCOUNT_KEY);
    return raw || null;
  } catch (e) {
    console.log('getSelectedAccountId error', e);
    return null;
  }
}

export async function setSelectedAccountId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(SELECTED_ACCOUNT_KEY, id);
  } catch (e) {
    console.log('setSelectedAccountId error', e);
  }
}

export async function ensureDefaultAccount(): Promise<{ accounts: Account[]; selectedId: string }> {
  let accounts = await getAccounts();
  let selectedId = await getSelectedAccountId();

  if (!accounts || accounts.length === 0) {
    const def: Account = { id: genId(), name: 'Cash', createdAt: new Date().toISOString() };
    accounts = [def];
    await saveAccounts(accounts);
    await setSelectedAccountId(def.id);
    selectedId = def.id;
  }

  if (!selectedId) {
    selectedId = accounts[0].id;
    await setSelectedAccountId(selectedId);
  }

  return { accounts, selectedId };
}

function txKey(accountId: string) {
  return `${TX_PREFIX}${accountId}`;
}

export async function getTransactions(accountId: string): Promise<Transaction[]> {
  const key = txKey(accountId);
  return await readJSON<Transaction[]>(key, []);
}

export async function saveTransactions(accountId: string, transactions: Transaction[]): Promise<void> {
  const key = txKey(accountId);
  await writeJSON(key, transactions);
}

export async function resetTransactions(accountId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(txKey(accountId));
  } catch (e) {
    console.log('resetTransactions error', e);
  }
}

export async function createAccount(name: string): Promise<Account> {
  const { accounts } = await ensureDefaultAccount();
  const account: Account = { id: genId(), name: name.trim() || 'New Account', createdAt: new Date().toISOString() };
  const updated = [account, ...accounts];
  await saveAccounts(updated);
  await setSelectedAccountId(account.id);
  return account;
}

export async function deleteAccount(accountId: string): Promise<{ accounts: Account[]; selectedId: string }> {
  let accounts = await getAccounts();
  accounts = accounts.filter(a => a.id !== accountId);
  await saveAccounts(accounts);
  try {
    await AsyncStorage.removeItem(txKey(accountId));
  } catch (e) {
    console.log('deleteAccount remove tx error', e);
  }
  let selectedId = await getSelectedAccountId();
  if (selectedId === accountId) {
    if (accounts.length === 0) {
      const def: Account = { id: genId(), name: 'Cash', createdAt: new Date().toISOString() };
      accounts = [def];
      await saveAccounts(accounts);
      selectedId = def.id;
    } else {
      selectedId = accounts[0].id;
    }
    await setSelectedAccountId(selectedId);
  }
  return { accounts, selectedId: selectedId! };
}

export async function renameAccount(accountId: string, name: string): Promise<Account[]> {
  const accounts = await getAccounts();
  const updated = accounts.map(a => (a.id === accountId ? { ...a, name: name.trim() || a.name } : a));
  await saveAccounts(updated);
  return updated;
}
