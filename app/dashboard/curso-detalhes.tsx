import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COURSES } from './courses';

export default function CursoDetalhes() {
  const { curso } = useLocalSearchParams();
  const data = COURSES[curso as keyof typeof COURSES];
  const [tab, setTab] = useState('Sobre');

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: data.nome }} />
      <Text style={styles.title}>{data.nome}</Text>

      <View style={styles.tabs}>
        {['Sobre', 'Conteúdo', 'Materiais', 'Progresso'].map((item) => (
          <Pressable
            key={item}
            onPress={() => setTab(item)}
            style={[styles.tab, tab === item && styles.activeTab]}
          >
            <Text>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        {/* Aba: Sobre */}
        {tab === 'Sobre' && (
          <Text>{data.sobre}</Text>
        )}

        {/* Aba: Conteúdo */}
        {tab === 'Conteúdo' &&
          data.conteudo.map((item) => (
            <Text key={item}>• {item}</Text>
          ))}

        {/* Aba: Materiais */}
        {tab === 'Materiais' &&
          data.materiais.map((item) => (
            <Text key={item}>📄 {item}</Text>
          ))}

        {/* Aba: Progresso */}
        {tab === 'Progresso' && (
          <>
            {/* Progresso geral — igual ao que já existia */}
            <Text style={styles.sectionTitle}>Progresso Geral</Text>
            <Text style={styles.progressText}>{data.progresso}% concluído</Text>
            <View style={styles.progressBackground}>
              <View
                style={[styles.progressFill, {
                  width: `${data.progresso}%`,
                  backgroundColor: '#004A8D',
                }]}
              />
            </View>

            {/* Horas por categoria — NOVO */}
            <Text style={[styles.sectionTitle, { marginTop: 28 }]}>
              Horas por Categoria
            </Text>

            {data.categorias.map((cat, index) => {
              const percentual =
                cat.limiteHoras === 0
                  ? 0
                  : Math.min(
                      (cat.horasCumpridas / cat.limiteHoras) * 100,
                      100
                    );

              const cores = ['#3b82f6', '#1e3a8a', '#10b981'];
              const cor = cores[index % cores.length];

              return (
                <View key={cat.nome} style={styles.categoriaItem}>
                  <View style={styles.categoriaHeader}>
                    <Text style={styles.categoriaNome}>{cat.nome}</Text>
                    <Text style={[styles.categoriaPercent, { color: cor }]}>
                      {percentual.toFixed(0)}%
                    </Text>
                  </View>
                  <Text style={styles.categoriaLabel}>
                    {cat.horasCumpridas}h de {cat.limiteHoras}h
                  </Text>
                  <View style={styles.progressBackground}>
                    <View
                      style={[styles.progressFill, {
                        width: `${percentual}%`,
                        backgroundColor: cor,
                      }]}
                    />
                  </View>
                </View>
              );
            })}
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
  // Progresso geral
  progressBackground: {
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: 12,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
  // Títulos de seção
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  // Categorias
  categoriaItem: {
    marginTop: 18,
  },
  categoriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriaNome: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  categoriaPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  categoriaLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 3,
    marginBottom: 4,
  },
});