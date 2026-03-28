import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { EmpresaEntity } from '../empresa/entities/empresa.entity';
import { EmpresaParametroEntity } from '../empresa/parametro/entities/parametro.entity';

import { ParametroEntity } from './entities/parametro.entity';
import { Parametro } from './enum/parametros';

@Injectable()
export class ParametroService {
  constructor(
    @InjectRepository(ParametroEntity)
    private repository: Repository<ParametroEntity>,
    @InjectRepository(EmpresaEntity)
    private empresaRepository: Repository<EmpresaEntity>,
    @InjectRepository(EmpresaParametroEntity)
    private empresaParametroRepository: Repository<EmpresaParametroEntity>,
  ) {}

  async popular(): Promise<void> {
    const parametros: ParametroEntity[] = [
      { id: 'CD_PRECO_PADRAO', descricao: 'Tabela de preço padrão', valorPadrao: '0' },
      { id: 'QT_DIAS_TROCA', descricao: 'Quantidade de dias para troca', valorPadrao: '60' },
      { id: 'QT_DIAS_DEVOLUCAO', descricao: 'Quantidade de dias para devolução', valorPadrao: '7' },
      { id: 'OBS_PADRAO_COMPRA', descricao: 'Observação padrão para compra', valorPadrao: '' },
      { id: 'OBS_PADRAO_VENDA', descricao: 'Observação padrão para venda', valorPadrao: '' },
      { id: 'OBS_PADRAO_CONSIGNACAO', descricao: 'Observação padrão para consignação', valorPadrao: '' },
      { id: 'DEVOLVER_SEM_ROMANEIO', descricao: 'Devolver sem romaneio', valorPadrao: 'N' },
      { id: 'FATURAR_PEDIDO_SEM_CONFERENCIA', descricao: 'Faturar pedido sem conferência', valorPadrao: 'N' },
      { id: 'INTEGRACAO_OPEN_PIX_HABILITADA', descricao: 'Habilitar integração com OpenPix', valorPadrao: 'N' },
      { id: 'INTEGRACAO_OPEN_PIX_APP_ID', descricao: 'Client ID para integração com OpenPix', valorPadrao: '' },
      { id: 'INTEGRACAO_INFINITY_PAY_HABILITADA', descricao: 'Habilitar integração com Infinity Pay', valorPadrao: 'N' },
      {
        id: 'INTEGRACAO_INFINITY_PAY_API_HANDLE',
        descricao:
          'Handle: sua InfiniteTag (a identificação que aparece no canto superior esquerdo do App InfinitePay). Use sem o símbolo $ do início.',
        valorPadrao: '',
      },
      {
        id: 'INTEGRACAO_INFINITY_PAY_URL_REDIRECT',
        descricao: 'URL de redirecionamento no final do processo de pagamento',
        valorPadrao: '',
      },
      {
        id: 'INTEGRACAO_INFINITY_PAY_URL_WEBHOOK',
        descricao: 'URL de webhook para integração com Infinity Pay',
        valorPadrao: '',
      },
      { id: 'URL_SITE_EMPRESA', descricao: 'URL do site da empresa', valorPadrao: '' },
    ];

    const dbParametros = await this.repository.find({ select: ['id', 'descricao'] });

    // Populate base parameters only when missing.
    for (const parametro of parametros) {
      const parametroExistente = dbParametros.find((p) => p.id === parametro.id);

      if (!parametroExistente) {
        await this.repository.insert(parametro);
      }
    }

    // Populate company parameters one by one; skip if already present.
    const empresas = await this.empresaRepository.find({ select: ['id'] });
    const dbEmpresaParametros = await this.empresaParametroRepository.find({ select: ['empresaId', 'parametroId'] });

    for (const empresa of empresas) {
      for (const parametro of parametros) {
        const existenteNaEmpresa = dbEmpresaParametros.find(
          (ep) => ep.empresaId === empresa.id && ep.parametroId === parametro.id,
        );

        if (!existenteNaEmpresa) {
          await this.empresaParametroRepository.insert({
            empresaId: empresa.id,
            parametroId: parametro.id as Parametro,
            valor: parametro.valorPadrao,
          });
        }
      }
    }
  }

  async find(id?: Parametro, descricao?: string): Promise<ParametroEntity[]> {
    return this.repository.find({ where: { id: ILike(`%${id ?? ''}%`) as any, descricao: ILike(`%${descricao ?? ''}%`) } });
  }

  async findById(id: Parametro): Promise<ParametroEntity> {
    return this.repository.findOne({ where: { id } });
  }
}
