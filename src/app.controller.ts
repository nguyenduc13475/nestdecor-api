import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  NotFoundException, Param, ParseIntPipe, Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiBody, ApiCreatedResponse,
  ApiNotFoundResponse, ApiOkResponse, ApiOperation,
  ApiParam, ApiProperty, ApiTags,
} from '@nestjs/swagger';
import {
  ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber,
  IsOptional, IsString, Min,
} from 'class-validator';

class CreateProductDto {
  @ApiProperty({ example: 'Bàn làm việc gỗ', description: 'Tên sản phẩm' })
  @IsString() @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Bàn', description: 'Danh mục sản phẩm' })
  @IsString() @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 850000, description: 'Giá tham khảo (VND)' })
  @IsNumber() @Min(0)
  price!: number;

  @ApiProperty({ example: 'Minimalist', required: false })
  @IsOptional() @IsString()
  style?: string;
}

class CreateDesignDto {
  @ApiProperty({ example: 'Phòng trọ tối giản' })
  @IsString() @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 12, description: 'Diện tích phòng (m²)' })
  @IsNumber() @Min(1)
  roomArea!: number;

  @ApiProperty({ example: 3000000, description: 'Ngân sách (VND)' })
  @IsNumber() @Min(0)
  budget!: number;

  @ApiProperty({ example: [1, 2], type: [Number], description: 'ID sản phẩm trong catalog' })
  @IsArray() @ArrayNotEmpty() @IsInt({ each: true })
  productIds!: number[];
}

type Product = CreateProductDto & { id: number };
type Design = CreateDesignDto & { id: number; totalPrice: number; withinBudget: boolean };

const products: Product[] = [
  { id: 1, name: 'Thảm Vintage', category: 'Thảm', price: 450000, style: 'Vintage' },
  { id: 2, name: 'Bàn làm việc gỗ', category: 'Bàn', price: 850000, style: 'Minimalist' },
  { id: 3, name: 'Đèn bàn LED', category: 'Đèn', price: 250000, style: 'Modern' },
];
const designs: Design[] = [];
let nextProductId = 4;
let nextDesignId = 1;

@ApiTags('Products - Decor catalog')
@Controller('products')
export class ProductsController {
  @Get()
  @ApiOperation({ summary: 'Danh sách sản phẩm decor' })
  @ApiOkResponse({ description: 'Danh sách sản phẩm và giá tham khảo' })
  findAll(): Product[] { return products; }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một sản phẩm' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse({ description: 'Không tìm thấy sản phẩm' })
  findOne(@Param('id', ParseIntPipe) id: number): Product {
    const product = products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Post()
  @ApiOperation({ summary: 'Thêm sản phẩm vào catalog' })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ description: 'Đã tạo sản phẩm' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  create(@Body() dto: CreateProductDto): Product {
    const product: Product = { id: nextProductId++, ...dto };
    products.push(product);
    return product;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi catalog' })
  @ApiParam({ name: 'id', example: 3 })
  @ApiNotFoundResponse({ description: 'Không tìm thấy sản phẩm' })
  delete(@Param('id', ParseIntPipe) id: number): void {
    const index = products.findIndex((p) => p.id === id);
    if (index < 0) throw new NotFoundException('Product not found');
    products.splice(index, 1);
  }
}

@ApiTags('Designs - Room plans')
@Controller('designs')
export class DesignsController {
  @Get()
  @ApiOperation({ summary: 'Danh sách phương án trang trí' })
  @ApiOkResponse({ description: 'Danh sách bản phối đã lưu trong phiên chạy' })
  findAll(): Design[] { return designs; }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một phương án trang trí' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse({ description: 'Không tìm thấy bản phối' })
  findOne(@Param('id', ParseIntPipe) id: number): Design {
    const design = designs.find((d) => d.id === id);
    if (!design) throw new NotFoundException('Design not found');
    return design;
  }

  @Post()
  @ApiOperation({ summary: 'Tạo phương án trang trí từ catalog và ngân sách' })
  @ApiBody({ type: CreateDesignDto })
  @ApiCreatedResponse({ description: 'Đã tạo bản phối và tính tổng chi phí' })
  @ApiBadRequestResponse({ description: 'Dữ liệu hoặc productIds không hợp lệ' })
  create(@Body() dto: CreateDesignDto): Design {
    const selected = dto.productIds.map((id) => {
      const product = products.find((p) => p.id === id);
      if (!product) throw new NotFoundException(`Product ${id} not found`);
      return product;
    });
    const totalPrice = selected.reduce((sum, p) => sum + p.price, 0);
    const design: Design = {
      id: nextDesignId++, ...dto, totalPrice,
      withinBudget: totalPrice <= dto.budget,
    };
    designs.push(design);
    return design;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa phương án trang trí' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse({ description: 'Không tìm thấy bản phối' })
  delete(@Param('id', ParseIntPipe) id: number): void {
    const index = designs.findIndex((d) => d.id === id);
    if (index < 0) throw new NotFoundException('Design not found');
    designs.splice(index, 1);
  }
}
