import { AppDataSource } from './data-source';

import { serverConfig } from './config';
import app from './app';
import { initSocket } from './socket';

const main = async () => {
  try {
    await AppDataSource.initialize();
    const httpServer = app.listen(serverConfig.PORT, () =>
      console.log(`🚀 Server start on port ${serverConfig.PORT} `)
    );
    initSocket(httpServer);
  } catch (err) {
    console.log(err);
  }
};

main();
