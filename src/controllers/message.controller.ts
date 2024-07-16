import { verificarPromocao, reformularMensagem } from '../services/chatgptService';
import { postarNoTwitter } from '../services/twitterService';
import { enviarMensagemParaGrupo, adicionarMensagemEnviada, mensagemJaEnviada, isGrupoPermitido } from '../services/whatsappService';

export async function processarMensagem(message: any) {
    const chat = await message.getChat();
    if (!chat.isGroup || !isGrupoPermitido(chat.id._serialized)) {
        console.log('Mensagem de um grupo não permitido, ignorada.');
        return;
    }

    if (mensagemJaEnviada(message.body)) {
        return;
    }

    const isPromocao = await verificarPromocao(message.body);
    if (!isPromocao) {
        console.log('Mensagem não relacionada a promoção, ignorada.');
        return;
    }

    const mensagemReformulada = await reformularMensagem(message.body);

    if (message.hasMedia) {
        const midia = await message.downloadMedia();
        postarNoTwitter(mensagemReformulada, midia);
        enviarMensagemParaGrupo('destination-group-id', mensagemReformulada, midia);
    } else {
        postarNoTwitter(mensagemReformulada);
        enviarMensagemParaGrupo('destination-group-id', mensagemReformulada);
    }

    adicionarMensagemEnviada(message.body);
}
