import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentsService } from './components.service';
import { ComponentEntity } from './entities/component.entity';

describe('ComponentsService', () => {
    let service: ComponentsService;
    let componentRepository: Repository<ComponentEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ComponentsService,
                {
                    provide: getRepositoryToken(ComponentEntity),
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<ComponentsService>(ComponentsService);
        componentRepository = module.get<Repository<ComponentEntity>>(getRepositoryToken(ComponentEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(componentRepository).toBeDefined();
    });
});
