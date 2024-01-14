// DOM Elements
let startTimerButton;
let stopTimerButton;
let freqSelector;

try {
    chrome;

    window.addEventListener("DOMContentLoaded", (event) => {
        
        // Start & stop timer
        startTimerButton = document.getElementById("start-timer");
        startTimerButton.addEventListener("click", () => {
            chrome.runtime.sendMessage({cmd: "startTimer"});
        });
    
        stopTimerButton = document.getElementById("stop-timer");
        stopTimerButton.addEventListener("click", () => {
             chrome.runtime.sendMessage({cmd: "pauseTimer"});
        });
    
        // Button for testing the popup website
        const test_popup = document.getElementById("test-popup");
        test_popup.addEventListener("click", () => {
            alert("Test!");
            chrome.tabs.create({ url: "./test.html" });
        });

        // Frequency selector
        freqSelector = document.getElementById("reminder-freq");
        freqSelector.addEventListener("change", (event) => {
            console.log("updating wait time from freq selector... ", event.target.value);
            updateWaitTime(event.target.value);
            chrome.runtime.sendMessage({cmd: "updateWaitTime", data: event.target.value});
        });
    });

    const waitForTimesToLoad = async () => {
        let wait = undefined;
        let cur = undefined;

        while (!wait) {
            chrome.storage.local.get(["wait_time"]).then(result => result.wait_time = wait);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        while (!cur) {
            chrome.storage.local.get(["current_time"]).then(result => result.current_time = cur);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return [wait, cur];
    }
    
    // Check for changes in current time or state
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (changes.current_time) {
            updateCurrentTime(changes.current_time.newValue);
        }
        if (changes.wait_time) {
            updateWaitTime(changes.wait_time.newValue);
        }
        if (changes.timer_state) {
            updateTimerState(changes.timer_state.newValue);
        }
    });

    const updateCurrentTime = async (new_cur) => {
        chrome.storage.local.get(["wait_time"]).then((result) => {
            console.log("updateCurrentTime (w/c): ", result.wait_time, new_cur);
            updateTimerDisplay(new_cur, result.wait_time);
        });
    };

    const updateWaitTime = async (new_wait) => {
        chrome.storage.local.get(["current_time"]).then((result) => {
            console.log("updateWaitTime (w/c): ", new_wait, result.current_time);
            updateTimerDisplay(result.current_time, new_wait);
        });
    };

    const updateTimerState = (new_state) => {
        if (new_state === "on") {
            freqSelector.disabled = true;
            startTimerButton.disabled = true;
            stopTimerButton.disabled = false;
        } 
        else {
            freqSelector.disabled = false;
            startTimerButton.disabled = false;
            stopTimerButton.disabled = true;
        }
    };

    const updateTimerDisplay = (current_time, wait_time) => {
        console.log("updating display, (w/c): ", wait_time, current_time);
        const time_left = wait_time - current_time;
        const minutes = String(Math.floor(time_left / 60)).padStart(2, '0');
        const seconds = String(time_left % 60).padStart(2, '0');
    
        const time_string = `${minutes}:${seconds}`;
        document.getElementById("timer-text").innerText = time_string;
    
        killLoadingScreen();
    };

    const killLoadingScreen = () => {
        // kill loading cover
        //console.log('killing loading-cover')
        const load = document.getElementById("loading-cover")
        if (load !== null) {
            document.body.removeChild(load);
        }
    };

} catch {
    console.log("Chrome undefined");
}

function natasha() {
  const ele = document.querySelector('#loading-cover');
  if (ele !== null) {
    document.body.removeChild(ele);
  }
}

// natasha's space
document.addEventListener('DOMContentLoaded', () => {
    const accordion = document.querySelector('.collapse-btn');
    
    accordion.addEventListener('click', (ev) => {
        accordion.classList.toggle('active');
        accordion.classList.toggle('inactive');
    });
});