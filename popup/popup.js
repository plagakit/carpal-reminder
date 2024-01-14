// DOM Elements
let startTimerButton;
let stopTimerButton;

const wait_time = 10;

try {
    chrome;

    window.addEventListener("DOMContentLoaded", (event) => {
        (async () => {
            let current_time;
            while (true) {
                await chrome.storage.local.get(["current_time"])
                    .then((result) => { current_time = result.current_time; });
                if (current_time !== undefined) break;
                console.log(current_time);
            }
            updateTime(current_time);
        })();
    
        startTimerButton = document.getElementById("start-timer");
        startTimerButton.addEventListener("click", async () => {
            
            const response = await chrome.runtime.sendMessage({cmd: "startTimer"});
        });
    
        stopTimerButton = document.getElementById("stop-timer");
        stopTimerButton.addEventListener("click", async () => {
            
            const response = await chrome.runtime.sendMessage({cmd: "stopTimer"});
        });
    
        const test_popup = document.getElementById("test-popup");
        test_popup.addEventListener("click", () => {
            alert("Test!");
            chrome.tabs.create({ url: "./test.html" });
        });
    
    });
    
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (changes.current_time) {
            updateTime(changes.current_time.newValue);
        }
    
        if (changes.running) {
            updateRunning(changes.running.newValue);
        }
    });
    
    const updateRunning = (running) => {
        if (running) {
            startTimerButton.disabled = true;
            stopTimerButton.disabled = false;
        } 
        else {
            startTimerButton.disabled = false;
            stopTimerButton.disabled = true;
        }
    }
    
    const updateTime = async (current_time) => {
        //let wait_time;
        //await chrome.storage.local.get(["wait_time"]).then((result) => { wait_time = result; });
        //console.log("Current time: ", current_time);
    
        const time_left = wait_time - current_time;
        const minutes = String(Math.floor(time_left / 60)).padStart(2, '0');
        const seconds = String(time_left % 60).padStart(2, '0');
    
        const time_string = `${minutes}:${seconds}`;
        document.getElementById("timer-text").innerText = time_string;
    
        // kill loading cover
        console.log('killing loading-cover')
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


//   let content = this.nextElementSibling;
//     if (content.style.display === "block") {
//       content.style.display = "none";
//     } else {
//       content.style.display = "block";
//     }