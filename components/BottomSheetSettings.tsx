
import React, { useMemo, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { colors } from '../styles/commonStyles';
import type { Account } from '../data/types';

export type BottomSheetSettingsRef = {
  open: () => void;
  close: () => void;
};

interface Props {
  accounts: Account[];
  selectedAccountId: string | null;
  onSwitchAccount: (id: string) => Promise<void> | void;
  onCreateAccount: (name: string) => Promise<void> | void;
  onRenameAccount: (id: string, name: string) => Promise<void> | void;
  onDeleteAccount: (id: string) => Promise<void> | void;
  onReset: () => Promise<void>;
}

const BottomSheetSettings = forwardRef<BottomSheetSettingsRef, Props>(({
  accounts,
  selectedAccountId,
  onSwitchAccount,
  onCreateAccount,
  onRenameAccount,
  onDeleteAccount,
  onReset,
}, ref) => {
  const snapPoints = useMemo(() => ['60%'], []);
  const sheetRef = useRef<BottomSheetMethods>(null);

  const [newName, setNewName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

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
        <Text style={styles.title}>Accounts</Text>
        <View style={[styles.cardLike]}>
          {accounts.length === 0 ? (
            <Text style={styles.small}>No accounts.</Text>
          ) : (
            <View>
              {accounts.map(acc => {
                const selected = acc.id === selectedAccountId;
                const isRenaming = renamingId === acc.id;
                return (
                  <View key={acc.id} style={styles.accountRow}>
                    <TouchableOpacity
                      onPress={() => onSwitchAccount(acc.id)}
                      style={[styles.radio, { borderColor: selected ? colors.primary : '#D1D5DB', backgroundColor: selected ? colors.primary : 'transparent' }]}
                    />
                    <View style={{ flex: 1 }}>
                      {isRenaming ? (
                        <TextInput
                          value={renameValue}
                          onChangeText={setRenameValue}
                          autoFocus
                          placeholder="Account name"
                          placeholderTextColor="#B3B3B3"
                          style={styles.input}
                          onSubmitEditing={async () => {
                            await onRenameAccount(acc.id, renameValue);
                            setRenamingId(null);
                          }}
                        />
                      ) : (
                        <Text style={styles.accountName}>{acc.name}</Text>
                      )}
                      <Text style={styles.small}>Created {new Date(acc.createdAt).toLocaleDateString()}</Text>
                    </View>
                    {isRenaming ? (
                      <TouchableOpacity
                        onPress={async () => {
                          await onRenameAccount(acc.id, renameValue);
                          setRenamingId(null);
                        }}
                        style={[styles.smallBtn, { backgroundColor: colors.primary }]}
                      >
                        <Text style={styles.smallBtnText}>Save</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ flexDirection: 'row', gap: 8 as any }}>
                        <TouchableOpacity
                          onPress={() => {
                            setRenamingId(acc.id);
                            setRenameValue(acc.name);
                          }}
                          style={[styles.smallBtn, { backgroundColor: colors.secondary }]}
                        >
                          <Text style={styles.smallBtnText}>Rename</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert('Delete account?', 'This will remove this account and its transactions.', [
                              { text: 'Cancel', style: 'cancel' },
                              { text: 'Delete', style: 'destructive', onPress: () => onDeleteAccount(acc.id) },
                            ]);
                          }}
                          style={[styles.smallBtn, { backgroundColor: colors.red }]}
                        >
                          <Text style={styles.smallBtnText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
          <View style={{ height: 10 }} />
          <View style={{ flexDirection: 'row', gap: 8 as any }}>
            <TextInput
              placeholder="New account name"
              placeholderTextColor="#B3B3B3"
              value={newName}
              onChangeText={setNewName}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity
              onPress={async () => {
                const name = newName.trim();
                if (!name) return;
                await onCreateAccount(name);
                setNewName('');
              }}
              style={[styles.smallBtn, { backgroundColor: colors.green }]}
            >
              <Text style={styles.smallBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.title, { marginTop: 14 }]}>Settings</Text>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FFF0F0', borderColor: '#FEE2E2' }]}
          onPress={() => {
            Alert.alert('Reset this account?', 'This will delete all transactions in the selected account.', [
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
          <Text style={[styles.actionText, { color: colors.red }]}>Reset Current Account</Text>
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
  cardLike: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 as any,
    paddingVertical: 8,
  },
  radio: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 999,
  },
  accountName: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: colors.text,
  },
  smallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  smallBtnText: {
    color: '#fff',
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Roboto_400Regular',
    color: colors.text,
    fontSize: 14,
    minWidth: 120,
  },
});

export default BottomSheetSettings;
