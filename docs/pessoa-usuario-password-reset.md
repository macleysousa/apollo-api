# Redefinição de Senha - Pessoa Usuário

Esta documentação explica como utilizar a funcionalidade de redefinição de senha para usuários do módulo pessoa-usuario, que utiliza autenticação via Keycloak.

## Funcionalidades Implementadas

### 1. Esqueci minha senha (`POST /pessoas-usuarios/esqueci-senha`)
- **Descrição**: Envia um e-mail com instruções para redefinir a senha através do Keycloak
- **Acesso**: Público (não requer autenticação)
- **Validações**:
  - E-mail deve ter formato válido
  - E-mail deve existir na base de dados

**Exemplo de requisição:**
```json
{
  "email": "usuario@example.com"
}
```

### 2. Solicitar código de redefinição (`POST /pessoas-usuarios/solicitar-codigo-reset`)
- **Descrição**: Gera um código de 6 dígitos válido por 15 minutos para redefinir senha
- **Acesso**: Público (não requer autenticação)
- **Validações**:
  - E-mail deve ter formato válido
  - E-mail deve existir na base de dados

**Exemplo de requisição:**
```json
{
  "email": "usuario@example.com"
}
```

**Exemplo de resposta (desenvolvimento):**
```json
{
  "sucesso": true,
  "mensagem": "Código de redefinição gerado com sucesso",
  "codigo": "123456"
}
```

### 3. Redefinir senha com código (`POST /pessoas-usuarios/redefinir-senha-com-codigo`)
- **Descrição**: Redefine a senha usando código de 6 dígitos
- **Acesso**: Público (não requer autenticação)
- **Validações**:
  - Código deve ter exatamente 6 dígitos
  - Código deve estar válido e não expirado
  - Nova senha deve ter no mínimo 8 caracteres

**Exemplo de requisição:**
```json
{
  "codigo": "123456",
  "novaSenha": "MinhaNovaSenh@123"
}
```

### 4. Alterar senha (usuário logado) (`PUT /pessoas-usuarios/alterar-senha`)
- **Descrição**: Permite ao usuário logado alterar sua própria senha
- **Acesso**: Requer autenticação (usuário deve estar logado)
- **Validações**:
  - Senha atual deve estar correta
  - Nova senha deve ter no mínimo 8 caracteres

**Exemplo de requisição:**
```json
{
  "senhaAtual": "MinhaSenh@Atual123",
  "novaSenha": "MinhaNovaSenh@123"
}
```

