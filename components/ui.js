import { StyleSheet, Text, View } from 'react-native';

export function CampoLabel({ label, children }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#1f2937',
  },
});
