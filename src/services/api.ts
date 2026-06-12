import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
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
  if (Platform.OS === 'android' && !uploadUri.startsWith('file://')) {
    uploadUri = `file://${uploadUri}`;
  }

  // Prepara o objeto JSON que o Spring Boot exige
  const dados = JSON.stringify({
    alunoId: Number(alunoId),
    cursoId,
    titulo,
    descricao,
    area,
    cargaHoraria,
    dataAtividade,
  });

  try {
    // Usamos a função nativa de upload do Expo File System
    const uploadTask = await FileSystem.uploadAsync(url, uploadUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'arquivo', // O nome do ficheiro (MultipartFile arquivo) no Spring Boot
      mimeType: mimeType,
      headers: {
        Authorization: authHeader || '',
      },
      parameters: {
        // Envia o JSON como um campo de texto no formulário (o Spring Boot com @RequestPart aceita isto se o conversor JSON estiver bem configurado)
        dados: dados,
      },
    });

    if (uploadTask.status === 200 || uploadTask.status === 201) {
      return JSON.parse(uploadTask.body);
    } else {
      let msg = `O Servidor recusou (Erro ${uploadTask.status}).`;
      try {
        const body = JSON.parse(uploadTask.body);
        if (body?.erro) msg = body.erro;
        else if (body?.message) msg = body.message;
      } catch {}
      throw new Error(msg);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Falha ao conectar com o servidor.');
  }
}