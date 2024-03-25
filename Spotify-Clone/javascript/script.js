console.log("Working!");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`;
}





async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML +
            `<li>
            <img src="img/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Sayan</div>
            </div>
            <div class="playNow">
                <span>Play now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
         </li>`
    }


    // Atach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs
}



const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    // Changed
    else {
        currentSong.pause();
        play.src = "img/play.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";




    // You can delete this from ChatGPT for the playNow img to be change

    // Reset playNow divs
    Array.from(document.querySelectorAll(".playNow")).forEach(playNowDiv => {
        playNowDiv.innerHTML = `
        <span>Play now</span>
        <img class="invert" src="img/play.svg" alt="">
    `;
    });

    // Update playNow div for the current song
    Array.from(document.querySelectorAll(".info")).forEach(infoDiv => {
        if (infoDiv.firstElementChild.innerHTML.trim() === track) {
            const playNowDiv = infoDiv.nextElementSibling;
            playNowDiv.innerHTML = `
            <span>Pause</span>
            <img class="invert" src="img/pause.svg" alt="">
        `;
        }
    });
    // To this CAN BE removed


}


async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let cardContainer = document.querySelector(".cardContainer")
    let anchors = div.getElementsByTagName("a")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];
            // Get the metadata
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);

            cardContainer.innerHTML = cardContainer.innerHTML +
                `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none" >
                            <path d="M18,12L6,19V5z" stroke="black" stroke-width="1.5" fill="black"/>
                        </svg>
                    </div>

                    
                    <img src="/songs/${folder}/cover.jpg" alt="Image">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>
            `
        }
    }


    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })



    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        if (window.innerWidth < 500) {
            e.addEventListener("click", async item => {
                console.log(item.currentTarget.dataset);
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                document.querySelector(".left").style.left = "0";
            });
        }
    });


}


async function main() {

    // Get the list of all the songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    // Display all the albums on the page
    displayAlbums()


    // Atach an event listner to play, previous and next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"


            Array.from(document.querySelectorAll(".playNow")).forEach(playNowDiv => {
                playNowDiv.innerHTML = `
                    <span>Play now</span>
                    <img class="invert" src="img/play.svg" alt="">
                `;
            });
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listner to the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })






    // Add event listner to the hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
        document.querySelector(".left").style.zIndex = "10"
    })

    // Add event listner to the close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
        setTimeout(() => {
            document.querySelector(".userImage").style.display = "block"
        }, 300);

    })

    // Add event listner to previous button
    previous.addEventListener("click", () => {
        console.log("previous clicked");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    // Add event listner to next button
    next.addEventListener("click", () => {
        console.log("next clicked");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })



    // If volume icon was clicked then show volume range
    const range = document.querySelector(".range");
    document.querySelector(".volume img").addEventListener("click", () => {
        range.style.display = range.style.display === "block" ? "none" : "block";
    });

    // Changing the volume icon opacity
    const volume = document.querySelector(".volume img");
    volume.addEventListener("click", () => {
        volume.style.filter = volume.style.filter === "brightness(80%)" ? "brightness(100%)" : "brightness(80%)";
    });

    // Changing volume
    range.getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to " + e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100
    })

}
main()





// Codes for the userimage

// Load the saved user image

// Display none of the input 
document.getElementById('saveImageBtn').style.display = "none"
document.getElementById('userImageInput').style.display = "none"

window.onload = function () {
    const savedImage = localStorage.getItem('userImage');
    if (savedImage) {
        document.querySelector('.userImage').innerHTML = `<img src="${savedImage}" alt="User Image">`;
    }
}


// Add event listner to the User image input
document.getElementById('userImageInput').addEventListener('change', function () {

    const fileInput = document.getElementById('userImageInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageSrc = e.target.result;
            localStorage.setItem('userImage', imageSrc);
            document.querySelector('.userImage').innerHTML = `<img src="${imageSrc}" alt="User Image">`;
        }
        reader.readAsDataURL(file);
    }
})

document.querySelector(".addImage").addEventListener('click', ()=>{
    document.getElementById('userImageInput').click();
    document.getElementById('saveImageBtn').style.display = "block"
})

// Display none to the save button
document.getElementById('saveImageBtn').addEventListener('click', function () {
    setTimeout(() => {
        document.getElementById('saveImageBtn').style.display = "none"
    }, 1000);
})

// Add event listner to the Image container to open the gallery
document.getElementById('userImage').addEventListener('click', function () {
    document.getElementById('userImageInput').click();
    document.getElementById('saveImageBtn').style.display = "block"
});


















