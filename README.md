# NestDecor API — CO3043

NestJS demo backend for NestDecor, featuring two independent REST API collections.

## Swagger

Once deployed: `https://YOUR-RENDER-SERVICE.onrender.com/api`

## Collections

- **Products** (`/products`): list, find by ID, create, delete decor products.
- **Designs** (`/designs`): list, find by ID, create, delete room designs. Creating a design calculates total price and whether it fits the budget using product IDs from the catalog.

## Development

```bash
npm install
npm install class-validator class-transformer
npm run start:dev
```

Visit `http://localhost:3000/api`.

## Deploy on Render

Build command: `npm ci && npm run build`
Start command: `npm run start:prod`

Configure Node.js runtime and let Render set `PORT` automatically.

**Note:** This is an in-memory demo. New records disappear after restarting/redeploying the service. It has no authentication, production database, or AI generation endpoint.
