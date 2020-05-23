//select our player in DOM
let player = document.querySelector('#audioPlayer');
//declare our empty array for playlists to come
let currentPlaylist = [];
// Current index of the files array
let i = 0;

let nextSrc = "";
let prevSrc = "";

// Listen for the music ended event, to play the next audio file
player.addEventListener('ended', function() {
    next();
    searchNext();
    searchPrev();
    injectNextPrev();
}, false);

//stop function
function stop() {
    player.currentTime=0;
    player.pause();  
}

/* Play/Pause button */
function play(idPlayer, control) {
    let player = document.querySelector('#' + idPlayer);
    
         if (player.paused) {
            player.play();
            control.innerHTML = "<i class='fas fa-pause'></i>";
        } else {
            player.pause();	
            control.innerHTML = "<i class='fas fa-play'></i>";
        }     
}

/* Mute button */
function mute(idPlayer) {
    let player = document.querySelector('#' + idPlayer);

    if (player.muted) {
        player.muted = false;
    } else {
        player.muted = true;
    }
}

/* Loop button */
function loop(idPlayer) {
    let player = document.querySelector('#' + idPlayer);

    if (player.loop) {
        player.loop = false;
    } else {
        player.loop = true;
    }
}

/* Function Fisher-Yates to shuffle an array */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

/* Random button*/
async function random(url) {
    //if currentPlaylist array is empty, fetch random songs and put them inside
    if(currentPlaylist.length === 0) {
        const response = await fetch(url);
        const results = await response.json();
        results.map(function(data) {
            currentPlaylist.push(data);
        });
        currentPlaylist = shuffle(currentPlaylist);
        player.src = currentPlaylist[0].link;       
        //if currentPlaylist array is full, empty it
    } else {
        currentPlaylist = [];
    }    
}

//ce qu'il aurait fallu faire : créer un obj pour chaque chanson où on stock toutes les infos de la table
//et du coup appeler en une fois
/////////////////////////////////////////////////////////
let imgCoverPrev = document.querySelector('#imgCoverPrev');
let artistTitlePrev = document.querySelector('#artistTitlePrev');
let imgCoverNext = document.querySelector('#imgCoverNext');
let artistTitleNext = document.querySelector('#artistTitleNext');

async function injectNextPrev(goNext, goPrev) {
    //check if current playlist is not empty
        if(currentPlaylist.length !== 0) {
    //check if current song is not the first song, then prev
        if (i !== 0) {
            let superPrevCover = await getPrevCover();
            imgCoverPrev.src = superPrevCover.album_image;
            artistTitlePrev.innerHTML = `<h5>${goPrev.title} - ${goPrev.name}</h5>`;
        }
    //check if current song is not the last song, then next
        if (i !== currentPlaylist.length - 1) {
            let superNextCover = await getNextCover();
            imgCoverNext.src = superNextCover.album_image;
            artistTitleNext.innerHTML = `<h5>${goNext.title} - ${goNext.name}</h5>`;
        }
    }
}

async function getNext(url, method, body) {
    let response = await fetch(url, method, body);
    let results = await response.json();
    return results;
}

async function searchNext() {
    //check if current playlist is not empty
    if(currentPlaylist.length !== 0) {
    //check if current song is not the last song
        if (i !== currentPlaylist.length - 1) {
        nextSrc = currentPlaylist[i+1].link;

        let data = new FormData;
        data.append('nextLink', nextSrc);

        let myNext = await getNext('./apps/getPrevAndNext.php', {
            method: 'POST',
            body: data});
        return myNext;
        }
    }
    
}

async function getPrev(url, method, body) {
    let response = await fetch(url, method, body);
    let results = await response.json();
    return results;
}

async function searchPrev() {
    //check if current playlist is not empty
    if(currentPlaylist.length !== 0) {
    //check if current song is not the first song
        if (i !== 0) {
        prevSrc = currentPlaylist[i-1].link;

        let data = new FormData;
        data.append('prevLink', prevSrc);

        let myPrev = await getPrev('./apps/getPrevAndNext.php', {
            method: 'POST',
            body: data});
        return myPrev;
        }
    }
}

async function getNextCover() {
    let data = new FormData;
    data.append('nextCover', nextSrc);

    let coverNext = await oskourNext('./apps/getPrevAndNext.php', {
        method: 'POST',
        body: data});
    return coverNext;         
}

