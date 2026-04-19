window.onload = function () {
    document.querySelector(".side-bar").addEventListener("click", SwitchScreen);
};

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
