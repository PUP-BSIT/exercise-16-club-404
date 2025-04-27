<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

$database = 'localhost';
$username = 'root';
$password = "";
$dbname = 'game';

$conn = mysqli_connect($database, $username, $password, $dbname);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM game_information";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
      die("Query failed: ");
    }

    $response = [];
    while ($row = $result->fetch_assoc()) {
      array_push($response, [ 
        'id' => $row['id'],
        'title' => $row['title'],
        'genre' => $row['genre'],
        'release_year' => $row['release_year'],
        'developer' => $row['developer'],
        'platform' => $row['platform'],
      ]);
    }

    echo json_encode($response);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $genre = $_POST['genre'] ?? '';
    $release_year = $_POST['release_year'] ?? '';
    $developer = $_POST['developer'] ?? '';
    $platform = $_POST['platform'] ?? '';

    $sql = "INSERT INTO game_information
      (title, genre, release_year, developer, platform) 
    VALUES ('{$title}', '{$genre}', '{$release_year}', '{$developer}', 
    '{$platform}')";

    if (!mysqli_query ($conn, $sql)) {
      die(mysqli_error($conn));
    }

	  echo "Insert Successful";
} else if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    parse_str(file_get_contents("php://input"), $_PATCH);
    $id = $_PATCH['id'] ?? 0;
    $title = $_PATCH['title'] ?? '';
    $genre = $_PATCH['genre'] ?? '';
    $release_year = $_PATCH['release_year'] ?? '';
    $developer = $_PATCH['developer'] ?? '';
    $platform = $_PATCH['platform'] ?? '';

	  $sql = "UPDATE game_information SET 
      title = '{$title}', 
      genre = '{$genre}', 
      release_year = '{$release_year}', 
      developer = '{$developer}',
      platform = '{$platform}'
	    WHERE id = {$id}";

    if (!mysqli_query($conn, $sql)) {
      die(mysqli_error($conn));
    }

	  echo "Update Successful";
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = $_DELETE['id'] ?? '';

	  $sql = "DELETE FROM game_information WHERE id = {$id}";

    if (!mysqli_query($conn, $sql)) {
      die(mysqli_error($conn));
    }

	  echo "Delete Successful";
} 

mysqli_close($conn);
?>
   