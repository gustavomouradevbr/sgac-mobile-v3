# SGAC Mobile V3

App do Sistema de Gestão Acadêmica desenvolvido com **React Native**, **Expo** e `expo-router`.

## Como rodar o projeto

**Requisitos:** Node.js 18+ e o app **Expo Go** no celular (ou um emulador configurado).

No terminal, execute:

```bash
# 1. Baixe o projeto e acesse a pasta
git clone https://github.com/gustavomouradevbr/sgac-mobile-v3

# 2. Acesse a pasta
cd sgac-mobile-v3

# 3. Istale as bibliotecas
npx expo install @react-native-picker/picker @react-native-community/datetimepicker expo-document-picker

# 4. Instale as dependências
npm install

# 5. Inicie o servidor
npx expo start

```

Após iniciar, **escaneie o QR Code** com o aplicativo Expo Go no seu celular. Se estiver usando emulador no computador, pressione `a` (Android) ou `i` (iOS) no terminal.

---

## Atalhos Úteis

* `npm run android` ou `npm run ios`: Inicia forçando a abertura no emulador.
* `npm run reset-project`: Limpa os arquivos de exemplo e cria uma pasta de rotas vazia.

**📌 Nota:** Toda a navegação do app é baseada em arquivos e fica dentro da pasta `app/`.
