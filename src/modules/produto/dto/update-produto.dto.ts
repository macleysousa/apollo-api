import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProdutoDto } from './create-produto.dto';

export class UpdateProdutoDto extends PartialType(OmitType(CreateProdutoDto, ['id'] as const)) {}
