<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Content-Type: application/json; charset=utf-8');
  
  $servername = "localhost";
  $username = "u937067793_club_404_mem";
  $password = "Club-404-!_!";
  $db = "u937067793_club_404";
  $conn = mysqli_connect($servername, $username, $password, $db);

  if (!$conn) {
    die("Connection not found.");
  } else if($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM song_information";
    $result = mysqli_query($conn, $sql);
    $response = [];

    while($row = mysqli_fetch_assoc($result)) {
    array_push($response, array(
      'id'=>$row["id"],
      'title'=> $row["title"],
      'artist_name' => $row["artist_name"],
      'year_released' => $row["year_released"],
      'genre' => $row["genre"],
      'album' => $row["album"]));
    }

    echo json_encode($response);
  } else if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $artist = $_POST['artist_name'];
    $year = $_POST['year_released'];
    $genre = $_POST['genre'];
    $album = $_POST['album'];
    $sql = "INSERT INTO song_information (
            title, 
            artist_name, 
            year_released, 
            genre, 
            album)
            VALUES ('$title', '$artist', '$year', '$genre', '$album')";
    
    if (!$title || !$artist || !$year || !$genre || !$album) {
      die("Please fill all the song fields.");
    }

    if (!mysqli_query($conn, $sql)) {
      echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

    echo "New Song Added.";
  } else if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents('php://input'), $_DELETE);

    $id = $_DELETE["id"] ?? "";
    $sql = "DELETE FROM song_information WHERE id=${id}";

    if (!mysqli_query($conn, $sql)) {
      echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
    
    echo "Deleted successfully!";
  } else if($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    parse_str(file_get_contents('php://input'), $_PATCH);

    $id = $_PATCH["id"] ?? "";
    $updatedTitle = $_PATCH["title"] ?? "";
    $updatedArtist = $_PATCH["artist_name"] ?? ""; 
    $updatedYear = $_PATCH["year_released"] ?? "";
    $updatedGenre = $_PATCH["genre"] ?? "";
    $updatedAlbum = $_PATCH["album"] ?? "";
    $sql = "UPDATE song_information
    SET title='${updatedTitle}', 
      artist_name='${updatedArtist}', 
      year_released='${updatedYear}', 
      genre='${updatedGenre}',
      album='${updatedAlbum}'
    WHERE id=${id}";

    if (!$id) {
      die("Please select a song to update.");
    }

    if (!mysqli_query($conn, $sql)) {
      echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

    echo "Updated successfully";
  }

  mysqli_close($conn);
?>
