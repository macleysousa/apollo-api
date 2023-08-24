import { EmpresaParametroView } from 'src/modules/empresa/parametro/views/paramentro.view';

class EmpresaParametroFakeRepository {
  findView(): EmpresaParametroView[] {
    const value = new EmpresaParametroView();
    value.empresaId = 1;
    value.parametroId = 'CD_PRECO_PADRAO';
    value.valor = 'valor1';
    return [value];
  }

  findViewOne(): EmpresaParametroView {
    const value = new EmpresaParametroView();
    value.empresaId = 1;
    value.parametroId = 'CD_PRECO_PADRAO';
    value.valor = 'valor1';
    return value;
  }
}

const empresaParametroFakeRepository = new EmpresaParametroFakeRepository();
export { empresaParametroFakeRepository };
