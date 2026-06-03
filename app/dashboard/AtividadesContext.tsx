// Importa recursos do React
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// Define os status possíveis
export type StatusAtividade = 'PENDENTE' | 'APROVADA' | 'REPROVADA';

// Define como uma atividade é salva
export type AtividadeAluno = {
  id: string; // ID único
  curso: string; // Curso escolhido
  area: string; // Área escolhida
  titulo: string; // Título da atividade
  cargaHoraria: number; // Quantidade de horas
  dataAtividade: string; // Data da atividade
  descricao: string; // Descrição digitada
  comprovanteNome: string; // Nome do arquivo
  status: StatusAtividade; // Status da atividade
  dataEnvio: string; // Data do envio
};

// Dados que vêm do formulário
type NovaAtividade = Omit<AtividadeAluno, 'id' | 'status' | 'dataEnvio'>;

// Tipo do Context
type AtividadesContextValue = {
  atividades: AtividadeAluno[]; // Lista de atividades
  adicionarAtividade: (atividade: NovaAtividade) => AtividadeAluno; // Adiciona atividade
};

// Cria o Context
const AtividadesContext = createContext<AtividadesContextValue | null>(null);

// Guarda as atividades fora do Provider
// Isso evita perder os dados quando a tela recarrega/remonta
let atividadesSalvas: AtividadeAluno[] = [];

// Provider das atividades
export function AtividadesProvider({ children }: { children: ReactNode }) {
  // Começa usando as atividades que já estavam salvas na memória
  const [atividades, setAtividades] = useState<AtividadeAluno[]>(atividadesSalvas);

  const value = useMemo<AtividadesContextValue>(() => {
    // Função para adicionar uma nova atividade
    function adicionarAtividade(atividade: NovaAtividade) {
      // Cria uma atividade completa
      const novaAtividade: AtividadeAluno = {
        ...atividade,
        id: String(Date.now()),
        status: 'PENDENTE',
        dataEnvio: new Date().toISOString(),
      };

      // Atualiza a memória externa
      atividadesSalvas = [novaAtividade, ...atividadesSalvas];

      // Atualiza a tela
      setAtividades(atividadesSalvas);

      // Mostra no terminal para confirmar
      console.log('Atividade salva:', novaAtividade);
      console.log('Lista atual:', atividadesSalvas);

      return novaAtividade;
    }

    return {
      atividades,
      adicionarAtividade,
    };
  }, [atividades]);

  return (
    <AtividadesContext.Provider value={value}>
      {children}
    </AtividadesContext.Provider>
  );
}

// Hook para usar as atividades nas telas
export function useAtividades() {
  const context = useContext(AtividadesContext);

  if (!context) {
    throw new Error('useAtividades precisa ser usado dentro de AtividadesProvider');
  }

  return context;
}