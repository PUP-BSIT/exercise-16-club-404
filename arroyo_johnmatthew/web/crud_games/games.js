const container = document.querySelector("#game_info_table");
const gameId = document.querySelector("#game_id");
const gameTitle = document.querySelector("#game_title");
const gameGenre = document.querySelector("#game_genre");
const gameReleaseYear = document.querySelector("#game_release_year");
const gameDeveloper = document.querySelector("#game_developer");
const gamePlatform = document.querySelector("#game_platform");

const endPoint = `https://dimgrey-parrot-643194.hostingersite.com/`+
  `exercises/games.php`;

async function displayGameInfo() {
  const response = await fetch(endPoint);
  const data = await response.json();

  container.innerHTML = ""; 

  for (const item of data) {
    const row = document.createElement("tr");
    const edit = editButton(item);
    const remove = deleteButton(item);

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${item.genre}</td>
      <td>${item.release_year}</td>
      <td>${item.developer}</td>
      <td>${item.platform}</td>`;

    row.append(edit);
    row.append(remove);
    container.append(row);
  }

  output();
}
    
async function insertGameInfo() {
  const choice = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `id=${gameId.value}&\
    title=${gameTitle.value}&\
    genre=${gameGenre.value}&\
    release_year=${gameReleaseYear.value}&\
    developer=${gameDeveloper.value}&\
    platform=${gamePlatform.value}`,
  };

  const response = await fetch(endPoint, choice);

  if (!response.ok) {
    console.error(
      "Error inserting game info:", 
      response.status, 
      response.statusText
    );

    return;
  }
  
  displayGameInfo();
}

async function updateGameInfo() {
  const choice = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `id=${gameId.value}&\
    title=${gameTitle.value}&\
    genre=${gameGenre.value}&\
    release_year=${gameReleaseYear.value}&\
    developer=${gameDeveloper.value}&\
    platform=${gamePlatform.value}`,
  };

  const response = await fetch(endPoint, choice);

  if (!response.ok) {
    console.error(
      "Error inserting game info:", 
      response.status, 
      response.statusText
    );

    return;
  }
  
  displayGameInfo();
}

async function deleteGameInfo(id) {
  const choice = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `id=${id}`,
  };

  const response = await fetch(endPoint, choice);
  
  if (!response.ok) {
    console.error(
      "Error deleting game info:", 
      response.status, 
      response.statusText
    );

    return;
  }

  displayGameInfo();
}

function output(id, title, genre, release_year, developer, platform) {
  gameId.value = id ?? '';
  gameTitle.value = title ?? '';
  gameGenre.value = genre ?? '';
  gameReleaseYear.value = release_year ?? '';
  gameDeveloper.value = developer ?? '';
  gamePlatform.value = platform ?? '';
}

function deleteButton(item) {
  const cell = document.createElement("td");
  const button = document.createElement("button");
  
  button.addEventListener("click", deleteGameInfo.bind(null, item.id));
  button.textContent= "Delete";
  cell.append(button);
  return cell; 
}

function editButton(item) {
  const cell = document.createElement("td");
  const button = document.createElement("button");
  button.addEventListener(
    "click",
    output.bind(
      null,
      item.id,
      item.title,
      item.genre,
      item.release_year,
      item.developer,
      item.platform
    ) 
  );

  button.textContent = "Edit";
  cell.append(button);
  return cell;  
}

displayGameInfo();