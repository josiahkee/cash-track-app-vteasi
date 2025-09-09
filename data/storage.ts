
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from './types';

const KEY = 'transactions_v1';

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: Transaction[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.log('getTransactions error', e);
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(transactions));
  } catch (e) {
    console.log('saveTransactions error', e);
  }
}

export async function resetTransactions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.log('resetTransactions error', e);
  }
}
