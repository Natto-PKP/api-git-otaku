import swaggerUi from 'swagger-ui-express';

export const swaggerSetup = swaggerUi.setup(undefined, {
  swaggerUrl: '/api/swagger.json',
  customSiteTitle: 'Git Otaku API Documentation',
});
