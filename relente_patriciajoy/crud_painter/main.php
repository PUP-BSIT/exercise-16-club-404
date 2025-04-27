<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

$database = 'localhost';
$username = 'u937067793_club_404_mem';
$password = "Club-404-!_!";
$dbname = 'u937067793_club_404';

$conn = mysqli_connect($database, $username, $password, $dbname);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT artist_id,
              first_name,
              last_name,
              nationality,
              artistic_style
            FROM painter_information";

    $result = mysqli_query($conn, $sql);

    // Prepare an array to store the data
    $response = [];

    if ($result) {
      // Fetch rows and add them to the response array
      while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            'artist_id' => $row['artist_id'],
            'firstname' => $row['first_name'],
            'lastname' => $row['last_name'],
            'nationality' => $row['nationality'],
            'artistic_style' => $row['artistic_style'],
        ];
      }
    } else {
      echo "Error: " . mysqli_error($conn);
    }

    echo json_encode($response);

} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstname = isset($_POST['firstname']) ? $_POST['firstname'] : '';
    $lastname = isset($_POST['lastname']) ? $_POST['lastname'] : '';
    $nationality = isset($_POST['nationality']) ? $_POST['nationality'] : '';
    $artstyle = isset($_POST['artstyle']) ? $_POST['artstyle'] : '';

    if (
      empty($firstname) ||
      empty($lastname) ||
      empty($nationality) ||
      empty($artstyle)
    ) {
      echo "Some fields are empty.";
      return;
    }

    $sql = "INSERT INTO painter_information (
      first_name,
      last_name,
      nationality,
      artistic_style
    )
    VALUES (
        '$firstname',
        '$lastname',
        '$nationality',
        '$artstyle'
    )";

    if (mysqli_query($conn, $sql)) {
      echo "New painter created successfully!";
      mysqli_close($conn);
      return;
    }
      echo "Error: " . mysqli_error($conn);
      mysqli_close($conn);

} else if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    parse_str(file_get_contents('php://input'), $_PATCH);

    // Get the fields
    $dataArtistId = $_PATCH["artist_id"] ?? "";
    $dataFirstname = $_PATCH["firstname"] ?? "";
    $dataLastname = $_PATCH["lastname"] ?? "";
    $dataNationality = $_PATCH["nationality"] ?? "";
    $dataArtisticStyle = $_PATCH["artistic_style"] ?? "";

    // Escape inputs
    $dataArtistId = intval($dataArtistId);
    $dataFirstname = mysqli_real_escape_string($conn, $dataFirstname);
    $dataLastname = mysqli_real_escape_string($conn, $dataLastname);
    $dataNationality = mysqli_real_escape_string($conn, $dataNationality);
    $dataArtisticStyle = mysqli_real_escape_string($conn, $dataArtisticStyle);

    // Check if required fields are present
    if (
      $dataArtistId &&
      $dataFirstname &&
      $dataLastname &&
      $dataNationality &&
      $dataArtisticStyle
    ) {
      $sql = "UPDATE painter_information
              SET first_name = '{$dataFirstname}',
                  last_name = '{$dataLastname}',
                  nationality = '{$dataNationality}',
                  artistic_style = '{$dataArtisticStyle}'
              WHERE artist_id = {$dataArtistId}";

      if (!mysqli_query($conn, $sql)) {
          echo "An error occurred while updating the record.";
          mysqli_close($conn);
          exit;
      }

        echo "Updated successfully";
    } else {
        echo "Missing fields";
    }

} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents('php://input'), $_DELETE);

    $id = isset($_DELETE["artist_id"]) ? intval($_DELETE["artist_id"]) : 0;

    if (!$id) {
        echo "Invalid artist ID.";
        mysqli_close($conn);
        exit;
    }

    $sql = "DELETE FROM painter_information WHERE artist_id = {$id}";

    if (!mysqli_query($conn, $sql)) {
        echo "An error occurred while deleting the record.";
        mysqli_close($conn);
        exit;
    }

    echo "Deleted successfully!";
}

mysqli_close($conn);
?>
   