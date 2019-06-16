function setup() {
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let pre = document.getElementById("predictions");
  let model = null;

  async function startCamera() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();

    setInterval(() => takeSnapshot(), 1000);
  }

  function takeSnapshot() {
    let context = canvas.getContext("2d"),
      width = video.videoWidth,
      height = video.videoHeight;

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      
      context.drawImage(video, 0, 0, width, height);

      classifyImage();
    }
  }

  function isCameraThere(){
    navigator.getMedia({video: true}, function() {
      return true;
    }, function() {
      return false;
    });
  }
  

  async function classifyImage() {
    predictions = await model.classify(canvas);
    displayPredictions(predictions);
  }

  function displayPredictions(predictions) {
    let val = "";

    for (prediction of predictions) {
      let perc = (prediction.probability * 100).toFixed(2);
      val += `${perc}% | ${prediction.className}\n`;
      console.log(val);
    }
    pre.innerHTML = val;

    // Get the logits.
    const logits = model.infer(img);
    console.log('Logits');
    logits.print(true);

    // Get the embedding.
    const embedding = model.infer(img, true);
    console.log('Embedding');
    embedding.print(true);

  }

  async function main() {
    if(isCameraThere){
      pre.innerHTML = 'No camera available!';
    } else {
      model = await mobilenet.load();
      await startCamera();
    }
    
  }
  main();
}