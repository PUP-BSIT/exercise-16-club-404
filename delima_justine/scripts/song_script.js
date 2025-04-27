const songId = document.querySelector("#song_id");
const songTitle = document.querySelector("#title");
const songArtist = document.querySelector("#artist");
const songYear = document.querySelector("#year_released");
const songGenre = document.querySelector("#genre");
const songAlbum = document.querySelector('#album');
const endpoint = `https://dimgrey-parrot-643194.hostingersite.com/` +
  `exercises/index.php`;

// Function to insert a new song into the database/table
function insertSong() {
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `title=${songTitle.value}&artist_name=${songArtist.value}&` +
          `year_released=${songYear.value}&genre=${songGenre.value}&` +
          `album=${songAlbum.value}`
  })
  .then((response) => response.text())
  .then((responseText) => {
    alert(responseText);
    displayData();
  });
}

// Function to delete a song from the database/table
function deleteSong(id) {
  fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `id=${id}`,
  })
  .then((response) => response.text())
  .then((responseText) => {
    alert(responseText);
    displayData();
  })
}

// Sends the song data to the edit form
function editSong(id, title, artist, year, genre, album) {
  songId.value = id;
  songTitle.value = title;
  songArtist.value = artist;
  songYear.value = year;
  songGenre.value = genre;
  songAlbum.value = album;
}

function clearSongForm() {
  songId.value = "";
  songTitle.value = "";
  songArtist.value = "";
  songYear.value = "";
  songGenre.value = "";
  songAlbum.value = "";
}

// Function to update a song in the database/table
function updateSong() {
  fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `id=${songId.value}&title=${songTitle.value}&` +
          `artist_name=${songArtist.value}&year_released=${songYear.value}&` +
          `genre=${songGenre.value}&album=${songAlbum.value}`
  })
  .then((response) => response.text())
  .then((responseText) => {
    if(!songId) {
      alert("Please select a song id to update.");
      return;
    }

    alert(responseText);
    displayData();
  })
}

// Function to display all songs to the user interface/HTML table
function displayData() {
  const tableBody = document.querySelector("#container");
  fetch(endpoint)
  .then((response) => response.json())
  .then((songList) => {
    tableBody.innerHTML = "";

    for (const song of songList) {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${song.id}</td>
      <td>${song.title}</td>
      <td>${song.artist_name}</td>
      <td>${song.year_released}</td>
      <td>${song.genre}</td>
      <td>${song.album}</td>
      <td><button onClick="editSong(
        ${song.id}, 
        '${song.title}', 
        '${song.artist_name}', 
        '${song.year_released}', 
        '${song.genre}',
        '${song.album}')">Edit</button></td>
      <td><button onClick="deleteSong(${song.id})">Delete</button></td>`
      tableBody.append(row);
    }
   });
}

displayData();