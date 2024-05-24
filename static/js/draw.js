const container = document.getElementById('myContainer');
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set the size of the canvas
const canvasWidth = 1200;
const canvasHeight = 700;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const gridSize = 50; // Size of grid squares

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let scale = 1;
let offsetX = -canvasWidth / 2 + 450;
let offsetY = 20;

var blackColor ="rgb(0 0 0 / 75%)"
var greyColor = "rgb(0 0 0 / 25%)"

let starting_x = 750
let starting_y = 2

let rectWidth = 150
let rectHeight = 100
let line_color = "rgb(0 0 0 / 50%)"
let background_color = "white"

let optionRectWidth = 100
let optionRectHeight = 65

// var nodes = []

var nodes = [{
    id:"1",
    text:"a",
    type:"",
    icon:"",
    click:"",
    children:["2", "3", "4", "5"]
},{
    id:"2",
    text:"b",
    type:"",
    icon:"",
    click:"",
    children:[]
},{
    id:"3",
    text:"c",
    type:"",
    icon:"",
    click:"",
    children:[]
},{
    id:"4",
    text:"d",
    type:"",
    icon:"",
    click:"",
    children:["6","7"]
},{
    id:"5",
    text:"e",
    type:"",
    icon:"",
    click:"",
    children:["8","9"]
},{
    id:"6",
    text:"a",
    type:"",
    icon:"",
    click:"",
    children:[]
},{
    id:"7",
    text:"b",
    type:"",
    icon:"",
    click:"",
    children:[]
},{
    id:"8",
    text:"x",
    type:"",
    icon:"",
    click:"",
    children:[]
},{
    id:"9",
    text:"y",
    type:"",
    icon:"",
    click:"",
    children:[]
}]


var nodeOptions = [
    {
        "text":"Video",
        "imgSrc":"",
        "id":"videoOption"
    },{
        "text":"Multiple choice",
        "imgSrc":"",
        "id":"videoOption"
    }, {
        "text":"Statement",
        "imgSrc":"",
        "id":"videoOption"
    }, {
        "text":"Image",
        "imgSrc":"",
        "id":"videoOption"
    }, {
        "text":"Lead form",
        "imgSrc":"",
        "id":"videoOption"
    }, {
        "text":"PDF",
        "imgSrc":"",
        "id":"videoOption"
    }
]


function draw_initial_ui(){  

    draw_plus(starting_x, starting_y, 50)

    nodeOptions.forEach((option, index)=>{
        draw_node_option(starting_x, starting_y, option, nodeOptions.length,index)
    })

}



function draw_plus(x,y, plus_size){
    start_x = (x + offsetX)
    start_y = (y + offsetY)
    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(start_x, start_y+plus_size);
    ctx.strokeStyle = blackColor;
    ctx.lineWidth = 10; // Adjust the line width as needed
    ctx.lineCap = "round"
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(start_x+plus_size/2, start_y+plus_size/2);
    ctx.lineTo(start_x-plus_size/2, start_y+plus_size/2);
    ctx.strokeStyle = blackColor;
    ctx.lineWidth = 10; // Adjust the line width as needed
    ctx.lineCap = "round"
    ctx.stroke();

}


function draw_node_option(plus_x, plus_y, option, options_len, index){
    // Calculate options width and start positions
    let options_width = (options_len * 120);
    let start_x = (plus_x - (options_width / 2)) + index * 120 + 12.5;
    let start_y = (plus_y + 100);

    // Draw the rectangle
    draw_rect(start_x, start_y, optionRectWidth, optionRectHeight, blackColor, greyColor, option.text, 12);

}



function draw_new_node_options(current_node){
    
}

function draw_new_node_options(options, x,y){
    
}

function draw_empty_branches(prev_node){

}

function draw_filled_node(text, icon){
    
}


function draw_branch(start_x, start_y, end_x, end_y, color){
    ctx.beginPath();
    start_x = (start_x + offsetX) * scale
    start_y = (start_y + offsetY) * scale
    end_x = (end_x + offsetX) * scale
    end_y = (end_y + offsetY) * scale
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(start_x, start_y+25);
    ctx.lineTo(end_x, start_y+25);
    ctx.lineTo(end_x, end_y);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2; // Adjust the line width as needed
    ctx.stroke();

}


