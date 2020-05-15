//select our player in DOM
let player = document.querySelector('#audioPlayer');

// Listen for the music ended event, to play the next audio file
player.addEventListener('ended', next, false);

//declare our empty array for playlists to come
let currentPlaylist = [];

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
            control.textContent = 'Pause';
        } else {
            player.pause();	
            control.textContent = 'Play';
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
        });player.src = currentPlaylist[0].link;
        //if currentPlaylist array is full, empty it
    } else {
        currentPlaylist = [];
    }    
}

// Current index of the files array
let i = 0;

// function for moving to next audio file
function next() {
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
}

function prev() {
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
    var top = 0, left = 0;
    
    do {
        top  += element.offsetTop;
        left += element.offsetLeft;
    } while (element = element.offsetParent);
    
    return { x: left, y: top };
}

/* Make progress bar clickable */
function clickProgress(idPlayer, control, event) {
    var parent = getPosition(control);    // La position absolue de la progressBar
    var target = getMousePosition(event); // L'endroit de la progressBar où on a cliqué
    var player = document.querySelector('#' + idPlayer);
  
    var x = target.x - parent.x; 
    var wrapperWidth = document.querySelector('#progressBarControl').offsetWidth;
    
    var percent = Math.ceil((x / wrapperWidth) * 100);    
    var duration = player.duration;
    
    player.currentTime = (duration * percent) / 100;
}


let contentDiv = document.querySelector('#content');
let partial;

/* get php partial to display in content */
async function getPartial(url) {
    console.log('before fetch')
    let toto =  await fetch(url)

    let response = await toto.text();
    storePartial(response);
    console.warn(response)
}

function storePartial(partialData) {
    partial = partialData;
    console.log('partial 1 = ' + partial);
}

/* Check if hash changes in url */
window.addEventListener('hashchange', async function() {
    if (window.location.hash === '#test') {
        await getPartial('./partials/comment-form.php');
        console.log('partial 2 = ' + partial);
        contentDiv.innerHTML = partial;
    }
})


//get song currently playing'id
// const audioPlayer = document.querySelector('#audioPlayer');

// audioPlayer.addEventListener('playing', (event => {
//     console.log('player on');
//     let currentSong = event.originalTarget.src;
//     fetch('./apps/song-id.php', {
//         method: 'POST',
//         body: currentSong.text
//     })
//     .then(response => {
//         if(response.ok) {
//             return response.text();
//         } else {
//             console.log('response error');
//         }
//     })
// })
// )
