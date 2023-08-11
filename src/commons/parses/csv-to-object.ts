import { Convert } from 'system-x64';

export async function parseCsvToProduto<T>(file: Express.Multer.File): Promise<T[]> {
  const csvString = file.buffer.toString('utf-8');
  const csvLines = csvString.split('\r\n');

  const referencias: any[] = [];
  const precos: any[] = [];
  const produtos: any[] = [];

  const items = csvLines.map((line) => line.split(';'));
  await Promise.all(
    items.map((columns) => {
      if (columns[0] === 'REFERENCIA') {
        const value = {
          referenciaId: Convert.toNumber(columns[1], { culture: 'pt-BR' }),
          referenciaIdExterno: Convert.toString(columns[2]),
          referenciaNome: Convert.toString(columns[3]),
          categoriaNome: Convert.toString(columns[4]),
          subCategoriaNome: Convert.toString(columns[5]),
          unidadeMedida: Convert.toString(columns[6]),
          cst: Convert.toString(columns[7]),
          cfop: Convert.toString(columns[8]),
          ncm: Convert.toString(columns[9]),
          peso: Convert.toDecimal(columns[10], { culture: 'pt-BR' }),
          marcaId: Convert.toNumber(columns[11], { culture: 'pt-BR' }),
          descricao: Convert.toString(columns[12] ?? ''),
          composicao: Convert.toString(columns[13] ?? ''),
          cuidados: Convert.toString(columns[14] ?? ''),
        };
        referencias.push(value);
      }

      if (columns[0] === 'REFERENCIA_PRECO') {
        const value = {
          tabelaPrecoId: Convert.toNumber(columns[1], { culture: 'pt-BR' }),
          referenciaId: Convert.toNumber(columns[2], { culture: 'pt-BR' }),
          preco: Convert.toDecimal(columns[3], { culture: 'pt-BR', default: 0 }),
        };
        precos.push(value);
      }

      if (columns[0] === 'PRODUTO') {
        const codigoBarras = [
          {
            produtoId: Convert.toNumber(columns[2], { culture: 'pt-BR' }),
            tipo: Convert.toString(columns[6]),
            codigo: Convert.toString(columns[7]),
          },
        ];
        const value = {
          referenciaId: Convert.toNumber(columns[1], { culture: 'pt-BR' }),
          produtoId: Convert.toNumber(columns[2], { culture: 'pt-BR' }),
          produtoIdExterno: Convert.toString(columns[3]),
          corNome: Convert.toString(columns[4]),
          tamanhoNome: Convert.toString(columns[5]),
          codigoBarras: Convert.toString(columns[7]).length > 0 ? codigoBarras : null,
        };

        produtos.push(value);
      }
    })
  );

  const values: T[] = [];

  await Promise.all(
    produtos.map((produto) => {
      const referencia = referencias.first((x) => x.referenciaId === produto.referenciaId);
      const referencia_precos = precos.filter((x) => x.referenciaId === produto.referenciaId);

      const value: T = {
        referenciaId: referencia.referenciaId,
        referenciaIdExterno: referencia.referenciaIdExterno,
        referenciaNome: referencia.referenciaNome,
        categoriaNome: referencia.categoriaNome,
        subCategoriaNome: referencia.subCategoriaNome,
        unidadeMedida: referencia.unidadeMedida,
        cst: referencia.cst,
        ncm: referencia.ncm,
        peso: referencia.peso,
        marcaId: referencia.marcaId,
        descricao: referencia.descricao,
        composicao: referencia.composicao,
        cuidados: referencia.cuidados,
        produtoId: produto.produtoId,
        produtoIdExterno: produto.produtoIdExterno,
        corNome: produto.corNome,
        tamanhoNome: produto.tamanhoNome,
        codigoBarras: produto.codigoBarras,
        precos: referencia_precos.length > 0 ? referencia_precos : null,
      } as T;

      values.push(value);
    })
  );

  return values;
}

export async function parseCsvToRefereciaPreco<T>(file: Express.Multer.File): Promise<T[]> {
  const csvString = file.buffer.toString('utf-8');
  const csvLines = csvString.split('\r\n');

  const values: T[] = [];

  const items = csvLines.map((line) => line.split(';'));
  await Promise.all(
    items.map((columns) => {
      if (columns[0] === 'REFERENCIA_PRECO') {
        const value: T = {
          tabelaPrecoId: Convert.toNumber(columns[1], { culture: 'pt-BR' }),
          referenciaId: Convert.toNumber(columns[2], { culture: 'pt-BR' }),
          preco: Convert.toDecimal(columns[3], { culture: 'pt-BR' }),
        } as T;
        values.push(value);
      }
    })
  );

  return values;
}
