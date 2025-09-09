
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTransactions } from '../hooks/useTransactions';
import { router } from 'expo-router';
import TransactionItem from '../components/TransactionItem';

export default function HistoryScreen() {
  const { transactions } = useTransactions();

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: colors.secondary,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 999,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <Text style={{ color: '#fff', fontFamily: 'Roboto_700Bold' }}>Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>History</Text>
        <View style={{ width: 74 }} />
      </View>

      <ScrollView contentContainerStyle={[commonStyles.screenPadding, { paddingBottom: 40 }]}>
        {transactions.length === 0 ? (
          <View style={commonStyles.card}>
            <Text style={commonStyles.text}>No transactions yet.</Text>
          </View>
        ) : (
          <View>
            {transactions.map(t => (
              <TransactionItem key={t.id} item={t} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
