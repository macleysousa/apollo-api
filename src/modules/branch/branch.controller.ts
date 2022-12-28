import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from '../component/component.decorator';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';

@ApiTags('Branches')
@Controller('branches')
@ApiBearerAuth()
@ApiComponent('ADMFM004', 'Manutenção de filial')
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    @Post()
    @ApiResponse({ type: BranchEntity, status: 201 })
    async create(@Body() createBranchDto: CreateBranchDto): Promise<BranchEntity> {
        return this.branchService.create(createBranchDto);
    }

    @Get()
    @ApiResponse({ type: BranchEntity, isArray: true, status: 200 })
    @ApiQuery({ name: 'filter', required: false, description: 'filter by cnpj or name' })
    async find(@Query('filter') filter: string): Promise<BranchEntity[]> {
        return this.branchService.find(filter);
    }

    @Get(':id')
    @ApiResponse({ type: BranchEntity, status: 200 })
    async findById(@Param('id', ParseIntPipe) id: number): Promise<BranchEntity> {
        return this.branchService.findById(id);
    }

    @Put(':id')
    @ApiResponse({ type: BranchEntity, status: 200 })
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateBranchDto: UpdateBranchDto): Promise<BranchEntity> {
        return this.branchService.update(id, updateBranchDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.branchService.remove(id);
    }
}
