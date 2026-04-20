let settings;

window.onload = function () {
    GetSettingsData();
    document.querySelector(".side-bar").addEventListener("click", SwitchScreen);
};

function GetSettingsData() {
    let url = "../settings.json";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            settings = JSON.parse(xhr.responseText);
            LoadInputs();
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function SwitchScreen(e) {
    let targetNode = e.target.closest(".side-bar-item");
    console.log(targetNode);
    let allItems = document.querySelectorAll(".side-bar-item");
    let targetVal = 0;
    for (let i = 0; i < allItems.length; i++) {
        if (targetNode === allItems[i]) {
            targetVal = i;
            break;
        }
    }
    let allPages = document.querySelectorAll(".page");
    for (let j = 0; j < allPages.length; j++) {
        if (j === targetVal) {
            allPages[j].classList.remove("hidden");
            allItems[j].classList.add("selected");
        } else {
            allPages[j].classList.add("hidden");
            allItems[j].classList.remove("selected");
        }
    }
}

function LoadInputs() {
    // This data is gained from the .env
    let obsIpRef = document.querySelector("#obs-ip-input");
    let obsPassRef = document.querySelector("#obs-password-input");

    // This is mostly easy stuff
    let chessUserRef = document.querySelector("#username-input");
    chessUserRef.value = settings.username;
    let obsLabelRef = document.querySelector("#obs-target-text-input");
    obsLabelRef.value = settings.obsLabel;
    let timeoutRef = document.querySelector("#request-delay-input");
    timeoutRef.value = settings.requestRate;

    // Now for the more fancy ones
    let timeControlRef = document.querySelector("#time-control-input");
    let allOptions = timeoutRef.querySelectorAll("option");
    for (let i = 0; i < allOptions.length; i++) {
        if (allOptions[i].value === settings.timeControl) {
            timeControlRef.selectedIndex = i;
            break;
        }
    }

    let startDateRef = document.querySelector("#start-date-input");
    let endDateRef = document.querySelector("#end-date-input");
}
