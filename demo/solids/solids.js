// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 96;
var h = 96;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var ROOT2 = Math.sqrt(2);
var PHI = ( 1 + Math.sqrt(5) ) / 2;
var isRotating = true;
var viewRotation = new Vector3();

// warm colors
var violet = '#636';
var magenta = '#C25';
var orange = '#E62';
var gold = '#EA0';
var yellow = '#ED0';

// cool colors
// var violet = '#366';
// var magenta = '#C25';
// var orange = '#4DD';
// var gold = '#EA0';
// var yellow = '#8FF';

var scene = new Anchor({
  scale: 16,
});

var solids = [];

// ----- tetrahedron ----- //

( function() {

  var z = -1/ROOT2;
  var a = { x: -1, y:  0, z: -z };
  var b = { x:  1, y:  0, z: -z };
  var c = { x:  0, y: -1, z:  z };
  var d = { x:  0, y:  1, z:  z };

  var tetrahedron = new Anchor({
    addTo: scene,
    translate: { x: -2, },
    scale: 0.5,
  });

  solids.push( tetrahedron );

  var tetraTri = new Shape({
    path: [ a, b, c ],
    addTo: tetrahedron,
    fill: true,
    stroke: false,
    color: magenta,
  });

   tetraTri.copy({
     path: [ a, b, d ],
     color: yellow,
   });

   tetraTri.copy({
     path: [ a, c, d ],
     color: gold,
   });

   tetraTri.copy({
     path: [ b, c, d ],
     color: violet,
   });

})();

// ----- octahedron ----- //

( function() {

  var a = { x: -1, y:  0,  z:  0 };
  var b = { x:  1, y:  0,  z:  0 };
  var c = { x:  0, y: -1,  z:  0 };
  var d = { x:  0, y:  1,  z:  0 };
  var e = { x:  0, y:  0,  z: -1 };
  var f = { x:  0, y:  0,  z:  1 };

  var octahedron = new Anchor({
    addTo: scene,
    // translate: { x: 0, },
    scale: 0.55,
  });

  solids.push( octahedron );

  var triangle = new Shape({
    path: [ a, c, e ],
    addTo: octahedron,
    fill: true,
    stroke: false,
    color: orange,
  });

   triangle.copy({
     path: [ a, c, f ],
     color: gold,
   });

   triangle.copy({
     path: [ b, c, e ],
     color: magenta,
   });

   triangle.copy({
     path: [ b, c, f ],
     color: violet,
   });

  triangle.copy({
    path: [ a, d, e ],
    color: gold,
  });

   triangle.copy({
     path: [ a, d, f ],
     color: yellow,
   });

   triangle.copy({
     path: [ b, d, e ],
     color: orange,
   });

   triangle.copy({
     path: [ b, d, f ],
     color: magenta,
   });

})();

// ----- cube ----- //

( function() {

  var cube = new Anchor({
    addTo: scene,
    translate: { x: 2, },
    scale: 0.4,
  });

  solids.push( cube );

  var face = new Rect({
    width: 2,
    height: 2,
    addTo: cube,
    translate: { z: 1 },
    fill: true,
    stroke: false,
    color: magenta,
  });

  face.copy({
    translate: { z: -1 },
    color: magenta,
  });

  face.copy({
    translate: { x: -1 },
    rotate: { y: TAU/4 },
    color: gold,
  });

  face.copy({
    translate: { x: 1 },
    rotate: { y: TAU/4 },
    color: orange,
  });

  face.copy({
    translate: { y: -1 },
    rotate: { x: TAU/4 },
    color: yellow,
  });

  face.copy({
    translate: { y: 1 },
    rotate: { x: TAU/4 },
    color: violet,
  });

})();

// ----- dodecahedron ----- //

( function() {

  var dodecahedron = new Anchor({
    addTo: scene,
    translate: { x: -1, y: 1 },
    scale: 0.5,
  });

  solids.push( dodecahedron );

  var pentagonPath = ( function() {
    // var radius = 0.5 / Math.asin( TAU/10 );
    var radius = 1;
    var path = [];
    for ( var i=0; i < 5; i++ ) {
      var theta = i/5 * TAU + TAU/4;
      var x = Math.cos( theta ) * radius;
      var y = Math.sin( theta ) * radius;
      path.push({ x: x, y: y });
    }
    return path;
  })();


  // edge length
  var edge = 2 * Math.asin( TAU/10 );
  // https://en.wikipedia.org/wiki/Regular_dodecahedron#Dimensions
  var midradius = ( PHI * PHI ) / 2;
  var ROOT5 = Math.sqrt(5);
  // var inradius = Math.sqrt( 5/2 + 11/10 * ROOT5 ) / 2;
  var inradius = ( PHI * PHI ) / ( 2 * Math.sqrt( 3 - PHI ) );
  inradius *= edge;
  // midradius *= edge;

  var face = new Shape({
    path: pentagonPath,
    addTo: dodecahedron,
    translate: { y: -midradius },
    rotate: { x: TAU/4 },
    fill: true,
    stroke: false,
    color: yellow,
  });

  face.copy({
    translate: { y: midradius },
    rotate: { x: TAU/4*-1 },
    color: violet,
  });

  [ -1, 1 ].forEach( function( ySide ) {
    var colorWheel = [ violet, magenta, orange, gold, yellow ];

    for ( var i=0; i < 5; i++ ) {
      var rotor1 = new Anchor({
        addTo: dodecahedron,
        rotate: { y: TAU/5 * i },
      });
      var rotor2 = new Anchor({
        addTo: rotor1,
        // HACK fudged number
        rotate: { x: TAU/5.7 },
      });

      face.copy({
        addTo: rotor2,
        translate: { y: midradius*ySide },
        rotate: { x: TAU/4*ySide },
        color: colorWheel[i],
      });
    }
  });

})();

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  viewRotation.y += isRotating ? +TAU/150 : 0;

  solids.forEach( function( solid ) {
    solid.rotate.set( viewRotation );
  });

  scene.updateGraph();
}

// -- render -- //

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  scene.renderGraph( ctx );

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = viewRotation.x;
    dragStartAngleY = viewRotation.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    viewRotation.x = dragStartAngleX + angleXMove;
    viewRotation.y = dragStartAngleY + angleYMove;
  },
});