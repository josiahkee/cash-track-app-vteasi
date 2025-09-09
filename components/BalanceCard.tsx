
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
}

const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'SGD' });

export default function BalanceCard({ balance, income, expense }: BalanceCardProps) {
  return (
    <View style={[commonStyles.card]}>
      <Text style={styles.label}>Current Balance</Text>
      <Text style={styles.balance}>{formatter.format(balance)}</Text>
      <View style={styles.row}>
        <View style={[styles.pill, { backgroundColor: '#F0FFF4', borderColor: '#DCFCE7' }]}>
          <View style={[styles.dot, { backgroundColor: colors.green }]} />
          <Text style={[styles.small, { color: colors.green }]}>Income {formatter.format(income)}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }]}>
          <View style={[styles.dot, { backgroundColor: colors.red }]} />
          <Text style={[styles.small, { color: colors.red }]}>Expense {formatter.format(expense)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: 'Roboto_400Regular',
  },
  balance: {
    fontSize: 34,
    fontFamily: 'Roboto_700Bold',
    color: colors.text,
    marginTop: 4,
  },
  row: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10 as any,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  small: {
    fontSize: 13,
    fontFamily: 'Roboto_700Bold',
  },
});
