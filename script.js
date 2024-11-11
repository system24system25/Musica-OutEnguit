const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Substitua com seu CLIENT ID
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Substitua com sua API KEY
const SCOPES = 'https://www.googleapis.com/auth/youtube.upload';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];

let auth2;

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
    }).then(() => {
        auth2 = gapi.auth2.getAuthInstance();
        if (auth2.isSignedIn.get()) {
            enableUploadButton();
        } else {
            auth2.signIn().then(enableUploadButton);
        }
    });
}

function enableUploadButton() {
    document.getElementById('uploadForm').onsubmit = handleUpload;
}

function handleUpload(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const album = document.getElementById('album').value;
    const isSingle = document.getElementById('isSingle').value === 'true';
    const musicFile = document.getElementById('musicFile').files[0];
    const coverImage = document.getElementById('coverImage').files[0];

    if (!musicFile || !coverImage) {
        alert('Por favor, selecione os arquivos de música e capa!');
        return;
    }

    // Crie um vídeo temporário com o arquivo de áudio e a capa (isso requer backend, não podemos fazer isso no frontend)
    // Aqui vamos simular esse passo criando o arquivo de vídeo com FFmpeg ou outra ferramenta no servidor.

    const videoFile = new File([musicFile], 'video.mp4', { type: 'video/mp4' }); // Simulação do vídeo gerado no backend

    uploadVideoToYouTube(videoFile, title, artist, album, isSingle);
}

// Função para enviar o vídeo para o YouTube usando a YouTube Data API
function uploadVideoToYouTube(file, title, artist, album, isSingle) {
    const videoMetadata = {
        snippet: {
            title: title,
            description: `Artista(s): ${artist}\nÁlbum: ${album}\nSingle: ${isSingle ? 'Sim' : 'Não'}`,
            tags: [artist, album, title, 'music'],
        },
        status: {
            privacyStatus: 'public',  // 'public', 'private', 'unlisted'
        },
    };

    const request = gapi.client.youtube.videos.insert({
        part: 'snippet,status',
        resource: videoMetadata,
        media: {
            body: file,
        },
    });

    request.execute((response) => {
        if (response.error) {
            alert('Erro ao enviar o vídeo para o YouTube: ' + response.error.message);
        } else {
            alert('Vídeo enviado com sucesso! ID do vídeo: ' + response.id);
        }
    });
}

handleClientLoad();

