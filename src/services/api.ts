import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export const BASE_URL = 'https://api-sgac-gustavo.onrender.com';

export async function getAuthHeader(): Promise<string | null> {
  return AsyncStorage.getItem('authHeader');
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const authHeader = await getAuthHeader();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Erro ${response.status}`;
    try {
      const body = await response.json();
      if (body?.erro) errorMsg = body.erro;
      else if (body?.message) errorMsg = body.message;
    } catch {
      // mantém mensagem padrão
    }
    throw new Error(errorMsg);
  }

  return response.json() as Promise<T>;
}

export async function uploadAtividadeMultipart(
  alunoId: string,
  cursoId: number,
  titulo: string,
  descricao: string,
  area: string,
  cargaHoraria: number,
  dataAtividade: string,
  fileUri: string,
  fileName: string,
  mimeType: string
): Promise<any> {
  const authHeader = await getAuthHeader();
  const url = `${BASE_URL}/api/submissoes`;

  // Corrige a URI do ficheiro para o Android
  let uploadUri = fileUri;
  if (Platform.OS === 'android' && !uploadUri.startsWith('file://') && !uploadUri.startsWith('content://')) {
    uploadUri = `file://${uploadUri}`;
  }

  // Prepara o objeto JSON mapeando o nome das variáveis como o Spring Boot espera
  const dadosObj = {
    alunoId: Number(alunoId),
    cursoId,
    titulo,
    descricao,
    area,
    cargaHoraria, // <-- Voltamos para 'cargaHoraria', pois é o que o DTO do Spring Boot realmente exige no JSON
    dataAtividade,
  };

  // RN Bug Fix: Misturar Blob (memória) e URIs (disco) no mesmo FormData
  // causa "Network request failed" no Android. A solução é salvar o JSON no disco temporariamente.
  const jsonUri = FileSystem.cacheDirectory + 'dados.json';
  await FileSystem.writeAsStringAsync(jsonUri, JSON.stringify(dadosObj));
  
  let jsonUploadUri = jsonUri;
  if (Platform.OS === 'android' && !jsonUploadUri.startsWith('file://')) {
    jsonUploadUri = `file://${jsonUploadUri}`;
  }

  const formData = new FormData();

  formData.append('dados', {
    uri: jsonUploadUri,
    name: 'dados.json',
    type: 'application/json'
  } as any);

  formData.append('arquivo', {
    uri: uploadUri,
    name: fileName,
    type: mimeType,
  } as any);

  try {
    // Voltamos ao fetch nativo. No Expo SDK moderno, ele não falha a rede se a URI estiver correta.
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader ?? '',
        'Accept': 'application/json',
        // ATENÇÃO: Nunca defina manualmente o 'Content-Type': 'multipart/form-data' no fetch do RN
      },
      body: formData,
    });

    if (response.ok) {
      return await response.json();
    } else {
      let msg = `O Servidor recusou (Erro ${response.status}).`;
      try {
        const body = await response.json();
        if (body?.erro) msg = body.erro;
        else if (body?.message) msg = body.message;
      } catch {}
      throw new Error(msg);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Falha ao conectar com o servidor.');
  }
}