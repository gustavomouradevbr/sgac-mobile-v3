import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Stack, useLocalSearchParams } from 'expo-router';
import { COURSES } from './courses';

export default function CursoDetalhes() {
  const { curso } = useLocalSearchParams();

  const data =
    COURSES[curso as keyof typeof COURSES];

  const [tab, setTab] = useState('Sobre');

  return (
    <ScrollView
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ title: data.nome }} />

      <Text style={styles.title}>
        {data.nome}
      </Text>

      <View style={styles.tabs}>
        {[
          'Sobre',
          'Conteúdo',
          'Materiais',
          'Progresso',
        ].map((item) => (
          <Pressable
            key={item}
            onPress={() => setTab(item)}
            style={[
              styles.tab,
              tab === item && styles.activeTab,
            ]}
          >
            <Text>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        {tab === 'Sobre' && (
          <Text>{data.sobre}</Text>
        )}

        {tab === 'Conteúdo' &&
          data.conteudo.map((item) => (
            <Text key={item}>• {item}</Text>
          ))}

        {tab === 'Materiais' &&
          data.materiais.map((item) => (
            <Text key={item}>📄 {item}</Text>
          ))}

        {tab === 'Progresso' && (
          <>
            <Text>
              {data.progresso}% concluído
            </Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${data.progresso}%`,
                  },
                ]}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  tab: {
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  activeTab: {
    borderWidth: 2,
    borderColor: '#004A8D',
  },

  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
  },

  progressBackground: {
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    marginTop: 12,
  },

  progressFill: {
    height: 12,
    backgroundColor: '#004A8D',
    borderRadius: 12,
  },
});