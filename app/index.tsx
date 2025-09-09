
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import BalanceCard from '../components/BalanceCard';
import DonutChart from '../components/DonutChart';
import BottomSheetSettings, { BottomSheetSettingsRef } from '../components/BottomSheetSettings';
import { useRef } from 'react';
import { useTransactions } from '../hooks/useTransactions';

const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });

export default function HomeScreen() {
  const settingsRef = useRef<BottomSheetSettingsRef>(null);
  const { balance, monthly, transactions, clearAll } = useTransactions();

  return (
    <View style={[commonStyles.container]}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Cash</Text>
        <View style={commonStyles.row}>
          <TouchableOpacity
            onPress={() => router.push('/history')}
            style={{
              backgroundColor: colors.backgroundAlt,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              marginRight: 8,
              boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Text style={{ color: colors.text, fontFamily: 'Roboto_700Bold' }}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => settingsRef.current?.open()}
            style={{
              backgroundColor: colors.secondary,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              boxShadow: '0px 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            <Text style={{ color: '#fff', fontFamily: 'Roboto_700Bold' }}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={[commonStyles.screenPadding, { paddingBottom: 40 }]}>
        <BalanceCard balance={balance} income={monthly.income} expense={monthly.expense} />

        <View style={[commonStyles.card, { alignItems: 'center' }]}>
          <DonutChart income={monthly.income} expense={monthly.expense} centerLabel="This Month" />
          <View style={{ height: 10 }} />
          <Text style={commonStyles.small}>
            Net this month: {formatter.format(monthly.income - monthly.expense)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push({ pathname: '/add', params: { type: 'income' } })}
          style={{
            backgroundColor: colors.green,
            padding: 16,
            borderRadius: 14,
            marginTop: 10,
            boxShadow: '0px 8px 20px rgba(34,197,94,0.25)',
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontFamily: 'Roboto_700Bold', fontSize: 16 }}>Add Income</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push({ pathname: '/add', params: { type: 'expense' } })}
          style={{
            backgroundColor: colors.red,
            padding: 16,
            borderRadius: 14,
            marginTop: 10,
            boxShadow: '0px 8px 20px rgba(239,68,68,0.25)',
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontFamily: 'Roboto_700Bold', fontSize: 16 }}>Add Expense</Text>
        </TouchableOpacity>

        <View style={{ height: 10 }} />
        {transactions.length === 0 ? (
          <View style={[commonStyles.card]}>
            <Text style={commonStyles.text}>No transactions yet. Add your first one!</Text>
          </View>
        ) : null}
      </ScrollView>

      <BottomSheetSettings ref={settingsRef} onReset={clearAll} />
    </View>
  );
}
