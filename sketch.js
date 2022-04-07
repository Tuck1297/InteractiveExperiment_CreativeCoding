/**
 * Tucker Johnson
 * Creative Coding Spring 2022
 */
const density = '@#O%+=|i-:....        ';
let video, asciiDiv, XPImage, dialogImage, errorAudio, introAudio;
let videoState = false;
let okButton = false;
let beginning = true;
let clicked = false;
let loadingState = false;
let matrixState = false;
let enterState = false;
let intro = false;
let error = false;
let textOpacity = 0;
let loading = 0;
let beginningScreenOpacity = 255;
// Preload P5 Method
function preload() {
    XPImage = loadImage('Images/Windows_XP.jpg');
    dialogImage = loadImage('Images/xpnotificationbox.png');
    errorAudio = loadSound('Audio/erro.mp3');
    introAudio = loadSound('Audio/oxp.wav');
}
// Setup P5 Method
function setup() {
    //createCanvas(400,400);
    video = createCapture(VIDEO);
    video.size(192, 144);
    video.hide();
    asciiDiv = createDiv();
    createCanvas(innerWidth, innerHeight);
}
function draw() {
    background(0);
    // Intro Animation
    if (beginning == true) {
        if (intro == false) {
            introAudio.play();
            intro = true;
        }
        beginningScreenOpacity = beginningScreenOpacity - 1;
        windowsXPAnimation();
    }
    if (videoState == true) {
        image(video, 0, 0, innerWidth, innerHeight);
    }
    // Video text conversion
    if (matrixState == true) {
        fill(0, 0, 0, textOpacity);
        rect(0, 0, innerWidth, innerHeight);
        let pixelsString = extractPixels();
        textSize(5);
        textFont('Courier');
        textLeading(6);
        fill(255, 255, 255, textOpacity);
        text(pixelsString, -100, -50);

        if (loadingState == false && enterState == true) {
            interactiveTextBox(innerWidth / 2, innerHeight / 2);
        }
    }
    // Loading Animation
    if (loadingState == true) {
        loadingAnimation(innerWidth / 2, innerHeight / 2);
        textOpacity = textOpacity + 5;
        if (textOpacity > 255) {
            loadingState = false;
            videoState = false;
            enterState = true;

        }
    }
}
// Extract pixels and convert to text video representation
function extractPixels() {
    video.loadPixels();
    let asciiImage = '';
    for (let j = 0; j < video.height; j++) {
        for (let i = 0; i < video.width; i++) {
            let pixelIndex = ((i + j * video.width) * 4);
            const r = video.pixels[pixelIndex + 0];
            const g = video.pixels[pixelIndex + 1];
            const b = video.pixels[pixelIndex + 2];
            const average = (r + b + g) / 3;
            const len = density.length;
            const charIndex = floor(map(average, 0, 255, len, 0));
            const c = density.charAt(charIndex);
            if (c == ' ') asciiImage += ' ..'
            else asciiImage += c + "..";
        }
        asciiImage += '\n';
    }
    return asciiImage;
}
// Introduction windows xp animation
function windowsXPAnimation() {
    image(XPImage, 0, 0, innerWidth, innerHeight);
    fill(0, 0, 0, beginningScreenOpacity);
    rect(0, 0, innerWidth, innerHeight);
    if (beginningScreenOpacity < -100) {
        if (error == false) {
            errorAudio.play();
            error = true;
        }
        image(dialogImage, (innerWidth / 2) - 300, (innerHeight / 2) - 150, 550, 300);
        fill('black');
        textSize(22);
        text('Scan complete...', (innerWidth / 2) - 110, (innerHeight / 2) - 40);
        text('No threat detected!', (innerWidth / 2) - 120, (innerHeight / 2) - 10);
        text('Click OK if you wish to continue.', (innerWidth / 2) - 180, (innerHeight / 2) + 20);
        text('Make sure your browser is set to full screen.', (innerWidth / 2) - 240, (innerHeight / 2) + 110);
        fill('#6699ff');
        rect((innerWidth / 2) - 80, (innerHeight / 2) + 30, 90, 30, 3);
        fill('white');
        rect((innerWidth / 2) - 78, (innerHeight / 2) + 32, 86, 26, 3);
        fill('black');
        textSize(18);
        text('OK', (innerWidth / 2) - 48, (innerHeight / 2) + 52);

        if (mouseX < (innerWidth / 2) + 10 && mouseX > (innerWidth / 2) - 80 && mouseY > (innerHeight / 2) +
            30 && mouseY < (innerHeight / 2) + 60) {
            if (clicked == true) {
                fill('#6699ff');
                rect((innerWidth / 2) - 80, (innerHeight / 2) + 30, 90, 30, 3);
                fill('grey');
                rect((innerWidth / 2) - 78, (innerHeight / 2) + 32, 86, 26, 3);
                fill('black');
                textSize(18);
                text('OK', (innerWidth / 2) - 48, (innerHeight / 2) + 52);
            }
        }
    }
}

function mousePressed() {
    clicked = true;
}
function mouseReleased() {
    if (mouseX < (innerWidth / 2) + 10 && mouseX > (innerWidth / 2) - 80 && mouseY > (innerHeight / 2) +
        30 && mouseY < (innerHeight / 2) + 60) {
        beginning = false;
        videoState = true;
        loadingState = true;
        matrixState = true;
    }
    if (mouseX > 110 && mouseX < 170 && mouseY > 90 && mouseY < 120 && loadingState == false && matrixState == true) {
        // When reach this state jump over to the interactive environment
        matrixState = false;
        location.href = "index (2).html";

    }
    clicked = false;
}
// Loading animation 
function loadingAnimation(centerX, centerY) {
    fill('white');
    textSize(50);
    text('UPLOADING', innerWidth / 2 - 110, innerHeight / 2);
    noStroke();
    loading = loading + 1;
    if (loading <= 2) {
        rect(centerX + 170, centerY, 5);
    }
    if (loading >= 2 && loading <= 4) {
        rect(centerX + 170, centerY, 5);
        rect(centerX + 180, centerY, 5);
    }
    if (loading >= 4 && loading <= 6) {
        rect(centerX + 170, centerY, 5);
        rect(centerX + 180, centerY, 5);
        rect(centerX + 190, centerY, 5);
    }
    if (loading > 8) {
        loading = 0;
    }
}
// Interactive text box after loading animation
function interactiveTextBox(centerX, centerY) {
    stroke('white');
    strokeWeight(3);
    fill('black');
    rect(0, 0, 300, 150);
    noStroke();
    fill('white');
    textSize(15);
    text('You have been sucessfully', 30, 30);
    text('uploaded. Click OK to be taken', 12, 50);
    text('to an interactive environment!', 12, 70);
    if (mouseX > 110 && mouseX < 170 && mouseY > 90 && mouseY < 120) {
        stroke('yellow');
        fill('yellow');
    } else {
        stroke('white');
    }
    strokeWeight(2);
    textSize(50);
    text('OK', 110, 120);
    noStroke();
}