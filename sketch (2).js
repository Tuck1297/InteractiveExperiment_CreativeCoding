/**
 * Tucker Johnson
 * Creative Coding Spring 2022
 */
let backgroundMusic1, backgroundMusic2, backgroundMusic3, backgroundMusic4;
let mic, analyzer, settings, courier, canvasImage;
let introArray = 'Remember, everything you do on a computer begin as 1s and 0s. \n The rest is up to you! \n Use the control panel located on the top right corner to interact with your viewspace...';
let currentIntroString = introArray[0];
let audioValHistory = [];
let introVal = 1;
let timeVal = 0;
let width = -innerWidth / 2;
let height = innerHeight / 2;
let translateWidth = ((-innerWidth / 2));
let translateHeight = (-innerHeight / 2);
let alreadyPlaying1 = false;
let alreadyPlaying2 = false;
let alreadyPlaying3 = false;
let alreadyPlaying4 = false;
let MicrophoneOn = false;
let introAnimation = true;
let record = false;
let Binary = true;

// Dat.Gui Interface settings
window.onload = function () {
    let gui = new dat.GUI();
    settings = {
        Video: false, Binary: false, Ellipse: false,
        Transparency: 255, AudioWaves: false, Audio1: false,
        Audio2: false, Audio3: false, Audio4: false,
        Microphone: false, DanceAudio: false, X: 0, Y: 0,
        Z: 0, Size: 0, Distance: 56, ToggleSpeed: 5000,
        ToggleX: false, ToggleY: false, ToggleZ: false,
        BG_Color: [0, 0, 0],
        Element_Color: [0, 128, 0], 
        AudioWavesColor: [255, 255, 255],
        MOVE_BY_XY: 'Hold shift key+click.'
    };
    // Environment folders
    let Environment1Folder = gui.addFolder('Environment1');
    let Environment2Folder = gui.addFolder('Environment2');
    let AudioFolder = gui.addFolder('Audio');
    // Environment 1 controllers
    let binaryController = Environment1Folder.add(settings, 'Binary').listen();
    binaryController.onChange(function (value) {
        settings['AudioWaves'] = false;
        settings['Ellipse'] = false;
        settings['Binary'].updateDisplay();
    });
    let ellipseController = Environment1Folder.add(settings, 'Ellipse').listen();
    ellipseController.onChange(function (value) {
        settings['AudioWaves'] = false;
        settings['Binary'] = false;
        settings['Ellipse'].updateDisplay();
    });

    Environment1Folder.add(settings, 'Transparency', 0, 255);
    Environment1Folder.add(settings, 'X', -30, 30, 0.05);
    Environment1Folder.add(settings, 'Y', -30, 30, 0.05);
    Environment1Folder.add(settings, 'Z', -30, 30, 0.05);
    Environment1Folder.add(settings, 'Size', -10, 10);
    Environment1Folder.add(settings, 'Distance', 0, 100);
    Environment1Folder.add(settings, 'ToggleSpeed', 1, 10000);
    Environment1Folder.add(settings, 'ToggleX');
    Environment1Folder.add(settings, 'ToggleY');
    Environment1Folder.add(settings, 'ToggleZ');
    Environment1Folder.add(settings, 'DanceAudio');
    Environment1Folder.addColor(settings, 'BG_Color');
    Environment1Folder.addColor(settings, 'Element_Color');
    Environment1Folder.add(settings, 'MOVE_BY_XY', true);
    
    // Environment 2 controllers
    let wavesController = Environment2Folder.add(settings, 'AudioWaves').listen();
    wavesController.onChange(function (value) {
        settings['Binary'] = false;
        settings['Ellipse'] = false;
        settings['Binary'] = false;
        settings['AudioWaves'].updateDisplay();
    });
    Environment2Folder.addColor(settings, 'AudioWavesColor');
    // Audio Controllers
    let audio1Controller = AudioFolder.add(settings, 'Audio1').listen();
    audio1Controller.onChange(function (value) {
        settings['Audio2'] = false;
        settings['Audio3'] = false;
        settings['Audio4'] = false;
        settings['Microphone'] = false;
        settings['Audio1'].updateDisplay();
    });
    let audio2Controller = AudioFolder.add(settings, 'Audio2').listen();
    audio2Controller.onChange(function (value) {
        settings['Audio1'] = false;
        settings['Audio3'] = false;
        settings['Audio4'] = false;
        settings['Microphone'] = false;
        settings['Audio2'].updateDisplay();
    });
    let audio3Controller = AudioFolder.add(settings, 'Audio3').listen();
    audio3Controller.onChange(function (value) {
        settings['Audio1'] = false;
        settings['Audio2'] = false;
        settings['Audio4'] = false;
        settings['Microphone'] = false;
        settings['Audio3'].updateDisplay();
    });
    let audio4Controller = AudioFolder.add(settings, 'Audio4').listen();
    audio4Controller.onChange(function (value) {
        settings['Audio1'] = false;
        settings['Audio2'] = false;
        settings['Audio3'] = false;
        settings['Microphone'] = false;
        settings['Audio4'].updateDisplay();
    });
    let micController = AudioFolder.add(settings, 'Microphone').listen();
    micController.onChange(function (value) {
        settings['Audio2'] = false;
        settings['Audio3'] = false;
        settings['Audio4'] = false;
        settings['Audio1'] = false;
        settings['Microphone'].updateDisplay();
    });
   gui.close();
}
// Preload audio and font for text
function preload() {
    backgroundMusic1 = loadSound('Audio/bensound-creativeminds.mp3');
    backgroundMusic2 = loadSound('Audio/morning-garden-acoustic-chill-15013.mp3');
    backgroundMusic3 = loadSound('Audio/HoliznaCC0 - Stealing Glimpses Of Your Face.mp3');
    backgroundMusic4 = loadSound('Audio/Strobotone - Ultimate.mp3');
    courier = loadFont('Font/COURIER.TTF');
}
// Setup P5 Method
function setup() {
    createCanvas(innerWidth, innerHeight, WEBGL);
    amplitude = new p5.Amplitude();
    textFont(courier);
    textAlign(CENTER, CENTER);
    Microphone = new p5.AudioIn();
}
// P5 draw method
function draw() {
    // Check if user wants to start any songs
    checkSounds();
    // Check current audio waves
    let audioVisual = audioWaves();
    // Increment x value either by sound value or base value
    if (settings.ToggleX == true) {
        if (settings.DanceAudio == true) {
            settings.X = settings.X + (audioVisual / settings.ToggleSpeed);
        } else {
            settings.X = settings.X + 100 / settings.ToggleSpeed;
        }
    }
    // Increment y value either by sound value or base value
    if (settings.ToggleY == true) {
        if (settings.DanceAudio == true) {
            settings.Y = settings.Y + (audioVisual / settings.ToggleSpeed);
        } else {
            settings.Y = settings.Y + 100 / settings.ToggleSpeed;
        }
    }
    // Increment z value either by sound value or base value
    if (settings.ToggleZ == true) {
        if (settings.DanceAudio == true) {
            settings.Z = settings.Z + (audioVisual / settings.ToggleSpeed);
        } else {
            settings.Z = settings.Z + 100 / settings.ToggleSpeed;
        }
    }
    // Draw dual audiowaves
    if (settings.AudioWaves == true) {
        background(settings.BG_Color[0], settings.BG_Color[1], settings.BG_Color[2]);
        translate((-innerWidth / 2), -innerHeight);
        stroke(settings.AudioWavesColor[0], settings.AudioWavesColor[1], settings.AudioWavesColor[2]);
        noFill();
        let tempVal;
        beginShape();
        for (let i = 0; i < audioValHistory.length; i++) {
            let y = map(audioValHistory[i], 0, 1, innerHeight, 0);
            vertex(i, y);
        }
        endShape();
        beginShape();
        for (let i = 0; i < audioValHistory.length; i++) {
            let y = map(-audioValHistory[i], 0, 1, innerHeight, 0);
            vertex(i, y);
        }
        endShape();
        if (audioValHistory.length > innerWidth - 100) {
            audioValHistory.splice(0, 1);
        }
        translate((-innerWidth / 2), (-innerHeight / 2));
    } else {
        background(settings.BG_Color[0], settings.BG_Color[1], settings.BG_Color[2]);
        if (introAnimation == true) {
            introTextAnimation();
        }
    }
    // Code to reposition binary or ellipse 3d objects
    if (keyIsDown(SHIFT) === true) {
        fill(255, 255, 255, 120);
        ellipse(0, 20, 500, 300);
        textSize(25);
        fill(0, 0, 0, 255);
        text("Press and hold the shift key \nwhile clicking the mouse \n to move all the \n3D objects on the canvas!", 10, 10);
    }
    // Draw binary text or ellipses
    if (settings.Binary == true || settings.Ellipse == true) {
        if (mouseIsPressed == true && keyIsDown(SHIFT) == true) {
            translateWidth = (-innerWidth / 1.3) + mouseX;
            translateHeight = (-innerHeight / 1.5) + 5 + mouseY;
        }
        translate(translateWidth, translateHeight);
        beginTextAnimation1(audioVisual);
        translate((innerWidth / 2), (innerHeight / 2));
    }  
}