**Exemplo de resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Senha alterada com sucesso"
}
```## Integração com Keycloak

A funcionalidade utiliza os seguintes métodos do KeycloakService:

### `sendResetPasswordEmail(email: string)`
- Busca o usuário por e-mail no Keycloak
- Envia e-mail com ações de redefinição de senha
- Utiliza o mecanismo nativo do Keycloak para reset de senha

### `generateResetPasswordToken(email: string): Promise<string>`
- Busca o usuário por e-mail no Keycloak
- Gera código de 6 dígitos aleatório
- Armazena código no cache por 15 minutos com dados do usuário
- Retorna o código gerado

### `validateResetPasswordToken(token: string): Promise<{email, userId} | null>`
- Valida se código existe no cache
- Verifica se código não expirou (15 minutos)
- Retorna dados do usuário se válido, null se inválido/expirado

### `resetPasswordWithToken(token: string, newPassword: string): Promise<void>`
- Valida o token de reset
- Redefine senha no Keycloak se token válido
- Invalida o token após uso
- Lança exceção se token inválido/expirado

### `login(email: string, password: string)`
- Valida credenciais do usuário no Keycloak
- Usado para verificar senha atual antes de alterar

## Fluxos de Uso

### Fluxo 1: Reset por E-mail (Para usuário que esqueceu a senha)
1. Usuário solicita reset via `POST /pessoas-usuarios/esqueci-senha`
2. Sistema envia e-mail através do Keycloak
3. Usuário clica no link do e-mail e redefine senha no Keycloak
4. Usuário faz login com nova senha

### Fluxo 2: Reset com Código (Mais controlado)
1. Usuário solicita código via `POST /pessoas-usuarios/solicitar-codigo-reset`
2. Sistema gera código de 6 dígitos válido por 15 minutos
3. Código é enviado por e-mail/SMS (em produção) ou retornado (desenvolvimento)
4. Usuário usa `POST /pessoas-usuarios/redefinir-senha-com-codigo` com código + nova senha
5. Sistema valida código, redefine senha e invalida o código

### Fluxo 3: Alteração de Senha (Para usuário logado)
1. Usuário logado chama `PUT /pessoas-usuarios/alterar-senha`
2. Sistema valida a senha atual via Keycloak
3. Se válida, sistema redefine para a nova senha
4. Usuário continua usando a aplicação com a nova senha

## Tratamento de Erros

### Erros de Validação
- E-mail inválido: Retornado pelo validation pipe do NestJS
- Senha muito curta: Retornado pelo validation pipe do NestJS

### Erros de Negócio
- E-mail não encontrado (esqueci-senha): `{ "sucesso": false, "mensagem": "E-mail não encontrado" }`
- Senha atual incorreta (alterar-senha): `{ "sucesso": false, "mensagem": "Senha atual incorreta" }`
- Erro no Keycloak: `{ "sucesso": false, "mensagem": "Erro ao enviar e-mail de redefinição de senha" }`

## Segurança - CORREÇÃO IMPORTANTE

### ⚠️ Vulnerabilidade Corrigida
**ANTES**: O endpoint `POST /pessoas-usuarios/redefinir-senha` estava público, permitindo que qualquer pessoa com o e-mail de um usuário alterasse sua senha.

**DEPOIS**:
- Removido endpoint público de redefinição direta
- Implementado `PUT /pessoas-usuarios/alterar-senha` que requer autenticação
- Usuário deve estar logado e informar senha atual para alterar

### Fluxo Seguro Implementado
1. **Para usuário que esqueceu**: Usar `esqueci-senha` → link por e-mail → reset no Keycloak
2. **Para usuário logado**: Usar `alterar-senha` → validar senha atual → definir nova senha

## Configuração Necessária

### Variáveis de Ambiente
- `KEYCLOAK_CLIENT_ID`: ID do cliente no Keycloak
- `KEYCLOAK_CLIENT_SECRET`: Secret do cliente
- `KEYCLOAK_REALM`: Nome do realm
- `KEYCLOAK_URL`: URL base do Keycloak

### Permissões no Keycloak
O cliente deve ter as seguintes permissões no Keycloak:
- `manage-users`: Para buscar usuários e redefinir senhas
- `manage-clients`: Para operações administrativas

## Segurança

### Considerações Importantes
1. **Rate Limiting**: Considere implementar rate limiting para evitar abuso
2. **Logs**: Todas as operações são logadas para auditoria
3. **Validação de E-mail**: Sistema verifica se e-mail existe antes de processar
4. **Timeouts**: Operações têm timeout para evitar travamentos

### Endpoints Públicos vs Autenticados
**Público** (`@IsPublic()`):
- `POST /pessoas-usuarios/esqueci-senha`: Usuário não consegue se autenticar (esqueceu senha)

**Autenticado** (requer token):
- `PUT /pessoas-usuarios/alterar-senha`: Usuário está logado e quer trocar senha

### Validações de Segurança
1. **Esqueci senha**: Apenas verifica se e-mail existe, não expõe informações
2. **Alterar senha**: Valida senha atual via login no Keycloak antes de alterar
3. **Rate limiting**: Recomendado implementar para ambos endpoints
4. **Logs de auditoria**: Todas operações são logadas

## Testes

### Testes Unitários
- Cenários de sucesso e erro para ambas as funcionalidades
- Mocks do KeycloakService e Repository
- Validação de chamadas corretas aos serviços externos

### Testes Manuais
- Arquivo `examples/pessoa-usuario-password-reset.http` contém exemplos de uso
- Testes podem ser executados via REST Client ou Postman

## Monitoramento

### Métricas Importantes
- Taxa de sucesso/erro dos resets de senha
- Tempo de resposta das operações
- Frequência de uso por usuário (para detectar abuso)

### Logs Recomendados
- Tentativas de reset (sucesso/erro)
- E-mails enviados
- Senhas redefinidas
- Erros de integração com Keycloak