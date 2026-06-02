import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FiltroCursoProps {
  cursoSelecionado: string;
  onSelecionarCurso: (curso: string) => void;
}

// Lista de cursos fictícia (Mude para os cursos reais do seu projeto)
const CURSOS_DISPONIVEIS = [
  'Todos os Cursos',
  'Análise e Desenvolvimento de Sistemas',
  'Administração',
  'Ciência da Computação',
  'Engenharia de Software',
];

export const FiltroCurso: React.FC<FiltroCursoProps> = ({ cursoSelecionado, onSelecionarCurso }) => {
  const [modalVisivel, setModalVisivel] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filtrar por Curso:</Text>
      
      {/* Botão que abre a seleção */}
      <TouchableOpacity style={styles.seletorBotao} onPress={() => setModalVisivel(true)}>
        <Text style={styles.seletorTexto}>{cursoSelecionado || 'Selecione um curso'}</Text>
        <Text style={styles.setaIcon}>▼</Text>
      </TouchableOpacity>

      {/* Janela de Opções (Modal) */}
      <Modal visible={modalVisivel} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisivel(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Curso</Text>
            <ScrollView>
              {CURSOS_DISPONIVEIS.map((curso, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.opcaoItem,
                    curso === cursoSelecionado && styles.opcaoItemSelecionado,
                  ]}
                  onPress={() => {
                    onSelecionarCurso(curso);
                    setModalVisivel(false);
                  }}
                >
                  <Text style={[
                    styles.opcaoTexto,
                    curso === cursoSelecionado && styles.opcaoTextoSelecionado
                  ]}>
                    {curso}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  seletorBotao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  seletorTexto: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  setaIcon: {
    fontSize: 10,
    color: '#94a3b8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Fundo escurecido suave
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '70%',
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  opcaoItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  opcaoItemSelecionado: {
    backgroundColor: '#eff6ff', // Fundo azul claro para o selecionado
  },
  opcaoTexto: {
    fontSize: 14,
    color: '#334155',
  },
  opcaoTextoSelecionado: {
    color: '#2563eb', // Texto azul para o selecionado
    fontWeight: 'bold',
  },
});