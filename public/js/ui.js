/**
 *  Main menu
 */

/**
*  Main menu buttons
*/
var menuButtons = document.querySelectorAll('.menu .item');

for(var i = 0; i<menuButtons.length; i++){
    var button = menuButtons[i];

    //open submenu
    button.addEventListener('click', function(e){
        var type = e.currentTarget.getAttribute('data-type');

        //hide main menu and show submenus
        var mainMenu = document.querySelector('.menu .main');
        mainMenu.classList.add('hidden');
        var subMenus = document.querySelector('.submenus');
        subMenus.classList.add('active');

        var submenu = document.querySelector('.submenu[data-type="' + type + '"]');
        submenu.classList.add('active');

    })
}

/**
 *
 * Back button on each of the submenus
 */
var backButtons = document.querySelectorAll('.btn-back-to-main-menu');

for(var i = 0; i<backButtons.length; i++){
    backButtons[i].addEventListener('click', function(){

        //go back to main menu
        var mainMenu = document.querySelector('.menu .main');
        mainMenu.classList.remove('hidden');
        var subMenus = document.querySelector('.submenus');
        subMenus.classList.remove('active');

        //close active submenu
        var activeSubMenu = document.querySelector('.submenu.active');
        activeSubMenu.classList.remove('active');

    })
}

/**
 * Focus in the input when clicked on label too
 */

$('.submenu label').on('click tap', function(){
    $(this).siblings('input').focus();
})

/**
 * Save user name in db/localstorage and start the game
 */
$('.btn-start-quickplay').on('click tap', function(){
    //check if name has been entered
    var name = $(this).siblings('.input-group').find('input').val();

    if(!name.length){
        //please enter name
        showSnackbar('Enter your name or live in shame');
        return false;
    }

    //set item in localstorage
    localStorage.setItem('name', name);

    //TODO: set name in db

    //redirect player to game
    window.location.replace('/game');

});

var snackbarTicker;

function showSnackbar(message){

    var snackbar = $('.snackbar');

    //check if the snackbar is already open
    if(snackbar.hasClass('open')){

        //if it is open, first close it
        snackbar.removeClass('open');

        //clear the previous closing timeout
        clearTimeout(snackbarTicker);

        //wait for the closing animation to end
        snackbar.on('transitionend', function(){

            //unbind transtion to prevent the snackbar from
            //jumping every time it shows
            snackbar.off('transitionend');
            snackbar.text(message).addClass('open');

            //close snackbar
            snackbarTicker = setTimeout(function(){
                snackbar.removeClass('open');
            }, 2000)
        })

        return false;
    }

    //show snackbar and insert message
    snackbar.text(message).addClass('open');

    //close snackbar
    snackbarTicker = setTimeout(function(){
        snackbar.removeClass('open');
    }, 2000)

}







