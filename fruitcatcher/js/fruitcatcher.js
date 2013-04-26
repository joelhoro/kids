 Array.prototype.randomchoice = function () {
       return this[Math.floor((Math.random()*this.length))];
 };


function Draw(elements)
{
    elements.map( function(item) { shapesLayer.add(item) } );
    stage.add(shapesLayer);
}

function HandleKeyStrokes(event)
{ 
//    console.log(event)
    if ( event.keyCode === 37 )
            Move("left");
    else if ( event.keyCode === 39 )
            Move("right");
}

function Initialize()
{
    stage 		 = new Kinetic.Stage(
                            {
                               container	 : 'container',
                               width		 : parameters.CANVAS_WIDTH,
                               height		 : parameters.CANVAS_HEIGHT
                            }
                    );
    shapesLayer = new Kinetic.Layer();	

    document.addEventListener('keydown', HandleKeyStrokes, false); 
}		

function PickObject()
{
    var image_name, image_file;
    var type_of_object = [ 'fruit', 'toy' ].randomchoice();
    
    images = {
                'fruit'     :       [ 'Apple', 'Apricot', 'Banana', 'Cherry', 'Kiwi', 'Lemon', 'Mango', 'Orange', 'Peach', 'Strawberry', 'Tomato' ],
                'toy'       :       [ 1,2,3,4,5,6,7,8,9 ]
             };
             
    file_names = {  'fruit'     : 'images/fruits/<%=image_name%>128.png', 
                    'toy'       : 'images/Toys/toy0<%=image_name%>.png' 
                 };
    
    image_name = images[type_of_object].randomchoice();
    image_file = _.template( file_names[type_of_object], { image_name : image_name } );
    return { type : type_of_object, file : image_file }
}

function Random(x,y)
{
    return Math.random() * ( y-x ) + x;
}

function Fruit(x,y,image_file)
{
    imageObj = new Image();
    imageObj.src = image_file;
    return new Kinetic.Image( { x : x, y : y, image : imageObj, width : 50, height : 50 } );
}

function CleanUp()
{
    stage.clear();
    stage.removeChildren();
    shapesLayer.removeChildren();
}


function StartGameLoop()
{
    var interval;
    $(window).blur(function(e) {
        if( running )
            clearInterval(interval);
        running = false;
    });
    $(window).focus(function(e) {
        if ( !running)
           interval = setInterval(GameLoop, parameters.GAME_LOOPINTERVAL); 
       running = true;
    });
    
    running = true;
    interval = setInterval(GameLoop, parameters.GAME_LOOPINTERVAL); 
}

function Basket(x,y)
{
    imageObj = new Image();
    imageObj.src = 'images/basket-xxl.png';
    return new Kinetic.Image( { x : x, y : y, image : imageObj, width : parameters.BASKET_SIZE, height : parameters.BASKET_SIZE } );
}

function Border()
{
    params = { x : 0, y : 0, width : 700, height : 550,  strokeWidth : 1,
                    fillLinearGradientStartPoint: [0, 0],
          fillLinearGradientEndPoint: [1500, 1500],
          fillLinearGradientColorStops: [0, 'white', 1, 'yellow']
            }; 

    return new Kinetic.Rect(params);
}

function Side()
{
    params = { x : 700, y : 0, width : 200, height : 550,  strokeWidth : 1,
                    fillLinearGradientStartPoint: [0, 0],
          fillLinearGradientEndPoint: [1500, 1500],
          fillLinearGradientColorStops: [0, 'white', 1, 'yellow']
            }; 

    return new Kinetic.Rect(params);
}

function GameLoop()
{
    CleanUp();
    
    border = Border();
    side   = Side();
    box    = Basket(boxposition, parameters.BASKET_Y );
    fruit  = Fruit(fruitposition_x,fruitposition_y,image_file);
    text   = PrintText("Fruitcatcher!\n\nHello")
    fruitposition_y = fruitposition_y + parameters.OBJECT_FALLING_SPEED
//console.log("Boxposition = ", boxposition )

    Draw( [ border, side, fruit, box, text ] )
}

function Move(side)
{
    var move = parameters.BASKET_MOVE_SPEED;
    if ( side === "left" )
            boxposition = boxposition - move;
    if ( side === "right" )
            boxposition = boxposition + move;

    if ( boxposition > 600 )
            boxposition = 0;
    if ( boxposition < 0 )
            boxposition = 600;
}

function PrintText(text)
{
    return new Kinetic.Text( {
                                    x	    	: 720, y : 50, text : text, fill : 'black', fontSize : 20,
			})
}

parameters = { 
                'BOXPOSITION_START'     :   300,
                'BASKET_SIZE'           :   95,
                'BASKET_Y'              :   450,
                'GAME_LOOPINTERVAL'     :   50,
                'OBJECT_FALLING_SPEED'  :   5,
                'BASKET_MOVE_SPEED'     :   20,
                'CANVAS_WIDTH'          :   900,
                'CANVAS_HEIGHT'         :   550
             };

Initialize();

boxposition     = parameters.BOXPOSITION_START;
object          = PickObject();
image_file      = object.file;
fruitposition_x = Random(0,600); 
fruitposition_y = 0;

StartGameLoop();
//gameLoop()