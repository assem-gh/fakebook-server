import { AppDataSource } from './data-source';

import { server } from './config';
import app from './app';

const main = async () => {
  try {
    await AppDataSource.initialize();
    app.listen(server.PORT, () =>
      console.log(`🚀 Server start on port ${server.PORT} `)
    );
  } catch (error) {
    console.log(error);
  }
};

main();