async function oskourNext(url, method, body) {
    let response = await fetch(url, method, body);
    let results = await response.json();
    return results;
}

async function getPrevCover() {
    let data = new FormData;
    data.append('prevCover', prevSrc);

    let coverPrev = await oskourPrev('./apps/getPrevAndNext.php', {
        method: 'POST',
        body: data});
    return coverPrev;         
}

async function oskourPrev(url, method, body) {
    let response = await fetch(url, method, body);
    let results = await response.json();
    return results;
}

async function letsRandom() {
    await random('./apps/get-playlists.php?random');
    let goNext = await searchNext(nextSrc);
    let goPrev = await searchPrev(prevSrc);
    await injectNextPrev(goNext, goPrev);
}
////////////////////////////////////////////////////////////////

// function for moving to next audio file
async function next() {
    // Check for last audio file in the playlist
    if (i === currentPlaylist.length - 1) {
        i = 0;
    } else {
        i++;
    }
    // Change the audio element source
    stop();
    player.src = currentPlaylist[i].link;
    player.play();
    let goNext = await searchNext(nextSrc);
    let goPrev = await searchPrev(prevSrc);
    await injectNextPrev(goNext, goPrev);
}

async function prev() {
    // Check for last audio file in the playlist
    if (i === 0) {
        i = currentPlaylist.length - 1;
    } else {
        i--;
    }
    // Change the audio element source
    stop();
    player.src = currentPlaylist[i].link;
    player.play();
    let goNext = await searchNext(nextSrc);
    let goPrev = await searchPrev(prevSrc);
    await injectNextPrev(goNext, goPrev);
}


/* Volume controller */
let volumeController = document.querySelector('#volumeController');

volumeController.oninput = function() {
    let volume = (volumeController.value / 10);
    player.volume = volume;	
}

/* Progression bar */
function update(player) {
    let duration = player.duration;    // Durée totale
    let time     = player.currentTime; // Temps écoulé
    if(Number.isNaN(duration) || Number.isNaN(time)) {
        duration = 0;
        time = 0;
    } else {
        let fraction = time / duration;
        let percent  = Math.ceil(fraction * 100);

        let progress = document.querySelector('#progressBar');
        
        progress.style.width = percent + '%';
        progress.textContent = percent + '%';

        document.querySelector('#progressTime').textContent = formatTime(time);
        document.querySelector('#durationTime').textContent = formatTime(duration);
    }
    
}

/* Display current time */
function formatTime(time) {
    let mins  = Math.floor((time % 3600) / 60);
    let secs  = Math.floor(time % 60);
	
    if (secs < 10) {
        secs = "0" + secs;
    }

    if (mins < 10) {
        mins = "0" + mins;
    }
		
    return mins + ":" + secs; // mm:ss
}

/* Click on progress bar to move forward or backward */
function getMousePosition(event) {
    return {
        x: event.pageX,
        y: event.pageY
    };
}

/* Calculate distance between child and parent, and returns top and left values */
function getPosition(element){
    let top = 0, left = 0;
    
    do {
        top  += element.offsetTop;
        left += element.offsetLeft;
    } while (element = element.offsetParent);
    
    return { x: left, y: top };
}

/* Make progress bar clickable */
function clickProgress(idPlayer, control, event) {
    let parent = getPosition(control);    // La position absolue de la progressBar
    let target = getMousePosition(event); // L'endroit de la progressBar où on a cliqué
    let player = document.querySelector('#' + idPlayer);
  
    let x = target.x - parent.x; 
    let wrapperWidth = document.querySelector('#progressBarControl').offsetWidth;
    
    let percent = Math.ceil((x / wrapperWidth) * 100);    
    let duration = player.duration;
    
    player.currentTime = (duration * percent) / 100;
}


/* --------------------------- Playing & refresh systems start --------------------------- */

/* --------------- Statements start --------------- */
let tabs = document.querySelectorAll('.tab');
let songTitleDiv = document.querySelector('#playerTitleArtist');
let currentTab;
let songId;
let songLink;

/* Declare songs data variables */
let songTitleLink;
let songTitle;
let songArtistName;
let songArtistId;
let songArtistPic;
let songDate;
let songAlbumTitle;
let songAlbumId;
let songAlbumDate;
let songAlbumCover;

