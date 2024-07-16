import 'dotenv/config';
import { client } from './services/whatsappService';
import { processarMensagem } from './controllers/messageController';

client.on('message', async message => {
    await processarMensagem(message);
});
