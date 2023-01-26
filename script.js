"use strict";

// Rectangle elements
const rectangle = document.getElementById("rectangle");
const options = document.querySelectorAll("#options > div > div.box");
const overlay = document.getElementById("overlay");

// Form elements
const form = document.querySelector("form#form");
const email = form.querySelector("input#email");
const dob = form.querySelector("input#dob");
const dobError = form.querySelector("div.dob-error");
const rectangleError = form.querySelector("div.rectangle-error");

// Global boolean checks
let isBoxDraged = false;
let curBoxNum = NaN;
let curBox;
let printAble = false;
let deleteAble = false;

// Final object
const labels = {};

// indicates if all the boxes are droped or not
function countDragBoxes() {
    if (rectangle.children.length >= 15) {
        printAble = true;
        if (!rectangleError.classList.contains("d-none"))
            rectangleError.classList.add("d-none");
    } else {
        printAble = false;
    }
}

// Loop throgh all the boxes to set the same functionality on each box
for (let i = 0; i < options.length; i++) {
    // Single box
    let box = options[i];

    // Working for non-touch screens

    // Event will call when the box will start draging
    box.addEventListener("dragstart", (e) => {
        box.classList.add("dragging");
        overlay.classList.remove("d-none");
        curBoxNum = i;
        deleteAble = false;
    });

    //Event will call when the box will draged anywhere.
    box.addEventListener("dragend", (e) => {
        box.classList.remove("dragging");
        overlay.classList.add("d-none");
        rectangle.classList.remove("active");

        curBoxNum = NaN;
    });

    // Working for Touch screens
    let boxDragedTouch = false;
    let cursorX = 0;
    let cursorY = 0;
    let boxAdded = false;

    // Event will call when the box touched
    box.addEventListener("touchstart", (e) => {
        console.log("drag start");
        boxDragedTouch = true;
    });

    // Make event call when any touched box is moving on the screen (Draging)
    box.addEventListener("touchmove", (e) => {
        if (boxDragedTouch) {
            console.log("Draging");
            box.style.position = "fixed";
            box.style.left = e.touches[0].clientX + "px";
            box.style.top = e.touches[0].clientY + "px";
            box.style.width = "50px";
            box.style.aspectRatio = "1/1";
            cursorX = e.touches[0].clientX;
            cursorY = e.touches[0].clientY;
        }
    });

    // Event made to be called when the draging box will be droped any where on the screen
    box.addEventListener("touchend", (e) => {
        if (boxDragedTouch) {
            boxDragedTouch = false;

            // Getting the distance of rectangle from screen edges
            const distanceFromTop = rectangle.offsetTop;
            const distanceFromLeft = rectangle.offsetLeft;

            // Getting the actual width and height of rectangle because of responsive functionality
            const rectWidth = rectangle.clientWidth;
            const rectHeight = rectangle.clientHeight;

            if (
                cursorX > distanceFromLeft &&
                cursorX < distanceFromLeft + rectWidth &&
                cursorY > distanceFromTop &&
                cursorY < distanceFromTop + rectHeight
            ) {
                // Styling box to be set in the rectangle
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
                // Style box to go back on its position
                box.style.position = "static";
                box.style.left = "unset";
                box.style.top = "unset";
                box.style.width = "100%";
                box.style.aspectRatio = "1/1";

                // When a draged box removed from the rectangle
                if (boxAdded) {
                    boxAdded = false;
                    document
                        .querySelector(`#options > div:nth-child(${i + 1})`)
                        .appendChild(box);
                }
            }
            // Checking if all the boxes are inside the rectangle or not
            countDragBoxes();
        }
    });
}

// Event will calls a box move over the rectangle while is was dragging
rectangle.addEventListener("dragover", function (event) {
    if (!deleteAble) {
        curBox = document.querySelector(".dragging");
        rectangle.appendChild(curBox);
        rectangle.classList.add("active");
        deleteAble = true;
        countDragBoxes();
    }

    // Getting information and creating variables for better code readability
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

// Removing the box from screen while it was dragging
overlay.addEventListener("dragover", () => {
    if (deleteAble) {
        rectangle.classList.remove("active");
        rectangle.removeChild(curBox);
        let emptyBox = document.querySelector(
            `.options > div:nth-child(${curBoxNum + 1})`
        );

        // Making styles
        curBox.style.width = "100%";
        curBox.style.position = "static";
        curBox.style.left = 0;
        curBox.style.top = 0;
        emptyBox.appendChild(curBox);
        deleteAble = false;
        countDragBoxes();
    }
});
// Function to calculate the x and y coordinates of the boxes
function calcCordinates() {
    const WidthHeight = rectangle.clientHeight;
    const oneCord = 100 / 12;
    for (let i = 0; i < rectangle.children.length; i++) {
        const box = rectangle.querySelector(`div.box.box-${i + 1}`);

        // Getting X coordinate
        let fromLeft = box.style.left;
        fromLeft = Number(fromLeft.slice(0, -1));
        let xCord = fromLeft / oneCord;
        if (xCord > 11) {
            xCord = 12.00001;
        }

        // Getting Y Coordinate
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
        // decreasee the number of digits after the decimal point to tow like 2.54 from 2.54232332
        xCord = Number(xCord.toFixed(2));
        yCord = Number(yCord.toFixed(2));

        // saving the labels data into the object which we created in a Global scop
        labels[`label-${i + 1}`] = {
            x: xCord,
            y: yCord,
        };
    }

    // Start working on the data shown with BLOB
    // Create new blob and the JSON data.
    const json = JSON.stringify(labels);
    const blob = new Blob([json], { type: "application/json" });

    // fetching the quesuet for show some data in the broswer.
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

    // Data developed and Now ready to work with locati
    const url = URL.createObjectURL(blob);
    window.location = url;
}

// Submitting the form by some validations
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
