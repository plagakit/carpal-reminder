// document.addEventListener('DOMContentLoaded', (event) => {
//     // const holistic = new Holistic({
//     //     locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
//     // });
    
//     const hands = new Hands({
//         locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
//     })

//     navigator.mediaDevices.getUserMedia({ video: true })
//         .then( (stream) => {
//             const videoElement = document.querySelector('video');
//             videoElement.srcObject = stream;
//             videoElement.play();

//             hands.setOptions({
//                 input: videoElement,
//                 selfieMode: true,
//                 selfieMode: true,
//                 maxNumHands: 2,
//                 modelComplexity: 1,
//                 minDetectionConfidence: 0.5,
//                 minTrackingConfidence: 0.5
//             });

//             hands.onResults(onResult);

//             // hands.start();
//             window.hands = hands;
//         })
//         .catch((error) => {
//             console.error('Error accessing camera:', error);
//         });

//     const canvasElement = document.querySelector('canvas');
//     const canvasCtx = canvasElement.getContext('2d');

//     function onResult(results) {
//         console.log("We've got results", results);
//         canvasCtx.save();
//         canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//         canvasCtx.drawImage(
//             results.image, 0, 0, canvasElement.width, canvasElement.height
//         );
//         if (results.multiHandLandmarks && results.multiHandedness) {
//             for (let index = 0; index < results.multiHandLandmarks.length; index++) {
//                 const classif = results.multiHandedness[index];
//                 const isRightHand = classification.label === 'Right';
//                 const landmarks = results.multiHandLandmarks[index];
//                 drawingUtils.drawingConnectors(
//                     canvasCtx, landmarks, hands.HAND_CONNECTIONS,
//                     { color: isRightHand ? "#00FF00" : "#FF0000" }
//                 );
//                 drawingUtils.drawLandmarks(canvasCtx, landmarks, {
//                     color: isRightHand ? "#FF0000" : "#00FF00",
//                     fillColor: isRightHand ? "#FF0000" : "#00FF00",
//                     radius: (data) => {
//                         return drawingUtils.lerp(data.from.z, -0.15, 0.1, 10, 1);
//                     }
//                 });
//             }
//         }
//         canvasCtx.restore();

//         if (results.multiHandWorldLandmarks) {
//             const landmarks = results.multiHandWorldLandmarks.reduce(
//                 (prev, curr) => [ ...prev, ...curr ], []
//             );
//             const colors = [];
//             let connections = [];
//             for (let loop = 0; loop < results.multiHandWorldLandmarks.length; loop++) {
//                 const offset = loop * hands.HAND_CONNECTIONS.length;
//                 const offestConnections =
//                     hands.HAND_CONNECTIONS.map(
//                         (connection) => [ connection[0] + offset, connection[1] + offset ]
//                     );
//                 connections = connections.concat(offsetConnections);
//                 colors.push({
//                     list: offsetConnections.map( (_,i) => i + offset ),
//                     color: classif.label
//                 });
//             }
//             // grid.updateLandmarks(landmarks, connections, colors);
//         } else {
//             // grid.updateLandmarks([]);
//         }
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.querySelector('video');
    const canvasElement = document.querySelector('canvas');

    let handLandMarker = undefined;
    let runningMode = "IMAGE";
    

    const createHandLandMarker = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
    }

    createHandLandMarker();
})