import { plainToClass } from 'class-transformer';

import { CreateCodigoBarrasDto } from '../codigo-barras/dto/create-codigo-barras.dto';

import { CreateProdutoDto } from './create-produto.dto';

describe('CreateProdutoDto', () => {
  it('should convert codigoBarras to instances of CreateCodigoBarrasDto', () => {
    const data = {
      produtoId: 1,
      produtoIdExterno: 'ABC123',
      codigoBarras: [
        { tipo: 'EAN13', codigo: '123456789012' },
        { tipo: 'EAN13', codigo: '987654321098' },
      ],
    };

    const produtoDto = plainToClass(CreateProdutoDto, data);

    expect(produtoDto.codigoBarras).toHaveLength(2);
    expect(produtoDto.codigoBarras[0]).toBeInstanceOf(CreateCodigoBarrasDto);
    expect(produtoDto.codigoBarras[1]).toBeInstanceOf(CreateCodigoBarrasDto);
  });
});
