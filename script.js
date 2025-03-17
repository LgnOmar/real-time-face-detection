const video = document.getElementById('video');


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        { video: {}},
        stream  => video.srcObject = stream,
        err => console.error(err)

    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = {
        width: video.videoWidth,  // Use intrinsic width
        height: video.videoHeight 
    };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async ()=> {
        const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
                inputSize:320,
                scoreThruscoreThreshold: 0.5
            })
        ).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        // requestAnimationFrame(detect);
        
        console.log("Video:", video.videoWidth, video.videoHeight);
        console.log("Canvas:", canvas.width, canvas.height);
    }, 100)
} );