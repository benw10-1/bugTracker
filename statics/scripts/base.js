var loaded = {}, userCont, login, dropdown, logo
const images = ["logo.png"]

function loadImages() {
    for (const x of images) {
        let img = new Image(100, 100)
        img.src = "/images/" + x
        loaded[x.split(".")[0]] = img
    }
}

function loadEls() {
    logo = document.querySelector(".logo")
    userCont = document.querySelector(".user-cont")
    login = document.querySelector(".showPopup")
    dropdown = document.querySelector(".dropdown")

    logo.appendChild(loaded.logo.cloneNode())
    login.addEventListener("mousedown", () => {
        toggleDropdown()
    })
}

function toggleDropdown(cond) {
    if (!dropdown) return
    if (typeof cond === "undefined") dropdown.classList.toggle("shown"); return;
    if (cond) dropdown.classList.add("shown")
    else dropdown.classList.remove("shown")
}