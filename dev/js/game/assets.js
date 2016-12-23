var clientId;

var level = [
    {'width':20000, 'height':50, 'x': 0, 'y':0, 'type':'platform'},
    {'width':50, 'height':20000, 'x': 0, 'y':0, 'type':'platform'},
    {'width':20000, 'height':50, 'x': 0, 'y':19950, 'type':'platform'},
    {'width':50, 'height':20000, 'x': 19950, 'y':0, 'type':'platform'},
    {'width':300, 'height':50, 'x': 400, 'y':300, 'type':'platform'},
    {'width':50, 'height':300, 'x': 1000, 'y':800, 'type':'platform'},
    {'width':200, 'height':200, 'x': 500, 'y':900, 'type':'platform'},
    {'width':300, 'height':50, 'x': 400, 'y':2200, 'type':'platform'},
    {'width':50, 'height':300, 'x': 1200, 'y':1300, 'type':'platform'},
    {'width':300, 'height':50, 'x': 2700, 'y':1400, 'type':'platform'},
    {'width':50, 'height':300, 'x': 2000, 'y':2800, 'type':'platform'}
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
    'maxSpeed':3.5,
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
    'yknockback':0,
    'name':'u/lordtuts'
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
var aimPointer = {
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

// Mouse
// Absolute position in game world
var mouseX;
var mouseY;
// Positon relative to tank
var mouseTankOffsetX = 0;
var mouseTankOffsetY = 0;
// If mouse is pressed
var mousepressed;

// If spacebar is pressed
var spacebar;

// Currently controlling tank
var tankToControl = tanks[0];

// Tank parameters
var turnSpeed = 240/60; // How fast tank turns, degrees per second, 240 degrees
var attackSpeed = 60/5; // Time before you can shoot again, 5 shots a second
var energyRechargeSpeed = 100/(60*4); // Amount of energy it refills in 1/60th second
var reloadTime = 2*60; // Time it takes to reload, seconds
var knockbackFriction = .75; // Multiplier, how fast tank stops from knockback, max 1 - no friction, min 0 - instantly stops
var movementFriction = .9; // Multiplier, how fast tank stops from moving
var maxAmmo = 10; // How many bullets tank can hold
var hitKnockbackMultiplier = 0.5; // How strong knockback is from bullet, multiplies bullet's speed
var shotKnockbackMultiplier = 0.4; // How strong tank gets knocked back when shooting, multiplies bullet's speed
var tankMoveSpeed = 3.5; // Top speed of tank when driving
var tankBoostSpeed = 4.5; // Top speed of tank while boosting
var tankAcceleration = tankMoveSpeed/6; // Acceleration amount in a frame
var bulletSpeed = 12; // How fast bullet moves, pixels/frame
var bulletDamage = 20;

var ticker;
var gameStarted = true; // Whether or not players can control tanks