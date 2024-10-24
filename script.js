const searchButton = document.getElementById('search-button');
const lyricsContainer = document.getElementById('lyrics-container');
const videoContainer = document.getElementById('video-container');
const downloadContainer = document.getElementById('download-container');
const buttonApi = document.getElementById('buttonApi');

searchButton.addEventListener('click', function(event) {
  event.preventDefault(); // Previene il comportamento predefinito di invio del modulo

  const songTitle = document.getElementById('song-title').value;
  const artistName = document.getElementById('artist-name').value;

  const apiUrl = `https://lyrist.vercel.app/api/:${songTitle}/:${artistName}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network error... not 404 obviously!!');
      }
      return response.json();
    })
    .then(data => {
      const lyrics = data.lyrics.replace(/\n/g, '<br>'); // Sostituisci \n con <br>
      lyricsContainer.innerHTML = `<p>${lyrics}</p>`;

      // YouTube API setup
      const apiKey = 'AIzaSyDegxQbPKtFouyxCAgoSGzCWEJ5VYnr1BI';
      const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=${songTitle}+${artistName}&key=${apiKey}`;

      fetch(youtubeUrl)
        .then(response => response.json())
        .then(data => {
          const videoId = data.items[0].id.videoId;
          const videoUrl = `https://www.youtube.com/embed/${videoId}`; // URL per l'iframe
          const directVideoUrl = `https://www.youtube.com/watch?v=${videoId}`; // URL diretto per Vevioz

          // Crea l'elemento video e aggiungilo al contenitore video
          const videoElement = document.createElement('iframe');
          videoElement.src = videoUrl;
          videoElement.frameBorder = '0';
          videoElement.allowFullscreen = true;
          videoContainer.innerHTML = '';
          videoContainer.appendChild(videoElement);

          // Richiesta all'API di Vevioz per ottenere il link di download
          getDownloadLink(directVideoUrl, 'mp3'); // Cambia 'mp3' in 'mp4' se necessario
        })
        .catch(error => {
          console.error('Error fetching YouTube video:', error);
          videoContainer.innerHTML = '<p>Failed to load YouTube video...</p>';
        });
    })
    .catch(error => {
      console.error('Error fetching lyrics:', error);
      lyricsContainer.innerHTML = "<p>Strangely I can't find the lyrics... <br> Maybe you typed it wrong...</p>";
    });
});

// Funzione per ottenere il link di download usando l'API di Vevioz
function getDownloadLink(directVideoUrl, ftype) {
  // Usa CORS Anywhere come proxy
  const veviozApiUrl = `https://cors-anywhere.herokuapp.com/https://api.vevioz.com/apis/single/${ftype}?url=${directVideoUrl}`;

  console.log("Vevioz API URL:", veviozApiUrl); // Log dell'URL dell'API Vevioz

  fetch(veviozApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch download link');
      }
      return response.json();
    })
    .then(data => {
      console.log("Vevioz Response Data:", data); // Log della risposta dell'API
      const downloadLink = document.createElement('a');
      downloadLink.href = data.link; // Assicurati che la chiave 'link' sia corretta in base alla risposta dell'API
      downloadLink.textContent = `Scarica ${ftype.toUpperCase()}`;
      downloadLink.target = '_blank'; // Apri il link in una nuova scheda
      downloadLink.classList.add('download-button'); // Aggiungi una classe per il pulsante
      downloadContainer.innerHTML = ''; // Pulisci eventuali link precedenti
      downloadContainer.appendChild(downloadLink);

      // Imposta l'URL dell'iframe del pulsante API
      buttonApi.src = `https://api.vevioz.com/apis/button/${ftype}?url=${directVideoUrl}`;
    })
    .catch(error => {
      console.error('Error fetching download link:', error);
      downloadContainer.innerHTML = '<p>Failed to retrieve download link...</p>';
    });
}
