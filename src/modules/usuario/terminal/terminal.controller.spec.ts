import { Test, TestingModule } from '@nestjs/testing';

import { userFakeRepository } from 'src/base-fake/user';
import { TerminalEntity } from 'src/modules/empresa/terminal/entities/terminal.entity';

import { UsuarioService } from '../usuario.service';

import { AddUsuarioTerminalDto } from './dto/add-terminal.dto';
import { UsuarioTerminalController } from './terminal.controller';
import { UsuarioTerminalService } from './terminal.service';
import { UsuarioTerminalView } from './views/terminal.view';

describe('UsuarioTerminalController', () => {
  let controller: UsuarioTerminalController;
  let service: UsuarioTerminalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioTerminalController],
      providers: [
        {
          provide: UsuarioTerminalService,
          useValue: {
            add: jest.fn().mockResolvedValue(userFakeRepository.findOneTerminalView()),
            find: jest.fn().mockResolvedValue([userFakeRepository.findOneTerminalView()]),
            findByEmpresaId: jest.fn().mockResolvedValue([userFakeRepository.findOneTerminalView()]),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UsuarioService,
          useValue: {
            findById: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
          },
        },
      ],
    }).compile();

    controller = module.get<UsuarioTerminalController>(UsuarioTerminalController);
    service = module.get<UsuarioTerminalService>(UsuarioTerminalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should add a new terminal to the user', async () => {
      const addTerminalDto: AddUsuarioTerminalDto = {
        empresaId: 1,
        terminalId: 1,
      };

      const terminal = { id: 1 } as UsuarioTerminalView;

      jest.spyOn(service, 'add').mockResolvedValueOnce(terminal);

      const result = await controller.add(1, addTerminalDto);

      expect(service.add).toHaveBeenCalledWith(1, addTerminalDto);
      expect(result).toEqual(terminal);
    });
  });

  describe('find', () => {
    it('should return an array of terminals for the user', async () => {
      const terminals = [{ id: 1 }, { id: 2 }] as UsuarioTerminalView[];

      jest.spyOn(service, 'find').mockResolvedValueOnce(terminals);

      const result = await controller.find(1);

      expect(service.find).toHaveBeenCalledWith(1);
      expect(result).toEqual(terminals);
    });
  });

  describe('findByEmpresaId', () => {
    it('should return an array of terminals for the user and empresa', async () => {
      const terminals = [{ id: 1 }, { id: 2 }] as UsuarioTerminalView[];

      jest.spyOn(service, 'findByEmpresaId').mockResolvedValueOnce(terminals);

      const result = await controller.findByEmpresaId(1, 1);

      expect(service.findByEmpresaId).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(terminals);
    });
  });

  describe('delete', () => {
    it('should delete a terminal from the user', async () => {
      jest.spyOn(service, 'delete').mockResolvedValueOnce(undefined);

      const result = await controller.delete(1, 1);

      expect(service.delete).toHaveBeenCalledWith(1, 1);
      expect(result).toBeUndefined();
    });
  });
});
