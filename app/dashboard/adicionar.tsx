import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function AdicionarAtividade() {
  const [regraId, setRegraId] = useState('1');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horasSolicitadas, setHorasSolicitadas] = useState('');
  const [dataAtividade, setDataAtividade] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function formatarDataISO(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  function formatarDataBrasil(dataISO: string) {
    if (!dataISO) {
      return 'Selecionar data';
    }

    const [ano, mes, dia] = dataISO.split('-');
    if (!ano || !mes || !dia) {
      return 'Selecionar data';
    }

    return `${dia}/${mes}/${ano}`;
  }

  function aoMudarData(_event: unknown, dataSelecionadaNova?: Date) {
    const dataAtual = dataSelecionadaNova || dataSelecionada;
    setMostrarCalendario(Platform.OS === 'ios');
    setDataSelecionada(dataAtual);
    setDataAtividade(formatarDataISO(dataAtual));
  }

  async function selecionarArquivo() {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!resultado.canceled && resultado.assets?.length) {
        setArquivoSelecionado(resultado.assets[0]);
      }
    } catch (erro) {
      console.log('Erro ao escolher arquivo:', erro);
      Alert.alert('Erro', 'Não foi possível escolher o arquivo.');
    }
  }

  function limparFormulario() {
    setRegraId('1');
    setTitulo('');
    setDescricao('');
    setHorasSolicitadas('');
    setDataAtividade('');
    setDataSelecionada(new Date());
    setMostrarCalendario(false);
    setArquivoSelecionado(null);
  }

  async function enviarAtividade() {
    const tituloLimpo = titulo.trim();
    const descricaoLimpa = descricao.trim();
    const horasNumero = Number(String(horasSolicitadas).replace(',', '.'));

    if (!regraId || !tituloLimpo || !descricaoLimpa || !horasSolicitadas || !dataAtividade || !arquivoSelecionado) {
      Alert.alert('Atenção', 'Preencha todos os campos e selecione um arquivo para continuar.');
      return;
    }

    if (!Number.isFinite(horasNumero) || horasNumero <= 0) {
      Alert.alert('Atenção', 'Informe uma quantidade válida de horas solicitadas.');
      return;
    }

    const userId = await AsyncStorage.getItem('userId');
    const userToken = await AsyncStorage.getItem('userToken');

    if (!userId || !userToken) {
      Alert.alert('Sessão expirada', 'Não foi possível encontrar os dados do utilizador. Faça login novamente.');
      return;
    }

    const formData = new FormData();
    formData.append(
      'dados',
      JSON.stringify({
        alunoId: Number(userId),
        regraId: Number(regraId),
        titulo: tituloLimpo,
        descricao: descricaoLimpa,
        horasSolicitadas: Number(horasNumero),
        dataAtividade,
      })
    );
    formData.append(
      'arquivo',
      {
        uri: arquivoSelecionado.uri,
        name: arquivoSelecionado.name,
        type: arquivoSelecionado.mimeType || 'application/octet-stream',
      } as any
    );

    try {
      setIsLoading(true);

      const response = await fetch('https://api-sgac-gustavo.onrender.com/api/submissoes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Sucesso', 'Solicitação enviada com sucesso.');
        limparFormulario();
        return;
      }

      let mensagemErro = 'Não foi possível enviar a solicitação.';

      try {
        const erro = await response.json();
        if (typeof erro?.message === 'string' && erro.message.trim()) {
          mensagemErro = erro.message;
        }
      } catch {
        // Mantém a mensagem padrão quando a API não retorna JSON válido.
      }

      Alert.alert('Falha no envio', mensagemErro);
    } catch (erro) {
      console.error('Erro ao enviar atividade:', erro);
      Alert.alert('Erro', 'Não foi possível enviar a atividade. Verifique a sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Adicionar Atividade' }} />

      <View style={styles.pageHeader}>
        <Text style={styles.kicker}>ATIVIDADES COMPLEMENTARES</Text>
        <Text style={styles.title}>Adicionar Atividade</Text>
        <Text style={styles.subtitle}>Registre uma nova atividade complementar</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Nova Atividade</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Regra</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={regraId} onValueChange={(itemValue) => setRegraId(String(itemValue))} style={styles.picker}>
              <Picker.Item label="Regra 1" value="1" />
              <Picker.Item label="Regra 2" value="2" />
              <Picker.Item label="Regra 3" value="3" />
              <Picker.Item label="Regra 4" value="4" />
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
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva brevemente a atividade"
            placeholderTextColor="#90A4AE"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Horas Solicitadas</Text>
          <TextInput
            style={styles.input}
            value={horasSolicitadas}
            onChangeText={setHorasSolicitadas}
            placeholder="Ex: 20"
            keyboardType="numeric"
            placeholderTextColor="#90A4AE"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data da Atividade</Text>
          <Pressable style={styles.dateInputFake} onPress={() => setMostrarCalendario(true)}>
            <Text style={styles.dateText}>{formatarDataBrasil(dataAtividade)}</Text>
            <MaterialIcons name="calendar-today" size={20} color="#60748A" />
          </Pressable>

          {mostrarCalendario && (
            <DateTimePicker value={dataSelecionada} mode="date" display="default" onChange={aoMudarData} />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Certificado / Comprovante (obrigatório)</Text>
          <View style={styles.fileInputRow}>
            <Pressable style={styles.fileButton} onPress={selecionarArquivo} disabled={isLoading}>
              <Text style={styles.fileButtonText}>Escolher arquivo</Text>
            </Pressable>

            <Text style={styles.fileNameText} numberOfLines={1} ellipsizeMode="middle">
              {arquivoSelecionado ? arquivoSelecionado.name : 'Nenhum arquivo escolhido'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtonsRow}>
          <Pressable style={styles.cancelButton} onPress={limparFormulario} disabled={isLoading}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>

          <Pressable style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} onPress={enviarAtividade} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Enviar Solicitação</Text>}
          </Pressable>
        </View>
      </View>

      <View style={styles.studentCard}>
        <View style={styles.studentIconWrap}>
          <MaterialIcons name="person" size={20} color="#5C3E99" />
        </View>

        <View style={styles.studentTextBlock}>
          <Text style={styles.studentTitle}>Aluno</Text>
          <Text style={styles.studentEmail}>ana.beatriz@gmail.com</Text>
        </View>
      </View>

      <Text style={styles.footer}>© 2026 SGAC - Sistema de Gestão de Atividades Complementares</Text>
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
    minWidth: 150,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.8,
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
