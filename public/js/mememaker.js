(function (window, document) {
    CanvasRenderingContext2D.prototype.drawBreakingText = function (str, x, y, w, lh, method) {
        // local variables and defaults
        var textSize = parseInt(this.font.replace(/\D/gi, ''));
        var textParts = [];
        var textPartsNo = 0;
        var words = [];
        var currLine = '';
        var testLine = '';
        str = str || '';
        x = x || 0;
        y = y || 0;
        w = w || this.canvas.width;
        lh = lh || 1;
        method = method || 'fill';

        // manual linebreaks
        textParts = str.split('\n');
        textPartsNo = textParts.length;

        // split the words of the parts
        for (var i = 0; i < textParts.length; i++) {
            words[i] = textParts[i].split(' ');
        }

        // now that we have extracted the words
        // we reset the textParts
        textParts = [];

        // calculate recommended line breaks
        // split between the words
        for (var i = 0; i < textPartsNo; i++) {

            // clear the testline for the next manually broken line
            currLine = '';

            for (var j = 0; j < words[i].length; j++) {
                testLine = currLine + words[i][j] + ' ';

                // check if the testLine is of good width
                if (this.measureText(testLine).width > w && j > 0) {
                    textParts.push(currLine);
                    currLine = words[i][j] + ' ';
                } else {
                    currLine = testLine;
                }
            }
            // replace is to remove trailing whitespace
            textParts.push(currLine);
        }

        // render the text on the canvas
        for (var i = 0; i < textParts.length; i++) {
            if (method === 'fill') {
                this.fillText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y+(textSize*lh*i));
            } else if (method === 'stroke') {
                this.strokeText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y+(textSize*lh*i));
            } else if (method === 'none') {
                return {'textParts': textParts, 'textHeight': textSize*lh*textParts.length};
            } else {
                console.warn('drawBreakingText: ' + method + 'Text() does not exist');
                return false;
            }
        }

        return {'textParts': textParts, 'textHeight': textSize*lh*textParts.length};
    };
}) (window, document);

var canvas = document.createElement('canvas');
var canvasWrapper = document.getElementById('canvasWrapper');
canvasWrapper.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext('2d');
var padding = 15;
var textTop = 'Top Text';
var textBottom = 'Bottom Text';
var textSizeTop = 10;
var textSizeBottom = 10;
var image = document.createElement('img');

image.onload = function (ev) {
    // delete and recreate canvas do untaint it
    canvas.outerHTML = '';
    canvas = document.createElement('canvas');
    canvasWrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    document.getElementById('trueSize').click();
    document.getElementById('trueSize').click();

    draw();
};

document.getElementById('imgURL').oninput = function(ev) {
    image.src = this.value;
};

document.getElementById('textTop').oninput = function(ev) {
    textTop = this.value;
    draw();
};

document.getElementById('textBottom').oninput = function(ev) {
    textBottom = this.value;
    draw();
};

document.getElementById('textSizeTop').oninput = function(ev) {
    textSizeTop = parseInt(this.value);
    draw();
    document.getElementById('textSizeTopOut').innerHTML = this.value;
};

document.getElementById('textSizeBottom').oninput = function(ev) {
    textSizeBottom = parseInt(this.value);
    draw();
    document.getElementById('textSizeBottomOut').innerHTML = this.value;
};

document.getElementById('trueSize').onchange = function(ev) {
    if (document.getElementById('trueSize').checked) {
        canvas.classList.remove('fullwidth');
    } else {
        canvas.classList.add('fullwidth');
    }
};

function style(font, size, align, base) {
    ctx.font = size + 'px ' + font;
    ctx.textAlign = align;
    ctx.textBaseline = base;
}

function draw() {
    // uppercase the text
    var top = textTop.toUpperCase();
    var bottom = textBottom.toUpperCase();

    // set appropriate canvas size
    canvas.width = image.width;
    canvas.height = image.height;

    // draw the image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // styles
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = canvas.width*0.004;

    var _textSizeTop = textSizeTop/100*canvas.width;
    var _textSizeBottom = textSizeBottom/100*canvas.width;

    // draw top text
    style('Impact', _textSizeTop, 'center', 'bottom');
    ctx.drawBreakingText(top, canvas.width/2, _textSizeTop+padding, null, 1, 'fill');
    ctx.drawBreakingText(top, canvas.width/2, _textSizeTop+padding, null, 1, 'stroke');

    // draw bottom text
    style('Impact', _textSizeBottom, 'center', 'top');
    var height = ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none').textHeight;
    console.log(ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none'));
    ctx.drawBreakingText(bottom, canvas.width/2, canvas.height-padding-height, null, 1, 'fill');
    ctx.drawBreakingText(bottom, canvas.width/2, canvas.height-padding-height, null, 1, 'stroke');
}

document.getElementById('textSizeTop').value = textSizeTop;
document.getElementById('textSizeBottom').value = textSizeBottom;
document.getElementById('textSizeTopOut').innerHTML = textSizeTop;
document.getElementById('textSizeBottomOut').innerHTML = textSizeBottom;