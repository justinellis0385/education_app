let main = document.querySelector('main');
let iframe = document.querySelector('iframe'); // This might be from another page
let options = document.getElementById('options'); // This might be from another page
let game = document.querySelector('.games'); // Select the main games div
let mainImg = document.getElementById('main');
let quiz = document.getElementById('quiz');
let quizPic1 = document.getElementById('quizPic1');
let quizPic2 = document.getElementById('quizPic2');
let clickCount = 0, index = 0;
let video = document.querySelector('video');

let gameOrder, imageType;

const gameArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// New helper function to handle class toggling
function toggleElementVisibility(element, isVisible) {
    if (isVisible) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

function addMainListener() {
    mainImg.addEventListener('click', updateGame);
}

function removeMainListener() {
    mainImg.removeEventListener('click', updateGame);
}

function addQuizListeners() {
    quizPic1.addEventListener('click', checkAnswer);
    quizPic2.addEventListener('click', checkAnswer);
}

function removeQuizListeners() {
    quizPic1.removeEventListener('click', checkAnswer);
    quizPic2.removeEventListener('click', checkAnswer);
}

function addEventListeners() {
    addMainListener();
    addQuizListeners();
}

function removeEventListeners() {
    removeMainListener();
    removeQuizListeners();
}

function playAudio(audioName) {
    let audio = document.querySelector(`audio[name="${audioName}"]`);
    audio.play();
    return audio;
}

function playMainAudio() {
    removeMainListener();
    let mainAudio = new Audio(`../audio/${gameArray[index]}.m4a`);
    mainAudio.play();
    mainAudio.addEventListener('ended', function() {
        let goodJob = playAudio('goodJob');
        goodJob.addEventListener('ended', addMainListener);
    })
}

function setMainImage() {
    if (index !== gameArray.length) {
        mainImg.src = `../images/${imageType}${gameArray[index]}.jpg`;
        mainImg.name = gameArray[index];
    } else {
        mainImg.src = `../images/unicorn.jpg`;
    }
}

function reloadPage() {
    location.reload(true);
}

function endGame() {
    let gameOver = playAudio('gameOver');
    gameOver.addEventListener('ended', function() {
        let cheer = playAudio('cheer');
        cheer.addEventListener('ended', reloadPage);
    })
}

function playVideo() {
    video.src = `../video/${gameArray[index-1]}.mp4`;
    setMainImage();
    toggleElementVisibility(game, false);
    toggleElementVisibility(quiz, false);
    toggleElementVisibility(video, true);
    video.play();
    video.addEventListener('ended', function() {
        toggleElementVisibility(game, true);
        toggleElementVisibility(video, false);
        if (index === gameArray.length) {
            setMainImage();
            removeMainListener();
            endGame();
        } else {
            removeMainListener();
            let clickLetter = playAudio('clickLetter');
            clickLetter.addEventListener('ended', addMainListener);
        }
    })
}

function checkAnswer(event) {
    removeQuizListeners();
    if (event.target.name === gameArray[index - 1]) {
        let rightAnswer = playAudio('rightAnswer');
        rightAnswer.addEventListener('ended', function() {
            toggleElementVisibility(quiz, false);
            addQuizListeners();
            playVideo();
        })
    } else {
        let wrongAnswer = playAudio('wrongAnswer');
        wrongAnswer.addEventListener('ended', addQuizListeners);
    }
}

function getRandomCharacter() {
    return gameArray[Math.floor(Math.random() * gameArray.length)];
}

function setQuizImageSource(pic1Source, pic2Source) {
    quizPic1.src = `../images/${imageType}${pic1Source}.jpg`;
    quizPic1.setAttribute('name', pic1Source);
    quizPic2.src = `../images/${imageType}${pic2Source}.jpg`;
    quizPic2.setAttribute('name', pic2Source);
}

function updateQuizImages() {
    let currentCharacter = gameArray[index - 1];
    let randomCharacter = getRandomCharacter();
    if (randomCharacter === currentCharacter) {
      randomCharacter = getRandomCharacter();
    }
    index % 2 === 0 ? setQuizImageSource(currentCharacter, randomCharacter) : setQuizImageSource(randomCharacter, currentCharacter);
}

function updateGame() {
    clickCount++;
    if (clickCount === 1 || clickCount % 2 !== 0) {
        playMainAudio();
    } else if (clickCount % 2 === 0) {
        index++;
        setMainImage();
        updateQuizImages();
        toggleElementVisibility(game, false);
        toggleElementVisibility(quiz, true);
        removeQuizListeners();
        let audio = new Audio(`../audio/quiz${gameArray[index - 1]}.m4a`);
        audio.play();
        audio.addEventListener('ended', addQuizListeners);
    }
}

function setupGame() {
    if (gameOrder === 'reverse') gameArray.reverse();
    setMainImage();
    toggleElementVisibility(game, true);
    toggleElementVisibility(options, false);
    let welcome = playAudio('clickLetter');
    welcome.addEventListener('ended', addEventListeners);
}

function changeOptionChoices() {
    let gameOrderButtons = document.getElementsByClassName('order');
    let imageTypes = document.getElementsByClassName('imageType');
    for (let i = 0; i < gameOrderButtons.length; i++) {
        toggleElementVisibility(gameOrderButtons[i], false);
        toggleElementVisibility(imageTypes[i], true);
    }
}

function addOptionListener() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('imageType')) {
            imageType = event.target.name;
            setupGame();
        }
    }, false);
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('order')) {
        gameOrder = event.target.name;
        main.removeChild(iframe);
        changeOptionChoices();
        let imageChoice = playAudio('imageChoice');
        imageChoice.addEventListener('ended', addOptionListener);
    }
}, false);
