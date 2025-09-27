# Copilot Instructions - Apollo API

Este documento contém instruções específicas para desenvolvimento no projeto Apollo API, um sistema de gestão empresarial construído com NestJS.

## 📋 Visão Geral do Projeto

- **Framework**: NestJS (TypeScript)
- **Banco de dados**: MySQL com TypeORM
- **Arquitetura**: Modular com guards, interceptors e decorators customizados
- **Autenticação**: JWT com Keycloak
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest

## 🏗️ Arquitetura e Padrões

### Estrutura de Módulos
O projeto segue uma estrutura modular onde cada funcionalidade de negócio é organizada em módulos separados:
```
src/modules/[modulo]/
├── dto/              # Data Transfer Objects
├── entities/         # Entidades TypeORM
├── [modulo].controller.ts
├── [modulo].service.ts
├── [modulo].module.ts
└── includes/         # Tipos para relacionamentos (quando aplicável)
```

### Convenções de Nomenclatura

#### Arquivos e Classes
- **Entities**: `[Nome]Entity` (ex: `EmpresaEntity`, `UsuarioEntity`)
- **DTOs**:
  - Criação: `Create[Nome]Dto`
  - Atualização: `Update[Nome]Dto`
  - Outros: `[Funcionalidade][Nome]Dto`
- **Controllers**: `[Nome]Controller`
- **Services**: `[Nome]Service`
- **Guards**: `[Nome]Guard`
- **Validações**: `Is[Nome]` ou `Is[Nome]Valid`

#### Banco de Dados
- **Tabelas**: Plural em português (ex: `empresas`, `usuarios`, `produtos`)
- **Colunas**: camelCase em português (ex: `nomeFantasia`, `criadoEm`)
- **Relacionamentos**: Usar IDs com sufixo `Id` (ex: `empresaId`, `usuarioId`)

## 🔒 Sistema de Autenticação e Autorização

### Decorators de Segurança

#### @ApiComponent
```typescript
@ApiComponent('CODIGO', 'Descrição da funcionalidade')
```
- Usado para controle de acesso por componente
- Código único no formato: `[MODULO][FM][000]`
- Exemplos: `ADMFM001`, `PESFM001`, `FUNFM001`

#### @ApiEmpresaAuth
```typescript
@ApiEmpresaAuth()
```
- Exige que o usuário esteja logado em uma empresa específica
- Usado em controllers que operam no contexto de uma empresa

#### @Roles
```typescript
@Roles(Role.sysadmin, Role.administrador)
```
- Controla acesso por tipo de usuário
- Tipos disponíveis: `sysadmin`, `administrador`, `operador`

#### @IsPublic
```typescript
@IsPublic()
```
- Permite acesso público (sem autenticação)

### Guards Disponíveis
1. **JwtAuthGuard**: Valida token JWT
2. **RolesGuard**: Valida roles do usuário
3. **ComponentGuard**: Valida acesso ao componente
4. **EmpresaAuthGuard**: Valida contexto da empresa
5. **PessoaGuard**: Valida acesso específico à pessoa

## 📊 Entidades e Base Classes

### BaseEntity
Todas as entidades devem estender `BaseEntity` que fornece:
```typescript
export class BaseEntity {
  criadoEm?: Date;
  atualizadoEm?: Date;
}
```

### Padrão de Entidade
```typescript
@Entity({ name: 'tabela_nome' })
export class ExemploEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  // Relacionamentos
  @OneToMany(() => RelacionadaEntity, item => item.exemplo)
  items: RelacionadaEntity[];
}
```

## ✅ Validações Customizadas

### Validações Disponíveis
O projeto possui várias validações customizadas em `src/commons/validations/`:

#### Validações de Negócio
- `@IsEmpresa()`: Valida se empresa existe
- `@IsPessoa()`: Valida se pessoa existe
- `@IsFuncionario()`: Valida se funcionário existe
- `@IsProduto()`: Valida se produto existe
- `@IsRomaneio()`: Valida romaneio com opções de situação/modalidade
- `@IsCaixa()`: Valida caixa com validações de acesso e situação

#### Validações de Formato
- `@IsCnpjValid()`: Valida CNPJ brasileiro
- `@IsValidDocument()`: Valida CPF ou CNPJ
- `@IsBetween(min, max)`: Valida valor numérico entre limites

### Padrão para Novas Validações
```typescript
@Injectable()
@ValidatorConstraint({ async: true })
export class MinhaNomeConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: MinhaService) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    // Lógica de validação
    return true;
  }

  defaultMessage(_args?: ValidationArguments): string {
    return 'Mensagem de erro padrão';
  }
}

export const IsMinhaValidacao = (options?: any, validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: MinhaNomeConstraint,
    });
  };
};
```

## 🎮 Controllers

### Padrão de Controller
```typescript
@ApiTags('Nome do Módulo')
@Controller('rota-base')
@ApiBearerAuth()
@ApiEmpresaAuth() // Se necessário contexto da empresa
@ApiComponent('CODIGO', 'Descrição')
export class ExemploController {
  constructor(private readonly service: ExemploService) {}

  @Post()
  @ApiResponse({ type: ExemploEntity, status: 201 })
  @Roles(Role.administrador) // Se necessário
  async create(@Body() dto: CreateExemploDto): Promise<ExemploEntity> {
    return this.service.create(dto);
  }

  @Get()
  @ApiResponse({ type: [ExemploEntity], status: 200 })
  @ApiQuery({ name: 'filter', required: false })
  async find(@Query('filter') filter?: string): Promise<ExemploEntity[]> {
    return this.service.find(filter);
  }
}
```

