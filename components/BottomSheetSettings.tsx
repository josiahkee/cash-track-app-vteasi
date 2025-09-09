
import React, { useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';

export type BottomSheetSettingsRef = {
  open: () => void;
  close: () => void;
};

interface Props {
  onReset: () => Promise<void>;
}

const BottomSheetSettings = forwardRef<BottomSheetSettingsRef, Props>(({ onReset }, ref) => {
  const snapPoints = useMemo(() => ['35%'], []);
  const sheetRef = useRef<BottomSheetMethods>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      console.log('Opening settings sheet');
      sheetRef.current?.expand();
    },
    close: () => {
      console.log('Closing settings sheet');
      sheetRef.current?.close();
    },
  }));

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: colors.backgroundAlt, borderRadius: 18 }}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
    >
      <BottomSheetView style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FFF0F0', borderColor: '#FEE2E2' }]}
          onPress={() => {
            Alert.alert('Reset all data?', 'This will delete all transactions.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: async () => {
                  await onReset();
                  sheetRef.current?.close();
                },
              },
            ]);
          }}
        >
          <Text style={[styles.actionText, { color: colors.red }]}>Reset Data</Text>
        </TouchableOpacity>
        <View style={{ height: 10 }} />
        <View style={[styles.info, { display: 'contents' as any }]}>
          <Text style={styles.small}>Cash Tracker v1</Text>
          <Text style={styles.small}>All data is stored locally on your device.</Text>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

BottomSheetSettings.displayName = 'BottomSheetSettings';

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    color: colors.text,
    marginBottom: 10,
  },
  actionBtn: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
  },
  actionText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
  },
  small: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Roboto_400Regular',
  },
  info: {
    gap: 4 as any,
  },
});

export default BottomSheetSettings;
