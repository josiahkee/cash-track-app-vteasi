
import React, { useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';

export type BottomSheetSettingsRef = {
  open: () => void;
  close: () => void;
};

interface Props {
  onReset: () => Promise&lt;void&gt;;
}

const BottomSheetSettings = forwardRef&lt;BottomSheetSettingsRef, Props&gt;(({ onReset }, ref) =&gt; {
  const snapPoints = useMemo(() =&gt; ['35%'], []);
  const sheetRef = useRef&lt;BottomSheet&gt;(null);

  useImperativeHandle(ref, () =&gt; ({
    open: () =&gt; {
      console.log('Opening settings sheet');
      sheetRef.current?.expand();
    },
    close: () =&gt; {
      console.log('Closing settings sheet');
      sheetRef.current?.close();
    },
  }));

  return (
    &lt;BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: colors.backgroundAlt, borderRadius: 18 }}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
    &gt;
      &lt;BottomSheetView style={{ paddingHorizontal: 20, paddingVertical: 10 }}&gt;
        &lt;Text style={styles.title}&gt;Settings&lt;/Text&gt;
        &lt;TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FFF0F0', borderColor: '#FEE2E2' }]}
          onPress={() =&gt; {
            Alert.alert('Reset all data?', 'This will delete all transactions.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: async () =&gt; { await onReset(); sheetRef.current?.close(); } }
            ]);
          }}
        &gt;
          &lt;Text style={[styles.actionText, { color: colors.red }]}&gt;Reset Data&lt;/Text&gt;
        &lt;/TouchableOpacity&gt;
        &lt;View style={{ height: 10 }} /&gt;
        &lt;View style={[styles.info, { display: 'contents' as any }]}&gt;
          &lt;Text style={styles.small}&gt;Cash Tracker v1&lt;/Text&gt;
          &lt;Text style={styles.small}&gt;All data is stored locally on your device.&lt;/Text&gt;
        &lt;/View&gt;
      &lt;/BottomSheetView&gt;
    &lt;/BottomSheet&gt;
  );
});

// Add display name for ESLint react/display-name rule compliance
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
