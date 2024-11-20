import { Test, TestingModule } from '@nestjs/testing';

import { empresaFakeRepository } from 'src/base-fake/empresa';

import { EmpresaService } from '../empresa.service';

import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { TerminalEntity } from './entities/terminal.entity';
import { TerminalController } from './terminal.controller';
import { TerminalService } from './terminal.service';

describe('TerminalController', () => {
  let controller: TerminalController;
  let service: TerminalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerminalController],
      providers: [
        {
          provide: TerminalService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: EmpresaService,
          useValue: {
            findById: jest.fn().mockResolvedValue(empresaFakeRepository.findOne()),
          },
        },
      ],
    }).compile();

    controller = module.get<TerminalController>(TerminalController);
    service = module.get<TerminalService>(TerminalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new terminal', async () => {
      const createTerminalDto: CreateTerminalDto = { id: 1, nome: 'Terminal 1' };

      const terminal = { id: 1 } as TerminalEntity;

      jest.spyOn(service, 'create').mockResolvedValueOnce(terminal);

      const result = await controller.create(1, createTerminalDto);

      expect(result).toEqual(terminal);
      expect(service.create).toHaveBeenCalledWith(1, createTerminalDto);
    });
  });

  describe('find', () => {
    it('should return an array of terminals', async () => {
      const terminals = [{ id: 1 }, { id: 2 }] as TerminalEntity[];

      jest.spyOn(service, 'find').mockResolvedValueOnce(terminals);

      const result = await controller.find(1);

      expect(result).toEqual(terminals);
      expect(service.find).toHaveBeenCalledWith(1);
    });
  });

  describe('findById', () => {
    it('should return a terminal by id', async () => {
      const terminal = { id: 1 } as TerminalEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(terminal);

      const result = await controller.findById(1, 1);

      expect(result).toEqual(terminal);
      expect(service.findById).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('update', () => {
    it('should update a terminal by id', async () => {
      const updateTerminalDto: UpdateTerminalDto = { nome: 'Terminal 2', inativo: false };

      const terminal = { id: 1 } as TerminalEntity;

      jest.spyOn(service, 'update').mockResolvedValueOnce(terminal);

      const result = await controller.update(1, 1, updateTerminalDto);

      expect(result).toEqual(terminal);
      expect(service.update).toHaveBeenCalledWith(1, 1, updateTerminalDto);
    });
  });

  describe('delete', () => {
    it('should delete a terminal by id', async () => {
      jest.spyOn(service, 'delete').mockResolvedValueOnce(undefined);

      const result = await controller.delete(1, 1);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(1, 1);
    });
  });
});
