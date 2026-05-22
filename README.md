 # Bem-vindo ao app Expo 👋

 Este é um projeto criado com [Expo](https://expo.dev) usando `create-expo-app`.

 ## Começando (Guia rápido)

 1. Instale as dependências

    ```bash
    npm install
    ```

 2. Inicie o projeto (recomendado via npx)

    ```bash
    npx expo start
    ```

 Após iniciar, o terminal exibirá opções para abrir o app em:

 - Emulador Android
 - Simulador iOS (macOS)
 - Expo Go (Android/iOS)
 - Navegador (web)

 Você pode começar a desenvolver editando os arquivos dentro da pasta **app/**. Este projeto usa roteamento baseado em arquivos (file-based routing) via `expo-router`.

 ## Reiniciar o projeto (opcional)

 Para resetar o projeto e obter uma base limpa, execute:

 ```bash
 npm run reset-project
 ```

 Esse comando moverá o código inicial para a pasta **app-example** e criará uma pasta **app** vazia para você começar.

 ## Instruções detalhadas (Português)

 **Pré-requisitos**
 - Node.js (recomendado v18+)
 - npm (ou yarn)
 - Expo Go no celular (Android/iOS) ou emulador configurado

 **Instalar dependências**
 ```bash
 npm install
 ```

 **Iniciar o bundler com limpeza de cache**
 ```bash
 npx expo start -c
 ```

 - Se a porta padrão (8081) estiver ocupada, o bundler perguntará outra porta (aceite `Y`).
 - Escaneie o QR code no terminal com o Expo Go (Android) ou com a câmera no iOS.
 - Se houver problemas de rede, inicie com túnel:
 ```bash
 npx expo start --tunnel
 ```

 **Rodando no dispositivo**
 1. Certifique-se que PC e celular estejam na mesma rede Wi‑Fi.
 2. Abra o Expo Go no celular.
 3. Escaneie o QR code mostrado no terminal que executou `npx expo start`.

 **Comandos úteis**
 - `npx expo start` — inicia o bundler (recomendado sem instalar o expo globalmente)
 - `npx expo start -c` — inicia limpando o cache
 - `npx expo start --tunnel` — força conexão via túnel quando rede local bloqueia
 - `npx expo start --android` — abre no dispositivo/emulador Android
 - `npx expo start --ios` — abre no simulador iOS (macOS)

 **Instalar CLI global (opcional)**
 Se preferir, instale a CLI global do Expo:
 ```bash
 npm install -g expo-cli
 expo start
 ```

 **Dependências opcionais**
 - Se o código usar `expo-linear-gradient`, instale com:
 ```bash
 npx expo install expo-linear-gradient
 ```

 **Solução de problemas comuns**
 - `expo` não encontrado no PowerShell/Terminal: use `npx expo ...` sem instalar globalmente.
 - Tela azul/erro no Expo Go: verifique o log no terminal do Metro (erro de compilação), limpe cache com `-c` e reinicie.
 - Porta ocupada: aceite trocar a porta ou finalize o processo que usa a porta 8081.

 ## Sobre navegação
 Este projeto usa `expo-router` (veja `package.json` -> `main: expo-router/entry`). Mantenha a pasta `app/` com arquivos de rotas para que a navegação funcione corretamente.

 ## Aprenda mais
 - Documentação do Expo: https://docs.expo.dev/
 - Tutorial do Expo: https://docs.expo.dev/tutorial/introduction/

 ## Comunidade
 - Expo no GitHub: https://github.com/expo/expo
 - Comunidade (Discord): https://chat.expo.dev

---

## Guia rápido (Português)

**Pré-requisitos**
- Node.js (recomenda-se v18+)
- npm (ou yarn)
- Um celular com Expo Go (Android/iOS) ou emulador configurado

**Instalar dependências**
```bash
npm install
```

**Iniciar o projeto (recomendado sem instalar expo global)**
```bash
npx expo start -c
```

Isso abre o Metro Bundler no terminal e mostra um QR code. Dicas:
- Escaneie o QR com o Expo Go (Android) ou com a câmera (iOS).
- Se a rede local tiver problemas, inicie com túnel:
```bash
npx expo start --tunnel
```

**Comandos úteis**
- Iniciar Android conectado: `npx expo start --android` (ou pressione `a` no terminal)
- Iniciar iOS (macOS): `npx expo start --ios` (ou pressione `i`)
- Limpar cache: `npx expo start -c`

**Se quiser instalar a CLI global (opcional)**
```bash
npm install -g expo-cli
expo start
```

**Problemas comuns**
- Porta ocupada: o bundler pergunta outra porta (aceite `Y`) ou mate o processo que usa 8081.
- `expo` não encontrado: use `npx expo ...` sem instalar globalmente.
- Erro após abrir no celular (tela "Something went wrong"): abra o log do Metro no terminal para ver o erro, limpe cache com `-c` e tente novamente.

**Dependências opcionais**
- Se o seu código usar `expo-linear-gradient`, instale com:
```bash
npx expo install expo-linear-gradient
```

**Sobre navegação**
- Este projeto usa `expo-router` (rota padrão definida em `package.json` -> `main: expo-router/entry`). Mantenha a pasta `app/` com arquivos de rotas para que a navegação funcione.

Se quiser, eu atualizo este README com passos para gerar um build de desenvolvimento ou criar uma imagem de fundo gradiente para usar sem dependências. Quer que eu adicione essas instruções? 