/* Declare albums data variables */
let albumId;
let albumTitle;
let albumArtistName;
let albumArtistId;
let albumArtistPic;
let albumDate;
let albumCover;
let albumTracks;

let albumTracksIds = [];
let albumTracksLinks = [];

const myHeaders = {
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    "x-rapidapi-key": "3c7ba1a799msh39d4063292763d0p17e532jsn54f102579552"
};

const myInit = { method: 'GET',
                headers: myHeaders};


/* ----- API song request ----- */
async function songQuery(songId) {
    let songResult = await getSongResults(`https://deezerdevs-deezer.p.rapidapi.com/track/${songId}`, myInit);
    return songResult;
}

async function getSongResults(url, init) {
    const response = await fetch(url, init);
    const results = await response.json();
    return results;  
}

/* ----- API album request ----- */
async function albumQuery(albumId) {
    let albumResult = await getAlbumResults(`https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`, myInit);
    return albumResult;
}

async function getAlbumResults(url, init) {
    const response = await fetch(url, init);
    const results = await response.json();
    return results;  
}

/* Make API song request and store result data */
async function makeSongRequest(songId) {
    let songResult = await songQuery(songId);

    songId = songResult.id;
    songTitleLink = songResult.preview;
    songTitle = songResult.title_short;
    songArtistName = songResult.artist.name;
    songArtistId = songResult.artist.id;
    songArtistPic = songResult.artist.picture;
    songDate = songResult.release_date;
    songAlbumTitle = songResult.album.title;
    songAlbumId = songResult.album.id;
    songAlbumDate = songResult.album.release_date;
    songAlbumCover = songResult.album.cover;

    return songAlbumId;
}

/* Make API album request and store result data */
async function makeAlbumRequest(songAlbumId) {
    let albumResult = await albumQuery(songAlbumId);

    albumId = albumResult.id;
    albumTitle = albumResult.title;
    albumArtistName = albumResult.artist.name;
    albumArtistId = albumResult.artist.id;
    albumArtistPic = albumResult.artist.picture;
    albumDate = albumResult.release_date;
    albumCover = albumResult.cover;
    albumTracks = albumResult.tracks.data;

    albumTracksIds = [];
    albumTracksLinks = [];

    for (let i = 0; i < albumTracks.length; i++) {
        albumTracksIds.push(albumTracks[i].id)
    }

    for (let i = 0; i < albumTracks.length; i++) {
        albumTracksLinks.push(albumTracks[i].preview)
    }
}


/* Display album's tracklist splitted in two columns */
function displayAlbumTracklist(albumTracksIds, albumTracksLinks) {
    let albumSongLeft = document.querySelector('#albumSongLeft');
    let albumSongRight = document.querySelector('#albumSongRight');
    let midAlbumLength = Math.round(albumTracksIds.length/2);

    for (let i = 0; i < midAlbumLength; i++) {
        albumSongLeft.innerHTML += '<p data-id="' + albumTracksIds[i] + '" data-link="' + albumTracksLinks[i] + '" class="text-white displayList albumSong">' + albumTracks[i].title + '</p>';
    }
    for (let i = midAlbumLength; i < albumTracksIds.length; i++) {
        albumSongRight.innerHTML += '<p data-id="' + albumTracksIds[i] + '" data-link="' + albumTracksLinks[i] + '" class="text-white displayList albumSong">' + albumTracks[i].title + '</p>';
    }
}

/* Get song when clicked in tracklist, play it and refresh display */
function clickSong() {
    let albumSongs = document.querySelectorAll('.albumSong');
    albumSongs.forEach(albumSong => {
        albumSong.addEventListener('click', async function() {
            songId = albumSong.dataset.id;
            songLink = albumSong.dataset.link;
            let albumId = await makeSongRequest(songId);
            await makeAlbumRequest(albumId); 
            setSong(songLink);
            refreshDisplay();
        })
    });
}

/* Give a new source to the player and play it */
function setSong(songLink) {
    player.src = songLink;
    player.play();
}

