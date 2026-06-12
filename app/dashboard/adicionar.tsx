import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { apiFetch, BASE_URL, getAuthHeader, uploadAtividadeMultipart } from '../../src/services/api';
import type { Curso, RegraAtividade } from '../../src/services/types';

const AREAS = [
  { label: 'Ensino', value: 'ENSINO' },
  { label: 'Pesquisa', value: 'PESQUISA' },
  { label: 'Extensão', value: 'EXTENSAO' },
  { label: 'Cultura', value: 'CULTURA' },
  { label: 'Eventos', value: 'EVENTOS' },
] as const;

type AreaValue = typeof AREAS[number]['value'];

export default function AdicionarAtividade() {
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [regras, setRegras] = useState<RegraAtividade[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<number | null>(null);
  const [areaSelecionada, setAreaSelecionada] = useState<AreaValue>('ENSINO');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [dataAtividade, setDataAtividade] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('userName').then(n => setUserEmail(n ?? ''));
    AsyncStorage.getItem('userId').then(id => setUserId(id));

    apiFetch<Curso[]>('/api/cursos')
      .then(data => {
        // Proteção estrita: garante que só atribui um Array válido
        const cursosSeguros = Array.isArray(data) ? data : [];
        setCursos(cursosSeguros);
        if (cursosSeguros.length > 0) {
          setCursoSelecionado(cursosSeguros[0].id);
          loadRegras(cursosSeguros[0].id);
        }
      })
      .catch(() => Alert.alert('Aviso', 'Não foi possível carregar os cursos.'));
  }, []);

  const loadRegras = async (cursoId: number) => {
    try {
      const data = await apiFetch<RegraAtividade[]>(`/api/regras/curso/${cursoId}`);
      // Proteção estrita para as regras
      setRegras(Array.isArray(data) ? data : []);
    } catch {
      setRegras([]);
    }
  };

  const limiteHorasArea = regras.find(r => r.area === areaSelecionada)?.limiteHoras ?? null;

  function formatarDataISO(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  function formatarDataBrasil(dataISO: string) {
    if (!dataISO) return 'Selecionar data';
    const [ano, mes, dia] = dataISO.split('-');
    if (!ano || !mes || !dia) return 'Selecionar data';
    return `${dia}/${mes}/${ano}`;
  }

  function aoMudarData(_event: unknown, dataNova?: Date) {
    const dataAtual = dataNova ?? dataSelecionada;
    setMostrarCalendario(Platform.OS === 'ios');
    setDataSelecionada(dataAtual);
    setDataAtividade(formatarDataISO(dataAtual));
  }

  async function selecionarArquivo() {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/png', 'image/jpeg'],
        copyToCacheDirectory: true,
      });
      if (!resultado.canceled && resultado.assets?.length) {
        setArquivoSelecionado(resultado.assets[0]);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
    }
  }

  function limparFormulario() {
    setTitulo('');
    setDescricao('');
    setCargaHoraria('');
    setDataAtividade('');
    setDataSelecionada(new Date());
    setMostrarCalendario(false);
    setArquivoSelecionado(null);
    setAreaSelecionada('ENSINO');
  }

  async function enviarAtividade() {
    const tituloLimpo = titulo.trim();
    const descricaoLimpa = descricao.trim();
    const horasNumero = Number(cargaHoraria.replace(',', '.'));

    if (!cursoSelecionado) {
      Alert.alert('Atenção', 'Selecione um curso.');
      return;
    }
    if (!tituloLimpo || !descricaoLimpa || !cargaHoraria || !dataAtividade || !arquivoSelecionado) {
      Alert.alert('Atenção', 'Preencha todos os campos e selecione um arquivo.');
      return;
    }
    if (!Number.isFinite(horasNumero) || horasNumero <= 0) {
      Alert.alert('Atenção', 'Informe uma carga horária válida.');
      return;
    }
    if (!userId) {
      Alert.alert('Sessão expirada', 'Faça login novamente.');
      return;
    }

    try {
      setIsLoading(true);

      // Usa a engine nativa do Expo para fazer o upload seguro
      const response = await uploadAtividadeMultipart(
        userId,
        cursoSelecionado,
        tituloLimpo,
        descricaoLimpa,
        areaSelecionada,
        horasNumero,
        dataAtividade,
        arquivoSelecionado.uri,
        arquivoSelecionado.name || 'comprovante.jpg',
        arquivoSelecionado.mimeType || 'application/octet-stream'
      );

      Alert.alert('Sucesso', 'Atividade enviada com sucesso!');
      limparFormulario();
      router.push('/dashboard/minhas-atividades');

    } catch (error: any) {
      console.error(error);
      Alert.alert('Falha no envio', error.message || 'Verifique sua internet ou tente novamente mais tarde.');
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
        <Text style={styles.subtitle}>Registre uma nova atividade complementar para validação</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Nova Atividade</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Curso</Text>
          {cursos.length === 0 ? (
            <ActivityIndicator color="#004A8D" />
          ) : (
            <View style={styles.chipRow}>
              {cursos.map(c => (
                <Pressable
                  key={c.id}
                  style={[styles.chip, cursoSelecionado === c.id && styles.chipActive]}
                  onPress={() => {
                    setCursoSelecionado(c.id);
                    loadRegras(c.id);
                  }}
                >
                  <Text style={[styles.chipText, cursoSelecionado === c.id && styles.chipTextActive]}>
                    {c.nome}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Área de Atividade</Text>
          <View style={styles.chipRow}>
            {AREAS.map(a => (
              <Pressable
                key={a.value}
                style={[styles.chip, areaSelecionada === a.value && styles.chipActive]}
                onPress={() => setAreaSelecionada(a.value)}
              >
                <Text style={[styles.chipText, areaSelecionada === a.value && styles.chipTextActive]}>
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
          {limiteHorasArea !== null && <Text style={styles.limiteHint}>Limite para esta área: {limiteHorasArea}h</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: Monitoria de Lógica de Programação"
            placeholderTextColor="#90A4AE"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva brevemente a atividade realizada"
            placeholderTextColor="#90A4AE"
            multiline
            numberOfLines={4}
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
            <Text style={[styles.dateText, !dataAtividade && { color: '#90A4AE' }]}>
              {formatarDataBrasil(dataAtividade)}
            </Text>
            <MaterialIcons name="calendar-today" size={20} color="#60748A" />
          </Pressable>
          {mostrarCalendario && (
            <DateTimePicker
              value={dataSelecionada}
              mode="date"
              display="default"
              onChange={aoMudarData}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Comprovante (PDF, PNG ou JPEG – máx. 20MB)</Text>
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
            <Text style={styles.cancelButtonText}>Limpar</Text>
          </Pressable>
          <Pressable
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={enviarAtividade}
            disabled={isLoading}
          >
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
          <Text style={styles.studentEmail}>{userEmail || 'Carregando...'}</Text>
        </View>
      </View>

      <Text style={styles.footer}>© 2026 SGAC – Sistema de Gestão de Atividades Complementares</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 16, paddingBottom: 28, gap: 14 },
  pageHeader: { gap: 4, paddingTop: 4 },
  kicker: { color: '#F07C2B', fontSize: 12, fontWeight: '900', letterSpacing: 1.05, textTransform: 'uppercase' },
  title: { color: '#10233F', fontSize: 29, fontWeight: '900', lineHeight: 35 },
  subtitle: { color: '#60748A', fontSize: 15, lineHeight: 22, marginTop: 2 },
  formContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, gap: 16, borderWidth: 1, borderColor: '#E4ECF6' },
  formTitle: { fontSize: 18, fontWeight: '800', color: '#10233F', marginBottom: 4 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, color: '#10233F', fontWeight: '700' },
  limiteHint: { fontSize: 11, color: '#2563EB', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#DCE6F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#10233F', backgroundColor: '#FFFFFF' },
  textArea: { height: 80, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#DCE6F0', backgroundColor: '#F9FBFD' },
  chipActive: { backgroundColor: '#004A8D', borderColor: '#004A8D' },
  chipText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  dateInputFake: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#DCE6F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 14, backgroundColor: '#FFFFFF' },
  dateText: { fontSize: 14, color: '#10233F' },
  fileInputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DCE6F0', borderRadius: 8, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  fileButton: { backgroundColor: '#F5F8FC', paddingHorizontal: 12, paddingVertical: 14, borderRightWidth: 1, borderRightColor: '#DCE6F0' },
  fileButtonText: { fontSize: 13, color: '#10233F', fontWeight: '700' },
  fileNameText: { flex: 1, paddingHorizontal: 12, fontSize: 13, color: '#5D7086' },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#F07C2B' },
  cancelButtonText: { color: '#F07C2B', fontWeight: '800', fontSize: 14 },
  submitButton: { backgroundColor: '#2F66F2', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, minWidth: 160, alignItems: 'center' },
  submitButtonDisabled: { opacity: 0.8 },
  submitButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  studentCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E2EAF3' },
  studentIconWrap: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1D8' },
  studentTextBlock: { flex: 1, gap: 4 },
  studentTitle: { color: '#10233F', fontSize: 15, fontWeight: '900' },
  studentEmail: { color: '#4B6A92', fontSize: 13, fontWeight: '600' },
  footer: { color: '#5E7188', fontSize: 12, lineHeight: 18, textAlign: 'center', paddingTop: 6 },
});