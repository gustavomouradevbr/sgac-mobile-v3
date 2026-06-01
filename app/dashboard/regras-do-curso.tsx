import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// Interface para tipar as atividades (opcional se usar TypeScript)
interface Atividade {
  nome: string;
  horas: string;
}

interface CategoryCardProps {
  titulo: string;
  limiteHoras: string;
  corIndicador: string;
  atividades: Atividade[];
}

// 1. Componente Reutilizável para cada Seção/Card
const CategoryCard: React.FC<CategoryCardProps> = ({ titulo, limiteHoras, corIndicador, atividades }) => {
  const [isOpen, setIsOpen] = useState(true); // Controla se o accordion está aberto

  return (
    <View style={styles.cardContainer}>
      {/* Cabeçalho do Card */}
      <TouchableOpacity 
        style={styles.cardHeader} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.indicatorCircle, { backgroundColor: corIndicador }]} />
          <View>
            <Text style={styles.titleText}>{titulo}</Text>
            <Text style={styles.subtitleText}>Exemplos de atividades válidas</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <View style={[styles.badge, { backgroundColor: corIndicador }]}>
            <Text style={styles.badgeText}>{limiteHoras}</Text>
          </View>
          {/* Seta simples simulada por texto (pode usar Lucide/Vector Icons aqui) */}
          <Text style={styles.arrowIcon}>{isOpen ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {/* Tabela de Atividades (Só renderiza se estiver aberto) */}
      {isOpen && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Atividade</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Horas</Text>
          </View>
          
          {atividades.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.rowText, { flex: 3 }]}>{item.nome}</Text>
              <Text style={[styles.rowHourText, { flex: 1, textAlign: 'right' }]}>{item.horas}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// 2. Tela Principal
export default function RegrasCursoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.topTagText}>ATIVIDADES COMPLEMENTARES</Text>
      <Text style={styles.mainTitle}>Regras do Curso</Text>
      <Text style={styles.mainSubtitle}>Curso atual: Nenhum curso vinculado</Text>

      {/* Seção: Ensino */}
      <CategoryCard 
        titulo="Ensino"
        limiteHoras="40h"
        corIndicador="#3b82f6" // Azul
        atividades={[
          { nome: 'Monitoria em disciplinas do curso', horas: '20h por semestre' },
          { nome: 'Tutoria em cursos a distância', horas: '20h por semestre' },
          { nome: 'Disciplinas optativas além da grade curricular', horas: '60h por disciplina concluída' },
        ]}
      />

      {/* Seção: Pesquisa e Iniciação Científica */}
      <CategoryCard 
        titulo="Pesquisa e Iniciação Científica"
        limiteHoras="60h"
        corIndicador="#1e3a8a" // Azul Escuro
        atividades={[
          { nome: 'Iniciação científica', horas: '60h por ano' },
          { nome: 'Publicação de artigo', horas: '30h por artigo' },
          { nome: 'Trabalho em anais de evento', horas: '20h por trabalho' },
        ]}
      />

      {/* Seção: Extensão e Responsabilidade Social */}
      <CategoryCard 
        titulo="Extensão e Responsabilidade Social"
        limiteHoras="40h"
        corIndicador="#10b981" // Verde
        atividades={[
          { nome: 'Projeto de extensão', horas: '40h por projeto' },
          { nome: 'Serviço voluntário', horas: '40h por semestre' },
          { nome: 'Organização de evento acadêmico', horas: '20h por evento' },
        ]}
      />
    </ScrollView>
  );
}

// 3. Estilização (Fiel ao Layout da Imagem)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9', // Fundo levemente acinzentado da página
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  topTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#f97316', // Laranja do topo
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 4,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    // Sombras para dar efeito de elevação leve (Card)
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicatorCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitleText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  arrowIcon: {
    fontSize: 10,
    color: '#94a3b8',
  },
  tableContainer: {
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  rowText: {
    fontSize: 13,
    color: '#334155',
  },
  rowHourText: {
    fontSize: 13,
    color: '#64748b',
  },
});