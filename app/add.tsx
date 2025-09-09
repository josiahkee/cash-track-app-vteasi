
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTransactions } from '../hooks/useTransactions';

export default function AddTransactionScreen() {
  const params = useLocalSearchParams<{ type?: 'income' | 'expense' }>();
  const initialType: 'income' | 'expense' = (params.type === 'expense' || params.type === 'income') ? params.type : 'income';

  const [type, setType] = useState<'income' | 'expense'>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { addTransaction } = useTransactions();

  const isValid = useMemo(() => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) return false;
    return true;
  }, [amount]);

  return (
    <View style={[commonStyles.container]}>
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
        <Text style={commonStyles.headerTitle}>Add</Text>
        <View style={{ width: 74 }} />
      </View>

      <View style={[commonStyles.content, commonStyles.screenPadding]}>
        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Type</Text>
          <View style={{ flexDirection: 'row', gap: 10 as any }}>
            <TouchableOpacity
              onPress={() => setType('income')}
              style={{
                flex: 1,
                backgroundColor: type === 'income' ? colors.green : colors.backgroundAlt,
                borderColor: type === 'income' ? colors.green : '#E5E7EB',
                borderWidth: 1,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ textAlign: 'center', color: type === 'income' ? '#fff' : colors.text, fontFamily: 'Roboto_700Bold' }}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType('expense')}
              style={{
                flex: 1,
                backgroundColor: type === 'expense' ? colors.red : colors.backgroundAlt,
                borderColor: type === 'expense' ? colors.red : '#E5E7EB',
                borderWidth: 1,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ textAlign: 'center', color: type === 'expense' ? '#fff' : colors.text, fontFamily: 'Roboto_700Bold' }}>Expense</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 14 }} />
          <Text style={commonStyles.label}>Amount</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#B3B3B3"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            style={commonStyles.input}
          />

          <View style={{ height: 14 }} />
          <Text style={commonStyles.label}>Description</Text>
          <TextInput
            placeholder={type === 'income' ? 'Salary, Gift...' : 'Groceries, Rent...'}
            placeholderTextColor="#B3B3B3"
            value={desc}
            onChangeText={setDesc}
            style={commonStyles.input}
          />

          <View style={{ height: 14 }} />
          <Text style={commonStyles.label}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text style={{ color: colors.text, fontFamily: 'Roboto_400Regular' }}>
              {date.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              onChange={(e: any, d?: Date) => {
                setShowPicker(false);
                if (d) setDate(d);
              }}
            />
          )}

          <TouchableOpacity
            onPress={async () => {
              if (!isValid) return;
              const num = Number(amount);
              await addTransaction(type, num, desc, date);
              router.replace('/');
            }}
            disabled={!isValid}
            style={{
              backgroundColor: isValid ? colors.primary : '#D1D5DB',
              padding: 14,
              borderRadius: 12,
              marginTop: 18,
              boxShadow: '0px 8px 20px rgba(10, 132, 255, 0.25)',
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontFamily: 'Roboto_700Bold', fontSize: 16 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
