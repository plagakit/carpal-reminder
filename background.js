// Timer stuff
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let wait_time = 10; // wait time in seconds, default is one second
let current_time = 0;
let timer_running = false;

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if (request.cmd === "startTimer") {
        runTimer();
        sendResponse({status: "good"});
    } else if (request.cmd === "stopTimer") {
        stopTimer();
    }
    if (request.greeting === "hello")
    sendResponse({status: "good"});
});

const runTimer = () => {

    setTimerRunning(true);
    setCurrentTime(0);

    (async () => {
        while (timer_running) {
            await sleep(1000);

            setCurrentTime(current_time + 1);
            if (current_time >= wait_time) {
                stopTimer();
                break;
            }
        }
    })();
    
};

const stopTimer = (natural_timeout) => {
    if (natural_timeout) {

    } else {
        setCurrentTime(wait_time);
    }
    setTimerRunning(false);
};

const setCurrentTime = (new_time) => {
    current_time = new_time;
    chrome.storage.local.set({"current_time": current_time});
};

const setTimerRunning = (new_running) => {
    timer_running = new_running;
    chrome.storage.local.set({"running" : timer_running});
};

setCurrentTime(0);
setTimerRunning(false);
