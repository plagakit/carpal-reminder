function calcWAspect(w0, h0, w1, h1) {
    const woh = w0 / h0;
    const how = h0 / w0;

    const hwar = w1 * how;
    const whar = h1 * woh;

    console.log(woh, how, w0, h0, w1, h1, whar, hwar);
    
    if (hwar > h1) {
        console.log( [whar, h1] );
        return [ whar, h1 ]
    } else {
        console.log( [w1,hwar] );
        return [ w1, hwar ];
    }
}

let reportNext = false;

function startCamera(cam) {
    var a = cam, b;
    return J(new I(new B(function(e) {
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia || alert("No navigator.mediaDevices.getUserMedia exists.");
        b = a.h;
        return e.return(navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: b.facingMode,
                width: b.width,
                height: b.height
            }
        }).then(function(f) {
            O(a, f)
        }).catch(function(f) {
            var h = "Failed to acquire camera feed: " + f;
            console.error(h);
            alert(h);
            throw f;
        }))
    }
    )));
}

document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('input-video');
    const canvasElement = document.getElementById('output-canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const outCont = document.querySelector('.out-container');

    function onResults(results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.clientWidth, canvasElement.height);
        // canvasCtx.drawImage(
        //     results.image, 0, 0, canvasElement.width, canvasElement.height
        // );

        if (reportNext) {
            console.log(results);
            reportNext = false;
        }

        if (results.multiHandLandmarks) {
            results.multiHandLandmarks.forEach( (landmarks,i) => {
                drawConnectors(
                    canvasCtx, landmarks, HAND_CONNECTIONS,
                    { color: results.multiHandedness[i].index == 0 ? '#00FF00' : '#a3a300', lineWidth: 5 }
                );
                drawLandmarks(
                    canvasCtx, landmarks,
                    { color: results.multiHandedness[i].index == 0 ? '#FF0000' : '00b5b5', lineWidth: 2 }
                );
            });
        }
        canvasCtx.restore();
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then( (stream)  => {
            videoElement.srcObject = stream;
            // videoElement.play();
            const { width: vWidth, height: vHeight } = stream.getTracks()[0].getSettings();

            let hands = null;
            window.camera = null;

            let lastW = null; lastH = null;

            const createHands = () => {
                hands = new Hands({
                    locateFile: (file) => {
                        return `/libs/mediapipe/hands/${file}`;
                    }
                });
                hands.setOptions({
                    maxNumHands: 2,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });
                hands.onResults(onResults);
            }

            const redoCamera = (ev) => {
                const width = ev.target.clientWidth;
                const height = ev.target.clientHeight;
                
                if ((lastW === width) && (lastH === height)) {
                    return;
                }

                if (width === undefined || height === undefined) {
                    console.log('Undefined size');
                    return;
                }

                console.log(lastW, width, lastH, height);


                lastW = width;
                lastH = height;

                const [ aWidth, aHeight ] = calcWAspect(vWidth, vHeight, width, height);
                console.log(`Canvas will be ${aWidth} x ${aHeight}`);

                if (window.camera !== null) {
                    window.camera.stop();
                    window.oldCamera = window.camera;
                }

                canvasElement.width = aWidth;
                canvasElement.height = aHeight;
                canvasElement.style.width = `${aWidth}px`;
                canvasElement.style.height = `${aHeight}px`;

                setTimeout( () => {
                    if (hands === null) {
                        createHands();
                    }

                    const newCamera = new Camera(videoElement, {
                        onFrame: async () => {
                            await hands.send({ image: videoElement });
                        },
                        width: vWidth, height: vHeight
                    });

                    window.camera = newCamera;
                    newCamera.start();

                    if (document.body.classList.contains('still-loading')) {
                        setTimeout( () => {
                            console.log('Stopping loading');
                            document.body.classList.remove('still-loading');
                            document.body.classList.add('fade-loading');
                            setTimeout( () => {
                                document.body.classList.remove('fade-loading');
                            }, 200);
                        }, 0);
                    }
                }, 0);
            }

            videoElement.addEventListener('resize', redoCamera);

            redoCamera({ target: videoElement });


            // const width = videoElement.clientWidth;
            // const height = videoElement.clientHeight;

            // const [ aWidth, aHeight ] = calcWAspect(vWidth, vHeight, width, height);

            // canvasElement.width = aWidth;
            // canvasElement.height = aHeight;

            // console.log(aWidth, aHeight);

            
            // setTimeout( () => {
                // const camera = new Camera(videoElement, {
                //     onFrame: async () => {
                //         await hands.send({ image: videoElement });
                //     },
                //     width: vWidth, height: vHeight
                // });

                // camera.start();
                // window.camera = camera;

                // setTimeout( () => {
                //     console.log('Stopping loading');
                //     document.body.classList.remove('still-loading');
                //     document.body.classList.add('fade-loading');
                //     setTimeout( () => {
                //         document.body.classList.remove('fade-loading');
                //     }, 200);
                // }, 0);
            // }, 0);
        });
});

document.addEventListener('keydown', (ev) => {
    if (ev.code === "Space") {
        reportNext = true;
    }
});

