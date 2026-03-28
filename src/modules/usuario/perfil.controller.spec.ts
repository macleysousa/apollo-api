import { Test, TestingModule } from '@nestjs/testing';

import { userFakeRepository } from 'src/base-fake/user';
import { ContextService } from 'src/context/context.service';

import { PerfilController } from './perfil.controller';

describe('PerfilController', () => {
  let perfilController: PerfilController;
  let context: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilController],
      providers: [
        {
          provide: ContextService,
          useValue: {
            usuario: jest.fn(),
          },
        },
      ],
    }).compile();

    perfilController = module.get<PerfilController>(PerfilController);
    context = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(perfilController).toBeDefined();
  });

  describe('/ (GET)', () => {
    it('should return the user profile', async () => {
      // Arrange

      jest.spyOn(context, 'usuario').mockReturnValueOnce(userFakeRepository.findOne());

      // Act
      const response = await perfilController.find();

      // Assert

      expect(context.usuario).toHaveBeenCalledTimes(1);
      expect(context.usuario).toHaveBeenCalledWith();

      expect(response).toEqual(userFakeRepository.findOne());
    });
  });
});
