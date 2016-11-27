CANVAS.WIDTH = 1280;
CANVAS.HEIGHT = 720;
CANVAS.FPS = 60;
CANVAS.load = [];

CANVAS.update = function() {

};

CANVAS.refresh = function() {
    CANVAS.Draw.clear();

    CANVAS.Draw.rect( 1280 - 240, 0, 240, 240 ).stroke();
    CANVAS.Draw.rect( 1280 - 240, 240, 240, 240 ).stroke();
    CANVAS.Draw.rect( 1280 - 240, 480, 240, 240 ).stroke();

    var txt = "MousePos: " + GAME.touch.x + ", " + GAME.touch.y;
    CANVAS.Draw.text( txt, 1, 2, 16, "black" );
    CANVAS.Draw.text( GAME.touch.id, 1, 16, 16, "black" );
    CANVAS.Draw.text( "" + !!GAME.touch.press, 1, 32, 16, "black" );
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
        GAME.touch.x *= CANVAS.WIDTH / CANVAS.currentWidth;

        GAME.touch.y = touch.clientY - rect.top;
        GAME.touch.y *= CANVAS.HEIGHT / CANVAS.currentHeight;

        GAME.touch.id = touch.identifier;

        GAME.touch.press = true;
    }, false );

    window.addEventListener( "touchmove", function( event ) {
        event.preventDefault();
        var touch = event.touches[0],
            rect = CANVAS.doc.getBoundingClientRect();

        GAME.touch.x = touch.clientX - rect.left;
        GAME.touch.x *= CANVAS.WIDTH / CANVAS.currentWidth;

        GAME.touch.y = touch.clientY - rect.top;
        GAME.touch.y *= CANVAS.HEIGHT / CANVAS.currentHeight;
    }, false );

    window.addEventListener( "touchend", function( event ) {
        event.preventDefault();

        var touches = event.changedTouches;
        for ( var i = 0; i < touches.length; i += 1 ) {
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
