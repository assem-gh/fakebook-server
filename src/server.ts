import { AppDataSource } from './data-source';

import { serverConfig } from './config';
import app from './app';

const main = async () => {
  try {
    await AppDataSource.initialize();
    app.listen(serverConfig.PORT, () =>
      console.log(`🚀 Server start on port ${serverConfig.PORT} `)
    );
  } catch (err) {
    console.log(err);
  }
};

main();
