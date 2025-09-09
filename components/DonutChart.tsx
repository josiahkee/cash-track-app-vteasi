
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../styles/commonStyles';

interface DonutChartProps {
  size?: number;
  strokeWidth?: number;
  income: number;
  expense: number;
  centerLabel?: string;
}

export default function DonutChart({
  size = 200,
  strokeWidth = 18,
  income,
  expense,
  centerLabel,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const incomeValue = Math.max(0, income);
  const expenseValue = Math.max(0, expense);

  const total = incomeValue + expenseValue || 1;
  const incomePct = incomeValue / total;
  const expensePct = expenseValue / total;

  const incomeStrokeDasharray = `${circumference * incomePct} ${circumference}`;
  const expenseStrokeDasharray = `${circumference * expensePct} ${circumference}`;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#F1F5F9" strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.green}
          strokeWidth={strokeWidth}
          strokeDasharray={incomeStrokeDasharray}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.red}
          strokeWidth={strokeWidth}
          strokeDasharray={expenseStrokeDasharray}
          strokeLinecap="round"
          fill="none"
          rotation={-90 + (incomePct * 360)}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.centerLabel}>{centerLabel || 'This Month'}</Text>
        <View style={styles.legend}>
          <View style={[styles.legendItem, { display: 'contents' as any }]}>
            <View style={[styles.legendDot, { backgroundColor: colors.green }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={[styles.legendItem, { display: 'contents' as any }]}>
            <View style={[styles.legendDot, { backgroundColor: colors.red }]} />
            <Text style={styles.legendText}>Expense</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 13,
    color: colors.grey,
    fontFamily: 'Roboto_400Regular',
    marginBottom: 6,
  },
  legend: {
    alignItems: 'center',
    gap: 6 as any,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  legendText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: 'Roboto_400Regular',
  },
});