function draw_rect(start_x,start_y,start_width,start_height,line_color, background_color, text="", fontSize="") {
    // Set the radius for the rounded edges
    const cornerRadius = 20 * scale;

    // Set the dimensions of the rectangle
    const width = start_width * scale;
    const height = start_height * scale;

    // Calculate the coordinates for the rounded corners
    const xTopLeft = start_x + offsetX;
    const yTopLeft = start_y + offsetY;
    const xTopRight = xTopLeft + width;
    const yTopRight = yTopLeft;
    const xBottomRight = xTopRight;
    const yBottomRight = yTopRight + height;
    const xBottomLeft = xTopLeft;
    const yBottomLeft = yTopLeft + height;
    // Begin the path
    ctx.beginPath();

    // Move to the starting point (top-left corner)
    ctx.moveTo(xTopLeft + cornerRadius, yTopLeft);

    // Draw the top line and top-right corner
    ctx.lineTo(xTopRight - cornerRadius, yTopRight);
    ctx.arcTo(xTopRight, yTopRight, xTopRight, yTopRight + cornerRadius, cornerRadius);

    // Draw the right line and bottom-right corner
    ctx.lineTo(xBottomRight, yBottomRight - cornerRadius);
    ctx.arcTo(xBottomRight, yBottomRight, xBottomRight - cornerRadius, yBottomRight, cornerRadius);

    // Draw the bottom line and bottom-left corner
    ctx.lineTo(xBottomLeft + cornerRadius, yBottomLeft);
    ctx.arcTo(xBottomLeft, yBottomLeft, xBottomLeft, yBottomLeft - cornerRadius, cornerRadius);

    // Draw the left line and top-left corner
    ctx.lineTo(xTopLeft, yTopLeft + cornerRadius);
    ctx.arcTo(xTopLeft, yTopLeft, xTopLeft + cornerRadius, yTopLeft, cornerRadius);

    // Close the path
    ctx.closePath();

    // Set the fill style to a blank color (you can set it to 'white' or any other color)
    ctx.fillStyle = background_color;

    // Fill the path
    ctx.fill();

    ctx.strokeStyle = line_color;
    ctx.lineWidth = 1; // Adjust the line width as needed

    ctx.stroke();

    if(text){
        ctx.font = fontSize + "px 'Poppins', sans-serif";

        // Measure the text width
        let textWidth = ctx.measureText(text).width;

        // Calculate the horizontal position to center the text
        let textX = start_x + (100 - textWidth) / 2  + offsetX;

        // Calculate the vertical position to center the text
        let textY = start_y + 65 / 2 + fontSize / 2  + offsetY;  

        ctx.fillStyle = "black";
        // Draw the text
        ctx.fillText(text, textX, textY);
    }

    

}


draw();

function draw() {
    draw_canvas();
    if(!nodes || nodes.length == 0){
        draw_initial_ui()
    }else{
        draw_tree_elements(nodes[0], starting_x, starting_y)
    }
    
}


function draw_canvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    // Translate and scale the context
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Calculate the start and end points for gridlines outside the canvas
    const startX = Math.floor(-offsetX / gridSize) * gridSize;
    const startY = Math.floor(-offsetY / gridSize) * gridSize;
    const endX = startX + canvasWidth / scale;
    const endY = startY + canvasHeight / scale;

    // Draw gridlines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let x = startX; x < endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
    }
    for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
    }

    ctx.restore();
}

function draw_tree_elements(node, plus_x, plus_y) {
    draw_rect(plus_x, plus_y, rectWidth, rectWidth, line_color, background_color, node.text, 16)
    node.children.forEach((id, index)=>{
        let child_node = getNodeFromId(id)
        if(child_node){
            let coords = get_coordinates(child_node, node, plus_x, plus_y, index)
            draw_tree_elements(child_node, coords[0], coords[1])
            child_node = getNodeFromId(id)
            coords = get_coordinates(child_node, node, plus_x, plus_y, index)
            draw_branch(plus_x+rectHeight/2+25, plus_y+rectHeight+50, coords[0]+rectWidth/2, coords[1])
        }
    })
}

function getNodeFromId(id){
    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].id === id){
            return nodes[i]
        }
    }
    return null
}

function get_coordinates(node, parent, plus_x, plus_y, current_index){

    let leftNeighbor = null
    let rightNeighbor = null

    if (current_index - 1 > 0) {
        leftNeighbor = getNodeFromId(parent.children[current_index-1])
    }
    if (current_index + 1 < parent.children.length) {
        rightNeighbor = getNodeFromId(parent.children[current_index+1])
    }

    let leftChildOffset = getNodeRecursiveWidth(leftNeighbor)/2
    let rightChildOffset = getNodeRecursiveWidth(rightNeighbor)/2

    let optionsLength = parent.children.length
    let index = parent.children.indexOf(node.id)
    let options_width = (optionsLength * (rectWidth+50));
    let start_x = (plus_x - (options_width / 2)) + index * (rectWidth+50) + 100 + leftChildOffset;
    let start_y = (plus_y + rectHeight+100);
    return [start_x, start_y]
}

function getNodeRecursiveWidth(node){
    let maxWidth = 0
    if(node && node.children){
        maxWidth = (rectWidth+50) * node.children.length
        node.children.forEach((child)=>{
            maxWidth = Math.max(getNodeRecursiveWidth(child), maxWidth)
        })
       
    }
    return maxWidth

}

function updateOffset(x, y) {
    offsetX += x;
    offsetY += y;
    draw();
}

function handleMouseDown(event) {
    isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    isDragging = false;
}

function handleMouseMove(event) {
    if (isDragging) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        updateOffset(deltaX, deltaY);
    }
}

function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    isDragging = true;
    lastMouseX = touch.clientX;
    lastMouseY = touch.clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
    if (isDragging) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - lastMouseX;
        const deltaY = touch.clientY - lastMouseY;
        lastMouseX = touch.clientX;
        lastMouseY = touch.clientY;
        updateOffset(deltaX, deltaY);
    }
}

function handleTouchEnd(event) {
    event.preventDefault();
    isDragging = false;
}

// Add event listeners
container.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
container.addEventListener('mousemove', handleMouseMove);
container.addEventListener('touchstart', handleTouchStart);
container.addEventListener('touchmove', handleTouchMove);
window.addEventListener('touchend', handleTouchEnd);
