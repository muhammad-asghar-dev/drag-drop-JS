"use strict";

let isBoxDraged = false;
const rectangle = document.getElementById("rectangle");
const options = document.querySelectorAll("#options > div > div.box");

const overlay = document.getElementById("overlay");

const form = document.querySelector("form#form");

const email = form.querySelector("input#email");
const dob = form.querySelector("input#dob");
const dobError = form.querySelector("div.dob-error");
const rectangleError = form.querySelector("div.rectangle-error");

let curBoxNum = NaN;
let curBox;
let printAble = false;
let deleteAble = false;

const labels = {};

function countDragBoxes() {
    if (rectangle.children.length >= 15) {
        printAble = true;
        if (!rectangleError.classList.contains("d-none"))
            rectangleError.classList.add("d-none");
    } else {
        printAble = false;
    }
}

for (let i = 0; i < options.length; i++) {
    let box = options[i];
    box.addEventListener("dragstart", (e) => {
        box.classList.add("dragging");
        overlay.classList.remove("d-none");
        curBoxNum = i;
        deleteAble = false;
    });
    box.addEventListener("dragend", (e) => {
        box.classList.remove("dragging");
        overlay.classList.add("d-none");
        rectangle.classList.remove("active");

        curBoxNum = NaN;
    });

    // For Touch screens
    let boxDragedTouch = false;
    let cursorX = 0;
    let cursorY = 0;
    let boxAdded = false;

    box.addEventListener("touchstart", (e) => {
        console.log("drag start");
        boxDragedTouch = true;
    });

    box.addEventListener("touchmove", (e) => {
        if (boxDragedTouch) {
            console.log("Draging");
            // console.log(e.touches[0].clientX, e.touches[0].clientY);
            box.style.position = "fixed";
            box.style.left = e.touches[0].clientX + "px";
            box.style.top = e.touches[0].clientY + "px";
            box.style.width = "50px";
            box.style.aspectRatio = "1/1";
            cursorX = e.touches[0].clientX;
            cursorY = e.touches[0].clientY;
        }
    });

    box.addEventListener("touchend", (e) => {
        if (boxDragedTouch) {
            boxDragedTouch = false;

            // console.log(cursorX, cursorY);
            //..
            const distanceFromTop = rectangle.offsetTop;
            const distanceFromLeft = rectangle.offsetLeft;

            const rectWidth = rectangle.clientWidth;
            const rectHeight = rectangle.clientHeight;

            // console.log("Distace from left >>", distanceFromLeft);

            if (
                cursorX > distanceFromLeft &&
                cursorX < distanceFromLeft + rectWidth &&
                cursorY > distanceFromTop &&
                cursorY < distanceFromTop + rectHeight
            ) {
                console.log("++++++++++");
                rectangle.appendChild(box);

                box.style.position = "absolute";
                box.style.left =
                    ((cursorX - distanceFromLeft) / rectWidth) * 100 + "%";
                box.style.top =
                    ((cursorY - distanceFromTop) / rectHeight) * 100 + "%";
                box.style.width = 100 / 12;
                box.style.aspectRatio = "1/1";
                boxAdded = true;
            } else {
                console.log("----------");
                box.style.position = "static";
                box.style.left = "unset";
                box.style.top = "unset";
                box.style.width = "100%";
                box.style.aspectRatio = "1/1";
                if (boxAdded) {
                    boxAdded = false;
                    document
                        .querySelector(`#options > div:nth-child(${i + 1})`)
                        .appendChild(box);
                }
            }
            countDragBoxes();
        }
    });
}

rectangle.addEventListener("dragover", function (event) {
    if (!deleteAble) {
        curBox = document.querySelector(".dragging");
        rectangle.appendChild(curBox);
        rectangle.classList.add("active");
        deleteAble = true;
        countDragBoxes();
    }
    var rect = rectangle.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    let width = rectangle.clientWidth;
    let height = rectangle.clientHeight;

    let fromLeft = (x * 100) / width - 4;
    let fromTop = (y * 100) / height - 4;

    fromLeft < 0 ? (fromLeft = 0) : "";
    fromLeft > 92 ? (fromLeft = 92) : "";

    fromTop < 0 ? (fromTop = 0) : "";
    fromTop > 92 ? (fromTop = 92) : "";

    curBox.style.width = 100 / 12 + "%";
    curBox.style.position = "absolute";
    curBox.style.left = `${fromLeft}%`;
    curBox.style.top = `${fromTop}%`;
});
overlay.addEventListener("dragover", () => {
    if (deleteAble) {
        rectangle.classList.remove("active");
        rectangle.removeChild(curBox);
        let emptyBox = document.querySelector(
            `.options > div:nth-child(${curBoxNum + 1})`
        );
        curBox.style.width = "100%";
        curBox.style.position = "static";
        curBox.style.left = 0;
        curBox.style.top = 0;
        emptyBox.appendChild(curBox);
        deleteAble = false;
        countDragBoxes();
    }
});

function calcCordinates() {
    const WidthHeight = rectangle.clientHeight;
    const oneCord = 100 / 12;
    for (let i = 0; i < rectangle.children.length; i++) {
        const box = rectangle.querySelector(`div.box.box-${i + 1}`);

        let fromLeft = box.style.left;
        fromLeft = Number(fromLeft.slice(0, -1));
        let xCord = fromLeft / oneCord;
        if (xCord > 11) {
            xCord = 12.00001;
        }

        let fromTop = box.style.top;
        fromTop = Number(fromTop.slice(0, -1));
        let yCord = fromTop / oneCord;
        yCord = 11 - yCord;
        if (yCord === 11 || yCord > 11) {
            yCord = 12.00001;
        }
        if (yCord < 0) {
            yCord = 0.00001;
        }
        xCord = Number(xCord.toFixed(2));
        yCord = Number(yCord.toFixed(2));
        labels[`label-${i + 1}`] = {
            x: xCord,
            y: yCord,
        };
    }
    const json = JSON.stringify(labels);
    const blob = new Blob([json], { type: "application/json" });

    fetch("", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "bearer ",
        },
        body: blob,
    }).then((response) => {
        return response.json();
    });
    // .then((data) => {
    //     console.log(data);
    // })
    // .catch((error) => {
    //     console.error(error);
    // });
    const url = URL.createObjectURL(blob);
    window.location = url;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    dob.addEventListener("change", () => {
        if (!dobError.classList.contains("d-none"))
            dobError.classList.add("d-none");
    });

    if (dob.value) {
        if (printAble) {
            if (email.value) {
                labels["email"] = email.value;
            } else {
                labels["email"] = "email not provided!";
            }
            labels["dob"] = dob.value;
            calcCordinates();
        } else {
            if (rectangleError.classList.contains("d-none"))
                rectangleError.classList.remove("d-none");
        }
    } else {
        dobError.classList.remove("d-none");
    }
});
