<?php
include_once '../partials/connection.php';

function createArray($column) {
    return array ([''.$column.'' => 'No results found']);
}

function search($column, $table, $search) {
    global $database;
    $req = $database->prepare("SELECT $column FROM $table WHERE $column LIKE ? ");
    $req->execute(['%'.$search.'%']);
    $search = $req->fetchAll(PDO::FETCH_ASSOC);
    if($search == false) {
        createArray($column);
        return list ($column) = createArray($column);
        }
    return $search;
}

if(!empty($_POST)) {
    $search = htmlspecialchars($_POST['search']);

    echo json_encode([
        'name' => search('name', 'artists', $search),
        'album_title' => search('album_title', 'albums', $search),
        'title' => search('title', 'songs', $search),
        'playlist_title' => search('playlist_title', 'playlists', $search),
    ]);
    $_POST = array();
}
?>