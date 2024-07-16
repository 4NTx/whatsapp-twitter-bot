import twitterClient from '../config/twitter';

export async function postarNoTwitter(mensagem: string, midia: any = null) {
    if (midia) {
        try {
            const mediaData = Buffer.from(midia.data, 'base64');
            const mediaUploadResponse = await twitterClient.post('media/upload', { media_data: mediaData.toString('base64') });

            if (mediaUploadResponse.data) {
                const mediaIdStr = (mediaUploadResponse.data as any).media_id_string;
                const params = { status: mensagem, media_ids: [mediaIdStr] };
                await twitterClient.post('statuses/update', params);
                console.log('Tweet com mídia postado: ' + mensagem);
            } else {
                throw new Error('Erro ao fazer upload da mídia');
            }
        } catch (error) {
            console.error('Erro ao postar no Twitter com mídia:', error);
        }
    } else {
        try {
            await twitterClient.post('statuses/update', { status: mensagem });
            console.log('Tweet postado: ' + mensagem);
        } catch (error) {
            console.error('Erro ao postar no Twitter:', error);
        }
    }
}
