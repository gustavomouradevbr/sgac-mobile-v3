import { StyleSheet, Text, View } from 'react-native';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Dashboard do SGAC</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F8FC',
    padding: 24,
  },
  title: {
    color: '#004A8D',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
});