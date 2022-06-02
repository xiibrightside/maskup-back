let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const id2class = { 0: "FaceMask", 1: "NoFaceMask" };

const setupCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 600, height: 400 },
      audio: false,
    })
    .then((stream) => {
      window.stream = stream;
      video.srcObject = stream;
    })
    .catch(function (err) {
      console.log("Something went wrong!");
    });
};

function detectImage() {
  video.width = 600;
  video.height = 400;
  detect(video).then((results) => {
    canvas.width = video.width;
    canvas.height = video.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0);
    for (bboxInfo of results) {
      bbox = bboxInfo[0];
      classID = bboxInfo[1];
      score = bboxInfo[2];

      ctx.beginPath();
      ctx.lineWidth = "4";
      if (classID == 0) {
        ctx.strokeStyle = "green";
        ctx.fillStyle = "green";
      } else {
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
      }

      ctx.rect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
      ctx.stroke();

      ctx.font = "30px Arial";

      let content = id2class[classID] + " " + score.toFixed(2);
      ctx.fillText(content, bbox[0], bbox[1] < 20 ? bbox[1] + 30 : bbox[1] - 5);
      if (classID == 1) {
        var sound = new Audio("./x-y.wav");
        sound.play();
      }
    }
  });
}

async function setup() {
  await loadModel();
}
setupCamera();
setup();

video.addEventListener("loadeddata", async () => {
  setInterval(detectImage, 40);
});
