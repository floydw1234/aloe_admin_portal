const container = document.getElementById('myContainer');
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set the size of the canvas
const canvasWidth = 1200;
const canvasHeight = 650;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const gridSize = 50; // Size of grid squares

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let scale = 1;
let offsetX = -canvasWidth / 2 + 450;
let offsetY = 20;


var nodes = [{
    nodeId:"",
    x: 600,
    y: 2,
    height:200,
    width:300,
    line_color:"rgb(0 0 0 / 50%)",
    background_color:"white",
    text:"",
    type:"",
    icon:"",
    click:"",
}]

var branches = [{
    parentNodeId:"",
    start_x: 600,
    start_y: 300,
    end_x:400,
    end_y:500,
    color:"rgb(0 0 0 / 50%)",
}]

function draw_initializer_node(x,y){

}

function draw_plus(node){

}


function draw_new_node_options(current_node){
    
}

function draw_new_node_options(options, x,y){
    
}

function draw_empty_branches(prev_node){

}

function draw_filled_node(text, icon){
    
}


function draw_branch({start_x, start_y, end_x, end_y, color}){
    ctx.beginPath();
    start_x = (start_x + offsetX) * scale
    start_y = (start_y + offsetY) * scale
    end_x = (end_x + offsetX) * scale
    end_y = (end_y + offsetY) * scale
    let height = end_y-start_y
    ctx.moveTo(start_x, start_y);
    // ctx.lineTo(start_x, start_y);
    // ctx.lineTo(end_x, start_y );
    ctx.lineTo(end_x, end_y);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2; // Adjust the line width as needed
    ctx.stroke();

}


function draw_rect(start_x,start_y,start_width,start_height,line_color, background_color) {
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

}

function draw() {
    draw_canvas();
    nodes.forEach((node) => {
        draw_tree_element(node)
    })
    branches.forEach((branch)=>{
        //draw_branch(branch)
    })
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

function draw_tree_element(node) {
    draw_rect(node.x, node.y, node.width, node.height, node.line_color, node.background_color)
}

draw();


function updateScale(delta) {
    const zoomSpeed = 0.1;
    scale += delta * zoomSpeed;
    if (scale < 0.1) scale = 0.1;
    if (scale > 5) scale = 5;
    draw();
}

function updateOffset(x, y) {
    offsetX += x;
    offsetY += y;
    draw();
}

function handleMouseWheel(event) {
    const delta = Math.sign(event.deltaY);
    updateScale(delta);
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
container.addEventListener('wheel', handleMouseWheel);
container.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
container.addEventListener('mousemove', handleMouseMove);
container.addEventListener('touchstart', handleTouchStart);
container.addEventListener('touchmove', handleTouchMove);
window.addEventListener('touchend', handleTouchEnd);
