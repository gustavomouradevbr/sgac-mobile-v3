export type AreaAtividade = 'ENSINO' | 'PESQUISA' | 'EXTENSAO' | 'CULTURA' | 'EVENTOS';
export type StatusSubmissao = 'PENDENTE' | 'APROVADA' | 'REPROVADA';

export interface Curso {
  id: number;
  nome: string;
  cargaHorariaMinima: number;
}

export interface RegraAtividade {
  id: number;
  cursoId: number;
  cursoNome: string;
  area: AreaAtividade;
  limiteHoras: number;
}

export interface SubmissaoResponse {
  id: number;
  alunoId: number;
  alunoNome: string;
  alunoEmail: string;
  cursoId: number;
  cursoNome: string;
  area: AreaAtividade;
  titulo: string;
  descricao: string;
  cargaHoraria: number;
  horasAprovadas: number | null;
  status: StatusSubmissao;
  certificadoUrl: string | null;
  nomeArquivoComprovante: string | null;
  resultadoOcr: string | null;
  dataSubmissao: string;
  dataAtividade: string;
}

export interface HorasAreaDTO {
  area: AreaAtividade;
  horasAprovadas: number;
  horasPendentes: number;
}

export interface AlunoProgressoDTO {
  totalAtividades: number;
  pendentes: number;
  aprovadas: number;
  reprovadas: number;
  horasAprovadas: number;
  cargaHorariaMinima: number;
  progressoPercentual: number;
  totalHorasAprovadas: number;
  totalHorasPendentes: number;
  percentualConcluido: number;
  horasPorArea: HorasAreaDTO[];
}