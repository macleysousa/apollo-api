import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from '../component/component.decorator';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';

@ApiTags('Branchs')
@Controller('branchs')
@ApiBearerAuth()
@ApiComponent('ADMFM003', 'Manutenção de filial')
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    @Post()
    @ApiResponse({ type: BranchEntity, status: 201 })
    async create(@Body() createBranchDto: CreateBranchDto): Promise<BranchEntity> {
        return this.branchService.create(createBranchDto);
    }

    @Get()
    @ApiResponse({ type: BranchEntity, isArray: true, status: 200 })
    async find(): Promise<BranchEntity[]> {
        return this.branchService.find();
    }

    @Get(':id')
    @ApiResponse({ type: BranchEntity, status: 200 })
    async findById(@Param('id') id: string): Promise<BranchEntity> {
        return this.branchService.findById(+id);
    }

    @Put(':id')
    @ApiResponse({ type: BranchEntity, status: 200 })
    async update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto): Promise<BranchEntity> {
        return this.branchService.update(+id, updateBranchDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.branchService.remove(+id);
    }
}
