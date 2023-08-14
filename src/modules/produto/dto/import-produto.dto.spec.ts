import { plainToClass } from 'class-transformer';

import { ImportProdutoDto, ImportProdutoPrecosDto } from './import-produto.dto';
import { CreateCodigoBarrasDto } from '../codigo-barras/dto/create-codigo-barras.dto';

describe('ImportProdutoDto', () => {
  it('should convert codigoBarras to instances of CreateCodigoBarrasDto', () => {
    const data = {
      produtoId: 1,
      produtoIdExterno: 'ABC123',
      codigoBarras: [{ codigo: '123456789012' }, { codigo: '987654321098' }],
    };

    const importProdutoDto = plainToClass(ImportProdutoDto, data);

    expect(importProdutoDto.codigoBarras).toHaveLength(2);
    expect(importProdutoDto.codigoBarras[0]).toBeInstanceOf(CreateCodigoBarrasDto);
    expect(importProdutoDto.codigoBarras[1]).toBeInstanceOf(CreateCodigoBarrasDto);
  });

  it('should convert precos to instances of ImportProdutoPrecosDto', () => {
    const data = {
      produtoId: 1,
      produtoIdExterno: 'ABC123',
      precos: [{ preco: 10 }, { preco: 20 }],
    };

    const importProdutoDto = plainToClass(ImportProdutoDto, data);

    expect(importProdutoDto.precos).toHaveLength(2);
    expect(importProdutoDto.precos[0]).toBeInstanceOf(ImportProdutoPrecosDto);
    expect(importProdutoDto.precos[1]).toBeInstanceOf(ImportProdutoPrecosDto);
  });
});
