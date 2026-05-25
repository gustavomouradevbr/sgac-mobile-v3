 # Bem-vindo ao SGAC Mobile V3

Este é o aplicativo mobile do Sistema de Gestão Acadêmica (SGAC), desenvolvido com **React Native** e **Expo**. O projeto utiliza roteamento baseado em arquivos através do `expo-router`.

---

## 📋 Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas na sua máquina:

* **[Node.js](https://nodejs.org/)**: Recomendado utilizar a versão 18 ou superior.
* **[Git](https://git-scm.com/)**: Para clonar o repositório do projeto.
* **Expo Go**: Aplicativo instalado no seu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/br/app/expo-go/id982107779)) para testar o app fisicamente, **OU** um emulador configurado no seu computador.

---

## 🚀 Como baixar e executar o projeto

Siga o passo a passo abaixo para rodar o projeto localmente:

**1. Clone o repositório**
Abra o terminal e execute o comando abaixo para baixar o código:
```bash
git clone [https://github.com/gustavomouradevbr/sgac-mobile-v3.git](https://github.com/gustavomouradevbr/sgac-mobile-v3.git)

```

**2. Acesse a pasta do projeto**

```bash
cd sgac-mobile-v3

```

**3. Instale as dependências**

```bash
npm install

```

**4. Inicie o servidor de desenvolvimento**

```bash
npx expo start

```

Após iniciar, um **QR Code** aparecerá no seu terminal.

* Se estiver usando o celular, abra o aplicativo **Expo Go** e escaneie o QR Code.
* Se estiver no computador, pressione `a` no terminal para abrir no emulador Android ou `i` para abrir no simulador iOS.

---

## 🛠️ Comandos Disponíveis

O projeto possui alguns scripts úteis configurados. No terminal, você pode rodar:

* `npm start`: Inicia o empacotador Metro (equivalente ao `npx expo start`).
* `npm run android`: Inicia o projeto forçando a abertura no emulador Android.
* `npm run ios`: Inicia o projeto forçando a abertura no simulador iOS.
* `npm run lint`: Executa a verificação de erros no código (ESLint).
* `npm run reset-project`: Reseta a estrutura do projeto, movendo o código inicial de exemplo para uma pasta separada e criando um diretório `app` limpo.

---

## 📁 Sobre a Navegação

Este projeto utiliza o **Expo Router**. A navegação funciona baseada em arquivos. Toda a estrutura de telas e rotas do aplicativo deve ser mantida dentro da pasta `app/` para que o roteamento funcione corretamente.

```

```
