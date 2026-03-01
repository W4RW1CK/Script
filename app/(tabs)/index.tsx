import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Script 🍌</Text>
      <Text style={styles.subtitle}>Setup completo — Fase 1.1 ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F6F2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C22',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});
