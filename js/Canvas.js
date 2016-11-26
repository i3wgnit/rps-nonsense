( function() {
    var lastTime = 0;
    var vendors = [ "webkit", "moz" ];
    var x = 0;
    for ( ; x < vendors.length && !window.requestAnimationFrame; ++x ) {
        window.requestAnimationFrame = window[ vendors[x] + "RequestAnimationFrame" ];
        window.cancelAnimationFrame =
            window[ vendors[x] + "CancelAnimationFrame" ] ||
            window[ vendors[x] + "CancelRequestAnimationFrame" ];
    }

    if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = function( callback, element ) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
            var id = window.setTimeout( function() {
                callback( currTime + timeToCall );
            }, timeToCall );
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if ( !window.cancelAnimationFrame ) {
        window.cancelAnimationFrame = function( id ) {
            clearTimeout( id );
        };
    }
}() );

var CANVAS = {
    currentWidth: null,
    currentHeight: null,
    RATIO: null,
    SCALE: null,

    MOBILE: ( function() {
        var a = navigator.userAgent || navigator.vendor || window.opera;
        if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test( a ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( a.substr( 0, 4 ) ) ) {
            return true;
        } else {
            return false;
        }
    } )(),

    images: {},

    doc: null,
    ctx: null,

    init: function() {
        document.body.style.margin = "0px";

        CANVAS.doc = document.createElement( "canvas" );
        CANVAS.ctx = CANVAS.doc.getContext( "2d" );

        CANVAS.doc.width = CANVAS.WIDTH;
        CANVAS.doc.height = CANVAS.HEIGHT;
        CANVAS.doc.style.display = "block";
        CANVAS.doc.style.margin = "auto";
        CANVAS.doc.innerHTML = "Your browser does not support canvas element.";
        document.body.appendChild( CANVAS.doc );

        CANVAS.RATIO = CANVAS.WIDTH / CANVAS.HEIGHT;
        CANVAS.resize();
        window.addEventListener( "resize", CANVAS.resize, false );

        then = window.performance.now();

        if ( CANVAS.load.length ) {
            CANVAS.Draw.text( "Loading",
                             CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2,
                             CANVAS.HEIGHT / 32, "grey", "center" );
            CANVAS.load.forEach( function( element ) {
                var img = new Image();
                img.addEventListener( "load", function() {
                    CANVAS.images[ element[0] ] = img;

                    var count = 0;
                    for ( var i in CANVAS.images ) {
                        if ( CANVAS.images.hasOwnProperty( i ) ) {
                            count++;
                        }
                    }

                    if ( count == CANVAS.load.length ) {
                        requestAnimationFrame( CANVAS.animate );
                    } else {
                        CANVAS.Draw.circle( CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2,
                                           CANVAS.HEIGHT / 8,
                                           -Math.PI / 2,
                                           2 * Math.PI * count / CANVAS.load.length - Math.PI / 2 )
                            .stroke( "grey", CANVAS.HEIGHT / 128 );
                    }
                }, false );
                img.src = element[1];
            } );
        } else {
            CANVAS.refresh();
            requestAnimationFrame( CANVAS.animate );
        }
    },

    resize: function() {
        if ( CANVAS.RATIO < window.innerWidth / window.innerHeight ) {
            CANVAS.currentHeight = window.innerHeight;
            CANVAS.currentWidth = CANVAS.RATIO * CANVAS.currentHeight;
            CANVAS.SCALE = CANVAS.currentHeight / CANVAS.HEIGHT;
        } else {
            CANVAS.currentWidth = window.innerWidth;
            CANVAS.currentHeight = CANVAS.currentWidth / CANVAS.RATIO;
            CANVAS.SCALE = CANVAS.currentWidth / CANVAS.WIDTH;
        }

        CANVAS.doc.style.width = CANVAS.currentWidth;
        CANVAS.doc.style.height = CANVAS.currentHeight;

        if ( CANVAS.MOBILE ) {
            document.body.style.height = window.innerHeight + 50 + "px";
        }

        setTimeout( function() {
            window.scrollTo( 0, 1 );
            setTimeout( function() {
                window.scrollTo( 0, 0 );
            }, 100 );
        }, 100 );
    },

    animate: function( now ) {
        if ( CANVAS.stop ) {
            return ;
        }
        var elapsed = now - then;
        if ( elapsed > 1000 / CANVAS.FPS ) {
            then = now - ( elapsed % ( 1000 / CANVAS.FPS ) );

            CANVAS.update();
            CANVAS.refresh();
        }

        requestAnimationFrame( CANVAS.animate );
    }
};

CANVAS.Draw = {

    clear: function() {
        CANVAS.ctx.clearRect( 0, 0, CANVAS.WIDTH, CANVAS.HEIGHT );
    },

    rect: function( x, y, w, h ) {
        x = Math.round( x );
        y = Math.round( y );
        CANVAS.ctx.beginPath();
        CANVAS.ctx.rect( x, y, w, h );

        return CANVAS.Draw.Paint;
    },

    circle: function( x, y, r, sAngle, eAngle, counterclockwise ) {
        x = Math.round( x );
        y = Math.round( y );
        CANVAS.ctx.beginPath();
        CANVAS.ctx.arc( x + 5, y + 5, r, sAngle, eAngle, counterclockwise );

        return CANVAS.Draw.Paint;
    },

    text: function( string, x, y, size, style, align ) {
        CANVAS.ctx.font = "bold " + size + "px Monospace";
        CANVAS.ctx.fillStyle = style;
        y += size / 2;
        switch ( align ) {
            case "center":
                x -= CANVAS.ctx.measureText( string ).width / 2;
                break;

            case "right":
                x -= CANVAS.ctx.measureText( string ).width;
                break;
        }
        x = Math.round( x );
        y = Math.round( y );
        CANVAS.ctx.fillText( string, x, y );
    },

    Paint: {
        fill: function( style ) {
            CANVAS.ctx.fillStyle = style || "#000000";
            CANVAS.ctx.fill();
        },

        stroke: function( style, lineWidth ) {
            CANVAS.ctx.strokeStyle = style || "#000000";
            CANVAS.ctx.lineWidth = lineWidth || 1;
            CANVAS.ctx.stroke();
        }
    }
};
