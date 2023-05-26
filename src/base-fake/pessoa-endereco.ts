import { UF } from 'src/commons/enum/uf.enum';
import { PessoaEnderecoEntity } from 'src/modules/pessoa/pessoa-endereco/entities/pessoa-endereco.entity';
import { EnderecoTipo } from 'src/modules/pessoa/pessoa-endereco/enum/endereco-tipo.enum';

class PessoaEnderocoFakeRepository {
  find(): PessoaEnderecoEntity[] {
    const value = new PessoaEnderecoEntity({
      pessoaId: 1,
      tipoEndereco: EnderecoTipo.Comercial,
      cep: '12345678',
      logradouro: 'Rua Teste',
      numero: '123',
      complemento: 'Complemento',
      bairro: 'Bairro',
      municipio: 'Municipio',
      uf: UF.CE,
      pais: 'Pais',
    });

    return [value];
  }

  findOne(): PessoaEnderecoEntity {
    const value = pessoaEnderecoFakeRepository.find()[0];
    return value;
  }
}

const pessoaEnderecoFakeRepository = new PessoaEnderocoFakeRepository();
export { pessoaEnderecoFakeRepository };
