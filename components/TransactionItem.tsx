
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import React from 'react';

import { Transaction } from '../data/types';

const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });

export default function TransactionItem({ item }: { item: Transaction }) {
  const isIncome = item.type === 'income';
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.description}>{item.description || (isIncome ? 'Income' : 'Expense')}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.green : colors.red }]}>
        {isIncome ? '+' : '-'}{formatter.format(Math.abs(item.amount))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
  },
  left: {
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Roboto_400Regular',
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    textAlign: 'right',
  },
});
