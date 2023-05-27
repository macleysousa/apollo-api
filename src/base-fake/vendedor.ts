import { VendedorEntity } from 'src/modules/vendedor/entities/vendedor.entity';

class VendedorFakeRepository {
  find(): VendedorEntity[] {
    const value = new VendedorEntity({ id: 1, nome: 'João', empresaId: 1, inativo: true });
    const value2 = new VendedorEntity({ id: 2, nome: 'Maria', empresaId: 1, inativo: false });

    return [value, value2];
  }

  findOne(): VendedorEntity {
    const value = vendedorFakeRepository.find()[0];
    return value;
  }
}

const vendedorFakeRepository = new VendedorFakeRepository();
export { vendedorFakeRepository };
