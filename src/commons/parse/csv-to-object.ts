import { Convert } from 'system-x64';

export async function parseCsvToObjet<T>(file: Express.Multer.File): Promise<T[]> {
  const csvString = file.buffer.toString('utf-8');
  const csvLines = csvString.split('\r\n');

  const values: T[] = [];

  const items = csvLines.map((line) => line.split(';'));
  await Promise.all(
    items.map((columns) => {
      if (columns[0] === 'PRODUTO') {
        const codigoBarras = Convert.toString(columns[19]).length == 0 ? null : [{ tipo: 'EAN13', codigo: Convert.toString(columns[19]) }];
        const value: T = {
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
          descricao: Convert.toString(columns[12]),
          composicao: Convert.toString(columns[13]),
          cuidados: Convert.toString(columns[14]),
          produtoId: Convert.toNumber(columns[15], { culture: 'pt-BR' }),
          produtoIdExterno: Convert.toString(columns[16]),
          corNome: Convert.toString(columns[17]),
          tamanhoNome: Convert.toString(columns[18]),
          codigoBarras: codigoBarras,
        } as T;
        values.push(value);
      }
    })
  );

  return values;
}
