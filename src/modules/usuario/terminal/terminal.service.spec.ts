import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { userFakeRepository } from 'src/base-fake/user';

import { AddUsuarioTerminalDto } from './dto/add-terminal.dto';
import { UsuarioTerminalEntity } from './entities/terminal.entity';
import { UsuarioTerminalService } from './terminal.service';

describe('UsuarioTerminalService', () => {
  let service: UsuarioTerminalService;
  let repository: Repository<UsuarioTerminalEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioTerminalService,
        {
          provide: getRepositoryToken(UsuarioTerminalEntity),
          useValue: {
            upsert: jest.fn().mockResolvedValue(undefined),
            find: jest.fn().mockResolvedValue([userFakeRepository.findOneTerminal()]),
            findOne: jest.fn().mockResolvedValue(userFakeRepository.findOneTerminal()),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<UsuarioTerminalService>(UsuarioTerminalService);
    repository = module.get<Repository<UsuarioTerminalEntity>>(getRepositoryToken(UsuarioTerminalEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('add', () => {
    it('should add a new terminal to the user', async () => {
      const addUsuarioTerminalDto: AddUsuarioTerminalDto = { empresaId: 1, terminalId: 1 };

      const usuarioId = 1;

      jest.spyOn(repository, 'upsert').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findByTerminalId').mockResolvedValueOnce(userFakeRepository.findOneTerminal());

      const result = await service.add(usuarioId, addUsuarioTerminalDto);

      expect(repository.upsert).toHaveBeenCalledWith(
        { ...addUsuarioTerminalDto, usuarioId },
        { conflictPaths: ['usuarioId', 'empresaId', 'terminalId'] },
      );
      expect(service.findByTerminalId).toHaveBeenCalledWith(usuarioId, addUsuarioTerminalDto.terminalId);
      expect(result).toEqual(userFakeRepository.findOneTerminal().terminal);
    });
  });

  describe('find', () => {
    it('should return an array of terminals for the user', async () => {
      const usuarioId = 1;

      const terminais = [userFakeRepository.findOneTerminal().terminal];

      const result = await service.find(usuarioId);

      expect(repository.find).toHaveBeenCalledWith({ where: { usuarioId } });
      expect(result).toEqual(terminais);
    });
  });

  describe('findByEmpresaId', () => {
    it('should return an array of terminals for the user and empresa', async () => {
      const usuarioId = 1;
      const empresaId = 1;

      const terminais = [userFakeRepository.findOneTerminal().terminal];

      const result = await service.findByEmpresaId(usuarioId, empresaId);

      expect(repository.find).toHaveBeenCalledWith({ where: { usuarioId, empresaId } });
      expect(result).toEqual(terminais);
    });
  });

  describe('findByTerminalId', () => {
    it('should return the usuarioTerminal by usuarioId and terminalId', async () => {
      const usuarioId = 1;
      const terminalId = 1;

      const usuarioTerminal = userFakeRepository.findOneTerminal();

      const result = await service.findByTerminalId(usuarioId, terminalId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { usuarioId, terminalId } });
      expect(result).toEqual(usuarioTerminal);
    });
  });

  describe('delete', () => {
    it('should delete the usuarioTerminal by usuarioId and terminalId', async () => {
      const usuarioId = 1;
      const terminalId = 1;

      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      const result = await service.delete(usuarioId, terminalId);

      expect(result).toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith({ usuarioId, terminalId });
    });

    it('should throw a BadRequestException if the usuarioTerminal cannot be deleted', async () => {
      const usuarioId = 1;
      const terminalId = 1;

      jest.spyOn(repository, 'delete').mockRejectedValueOnce(new Error());

      await expect(service.delete(usuarioId, terminalId)).rejects.toThrow(BadRequestException);
      expect(repository.delete).toHaveBeenCalledWith({ usuarioId, terminalId });
    });
  });
});
