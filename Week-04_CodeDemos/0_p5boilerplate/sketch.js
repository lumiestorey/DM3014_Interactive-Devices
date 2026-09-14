/*
<Project Description>
*/
let video;

function setup() {
    createCanvas(windowWidth, windowHeight);
    video = createCapture(VIDEO);
    video.size(648, 468);
    video.hide();

}

function draw() {
    image(video, 0, 0, windowWidth, windowHeight);
}