function getXMLChildByTagName(xmlObject, tagName) {
    const children = xmlObject.children;
    for (var i = 0; i < children.length; i++) {
        xmlItem = children.item(i);
        if (xmlItem.tagName != tagName) {
            continue;
        }
        return xmlItem;
    }
    return null;
}

function getBndBoxesFromXML(xmlObject) {
    const colors = ["green", "red", "blue", "yellow", "black"];
    const bndBoxes = [];
    const xmlElements = xmlObject.all;
    let xmlItem, xmin, xmax;
    for (var i = 0; i < xmlElements.length; i++) {
        xmlItem = xmlElements.item(i);
        if (xmlItem.tagName != 'object') {
            continue;
        }
        const objBndBox = getXMLChildByTagName(xmlItem, "bndbox");
        const objName = getXMLChildByTagName(xmlItem, "name");
        xmin = parseInt(objBndBox.children[0].textContent);
        ymin = parseInt(objBndBox.children[1].textContent);
        xmax = parseInt(objBndBox.children[2].textContent);
        ymax = parseInt(objBndBox.children[3].textContent);
        bndBoxes.push({
            x: xmin,
            y: ymin,
            w: xmax - xmin,
            h: ymax - ymin,
            color: colors[bndBoxes.length],
            name: objName.textContent
        });
    }
    return bndBoxes;
}

function is_mouse_in_shape(x, y, boundingBox, canvas) {
    let shape_left = boundingBox.x //+ parseInt(canvas.offsetLeft);
    let shape_right = shape_left + boundingBox.w;
    let shape_top = boundingBox.y // + parseInt(canvas.offsetTop);
    let shape_bottom = shape_top + boundingBox.h;

    return ( x > shape_left && x < shape_right && y > shape_top && y < shape_bottom );
    
}

function mouse_move(event, canvas, boundingBoxes, ctx, img) {
    if (!is_dragging) return;
    event.preventDefault();
    const mouseX = parseInt(event.clientX) - parseInt(canvas.offsetLeft);
    const mouseY = parseInt(event.clientY) - parseInt(canvas.offsetTop);

    console.log(mouseX, mouseY);

    let bnd_box = boundingBoxes[current_bnd_box_index];
    bnd_box.x = mouseX - ( bnd_box.w / 2 );
    bnd_box.y = mouseY - ( bnd_box.h / 2 );

    renderImg(boundingBoxes, ctx, img);
}

function mouse_up(event) {
    if (!is_dragging) return;
    event.preventDefault();
    is_dragging = false;
}

function mouse_out(event) {
    if (!is_dragging) return;
    event.preventDefault();
    is_dragging = false;
}

function mouse_down(event, canvas, boundingBoxes) {
    // TODO: should consider window.scroll in all events :/ maybe create a handler function?
    const startX = parseInt(event.clientX) - parseInt(canvas.offsetLeft) + window.scrollX;
    const startY = parseInt(event.clientY) - parseInt(canvas.offsetTop) + window.scrollY;
    console.log(startY, window.scrollY);
    event.preventDefault();
    let index = 0;
    for (let bndbox of boundingBoxes) {
        if (is_mouse_in_shape(startX, startY, bndbox, canvas)) {
            console.log(`inside ${bndbox.name}`);
            is_dragging = true;
            current_bnd_box_index = index;
            return;
        }
        index++;
    }
}

function renderImg(boundingBoxes, ctx, img) {
    ctx.clearRect(0, 0, 800, 600);
    ctx.drawImage(img, 0, 0);
    ctx.lineWidth = 3;
    ctx.font = "15px Arial";
    let bb;
    for (var i = 0; i < boundingBoxes.length; i++) {
        bb = boundingBoxes[i];
        ctx.strokeStyle = bb["color"];
        ctx.strokeRect(bb["x"], bb["y"], bb["w"], bb["h"]);
        ctx.fillStyle = bb["color"];
        ctx.fillText(bb["name"], bb["x"] + 15, bb["y"] + 15);
    }
}

function init(boundingBoxes) {
    const canvas = document.getElementById("canvas");
    console.log(canvas.offsetTop);
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => renderImg(boundingBoxes, ctx, img);
    img.src = img_url;
    canvas.onmousedown = (event) => mouse_down(event, canvas, boundingBoxes);
    canvas.onmouseup = mouse_up;
    canvas.onmouseout = mouse_out;
    canvas.onmousemove = (event) => mouse_move(event, canvas, boundingBoxes, ctx, img);
}

const img_anchor = document.querySelector("#img-url");
const label_anchor = document.querySelector("#label-url");

const img_url = img_anchor ? img_anchor.href : null;
const label_url = label_anchor ? label_anchor.href : null;

let is_dragging = false;
let current_bnd_box_index = null;

if (label_url) {
    fetch(label_url)
    .then(res => res.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        const bndBoxes = getBndBoxesFromXML(data);
        init(bndBoxes);
    });
} else {
    init(
        [
            {
                x: 100,
                y: 100,
                w: 100,
                h: 100,
                color: "red",
                name: "undefined",
            }
        ]
    );
}
