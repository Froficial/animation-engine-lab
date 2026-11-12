# Auditoria do recorte público — 12/11/2026

Escopo: 23 arquivos textuais dos diretórios packages/animation-contract, packages/character-rig e experiments/remotion-poc. Extração por lista permitida, sem importar histórico Git.

## Revisão

Imports limitados aos dois pacotes locais, componentes do experimento, Node test/assert, React, Remotion e Vite. As composições usam formas SVG descritas no código; nenhum asset binário externo foi incluído. Revisão textual e busca por credenciais, tokens, senhas, chamadas de rede e caminhos pessoais não identificaram segredos nesse recorte. Isso não constitui auditoria integral do produto privado nem comprovação jurídica de autoria.

Excluídos: backend, banco, frontend do produto, .env, integrações IA/TTS, uploads, mídia de usuário, assets do kit, documentos internos e histórico de commits. O novo repositório não usa tokens para buscar o projeto privado.

## Verificação

24 testes de lógica executados com sucesso no ambiente de preparação. Build e MP4s precisam também passar pelo workflow público; consulte o resultado de cada execução, sem inferir aprovação artística apenas de um job verde.

## Pipeline

Actions oficiais fixadas por SHA, token com contents:read, runner padrão Ubuntu, limite de 30 minutos, cancelamento de execuções substituídas e artefatos por 3 dias. Dependências npm travadas em package-lock.json, com URLs públicas registry.npmjs.org. Sem secrets, deploy ou serviços pagos configurados.

Publicar este laboratório não altera a visibilidade nem publica o restante do produto. Novos arquivos devem ser revisados antes de inclusão; não sincronizar o repositório privado inteiro.