// Get current audio wave values
function audioWaves() {
    let audioOutput;
    if (settings.Microphone == false) {
        analyzer = amplitude.getLevel();
        audioValHistory.push(analyzer);
        audioOutput = map(analyzer, 0, 1, 0, 100);
    } else {
        analyzer = Microphone.getLevel() * 5;
        audioOutput = map(analyzer, 0, 1, 0, 100);
        audioValHistory.push(analyzer);
    }
    return audioOutput;
}

// Logic to draw ellipse/binary objects
function beginTextAnimation1(audioVisual) {
    let elementSize = settings.Size;
    // Affects the size of the binary/ellipse based on audio waves
    if (settings.DanceAudio == true) {
        elementSize = audioVisual + settings.Size;
    }
    push();
    textSize(30 + elementSize);
    for (let j = 0; j < 20; j++) {
        for (let i = 0; i < 50; i++) {
            // Rotate about x,y,z axis for 3D effects
            rotateX((settings.X) / 100);
            rotateY((settings.Y) / 100);
            rotateZ((settings.Z) / 100);
            fill(settings.Element_Color[0], settings.Element_Color[1], settings.Element_Color[2], settings.Transparency);
            // Draw ellipse
            if (settings.Ellipse == true) {
                stroke('black');
                ellipse((settings.Distance) * i, (settings.Distance) * j, elementSize + 20);
            }
            // Draw binary 
            if (settings.Binary == true) {
                text(floor(random(0, 2)), settings.Distance * i, settings.Distance * j);
            }
        }
    }
    pop();
}
// Start,stop,or play audio based on user input
function checkSounds() {
    // Audio 1 settings
    if (settings.Audio1 == true && alreadyPlaying1 == false) {
        backgroundMusic2.stop();
        backgroundMusic3.stop();
        backgroundMusic4.stop();
        amplitude = new p5.Amplitude();
        amplitude.setInput(backgroundMusic1);
        backgroundMusic1.play();
        analyzer = amplitude.getLevel();
        alreadyPlaying1 = true;
    }
    if (settings.Audio1 == false && alreadyPlaying1 == true) {
        backgroundMusic1.stop();
        alreadyPlaying1 = false;
    }
    // Audio 2 settings
    if (settings.Audio2 == true && alreadyPlaying2 == false) {
        backgroundMusic1.stop();
        backgroundMusic3.stop();
        backgroundMusic4.stop();
        amplitude = new p5.Amplitude();
        amplitude.setInput(backgroundMusic2);
        backgroundMusic2.play();
        analyzer = amplitude.getLevel();
        alreadyPlaying2 = true;
    }
    if (settings.Audio2 == false && alreadyPlaying2 == true) {
        backgroundMusic2.stop();
        alreadyPlaying2 = false;
    }
    // Audio 3 settings
    if (settings.Audio3 == true && alreadyPlaying3 == false) {
        backgroundMusic1.stop();
        backgroundMusic2.stop();
        backgroundMusic4.stop();
        amplitude = new p5.Amplitude();
        amplitude.setInput(backgroundMusic3);
        backgroundMusic3.play();
        analyzer = amplitude.getLevel();
        alreadyPlaying3 = true;
    }
    if (settings.Audio3 == false && alreadyPlaying3 == true) {
        backgroundMusic3.stop();
        alreadyPlaying3 = false;
    }
    // Audio 4 settings
    if (settings.Audio4 == true && alreadyPlaying4 == false) {
        backgroundMusic1.stop();
        backgroundMusic2.stop();
        backgroundMusic3.stop();
        amplitude = new p5.Amplitude();
        amplitude.setInput(backgroundMusic4);
        backgroundMusic4.play();
        analyzer = amplitude.getLevel();
        alreadyPlaying4 = true;
    }
    if (settings.Audio4 == false && alreadyPlaying4 == true) {
        backgroundMusic4.stop();
        alreadyPlaying4 = false;
    }
    // Microphone audio settings
    if (settings.Microphone == true && MicrophoneOn == false) {
        backgroundMusic1.stop();
        backgroundMusic2.stop();
        backgroundMusic3.stop();
        backgroundMusic4.stop();
        Microphone.start();
        analyzer = Microphone.getLevel();
        MicrophoneOn = true;
    }
    if (settings.Microphone == false && alreadyPlaying4 == true) {
        Microphone.stop();
        MicrophoneOn = false;
    }
}
// As soon as the first click is detected upon starting the animation get rid
// of the intro animation text
function mouseReleased() {
    introAnimation = false;
}
// Animation that welcomes the user to the interactive experience
function introTextAnimation() {
    fill('white');
    textSize(20);
    timeVal = timeVal + 0.5;
    if (introVal < introArray.length && timeVal % 2.5 == 0) {
        currentIntroString = currentIntroString + introArray[introVal];
        introVal++;
    }
    text(currentIntroString, 0, 0);
}