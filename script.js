const searchButton = document.getElementById('search-button');
const lyricsContainer = document.getElementById('lyrics-container');
const videoContainer = document.getElementById('video-container'); // Add a new container for the video

searchButton.addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

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
      const lyrics = data.lyrics.replace(/\n/g, '<br>'); // Replace \n with <br>
      lyricsContainer.innerHTML = `<p>${lyrics}</p>`;

      // YouTube API setup
      const apiKey = 'AIzaSyDegxQbPKtFouyxCAgoSGzCWEJ5VYnr1BI';
      const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=${songTitle}+${artistName}&key=${apiKey}`;

      fetch(youtubeUrl)
        .then(response => response.json())
        .then(data => {
          const videoId = data.items[0].id.videoId;
          const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

          // Create the video element and add it to the video container
          const videoElement = document.createElement('iframe');
          videoElement.src = videoUrl;
          videoElement.frameBorder = '0';
          videoElement.allowFullScreen = true;
          videoContainer.innerHTML = '';
          videoContainer.appendChild(videoElement);
        })
        .catch(error => {
          console.error('Error fetching YouTube video:', error);
          videoContainer.innerHTML = '<p>Failed to load YouTube video...</p>';
        });
    })
    .catch(error => {
      console.error('Error fetching lyrics:', error);
      lyricsContainer.innerHTML = "<p>Strangely i can't find the lyrics.. <br> maybe you typed it wrong...</p>";
    });
});