### Decorators de Parâmetros
- `@CurrentUser()`: Obtém usuário autenticado
- `@CurrentBranch()`: Obtém empresa do contexto
- `@CurrentAuth()`: Obtém objeto completo de autenticação

## 📦 DTOs

### Padrão de DTO
```typescript
export class CreateExemploDto {
  @ApiProperty()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBetween(1, 999)
  valor?: number;

  @ApiProperty({ enum: MinhaEnum, default: MinhaEnum.Padrao, required: false })
  @IsOptional()
  @IsEnum(MinhaEnum)
  tipo?: MinhaEnum;
}
```

## 🔄 Services

### Padrão de Service
```typescript
@Injectable()
export class ExemploService {
  constructor(
    @InjectRepository(ExemploEntity)
    private readonly repository: Repository<ExemploEntity>,
  ) {}

  async create(dto: CreateExemploDto): Promise<ExemploEntity> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<ExemploEntity> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Exemplo com ID ${id} não encontrado`);
    }
    return entity;
  }
}
```

## 📋 Scripts e Comandos

### Comandos NPM Customizados
```bash
# Geração de código
npm run module:create nome        # Criar módulo
npm run controller:create nome    # Criar controller
npm run service:create nome       # Criar service
npm run crud nome                 # Criar resource completo

# Migrations
npm run mg:create -- nome         # Criar migration
npm run mg:run                    # Executar migrations
npm run mg:revert                 # Reverter migration

# Desenvolvimento
npm run start:dev                 # Modo desenvolvimento
npm run test                      # Executar testes
npm run format                    # Formatar código
```

## 🏷️ Enums e Constantes

### Localização de Enums
- Enums gerais: `src/commons/enum/`
- Enums específicos: `src/modules/[modulo]/enum/`

### Padrão de Enum
```typescript
export enum MinhaEnum {
  Opcao1 = 'opcao1',
  Opcao2 = 'opcao2',
  NaoInformado = 'nao_informado',
}
```

## 🧪 Testes

### Estrutura de Testes
- Testes unitários: `.spec.ts` no mesmo diretório do arquivo
- Testes e2e: `test/` (raiz do projeto)
- Fakes/Mocks: `src/base-fake/`

### Padrão de Teste Unitário
```typescript
describe('ExemploService', () => {
  let service: ExemploService;
  let repository: Repository<ExemploEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExemploService,
        {
          provide: getRepositoryToken(ExemploEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExemploService>(ExemploService);
    repository = module.get<Repository<ExemploEntity>>(getRepositoryToken(ExemploEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## 🌍 Internacionalização e Mensagens

### Mensagens de Erro
- Use mensagens em português brasileiro
- Seja específico sobre o erro
- Inclua informações úteis para o usuário

### Exemplos:
```typescript
throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
throw new BadRequestException('CNPJ deve estar em formato válido');
throw new UnauthorizedException('Usuário não tem acesso a esta funcionalidade');
```

## 🔧 Configurações

### Variáveis de Ambiente Importantes
- `ACCESS_TOKEN_SECRET`: Secret para JWT
- `PORT`: Porta da aplicação (padrão: 5000)
- Database configs em `ormconfig.ts`

### ESLint e Formatação
O projeto usa configuração personalizada do ESLint:
- Import/export sorting automático
- Prettier para formatação
- Regras específicas para TypeScript

## 📝 Documentação Swagger

### Padrões para Documentação
```typescript
@ApiTags('Nome do Módulo')
@ApiResponse({ type: Entity, status: 200 })
@ApiQuery({ name: 'param', required: false, description: 'Descrição' })
@ApiProperty({ description: 'Descrição do campo', example: 'Exemplo' })
```

### Decorators Personalizados
- `@ApiQueryEnum()`: Para parâmetros enum em query
- `@ApiPaginatedResponse()`: Para respostas paginadas

## 🚀 Boas Práticas

### Desenvolvimento
1. **Sempre** estender `BaseEntity` para novas entidades
2. **Sempre** usar validações apropriadas nos DTOs
3. **Sempre** documentar endpoints com Swagger
4. **Sempre** implementar testes para novos serviços
5. **Sempre** usar os decorators de segurança apropriados

### Segurança
1. Use `@ApiEmpresaAuth()` para operações que requerem contexto da empresa
2. Use `@ApiComponent()` para controle de acesso granular
3. Use `@Roles()` para controle por tipo de usuário
4. Valide sempre os dados de entrada com DTOs

### Performance
1. Use `relations` apropriadamente no TypeORM
2. Implemente paginação para listas grandes
3. Use indexes apropriados nas migrations

### Manutenibilidade
1. Mantenha controllers enxutos, lógica nos services
2. Use injeção de dependência apropriadamente
3. Organize imports com as regras do ESLint
4. Escreva testes legíveis e mantenha cobertura

## 🔄 Migrations

### Padrão de Migration
```typescript
export class CreateTableExemplo1234567890123 implements MigrationInterface {
  name = 'CreateTableExemplo1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE exemplo (
        id int NOT NULL AUTO_INCREMENT,
        nome varchar(255) NOT NULL,
        criadoEm datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        atualizadoEm datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE exemplo`);
  }
}
```

## 📞 Contexto e Helpers

### ContextService
Use o `ContextService` para acessar informações do usuário e empresa logados:
```typescript
constructor(private readonly contextService: ContextService) {}

const usuario = this.contextService.usuario();
const empresa = this.contextService.empresa();
```

### Helpers Disponíveis
- `src/helpers/r2.ts`: Para operações com AWS S3/R2
- `src/commons/crypto.ts`: Para operações de criptografia

---

**Nota**: Sempre consulte o código existente como referência e mantenha consistência com os padrões estabelecidos. Em caso de dúvidas sobre implementações específicas, verifique módulos similares já implementados no projeto.