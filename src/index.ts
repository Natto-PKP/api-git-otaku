import { server } from './server'; // Import server from server.ts

// Start Express server
server.listen(process.env.API_PORT || 8888, () => {
  console.log(`Server listening on port ${process.env.API_PORT || 8888}`);
});
