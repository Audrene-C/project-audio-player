<?php
include_once '../partials/connection.php';
include_once '../partials/start-session.php';

if (isset($_POST['songId'])) {
    $songId = (int)$_POST['songId'];
    $title = $_POST['title'];
}

$commentsQuery = $database->prepare('SELECT * from comments WHERE song_id = ? ORDER BY comments.created_at');
$commentsQuery->execute([$songId]);
$comments = $commentsQuery->fetchAll(PDO::FETCH_ASSOC);

$commentsCount = count($comments);

echo ('
    <div class="col-12 text-center">
        <h2><b class="text-white">'.$title.'</b></h2>
        <h5 class="mt-3 mb-5">'.$commentsCount.' comments</h5>
    </div>
');

if ($commentsCount !== 0) {
    foreach ($comments as $comment) {
            $userId = $comment['user_id'];

            $userQuery = $database->prepare('SELECT * from users WHERE id = ?');
            $userQuery->execute([$userId]);
            $user = $userQuery->fetch(PDO::FETCH_ASSOC);

        echo ('
            <div class="col-12 col-md-8 text-white mb-4 comment displayList">'
                .$comment['created_at'].' - <b class="name">'.$user['nickname'].'</b> : '.$comment['comment'].'<br>
            </div>
        ');
    } 
} else {
    echo ('
        <div class="container">
            <div class="row justify-content-center text-center">
                <div id="noCommentsYet" class="col-12 col-md-8 mt-5 mb-5 cardText">
                    <h4 class="mb-4 mt-3"><b class="text-white">This song hasn\'t been commented yet<b></h4>
                    <h5 class="mb-3">Be the first one to share thoughts and feelings about this song</h5>
                </div>
            </div>
        </div>
        
    ');
}


if (!isset($_SESSION['nickname'])) {
    echo (' 
        <div class="container">
            <div class="row justify-content-center text-center">
                <div id="signForComment" class="col-12 col-md-8 mt-5 cardText">
                    <h4 class="mb-4 mt-3"><b class="text-white">Join us to comment<b></h4>
                    <h5 class="mb-3">Sign up or log in to post comments</h5>
                </div>
            </div>
        </div>
    ');
}
?>
