import { ProductsController } from './app.controller';

describe('ProductsController', () => {
  it('returns seeded products', () => {
    const controller = new ProductsController();
    expect(controller.findAll().length).toBeGreaterThan(0);
  });
});
