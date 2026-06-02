import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';

import { Stack, useRouter } from 'expo-router';
import { COURSES } from './courses';

export default function CursosScreen() {
  const router = useRouter();

  const [selectedCourse, setSelectedCourse] = useState('TODOS');

  const cursos = Object.values(COURSES);

  const filteredCourses =
    selectedCourse === 'TODOS'
      ? cursos
      : cursos.filter(
          (curso) => curso.sigla === selectedCourse
        );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: 'Cursos' }} />

      <Text style={styles.title}>Cursos</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Pressable
          style={[
            styles.chip,
            selectedCourse === 'TODOS' && styles.activeChip,
          ]}
          onPress={() => setSelectedCourse('TODOS')}
        >
          <Text>Todos</Text>
        </Pressable>

        {cursos.map((curso) => (
          <Pressable
            key={curso.sigla}
            style={[
              styles.chip,
              selectedCourse === curso.sigla &&
                styles.activeChip,
            ]}
            onPress={() =>
              setSelectedCourse(curso.sigla)
            }
          >
            <Text>{curso.sigla}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {filteredCourses.map((curso) => (
        <Pressable
          key={curso.sigla}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: '/dashboard/curso-detalhes',
              params: {
                curso: curso.sigla,
              },
            })
          }
        >
          <Text style={styles.cardTitle}>
            {curso.nome}
          </Text>

          <Text style={styles.cardDescription}>
            {curso.sobre}
          </Text>
        </Pressable>
      ))}
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

  chip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 20,
  },

  activeChip: {
    borderWidth: 2,
    borderColor: '#004A8D',
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  cardDescription: {
    color: '#555',
  },
});