import {AppDataSource} from './data-source';
import app from './app';
import {initSocket} from './socket';
import {serverConfig} from './config';


const main = async () => {
    await AppDataSource.initialize();
    const httpServer = app.listen(serverConfig.PORT, () =>
        console.log(`Server start on port ${serverConfig.PORT} `)
    );
    initSocket(httpServer);
};

main().catch(err => {
    console.log(err);
})