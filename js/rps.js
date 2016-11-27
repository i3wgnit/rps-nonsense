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
    [ "0", "img/0.jpg" ],
    [ "1", "img/1.jpg" ],
    [ "2", "img/2.jpg" ],

    [ "0_0", "img/0_0.png" ],
    [ "1_0", "img/1_0.png" ],
    [ "2_0", "img/2_0.png" ],

    [ "0_1", "img/0_1.png" ],
    [ "1_1", "img/1_1.png" ],
    [ "2_1", "img/2_1.png" ]
];

CANVAS.update = function() {
};

CANVAS.refresh = function() {
    CANVAS.Draw.clear();
    CANVAS.Draw.rect( 1, 1, 1278, 718 ).stroke();

    if ( GAME.n ) {
        CANVAS.ctx.drawImage( CANVAS.images[ GAME.me.next ], 384, 124, 248, 248 );
        CANVAS.Draw.rect( 384, 124, 248, 248 ).fill( "rgba(" + colors[GAME.me.next] + ",0.5)" );
        CANVAS.Draw.rect( 384, 124, 248, 248 ).stroke( "black", 8 );
    }

    if ( GAME.p ) {
        CANVAS.Draw.text( "Me: " + GAME.me.points, 36, 576, 76, "black" );
        CANVAS.Draw.text( GAME.you.points + " :You", 1008, 576, 76, "black", "right" );
    }

    GAME.buttons.forEach( function( elem, ix ) {
        CANVAS.ctx.drawImage( CANVAS.images[ ix + "_" + elem.state ],
                             elem.x, elem.y, elem.w, elem.h );
        CANVAS.Draw.rect( elem.x, elem.y, elem.w, elem.h ).fill( "rgba(" + elem.style + ", .5)" );
    } );

    CANVAS.Draw.text( GAME.txt, 24, 472, 24, "black" );

    // Debug
    var txt1 = "MousePos: " + GAME.touch.x + ", " + GAME.touch.y,
        txt2 = "id: " + GAME.touch.id,
        txt3 = "press: " + GAME.touch.press;
    CANVAS.Draw.text( txt1, 1, 3, 16, "black" );
    CANVAS.Draw.text( txt2, 1, 15, 16, "black" );
    CANVAS.Draw.text( txt3, 1, 24, 16, "black" );
};

var GAME = {
    play: 0,
    state: -1,
    rules: false,
    txt: "",
    count: 0,
    n: 0,
    p: 0,
    buttons: []
};

GAME.Player = function( n, p ) {
    this.points = p;
    this.next = n;
}

GAME.me = new GAME.Player( 1, 3 );
GAME.you = new GAME.Player( null, 0 );

GAME.Button = function( x, y, w, h, s ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.style = s;
    this.state = 0;
}

var colors = [ "255, 182, 193",
              "144, 238, 144",
              "137, 207, 240" ]

colors.forEach( function( elem, ix ) {
    GAME.buttons[ix] = new GAME.Button( 1032, 24 + ix * 224, 224, 224, elem );
} );

GAME.hover = function() {
    if ( GAME.state == 0 ) {
        GAME.buttons.forEach( function( elem, ix ) {
            elem.state = 0;
            if ( GAME.touch.x >= elem.x && GAME.touch.x <= elem.x + elem.w &&
                GAME.touch.y >= elem.y && GAME.touch.y <= elem.y + elem.h ) {
                elem.state = 1;
            }
        } );
    }
}

GAME.click = function() {
    if ( GAME.state == 0 ) {
        GAME.buttons.forEach( function( elem, ix ) {
            if ( GAME.touch.x >= elem.x && GAME.touch.x <= elem.x + elem.w &&
                GAME.touch.y >= elem.y && GAME.touch.y <= elem.y + elem.h ) {
                GAME.choose( ix );
            }
        } );
    } else if ( GAME.state == 1 ) {
        GAME.txt = "";
        GAME.state = 0;
        if ( GAME.me.points - GAME.you.points >= 19 ) {
            GAME.txt = "Look at that! I won. Want to play again?"
            GAME.state = -1;
        } else {
            GAME.me.next = parseInt( 3 * Math.random() );
        }
    } else if ( GAME.state == 2 ) {
        GAME.state = 1;
        GAME.txt = "Way better, isn't it?";
        GAME.me.points += GAME.you.points;
        GAME.you.points = 0;
    } else if ( GAME.state < 0 ) {
        if ( !GAME.play ) {
            GAME.state -= 1;
            var s = 0 - GAME.state - 1,
                t = "";
            switch ( s ) {
                case 1:
                    t = "Hello there! Welcome.";
                    break;
                case 2:
                    t = "This is just like normal Rock Paper Scissors."
                    break;
                case 3:
                    t = "The goal is to get a 19 points advantage."
                    break;
                case 4:
                    t = "Here is what I'm going to play, you do you.";
                    GAME.n = true;
                    break;
                case 5:
                    t = "Since it's your first time playing, I will give myself 3 points.";
                    GAME.p = true;
                    break;
                default:
                    GAME.state = 0;
                    GAME.play = true;
            }
            GAME.txt = t;
            console.log( "s: " + GAME.state );
        } else {
            GAME.me.points = 0;
            GAME.you.points = 0;
            GAME.state = 0;
            GAME.txt = "";
        }
    }
};

GAME.changeRules = function() {
    var c = 0.0557,
        p = c * ( GAME.count ),
        r = Math.random();

    if ( r < p ) {
        GAME.rules = !GAME.rules;
        GAME.txt = "Hey, this is getting a bit unfair, how about we change the rules?";
        GAME.state = 1;
    }

    if ( GAME.you.points - GAME.me.points >= 18 ) {
        GAME.txt = "This game is dumb, let's swap points, ok?";
        GAME.state = 2;
    }
    console.log( "p, r: " + p + " | " + r );
};

GAME.gText = function( x ) {
    var t = "";
    switch ( x ) {
        case 1:
            t = "According to the rules, you Lose when you " +
                ( GAME.rules ? "Lose" : "Win" ) + ".";
            break;
        case 2:
            t = "I'm impressed that a monkey like you managed to Win.";
            break;
        default:
            t = "Since it's a Draw, it might as well be my Win, right?";
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
    GAME.txt = GAME.gText( res );
    console.log( "mn, yn, r: " + GAME.me.next + " | " + x + " | " + res );

    if ( res == 2 ) {
        GAME.you.points += 1;
        GAME.count += 1;
    } else {
        GAME.me.points += 1;
        GAME.count = 0;
    }
    console.log( "p: " + GAME.me.points + " | " + GAME.you.points );

    if ( GAME.me.points < GAME.you.points ) {
        GAME.changeRules();
    }
};

GAME.touch = {
    x: 0,
    y: 0,
    id: 0,
    press: false
};

CANVAS.init();

GAME.upTouch = function( evt ) {
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
        GAME.upTouch( touch );
        GAME.touch.id = touch.identifier;
        GAME.touch.press = true;
    }, false );

    window.addEventListener( "touchmove", function( event ) {
        event.preventDefault();
        var touches = event.changedTouches,
            rect = CANVAS.doc.getBoundingClientRect();

        for ( var i = 0; i < touches.length; i += 1 ) {
            if ( GAME.touch.id == touches[i].identifier ) {
                GAME.upTouch( touches[i] );
                GAME.hover();
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

    window.addEventListener( "mousemove", function( event ) {
        GAME.upTouch( event );
        GAME.hover();
    }, false );

    window.addEventListener( "mouseup", function( event ) {
        GAME.upTouch( event );
        GAME.touch.press = false;
        GAME.click();
    }, false )
}
