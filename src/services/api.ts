import AsyncStorage from '@react-native-async-storage/async-storage';

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
      // Mantém a mensagem padrão quando a resposta não é JSON.
    }
    throw new Error(errorMsg);
  }

  return response.json() as Promise<T>;
}

export async function apiFetchMultipart<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const authHeader = await getAuthHeader();
  
  // A magia está aqui: criamos um objeto headers VAZIO
  // O React Native vai automaticamente injetar o 'Content-Type: multipart/form-data; boundary=...'
  const headers: Record<string, string> = {};
  
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = `Erro ${response.status}`;
    try {
      const body = await response.json();
      if (body?.erro) errorMsg = body.erro;
      else if (body?.message) errorMsg = body.message;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json() as Promise<T>;
}