export default async function handler(req, res) {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    
    // Вставьте сюда реальный ID артиста AVA11
    // Если не знаете, используйте этот ID для теста (The Weeknd): '1Xyo4u8uXC1ZmMpatF05PJ'
    const artist_id = '1Xyo4u8uXC1ZmMpatF05PJ'; 

    try {
        // 1. Получаем токен (Правильная ссылка!)
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();
        
        if (!tokenData.access_token) {
            throw new Error('Failed to get access token');
        }

        const accessToken = tokenData.access_token;

        // 2. Получаем релизы (Правильная ссылка!)
        const apiResponse = await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums?include_groups=album,single,ep&market=US&limit=10`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        const musicData = await apiResponse.json();

        if (musicData.error) {
             throw new Error(musicData.error.message);
        }

        // 3. Отдаем данные
        res.status(200).json(musicData.items);

    } catch (error) {
        console.error('Backend Error:', error);
        res.status(500).json({ error: error.message });
    }
}