/* Display song's title, artist and album's cover */
function refreshSongDisplay(songTitle, songArtistName, songAlbumCover) {
    let albumImgDiv = document.querySelector('#albumImg');
    albumImgDiv.src = songAlbumCover;
    songTitleDiv.innerHTML = '<h5 class="text-white mb-4">' + songTitle + ' - ' + songArtistName + '</h5>';
}

/* Get the content to be displayed from PHP partials */
async function getPartial(url) {
    let response =  await fetch(url);
    let result = await response.text();
    return result;
}

/* Inject partial content in HTML */
function displayPartial(partial) {
    document.querySelector('#content').innerHTML = partial;
}

/* Intercept comment form and post it to PHP with song data for process */
async function commentProcess() {
    let commentForm = document.querySelector('#commentForm');
    let commentInput = document.querySelector('#commentInput');
    commentForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        let commentText = commentInput.value;
        let formData = new FormData();
        formData.append('songId', songId);
        formData.append('comment', commentText);
        formData.append('artist', songArtistName);
        formData.append('title', songTitle);
        await fetch('./apps/comment-process.php', {
            method: 'POST',
            body: formData
        })
        refreshDisplay();
    })
}

/* Send request to PHP to get all song's comments */
async function commentsDisplay() {
    let commentsDiv = document.querySelector('#commentsDiv');
    let formData = new FormData();
    formData.append('songId', songId);
    formData.append('title', songTitle);
    let commentsResponse = await fetch('./apps/get-comments.php', {
        method: 'POST',
        body: formData
    })
    let commentsContent = await commentsResponse.text();
    console.log(commentsContent)
    commentsDiv.innerHTML = commentsContent;
}

/* Listen for click on tabs and store the targeted tab  */
async function listenTab() {
    /* Display "Now playing" by default */
    // if (!currentTab) {
    //     currentTab = 'Now playing';
    // }
    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            if (event.target.innerHTML === 'Now playing') {
                currentTab = 'Now playing';
                refreshTabDisplay();
                return currentTab;
            } else if (event.target.innerHTML == 'Comments') {
                currentTab = 'Comments';
                refreshTabDisplay();
                return currentTab;
            } else if (event.target.innerHTML === 'Popular playlists') {
                currentTab = 'Popular playlists';
                refreshTabDisplay();
                return currentTab;
            } else if (event.target.innerHTML === 'New releases') {
                currentTab = 'New releases';
                refreshTabDisplay();
                return currentTab;
            } 
        })
    });

    return currentTab;
}

async function refreshTabDisplay() {
    if (currentTab === 'Now playing') {
        if (songId) {
            /* Display song's title/artist/cover and album's tracklist */
            let partial = await getPartial('./partials/now-playing.php');
            displayPartial(partial);
            refreshSongDisplay(songTitle, songArtistName, songAlbumCover);
            displayAlbumTracklist(albumTracksIds, albumTracksLinks);
        } else {
            let partial = await getPartial('./partials/now-playing-default.php');
            displayPartial(partial);
        }
        
    } else if (currentTab === 'Comments') {
        if (songId) {
            /* Display comments list and process comment post */
            let partial = await getPartial('./partials/comments.php');
            displayPartial(partial);
            await commentsDisplay();
            commentProcess();
            
        } else {
            let partial = await getPartial('./partials/comments-default.php');
            displayPartial(partial);
        }

    } else if (currentTab === 'Popular playlists') {
    let partial = await getPartial('./partials/coming-soon.php');
    displayPartial(partial);

    } else if (currentTab === 'New releases') {
    let partial = await getPartial('./partials/coming-soon.php');
    displayPartial(partial);
    }

    /* Allows to play songs from tracklist */
    clickSong();
}

async function refreshDisplay() {
    await listenTab();
    await refreshTabDisplay(); 
}

/* --------------- Statements end --------------- */


/* --------------- Playing path --------------- */
player.addEventListener('playing', async function() {

    /* Make API song request */
    let albumId = await makeSongRequest(songId);
    await makeAlbumRequest(albumId);

    /* Refresh all display */
    refreshDisplay();
})

/* Refresh all display once on page loading*/
refreshDisplay();

/* --------------------------- Playing & refresh systems end --------------------------- */


//play playlist when you click on one
function playPlaylist(idPlayer, mySrc) {
    let player = document.querySelector('#' + idPlayer);
    player.src = mySrc;
    player.play();
    songId = idSong;        
}