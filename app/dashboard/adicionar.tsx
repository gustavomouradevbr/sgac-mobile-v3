import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAtividades } from './AtividadesContext';

export default function AdicionarAtividade() {
  // Permite mudar de tela
  const router = useRouter();

  // Pega a função que salva a atividade
  const { adicionarAtividade } = useAtividades();

  // Controla se o formulário aparece ou não
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Guarda o curso selecionado
  const [curso, setCurso] = useState('ADS');

  // Guarda a área selecionada
  const [area, setArea] = useState('Cultura');

  // Guarda o título digitado
  const [titulo, setTitulo] = useState('');

  // Guarda a carga horária digitada
  const [cargaHoraria, setCargaHoraria] = useState('');

  // Guarda a descrição digitada
  const [descricao, setDescricao] = useState('');

  // Guarda a data escolhida
  const [data, setData] = useState(new Date());

  // Controla se o calendário aparece
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  // Guarda o arquivo escolhido
  const [arquivo, setArquivo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  // Função chamada quando o usuário escolhe uma data
  function aoMudarData(_event: unknown, dataSelecionada?: Date) {
    const dataAtual = dataSelecionada || data;

    // No Android fecha o calendário, no iOS mantém aberto
    setMostrarCalendario(Platform.OS === 'ios');

    // Salva a data escolhida
    setData(dataAtual);
  }

  // Abre o seletor de arquivos do celular
  async function escolherArquivo() {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      // Se o usuário escolheu um arquivo, salva ele no estado
      if (!resultado.canceled) {
        setArquivo(resultado.assets[0]);
      }
    } catch (erro) {
      console.log('Erro ao escolher arquivo:', erro);
      Alert.alert('Erro', 'Não foi possível escolher o arquivo.');
    }
  }

  // Mostra a data no formato brasileiro
  const dataFormatada = data.toLocaleDateString('pt-BR');

  // Formata a data para salvar como ano-mês-dia
  function formatarDataISO(dataSelecionada: Date) {
    const ano = dataSelecionada.getFullYear();
    const mes = String(dataSelecionada.getMonth() + 1).padStart(2, '0');
    const dia = String(dataSelecionada.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  // Limpa o formulário
  function limparFormulario() {
    setMostrarFormulario(false);
    setTitulo('');
    setCargaHoraria('');
    setDescricao('');
    setData(new Date());
    setArquivo(null);
  }

  // Envia a atividade para Minhas Atividades
  function enviarSolicitacao() {
    const horas = Number(cargaHoraria.replace(',', '.'));

    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Preencha o título da atividade.');
      return;
    }

    if (!horas || horas <= 0) {
      Alert.alert('Atenção', 'Informe uma carga horária válida.');
      return;
    }

    if (!arquivo) {
      Alert.alert('Atenção', 'Escolha o certificado ou comprovante da atividade.');
      return;
    }

    // Salva a atividade no Context
    adicionarAtividade({
      curso,
      area,
      titulo: titulo.trim(),
      cargaHoraria: horas,
      dataAtividade: formatarDataISO(data),
      descricao: descricao.trim(),
      comprovanteNome: arquivo.name,
    });

    // Limpa os campos
    limparFormulario();

    // Mostra mensagem
    Alert.alert('Sucesso', 'Solicitação enviada para análise.');

    // Vai para a página Minhas Atividades
    router.push('/dashboard/minhas-atividades');
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Adicionar Atividade' }} />

      <View style={styles.pageHeader}>
        <Text style={styles.kicker}>ATIVIDADES COMPLEMENTARES</Text>
        <Text style={styles.title}>Adicionar Atividade</Text>
        <Text style={styles.subtitle}>Registre uma nova atividade complementar</Text>
      </View>

      {!mostrarFormulario ? (
        <>
          <View style={styles.beforeCard}>
            <View style={styles.beforeIconWrap}>
              <MaterialIcons name="check-circle" size={22} color="#2CC36B" />
            </View>

            <View style={styles.beforeTextBlock}>
              <Text style={styles.beforeTitle}>Antes de enviar:</Text>
              <Text style={styles.beforeDescription}>
                Preencha os dados obrigatórios e adicione o comprovante da atividade.
              </Text>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={() => setMostrarFormulario(true)}>
            <Text style={styles.primaryButtonText}>Preencher Formulário</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Nova Atividade</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Curso</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={curso}
                onValueChange={(itemValue) => setCurso(String(itemValue))}
                style={styles.picker}
              >
                <Picker.Item label="Análise e Desenvolvimento de Sistemas (ADS)" value="ADS" />
                <Picker.Item label="Redes de Computadores" value="Redes" />
                <Picker.Item label="Sistemas de Informação" value="SI" />
                <Picker.Item label="Gestão de TI" value="GTI" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Área</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={area}
                onValueChange={(itemValue) => setArea(String(itemValue))}
                style={styles.picker}
              >
                <Picker.Item label="Cultura" value="Cultura" />
                <Picker.Item label="Esportes" value="Esportes" />
                <Picker.Item label="Pesquisa" value="Pesquisa" />
                <Picker.Item label="Voluntariado" value="Voluntariado" />
                <Picker.Item label="Tecnologia" value="Tecnologia" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título</Text>

            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Monitoria de Lógica"
              placeholderTextColor="#90A4AE"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Carga Horária (horas)</Text>

            <TextInput
              style={styles.input}
              value={cargaHoraria}
              onChangeText={setCargaHoraria}
              placeholder="Ex: 20"
              keyboardType="numeric"
              placeholderTextColor="#90A4AE"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data da Atividade</Text>

            <Pressable style={styles.dateInputFake} onPress={() => setMostrarCalendario(true)}>
              <Text style={styles.dateText}>{dataFormatada}</Text>
              <MaterialIcons name="calendar-today" size={20} color="#60748A" />
            </Pressable>

            {mostrarCalendario && (
              <DateTimePicker
                value={data}
                mode="date"
                display="default"
                onChange={aoMudarData}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descreva brevemente a atividade (opcional)"
              placeholderTextColor="#90A4AE"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Certificado / Comprovante (obrigatório)</Text>

            <View style={styles.fileInputRow}>
              <Pressable style={styles.fileButton} onPress={escolherArquivo}>
                <Text style={styles.fileButtonText}>Escolher arquivo</Text>
              </Pressable>

              <Text style={styles.fileNameText} numberOfLines={1} ellipsizeMode="middle">
                {arquivo ? arquivo.name : 'Nenhum arquivo escolhido'}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtonsRow}>
            <Pressable style={styles.cancelButton} onPress={limparFormulario}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable style={styles.submitButton} onPress={enviarSolicitacao}>
              <Text style={styles.submitButtonText}>Enviar Solicitação</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.studentCard}>
        <View style={styles.studentIconWrap}>
          <MaterialIcons name="person" size={20} color="#5C3E99" />
        </View>

        <View style={styles.studentTextBlock}>
          <Text style={styles.studentTitle}>Aluno</Text>
          <Text style={styles.studentEmail}>ana.beatriz@gmail.com</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        © 2026 SGAC - Sistema de Gestão de Atividades Complementares
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 28,
    gap: 14,
  },
  pageHeader: {
    gap: 4,
    paddingTop: 4,
  },
  kicker: {
    color: '#F07C2B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.05,
    textTransform: 'uppercase',
  },
  title: {
    color: '#10233F',
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 35,
  },
  subtitle: {
    color: '#60748A',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 2,
  },
  beforeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#0F335C',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E4ECF6',
  },
  beforeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F8FC',
    borderWidth: 1,
    borderColor: '#DCE6F0',
  },
  beforeTextBlock: {
    flex: 1,
    gap: 4,
  },
  beforeTitle: {
    color: '#10233F',
    fontSize: 15,
    fontWeight: '900',
  },
  beforeDescription: {
    color: '#5D7086',
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#2F66F2',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F66F2',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: '#0F335C',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E4ECF6',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10233F',
    marginBottom: 4,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: '#10233F',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DCE6F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#10233F',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DCE6F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#10233F',
  },
  dateInputFake: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE6F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 14,
    color: '#10233F',
  },
  fileInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE6F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  fileButton: {
    backgroundColor: '#F5F8FC',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: '#DCE6F0',
  },
  fileButtonText: {
    fontSize: 13,
    color: '#10233F',
    fontWeight: '700',
  },
  fileNameText: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#5D7086',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F07C2B',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#F07C2B',
    fontWeight: '800',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2F66F2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2EAF3',
    shadowColor: '#10345F',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  studentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1D8',
  },
  studentTextBlock: {
    flex: 1,
    gap: 4,
  },
  studentTitle: {
    color: '#10233F',
    fontSize: 15,
    fontWeight: '900',
  },
  studentEmail: {
    color: '#4B6A92',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    color: '#5E7188',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingTop: 6,
  },
});