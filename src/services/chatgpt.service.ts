import axios from 'axios';
import config from 'config';

const openAiConfig = config.get('OpenAI');

export async function verificarPromocao(mensagemOriginal: string): Promise<boolean> {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: `Esta mensagem está relacionada a uma promoção de itens? Responda com "sim" ou "não": "${mensagemOriginal}"`,
            max_tokens: 10
        }, {
            headers: {
                'Authorization': `Bearer ${openAiConfig.api_key}`
            }
        });
        return response.data.choices[0].text.trim().toLowerCase() === 'sim';
    } catch (error) {
        console.error('Erro ao verificar a mensagem:', error);
        return false;
    }
}

export async function reformularMensagem(mensagemOriginal: string): Promise<string> {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: `Reformule a seguinte mensagem de maneira mais organizada e diferente: "${mensagemOriginal}"`,
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer ${openAiConfig.api_key}`
            }
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Erro ao reformular a mensagem:', error);
        return mensagemOriginal;
    }
}
