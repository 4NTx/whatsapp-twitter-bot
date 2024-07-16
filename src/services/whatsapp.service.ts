import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import config from 'config';

const whatsappConfig = config.get('WhatsApp');

const client = new Client({
    authStrategy: new LocalAuth()
});

let mensagensEnviadas: string[] = [];

const caminhoMensagensEnviadas = path.resolve(__dirname, '../../data/sentMessages.json');

if (fs.existsSync(caminhoMensagensEnviadas)) {
    mensagensEnviadas = JSON.parse(fs.readFileSync(caminhoMensagensEnviadas, 'utf-8'));
}

const gruposPermitidos: string[] = whatsappConfig.allowed_groups;

client.on('qr', (qr: string) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente WhatsApp pronto!');
});

client.initialize();

export function enviarMensagemParaGrupo(grupoId: string, mensagem: string, midia: any = null) {
    if (midia) {
        const midiaMensagem = new MessageMedia(midia.mimetype, midia.data, midia.filename);
        client.sendMessage(grupoId, midiaMensagem, { caption: mensagem });
    } else {
        client.sendMessage(grupoId, mensagem);
    }
}

export function adicionarMensagemEnviada(mensagem: string) {
    mensagensEnviadas.push(mensagem);
    fs.writeFileSync(caminhoMensagensEnviadas, JSON.stringify(mensagensEnviadas));
}

export function mensagemJaEnviada(mensagem: string): boolean {
    return mensagensEnviadas.includes(mensagem);
}

export function isGrupoPermitido(grupoId: string): boolean {
    return gruposPermitidos.includes(grupoId);
}

export { client };
