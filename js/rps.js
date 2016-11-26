CANVAS.WIDTH = 1280;
CANVAS.HEIGHT = 720;
CANVAS.FPS = 60;
CANVAS.load = [];

CANVAS.update = function() {

};

CANVAS.refresh = function() {
    CANVAS.Draw.clear();

    var txt = "MousePos: " + GAME.touch.x + ", " + GAME.touch.y;
    CANVAS.Draw.text( txt, 1, 1, 18, "black" );
    CANVAS.Draw.text( "" + !!GAME.touch.press, 1, 20, 18, "black" );
};

var GAME = {};

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
        GAME.touch.y = touch.clientY - rect.top;
        GAME.touch.press = true;
        GAME.touch.id = touch.identifier;
    }, false );

    window.addEventListener( "touchend", function( event ) {
        event.preventDefault();

        var touches = event.changedTouches;
        for ( var i = 0; i < touches.length; i++ ) {
            if ( GAME.touch.id == touches[i].identifier ) {
                GAME.touch.press = false;
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
    }, false );
}

CANVAS.init();
