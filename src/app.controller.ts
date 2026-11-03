import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';

class ProductDto {
  @ApiProperty({ example: 'Sofa Minimalism' }) name: string;
  @ApiProperty({ example: 1500000 }) price: number;
}

class DesignDto {
  @ApiProperty({ example: 'user_123' }) userId: string;
  @ApiProperty({ example: 3000000 }) budget: number;
}

const products: any[] = [{ id: 1, name: 'Thảm Vintage', price: 450000 }];
const designs: any[] = [];

@ApiTags('Products (Catalog)')
@Controller('products')
export class ProductsController {
  @Get() @ApiOperation({ summary: 'Lấy danh sách đồ decor' }) getProducts() { return products; }
  @Post() @ApiOperation({ summary: 'Thêm đồ decor' }) createProduct(@Body() dto: ProductDto) { 
    products.push({ id: Date.now(), ...dto }); return dto; 
  }
}

@ApiTags('Designs (Bản phối)')
@Controller('designs')
export class DesignsController {
  @Get() @ApiOperation({ summary: 'Lấy lịch sử bản phối' }) getDesigns() { return designs; }
  @Post() @ApiOperation({ summary: 'Lưu bản phối mới' }) createDesign(@Body() dto: DesignDto) { 
    designs.push({ id: Date.now(), ...dto }); return dto; 
  }
}