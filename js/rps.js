CANVAS.WIDTH = 1280;
CANVAS.HEIGHT = 720;
CANVAS.FPS = 60;
CANVAS.load = [];

CANVAS.update = function() {

};

CANVAS.refresh = function() {
    CANVAS.Draw.clear();

    GAME.buttons.forEach( function( elem ) {
        CANVAS.Draw.rect( elem.x, elem.y, elem.w, elem.h ).fill( elem.style );;
    } );

    var txt1 = "MousePos: " + GAME.touch.x + ", " + GAME.touch.y,
        txt2 = "id: " + GAME.touch.id,
        txt3 = "press: " + GAME.touch.press;
    CANVAS.Draw.text( txt1, 1, 2, 16, "black" );
    CANVAS.Draw.text( txt2, 1, 14, 16, "black" );
    CANVAS.Draw.text( txt3, 1, 23, 16, "black" );
};

var GAME = {
    buttons: []
};

GAME.Button = function( x, y, w, h, s ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.style = s;
}

var colors = [ "lightpink",
              "lightgreen",
              "#89CFF0" ]

colors.forEach( function( elem, ix ) {
    GAME.buttons[ix] = new GAME.Button( 1038,
                                       6 + ix * 236,
                                       236,
                                       236,
                                       elem );
} );

GAME.click = function() {
    GAME.buttons.forEach( function( elem, ix ) {
        if ( GAME.touch.x >= elem.x && GAME.touch.x <= elem.x + elem.w &&
            GAME.touch.y >= elem.y && GAME.touch.y <= elem.y + elem.h ) {
            GAME.choose( ix );
        }
    } );
};

GAME.choose = function( c ) {
    alert( c );
}

GAME.touch = {
    x: 0,
    y: 0,
    id: 0,
    press: false
};

if ( CANVAS.MOBILE ) {
    window.addEventListener( "touchstart", function( event ) {
        event.preventDefault();

        var touch = event.touches[0],
            rect = CANVAS.doc.getBoundingClientRect();

        GAME.touch.x = touch.clientX - rect.left;
        GAME.touch.x *= CANVAS.WIDTH / CANVAS.currentWidth;

        GAME.touch.y = touch.clientY - rect.top;
        GAME.touch.y *= CANVAS.HEIGHT / CANVAS.currentHeight;

        GAME.touch.id = touch.identifier;

        GAME.touch.press = true;
    }, false );

    window.addEventListener( "touchmove", function( event ) {
        event.preventDefault();
        var touches = event.changedTouches,
            rect = CANVAS.doc.getBoundingClientRect();

        for ( var i = 0; i < touches.length; i += 1 ) {
            if ( GAME.touch.id == touches[i].identifier ) {
                GAME.touch.x = touches[i].clientX - rect.left;
                GAME.touch.x *= CANVAS.WIDTH / CANVAS.currentWidth;

                GAME.touch.y = touches[i].clientY - rect.top;
                GAME.touch.y *= CANVAS.HEIGHT / CANVAS.currentHeight;
            }
        }

    }, false );

    window.addEventListener( "touchend", function( event ) {
        event.preventDefault();

        var touches = event.changedTouches;
        for ( var i = 0; i < touches.length; i += 1 ) {
            if ( GAME.touch.id == touches[i].identifier ) {
                GAME.touch.press = false;

                GAME.click();
            }
        }
    }, false );
} else {
    window.addEventListener( "click", function( event ) {
        var rect = CANVAS.doc.getBoundingClientRect();
        GAME.touch.x = event.clientX - rect.left;
        GAME.touch.x *= CANVAS.WIDTH / CANVAS.currentWidth;
        GAME.touch.y = event.clientY - rect.top;
        GAME.touch.y *= CANVAS.HEIGHT / CANVAS.currentHeight;

        GAME.click();
    }, false );
}

CANVAS.init();
