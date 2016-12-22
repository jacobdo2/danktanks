var clientId;

var level = [
    {'width':1280, 'height':50, 'x': 0, 'y':0, 'type':'platform'},
    {'width':50, 'height':720, 'x': 0, 'y':0, 'type':'platform'},
    {'width':1280, 'height':50, 'x': 0, 'y':670, 'type':'platform'},
    {'width':50, 'height':720, 'x': 1230, 'y':0, 'type':'platform'},
    {'width':640, 'height':300, 'x': 320, 'y':210, 'type':'platform'}
];
// Tank: hp, team, movement speed, x, y, width, height, body rot, turret rot, xspd, yspd
var defaultTank = {
    'maxHp':160,
    'hp':160,
    'energy':100,
    'ammo':10,
    'reloadTimer':0,
    'shootDelayTimer':0,
    'team':0,
    'movementSpeed':0,
    'x':150,
    'y':150,
    'width':72,
    'height':72,
    'rotation':0,
    'turretRotation':0,
    'xspd':0,
    'yspd':0,
    'xknockback':0,
    'yknockback':0
};
var tanks = [

];
// Bullet: team, xspd, yspd, x, y, width, height
var bullets = [

];
/*
var buttons = [
    {
        'buttonText':'Start game',
        'buttonType':'start',
        'x':570,
        'y':280,
        'width':140,
        'height':50
    },
    {
        'buttonText':'Join game',
        'buttonType':'join',
        'x':570,
        'y':340,
        'width':140,
        'height':50
    }
];*/
var pointer = {
    'x':0,
    'y':0,
    'width':2,
    'height':2
};

// Declare game variables

// Input
// Driving direction axis
var xaxis;
var yaxis;
// Mouse positions
var mouseX;
var mouseY;
// If mouse is pressed
var mousepressed;
// If spacebar is pressed
var spacebar;
// Currently controlling tank
var tankToControl = tanks[0];

// Tank parameter
var rotationSpeed = 4;

var ticker;
var gameStarted = true;