export default async function handler(req, res) {
    // 1. Получаем секретные ключи из настроек Vercel (см. Шаг 4)
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    
    // Ваш Spotify Artist ID (можно найти в ссылке на профиль артиста)
    // Пример: open.spotify.com/artist/YOUR_ID_HERE
    const artist_id = '6eAmPXwxNuj3OuHLPClog7?si=EAoFOL1GS62jUzS9J3XzHw'; // <-- ЗАМЕНИТЕ НА ID AVA11

    try {
        // 2. Запрашиваем токен доступа (Access Token)
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 3. Запрашиваем альбомы/синглы артиста
        const apiResponse = await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums?include_groups=album,single,ep&market=US&limit=10`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        const musicData = await apiResponse.json();

        // 4. Отдаем данные нашему сайту
        res.status(200).json(musicData.items);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}