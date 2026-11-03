import { Module } from '@nestjs/common';
import { ProductsController, DesignsController } from './app.controller';

@Module({
  imports: [],
  controllers: [ProductsController, DesignsController],
  providers: [],
})
export class AppModule {}