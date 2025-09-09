
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#0A84FF',
  secondary: '#111827',
  accent: '#10B981', // green
  background: '#F7F7F7',
  backgroundAlt: '#FFFFFF',
  text: '#111111',
  grey: '#9CA3AF',
  card: '#FFFFFF',
  red: '#EF4444',
  green: '#22C55E',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  screenPadding: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    textAlign: 'left',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Roboto_400Regular',
    color: colors.text,
    lineHeight: 24,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: '#ECECEC',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.text,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Roboto_400Regular',
    color: colors.text,
    fontSize: 16,
    width: '100%',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.03)',
  },
  label: {
    fontSize: 13,
    color: colors.grey,
    marginBottom: 6,
    fontFamily: 'Roboto_400Regular',
  },
  small: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Roboto_400Regular',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
});
