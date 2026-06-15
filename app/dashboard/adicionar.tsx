import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
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
import { apiFetch, uploadAtividadeMultipart } from '../../src/services/api';
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
  const [isOcrLoading, setIsOcrLoading] = useState(false);
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

  async function extrairDadosComOCR(asset: DocumentPicker.DocumentPickerAsset) {
    setIsOcrLoading(true);
    try {
      const formData = new FormData();
      // "helloworld" é a chave gratuita. Limite de imagens até 1MB.
      formData.append('apikey', 'helloworld'); 
      formData.append('language', 'por');
      formData.append('file', {
        uri: asset.uri,
        name: asset.name || 'documento.jpg',
        type: asset.mimeType || 'image/jpeg',
      } as any);

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // NUNCA coloque 'Content-Type': 'multipart/form-data' manualmente no fetch do React Native
        },
      });

      const data = await response.json();

      // Proteção contra erros da própria API (ex: arquivo muito pesado)
      if (data.IsErroredOnProcessing) {
        console.log("Erro da API de OCR: ", data.ErrorMessage);
        Alert.alert('Aviso', 'Não foi possível ler esta imagem. Preencha os dados manualmente.');
        return;
      }

      if (data.ParsedResults && data.ParsedResults.length > 0) {
        const textoExtraido = data.ParsedResults[0].ParsedText || '';

        console.log("=== TEXTO BRUTO DO OCR ===");
        console.log(textoExtraido);
        console.log("==========================");

        if (!textoExtraido.trim()) {
           Alert.alert('Aviso', 'A imagem parece estar borrada ou em branco. Preencha manualmente.');
           return;
        }

        // REGEX SUPER PODEROSA: Cobre "CH: 40", "Carga horária de 20", "15 hrs", etc.
        const regexHoras = /(?:carga\s*hor[aá]ria|dura[cç][aã]o|total|ch|c\.h\.)\s*(?:de|:)?\s*(\d+)|(\d+)\s*(?:horas?|h\b|hrs|horas?\/aula)/i;
        const matchHoras = textoExtraido.match(regexHoras);

        if (matchHoras) {
          const horasEncontradas = matchHoras[1] || matchHoras[2];
          if (horasEncontradas) {
            setCargaHoraria(horasEncontradas);
          }
        }

        // TENTA DESCOBRIR O NOME DO CURSO OU PEGA A PRIMEIRA LINHA
        const textoLimpo = textoExtraido.replace(/\r?\n|\r/g, " "); // Tira quebras de linha
        const textoLower = textoLimpo.toLowerCase();
        
        if (textoLower.includes('java') || textoLower.includes('spring')) {
          setTitulo('Curso de Java/Spring Boot');
        } else if (textoLower.includes('react') || textoLower.includes('javascript') || textoLower.includes('front')) {
          setTitulo('Curso de Desenvolvimento Frontend');
        } else if (textoLower.includes('python') || textoLower.includes('dados') || textoLower.includes('data')) {
          setTitulo('Curso de Python / Análise de Dados');
        } else {
          // Fallback: Se não for curso de tech, pega as primeiras 40 letras limpas do certificado como título
          const possivelTitulo = textoLimpo.substring(0, 40).trim();
          if (possivelTitulo) {
            setTitulo(possivelTitulo);
          }
        }
      }
    } catch (error) {
      console.log('Falha na leitura do OCR:', error);
    } finally {
      setIsOcrLoading(false);
    }
  }

  async function tirarFoto() {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão necessária', 'É necessário permitir o acesso à câmera para capturar o certificado.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        const asset = result.assets[0];
        // Mapeamos a foto para o mesmo formato do DocumentPicker para manter a compatibilidade da API
        const file = {
          uri: asset.uri,
          name: asset.fileName || `foto_certificado_${Date.now()}.jpg`,
          mimeType: asset.mimeType || 'image/jpeg',
          size: asset.fileSize,
        } as DocumentPicker.DocumentPickerAsset;
        
        setArquivoSelecionado(file);
        await extrairDadosComOCR(file);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível acessar a câmera.');
    }
  }

  async function selecionarArquivo() {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/png', 'image/jpeg'],
        copyToCacheDirectory: true,
      });
      if (!resultado.canceled && resultado.assets?.length) {
        const file = resultado.assets[0];
        setArquivoSelecionado(file);
        // Dispara a extração de dados via OCR logo após selecionar o documento
        await extrairDadosComOCR(file);
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
        {(!arquivoSelecionado || isOcrLoading) ? (
          isOcrLoading ? (
            <View style={styles.step1Container}>
              <ActivityIndicator size={48} color="#004A8D" style={{ marginBottom: 16 }} />
              <Text style={styles.ocrLoadingTitle}>Lendo certificado...</Text>
              <Text style={styles.ocrLoadingSubtitle}>Nossa Inteligência Artificial está extraindo os dados do seu documento.</Text>
            </View>
          ) : (
            <View style={styles.step1Container}>
              <View style={styles.step1Header}>
                <MaterialIcons name="document-scanner" size={44} color="#F07C2B" />
                <Text style={styles.step1Title}>Anexar Certificado</Text>
                <Text style={styles.step1Subtitle}>
                  Para começar, tire uma foto ou selecione o arquivo do seu certificado. Tentaremos preencher os dados automaticamente!
                </Text>
              </View>

              <View style={styles.step1Buttons}>
                <Pressable style={styles.bigButtonCamera} onPress={tirarFoto}>
                  <MaterialIcons name="camera-alt" size={26} color="#FFFFFF" />
                  <Text style={styles.bigButtonCameraText}>Tirar Foto do Certificado</Text>
                </Pressable>

                <Pressable style={styles.bigButtonFile} onPress={selecionarArquivo}>
                  <MaterialIcons name="upload-file" size={26} color="#004A8D" />
                  <Text style={styles.bigButtonFileText}>Anexar PDF / Imagem</Text>
                </Pressable>
              </View>
            </View>
          )
        ) : (
          <>
            <Text style={styles.formTitle}>Revisar Dados</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Arquivo Anexado</Text>
              <View style={styles.fileInputRow}>
                <View style={styles.fileSelectedInfo}>
                  <MaterialIcons name="check-circle" size={20} color="#2F66F2" />
                  <Text style={styles.fileNameText} numberOfLines={1} ellipsizeMode="middle">
                    {arquivoSelecionado.name}
                  </Text>
                </View>
                <Pressable style={styles.changeFileButton} onPress={() => setArquivoSelecionado(null)}>
                  <Text style={styles.changeFileButtonText}>Trocar arquivo</Text>
                </Pressable>
              </View>
            </View>

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
          </>
        )}
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
  step1Container: { alignItems: 'center', paddingVertical: 24, gap: 24 },
  step1Header: { alignItems: 'center', gap: 8 },
  step1Title: { fontSize: 22, fontWeight: '800', color: '#10233F', textAlign: 'center' },
  step1Subtitle: { fontSize: 14, color: '#60748A', textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 },
  step1Buttons: { width: '100%', gap: 12 },
  bigButtonCamera: { backgroundColor: '#2F66F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, gap: 10 },
  bigButtonCameraText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  bigButtonFile: { backgroundColor: '#F4F7FC', borderWidth: 1, borderColor: '#DCE6F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, gap: 10 },
  bigButtonFileText: { color: '#004A8D', fontSize: 16, fontWeight: '800' },
  ocrLoadingTitle: { fontSize: 18, fontWeight: '800', color: '#10233F', textAlign: 'center' },
  ocrLoadingSubtitle: { fontSize: 14, color: '#60748A', textAlign: 'center', paddingHorizontal: 20 },
  fileSelectedInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  changeFileButton: { paddingHorizontal: 16, paddingVertical: 14, borderLeftWidth: 1, borderLeftColor: '#DCE6F0', backgroundColor: '#FFF5F0' },
  changeFileButtonText: { color: '#F07C2B', fontSize: 13, fontWeight: '800' },
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