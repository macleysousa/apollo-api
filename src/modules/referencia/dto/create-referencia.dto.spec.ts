import { plainToClass } from 'class-transformer';

import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';

import { CreateReferenciaDto } from './create-referencia.dto';

describe('CreateReferenciaDto', () => {
  it('should create a valid CreateReferenciaDto object', () => {
    const dto = new CreateReferenciaDto();
    dto.id = 1;
    dto.nome = 'Referencia 1';
    dto.idExterno = 'REF-001';
    dto.unidadeMedida = UnidadeMedida.UN;
    dto.categoriaId = 1;
    dto.subCategoriaId = 2;
    dto.marcaId = 3;
    dto.descricao = 'Descrição da Referencia 1';
    dto.composicao = 'Composição da Referencia 1';
    dto.cuidados = 'Cuidados com a Referencia 1';
    dto.precos = [
      { tabelaDePrecoId: 1, referenciaId: 1, preco: 10.0 },
      { tabelaDePrecoId: 1, referenciaId: 2, preco: 20.0 },
    ];

    const result = plainToClass(CreateReferenciaDto, dto);

    expect(dto).toBeDefined();
    expect(result).toBeInstanceOf(CreateReferenciaDto);
    expect(result.precos).toHaveLength(2);
  });
});
