import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from '../componente/decorator/componente.decorator';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EmpresaEntity } from './entities/empresa.entity';
import { Roles } from '../usuario/roles.decorator';
import { Role } from '../usuario/enums/usuario-tipo.enum';
import { EmpresaInclude, EmpresaIncludeEnum } from './includes/empresa.include';
import { ApiQueryEnum } from 'src/decorators/api-query-enum.decorator';

@ApiTags('Empresas')
@Controller('empresas')
@ApiBearerAuth()
@ApiComponent('ADMFM004', 'Manutenção de empresas')
export class EmpresaController {
  constructor(private readonly service: EmpresaService) {}

  @Post()
  @ApiResponse({ type: EmpresaEntity, status: 201 })
  @Roles(Role.sysadmin)
  async create(@Body() createBranchDto: CreateEmpresaDto): Promise<EmpresaEntity> {
    return this.service.create(createBranchDto);
  }

  @Get()
  @ApiResponse({ type: [EmpresaEntity], status: 200 })
  @ApiQuery({ name: 'filter', required: false, description: 'filter by cnpj or name' })
  @ApiQueryEnum({ name: 'incluir', required: false, enum: EmpresaIncludeEnum, isArray: true })
  async find(@Query('filter') filter: string, @Query('incluir') incluir: EmpresaInclude[]): Promise<EmpresaEntity[]> {
    return this.service.find(filter, incluir);
  }

  @Get(':id')
  @ApiResponse({ type: EmpresaEntity, status: 200 })
  @ApiQueryEnum({ name: 'incluir', required: false, enum: EmpresaIncludeEnum, isArray: true })
  async findById(@Param('id', ParseIntPipe) id: number, @Query('incluir') incluir: EmpresaInclude[]): Promise<EmpresaEntity> {
    return this.service.findById(id, incluir);
  }

  @Put(':id')
  @ApiResponse({ type: EmpresaEntity, status: 200 })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBranchDto: UpdateEmpresaDto): Promise<EmpresaEntity> {
    return this.service.update(id, updateBranchDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
