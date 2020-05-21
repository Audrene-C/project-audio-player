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
// player.addEventListener('ended', searchNext(), false);
// player.addEventListener('ended', searchPrev(), false);

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


/* ----- Playing & refresh systems start ----- */
let tabs = document.querySelectorAll('.tab');
let songTitleDiv = document.querySelector('#playerTitleArtist');
let currentTab;

/* Gives the new src to the player and plays it */
function setSong(songLink) {
    player.src = songLink;
    player.play();
}

/* Display song's title and artist */
function refreshSongDisplay(newSongData) {
    songTitleDiv.innerHTML = newSongData;
}

/* Get the content to be displayed from partials */
async function getPartial(url) {
    let response =  await fetch(url);
    let result = await response.text();
    return result;
}

/* Inject the content in the HTML */
function displayPartial(partial) {
    document.querySelector('#content').innerHTML = partial;
}

/* Get song when clicked in album's list and play it */
function clickSong() {
    let albumSongs = document.querySelectorAll('.albumSong');
    albumSongs.forEach(albumSong => {
        albumSong.addEventListener('click', async function() {
            console.log('clicked')
            let songName = albumSong.innerText;
            let songFormData = new FormData;
            songFormData.append('songName', songName); 

            let getSongLink = await fetch('./apps/get-song.php', {
                method: 'POST',
                body: songFormData
        })
            let songLink = await getSongLink.text();
            setSong(songLink);
        })    
    });
}


/* Check if player is playing a song */
player.addEventListener('playing', async function(event) {
    /* Store song's source */
    let currentSong = event.target.src;
    let formData = new FormData;
    formData.append('link', currentSong); 

    /* Send song's source to php to get artist and title */
    let response = await fetch('./apps/get-song-data.php', {
        method: 'POST',
        body: formData
    })
    /* Display song's title and artist in player */
    let songDisplay = await response.text();
    songTitleDiv.innerHTML = songDisplay;

    /* ----- Tab system start ----- */
    /* Display "Now playing" by default when a song is played */
    if (!currentTab) {
        currentTab = 'Now playing';
    }

    /* Listen for click on tabs, and store the targeted tab in currentTab */
    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            if (event.target.innerHTML === 'Now playing') {
                currentTab = 'Now playing';
            } else if (event.target.innerHTML == 'Comments') {
                currentTab = 'Comments';
            } else if (event.target.innerHTML === 'Popular playlists') {
                currentTab = 'Popular playlists';
            } else if (event.target.innerHTML === 'New releases') {
                currentTab = 'New releases';
            } 
        })     
    });

    /* Refresh tab's display */
    async function refreshTabDisplay() {
        if (currentTab === 'Now playing') {
            let partial = await getPartial('./partials/now-playing.php');
            displayPartial(partial);
            } else if (currentTab === 'Comments') {
            let partial = await getPartial('./partials/comments.php');
            displayPartial(partial);
            } else if (currentTab === 'Popular playlists') {
            let partial = await getPartial('./partials/coming-soon.php');
            displayPartial(partial);
            } else if (currentTab === 'New releases') {
            let partial = await getPartial('./partials/coming-soon.php');
            displayPartial(partial);
        }
        clickSong();
        }
    
    refreshTabDisplay();
    /* ----- Tab system end ----- */
})
/* ----- Playing & refresh systems end ----- */


/* Listen for click on sidebar buttons, and call the appropriate php page for display */
let sideButtons = document.querySelectorAll('.sideButton');
sideButtons.forEach(sideButton => {
    sideButton.addEventListener('click', async function(event) {
        if (event.target.innerHTML === 'My comments') {
            let partial = await getPartial('./partials/my-comments.php');
            displayPartial(partial);
        }
    })
});