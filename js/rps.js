function delay( fn, t ) {

    // private instance variables
    var queue = [], self, timer;

    function schedule( fn, t ) {
        timer = setTimeout( function() {
            timer = null;
            fn();
            if ( queue.length ) {
                var item = queue.shift();
                schedule( item.fn, item.t );
            }
        }, t );
    }
    self = {
        delay: function( fn, t ) {

            // if already queuing things or running a timer,
            //   then just add to the queue
            if ( queue.length || timer ) {
                queue.push( { fn: fn, t: t } );
            } else {

                // no queue or timer yet, so schedule the timer
                schedule( fn, t );
            }
            return self;
        },
        cancel: function() {
            clearTimeout( timer );
            queue = [];
        }
    };
    return self.delay( fn, t );
}

CANVAS.WIDTH = 1280;
CANVAS.HEIGHT = 720;
CANVAS.FPS = 60;
CANVAS.load = [
    [ "0_0", "img/1_0.jpg" ],
    [ "1_0", "img/1_0.jpg" ],
    [ "2_0", "img/1_0.jpg" ]
];

CANVAS.update = function() {

};

CANVAS.refresh = function() {
    CANVAS.Draw.clear();
    CANVAS.Draw.rect( 1, 1, 1278, 718 ).stroke();

    GAME.buttons.forEach( function( elem, ix ) {
        CANVAS.ctx.drawImage( CANVAS.images[ ix + "_0" ], elem.x, elem.y, elem.w, elem.h )
        CANVAS.Draw.rect( elem.x, elem.y, elem.w, elem.h ).fill( elem.style );
    } );

    var txt1 = "MousePos: " + GAME.touch.x + ", " + GAME.touch.y,
        txt2 = "id: " + GAME.touch.id,
        txt3 = "press: " + GAME.touch.press;
    CANVAS.Draw.text( txt1, 1, 3, 16, "black" );
    CANVAS.Draw.text( txt2, 1, 15, 16, "black" );
    CANVAS.Draw.text( txt3, 1, 24, 16, "black" );
};

var GAME = {
    state: -1,
    rules: false,
    txt: "",
    buttons: []
};

GAME.Player = function( n, p ) {
    this.points = p;
    this.next = n;
}

GAME.me = new GAME.Player( 1, 5 );
GAME.you = new GAME.Player( null, 0 );

GAME.Button = function( x, y, w, h, s ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.style = s;
}

var colors = [ "rgba(255, 182, 193, 0.6)",
              "rgba(144, 238, 144, 0.6)",
              "rgba(137, 207, 240, 0.6)" ]

colors.forEach( function( elem, ix ) {
    GAME.buttons[ix] = new GAME.Button( 1032, 24 + ix * 224, 224, 224, elem );
} );

GAME.click = function() {
    if ( GAME.state == 0 ) {
        GAME.buttons.forEach( function( elem, ix ) {
            if ( GAME.touch.x >= elem.x && GAME.touch.x <= elem.x + elem.w &&
                GAME.touch.y >= elem.y && GAME.touch.y <= elem.y + elem.h ) {
                GAME.choose( ix );
            }
        } );
    } else if ( GAME.state == 1 ) {
        GAME.state = 0;
        if ( GAME.me.points - GAME.you.points >= 50 ) {
            GAME.state = -1;
        }

        if ( GAME.me.points < GAME.you.points ) {
            GAME.changeRules();
        }
    } else if ( GAME.state < 0 ) {
        var s = 0 - GAME.state,
            t = "";
        switch ( s ) {
            case 1:
                t = "Hello there! Welcome.";
                break;
            case 2:
                t = "Since it's your first time playing, I will give myself 5 points.";
                break;
            default:
                GAME.state = 1;
        }
        GAME.state -= 1;
        GAME.txt = t;
    }
};

GAME.changeRules = function() {
    var c = 0.0557,
        p = c * ( GAME.me.points - GAME.you.points ),
        r = Math.random();

    if ( r < p ) {
        GAME.rules = !GAME.rules;
    }
};

GAME.gText = function( x ) {
    var t = "";
    switch ( x ) {
        case 1:
            t = "According to the rules, you Lose when you " + ( GAME.rules ? "Lose" : "Win" );
            break;
        case 2:
            t = "I'm impressed that a monkey like you managed to Win.";
            break;
        default:
            t = "Since it's a Draw, it might as well be my point, right?";
    }
    return t;
};

GAME.choose = function( x ) {
    GAME.you.next = x;

    GAME.state = 1;
    var res = 0;
    if ( GAME.rules ) {
        res = GAME.me.next - GAME.you.next;
    } else {
        res = GAME.you.next - GAME.me.next;
    }
    res = ( res + 3 ) % 3;
    console.log( x + " | " + res );

    if ( res == 2 ) {
        GAME.you.points += 1;
    } else {
        GAME.me.points += 1;
    }

    GAME.txt = GAME.gText( res );

    console.log( GAME.txt );
};

GAME.touch = {
    x: 0,
    y: 0,
    id: 0,
    press: false
};

CANVAS.init();

function upTouch( evt ) {
    var rect = CANVAS.doc.getBoundingClientRect();
    GAME.touch.x = evt.clientX - rect.left;
    GAME.touch.x *= CANVAS.WIDTH / CANVAS.currentWidth;
    GAME.touch.y = evt.clientY - rect.top;
    GAME.touch.y *= CANVAS.HEIGHT / CANVAS.currentHeight;
}

if ( CANVAS.MOBILE ) {
    window.addEventListener( "touchstart", function( event ) {
        event.preventDefault();

        var touch = event.touches[0];
        upTouch( touch );
        GAME.touch.id = touch.identifier;
        GAME.touch.press = true;
    }, false );

    window.addEventListener( "touchmove", function( event ) {
        event.preventDefault();
        var touches = event.changedTouches,
            rect = CANVAS.doc.getBoundingClientRect();

        for ( var i = 0; i < touches.length; i += 1 ) {
            if ( GAME.touch.id == touches[i].identifier ) {
                upTouch( touches[i] );
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
    window.addEventListener( "mousedown", function() {
        GAME.touch.press = true;
    } );

    window.addEventListener( "mousemove", upTouch, false );

    window.addEventListener( "mouseup", function( event ) {
        upTouch( event );
        GAME.touch.press = false;
        GAME.click();
    }, false )
}
