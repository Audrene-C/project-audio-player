<?php
include_once '../partials/connection.php';
include_once '../partials/start-session.php';

$userId = (int)$_SESSION['userId'];
$comment = $_POST['comment'];
$songId = (int)$_POST['songId'];
$artist = $_POST['artist'];
$title = $_POST['title'];


$newCommentQuery = $database->prepare('INSERT INTO comments(user_id, comment, song_id, song_artist, song_title)
VALUES(:user_id, :comment, :song_id, :song_artist, :song_title)');

$newCommentQuery->execute(array(
    'user_id' => $userId,
    'comment' => $comment,
    'song_id' => $songId,
    'song_artist' => $artist,
    'song_title' => $title
));
?>