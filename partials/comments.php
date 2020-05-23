<?php
    include_once '../partials/start-session.php';
echo ('
        <div class="container-fluid">
            <div class="container">
                <div id="commentsDiv" class="row justify-content-center mt-5">
');
echo ('        
                </div>
            </div>
');

            if (isset($_SESSION['nickname'])) {
echo (' 
            <div class="container">
                <div class="row justify-content-around text-center mt-5">
                    <div id="commentFormDiv" class="col-8">
');
                        include_once "comment-form.php";
echo (' 
                    </div>
                </div>
            </div>
        </div>
');
    }
?>
