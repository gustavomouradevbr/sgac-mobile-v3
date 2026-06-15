<div align="center">
  
# 🎓 SGAC Mobile V3
**Sistema de Gestão de Atividades Complementares**

Um aplicativo desenvolvido com **React Native** e **Expo** para facilitar o envio, a validação e o acompanhamento de horas complementares por estudantes universitários.

</div>

---

## ✨ Principais Funcionalidades

- 📊 **Dashboard Interativo:** Visão geral rápida do progresso do aluno, total de horas obrigatórias e status das atividades (Aprovadas, Pendentes e Reprovadas).
- 📸 **Extração Inteligente com IA (OCR):** Envie uma foto ou PDF do certificado e nossa integração extrai automaticamente o título do curso e a carga horária usando a API do OCR.Space.
- 📤 **Submissão de Documentos:** Suporte total para upload de imagens (Câmera ou Galeria) e documentos via formulário *multipart*.
- 📁 **Histórico de Submissões:** Acompanhe detalhadamente o status de cada atividade enviada na aba "Minhas Atividades".
- 📖 **Regras Dinâmicas por Curso:** Visualização clara dos limites de horas estabelecidos para cada categoria (Ensino, Pesquisa, Extensão, Cultura, etc.).
- 📱 **Layout Responsivo e Adaptativo:** Navegação fluida que se adapta perfeitamente tanto em smartphones (menu hambúrguer) quanto em telas maiores/desktop (sidebar lateral).

## 🚀 Tecnologias Utilizadas

- **React Native** + **Expo**
- **Expo Router** (Navegação moderna baseada em arquivos)
- **TypeScript** (Tipagem forte e prevenção de erros em tempo de desenvolvimento)
- **Context API** (Gerenciamento de estado de Atividades e Cursos)
- **OCR.Space** (Inteligência Artificial para leitura inteligente de certificados)
- **AsyncStorage** (Persistência local dos dados da sessão do aluno)

## 🛠️ Como rodar o projeto localmente

### 📋 Pré-requisitos
- Node.js (versão 18 ou superior)
- App **Expo Go** instalado no seu smartphone (Android/iOS) ou um Emulador devidamente configurado no seu computador.

### 💻 Passo a Passo

No seu terminal, execute os comandos abaixo:

```bash
# 1. Clone este repositório e acesse a pasta do projeto
git clone https://github.com/gustavomouradevbr/sgac-mobile-v3.git
cd sgac-mobile-v3

# 2. Instale todas as dependências do projeto
npm install

# 3. Instale/atualize as bibliotecas nativas via Expo para evitar conflitos
npx expo install @react-native-picker/picker @react-native-community/datetimepicker expo-document-picker expo-image-picker

# 4. Inicie o servidor do Expo
npx expo start
```

Ao iniciar o servidor, um **QR Code** será exibido no seu terminal.
- **No Celular:** Abra o app **Expo Go** e escaneie o QR Code.
- **No Emulador:** Pressione `a` para rodar no emulador Android ou `i` para o simulador iOS diretamente pelo terminal.

---

## 📂 Estrutura de Navegação (`app/dashboard/`)

A navegação do aplicativo utiliza a arquitetura de roteamento por arquivos:
- `/dashboard`: Painel inicial (Métricas de progresso e total de horas).
- `/dashboard/adicionar`: Formulário avançado de submissão de certificados (com leitura via IA).
- `/dashboard/minhas-atividades`: Lista contendo todo o histórico de atividades enviadas.
- `/dashboard/regras-do-curso`: Lista e detalhamento dos limites de carga horária exigidos pelo curso.

## ⚡ Atalhos Úteis no Terminal

Durante o desenvolvimento com o servidor Expo rodando:
* `r`: Recarrega o aplicativo (*Reload*).
* `m`: Abre o menu nativo de desenvolvedor.
* `npm run android` / `npm run ios`: Scripts de atalho para forçar a abertura nos emuladores.

---
<div align="center">
  <i>Desenvolvido com 💙 para modernizar a gestão acadêmica.</i>
</div>
