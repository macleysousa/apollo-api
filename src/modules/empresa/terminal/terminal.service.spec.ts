import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { TerminalEntity } from './entities/terminal.entity';
import { TerminalService } from './terminal.service';

describe('TerminalService', () => {
  let service: TerminalService;
  let repository: Repository<TerminalEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TerminalService,
        {
          provide: getRepositoryToken(TerminalEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TerminalService>(TerminalService);
    repository = module.get<Repository<TerminalEntity>>(getRepositoryToken(TerminalEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new terminal', async () => {
      const empresaId = 1;
      const createTerminalDto: CreateTerminalDto = { id: 1, nome: 'Terminal 1' };

      const terminal = { id: 1 } as TerminalEntity;

      jest.spyOn(repository, 'save').mockResolvedValueOnce(terminal);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(terminal);

      const result = await service.create(empresaId, createTerminalDto);

      expect(result).toEqual(terminal);
      expect(repository.save).toHaveBeenCalledWith({ ...createTerminalDto, empresaId });
      expect(service.findById).toHaveBeenCalledWith(empresaId, terminal.id);
    });
  });

  describe('find', () => {
    it('should find terminals by empresaId', async () => {
      const empresaId = 1;
      const terminals = [{ id: 1 }, { id: 2 }] as TerminalEntity[];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(terminals);

      const result = await service.find(empresaId);

      expect(result).toEqual(terminals);
      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId } });
    });
  });

  describe('findById', () => {
    it('should find a terminal by id and empresaId', async () => {
      const empresaId = 1;
      const id = 1;
      const terminal = { id } as TerminalEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(terminal);

      const result = await service.findById(empresaId, id);

      expect(result).toEqual(terminal);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id, empresaId } });
    });
  });

  describe('update', () => {
    it('should update a terminal', async () => {
      const empresaId = 1;
      const id = 1;
      const updateTerminalDto: UpdateTerminalDto = { nome: 'Terminal 1', inativo: false };

      const terminal = { id } as TerminalEntity;

      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(terminal);

      const result = await service.update(empresaId, id, updateTerminalDto);

      expect(result).toEqual(terminal);
      expect(repository.update).toHaveBeenCalledWith({ empresaId, id }, updateTerminalDto);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
    });
  });

  describe('delete', () => {
    it('should delete a terminal', async () => {
      const empresaId = 1;
      const id = 1;

      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      await service.delete(empresaId, id);

      expect(repository.delete).toHaveBeenCalledWith({ empresaId, id });
    });

    it('should throw an error if delete fails', async () => {
      const empresaId = 1;
      const id = 1;

      jest.spyOn(repository, 'delete').mockRejectedValueOnce(new Error());

      await expect(service.delete(empresaId, id)).rejects.toThrowError('Não foi possível excluir o terminal');
    });
  });
});
