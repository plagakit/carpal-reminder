// Timer stuff
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let wait_time = 3;
let current_time = 0;
let timer_state = "off"; // "off" "on" "paused"

const updateWaitTime = async (new_time) => {
    wait_time = new_time;
    stopTimer(false);
    await chrome.storage.local.set({"wait_time" : wait_time});
};

const updateCurrentTime = async (new_time) => {
    current_time = new_time;
    await chrome.storage.local.set({"current_time" : current_time});
};

const updateTimerState = async (new_state) => {
    timer_state = new_state;
    await chrome.storage.local.set({"timer_state" : new_state});
}

updateWaitTime(wait_time);
updateCurrentTime(current_time);
updateTimerState(timer_state);

// Receive commands from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === "startTimer") {
        startTimer();
    }
    else if (request.cmd === "pauseTimer") {
        pauseTimer();
    }
    else if (request.cmd === "stopTimer") {
        stopTimer(false);
    }
    else if (request.cmd === "updateWaitTime") {
        updateWaitTime(request.data);
    }
});

const startTimer = () => {
    if (timer_state == "off") {
        updateCurrentTime(0);
    }
    updateTimerState("on");
    
    timerLoop();
};

const timerLoop = async () => {
    while (timer_state === "on") {
        await sleep(1000);
        updateCurrentTime(current_time + 1);
        //console.log("tick! ", current_time, wait_time);
        if (current_time >= wait_time) {
            stopTimer(true);
            return;
        }
    }
};

const pauseTimer = () => {
    updateTimerState("paused");
}

const stopTimer = (natural_timeout) => {
    updateTimerState("off");
    updateCurrentTime(0);

    if (natural_timeout) {
        chrome.notifications.clear("stretch");
        chrome.notifications.create("stretch", {
           title: "Carpal Pal",
           message: "Time to stretch your hands!",
           iconUrl: "../images/cat-icon.png",
           type: "basic",
           requireInteraction: true,
           buttons: [
            { title: "Sure!" },
            { title: "Remind me in 15 minutes..." }
           ]
        });
    }
}

// stretch reminder, KAM ADD A LINK TO THE STRETCH GAME HERE
chrome.notifications.onButtonClicked.addListener((notifID, buttonIndex) => {
    if (notifID === "stretch") {
        if (buttonIndex == 0) { // sure!
            console.log("yaya");
            chrome.tabs.create({
                url : "../hands/hands.html"
            });
            (async () => {
                // normally wed wait for them to finish but this is like. works yk
                await updateWaitTime(wait_time + 3); // three minutes to complete the exercise?
                startTimer(); 
            })();
        } 
        else { // 15 min
            (async () => {
                await updateWaitTime(15 * 60);
                startTimer(); 
            })();
        }
    }
});