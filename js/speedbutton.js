function decisecond(){
    if(get('game-mode').value === 1 && parseFloat(get('time').innerHTML) <= 0
       && get('max-time').value > 0){
        /* if in max-time mode and time is less than or equal to 0 and max-time isn't 0 */
        stop();

    }else if(get('game-mode').value === 0 && get('max-points').value !== 0
             && parseInt(get('score').innerHTML) >= get('max-points').value){
        /* if in max-points mode and score is not greater than max-points and max-points is not equal to 0 */
        stop();

    }else{
        /* increase time if max-time is equal to 0 or in max-points mode, else decrease time */
        get('time').innerHTML = ((parseFloat(get('time').innerHTML) + ((get('game-mode').value === 1
                                && get('max-time').value > 0) ? -.1 : .1)).toFixed(1));
    }
}

function get(i){
    return document.getElementById(i);
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function randomize_buttons(clicked_button_id){
    i = get(clicked_button_id).value;

    if(game_running){
        /* stop game if clicking on a red button ends the game and clicked on a red button */
        if(get('red-onclick').value === 1 && i.lastIndexOf('-', 0) === 0){
            stop();
            return;
        }
    }

    /* increase or decrease time based on settings value for clicked button */
    get('score').innerHTML = parseInt(get('score').innerHTML) + (i.lastIndexOf('+', 0) === 0 ? parseInt(get('green-points').value) : -parseInt(get('red-points').value));

    /* reset buttons to disabled, value=-, and black backgrounds if game has not ended with this click */
    i = grid_side * grid_side - 1;
    var p = (get('game-mode').value == 1 ||
             get('max-points').value == 0 ||
             parseInt(get('score').innerHTML) < get('max-points').value);

    do{
        if(p){
            get(i).classList.remove('color0');
            get(i).classList.remove('color1');
            get(i).classList.add('color2');
            get(i).value = '-';
        }
        get(i).disabled = 1;
    }while(i--);

    /* if game has not ended with this click */
    if(p){
        var ti = 0;

        /* randomize locations of and setup green buttons that currently exist */
        if(get('green-frequency').value > 0){
            i = get('green-frequency').value > (grid_side * grid_side) - 1 ? (grid_side * grid_side) - 1 : get('green-frequency').value - 1;
            ti = i + 1;
            do{
                do{
                    var b = random_number(grid_side * grid_side);
                }while(!get(b).disabled);

                get(b).classList.remove('color2');
                get(b).classList.add('color1');
                get(b).disabled = 0;
                get(b).value = '+' + parseInt(get('green-points').value);
            }while(i--);
        }

        /* if there are no green buttons or space for red buttons is available */
        if(get('green-frequency').value == 0 || (get('grid-dimensions').value > 1 && (grid_side * grid_side) - ti > 0)){
            /* create and randomize enough red buttons to fill available space or just number of red buttons */
            i = get('red-frequency').value > (grid_side * grid_side) - ti - 1 ? (grid_side * grid_side) - ti - 1 : get('red-frequency').value - 1;
            if(i >= 0){
                do{
                    do{
                        var c = random_number(grid_side * grid_side);
                    }while(!get(c).disabled);

                    get(c).classList.remove('color2');
                    get(c).classList.add('color0');
                    get(c).disabled = 0;
                    get(c).value = '-' + parseInt(get('red-points').value);
                }while(i--);
            }
        }
    }
}

function reset(){
    if(confirm('Reset settings?')){
        stop();
        get('audio-volume').value = 1;
        get('game-mode').value = 1;
        get('green-frequency').value = 1;
        get('green-points').value = 1;
        get('grid-dimensions').value = 5;
        get('max-points').value = 50;
        get('max-time').value = 30;
        get('red-frequency').value = 1;
        get('red-onclick').value = 0;
        get('red-points').value = 1;
        get('score').value = 0;
        get('start-key').value = 'H';
        get('time').value = 0;
        get('y-margin').value = 0;
        save();
    }
}

function save(){
    /* save settings into localStorage if they differ from default */
    i = 11;
    j = [
        'grid-dimensions',
        'game-mode',
        'max-points',
        'max-time',
        'green-frequency',
        'green-points',
        'red-frequency',
        'red-onclick',
        'red-points',
        'audio-volume',
        'y-margin',
        'start-key'
    ];
    do{
        if(get(j[i]).value === [5, 1, 50, 30, 1, 1, 1, 0, 1, 1, 0, 'H'][i]){
            ls.removeItem('speedbutton-' + i);
        }else{
            ls.setItem(
                'speedbutton-' + i,
                get(j[i]).value
            );
        }
    }while(i--);
    j = 0;
}
function set_settings_disable(i){
    /* enable or disable most setting inputs */
    get('grid-dimensions').disabled = i;
    get('game-mode').disabled = i;
    get('green-frequency').disabled = i;
    get('green-points').disabled = i;
    get('max-points').disabled = i;
    get('reset-button').disabled = i;
    get('max-time').disabled = i;
    get('red-frequency').disabled = i;
    get('red-onclick').disabled = i;
    get('red-points').disabled = i
}

function start(){
    /* verify settings are numbers and greater than or equal to 0 */
    i = 7;
    var j = [
        'max-points',
        'max-time',
        'green-frequency',
        'green-points',
        'red-frequency',
        'red-points',
        'audio-volume',
        'y-margin'
    ];
    do{
        if(isNaN(get(j[i]).value) || get(j[i]).value < 0){
            get(j[i]).value = [
                50,
                30,
                1,
                1,
                1,
                1,
                1,
                0
            ][i];
        }
    }while(i--);

    /* adjust margin-top of entire game */
    get('lol-a-table').style.marginTop = get('y-margin').value + 'px';

    /* save settings into localStorage and create game area */
    save();
    setup();

    /* reset game buttons */
    i = grid_side * grid_side - 1;
    do{
        get(i).disabled = 1;
        get(i).classList.remove('color0');
        get(i).classList.remove('color1');
        get(i).classList.remove('color2');
        get(i).classList.add('color2');
        get(i).value = '-';
    }while(i--);

    /* disable many setting inputs */
    set_settings_disable(1);

    get('score-max').innerHTML = '';
    get('time-max').innerHTML = '';

    /* generate green and red buttons */
    randomize_buttons(random_number(grid_side * grid_side));

    get('score').innerHTML = 0;
    get('time').innerHTML = 0;

    /* setup max-time or max-points displays */
    if(get('game-mode').value === 1){
        get('time').innerHTML = get('max-time').value >= 0 ? get('max-time').value === '' ? 0 : get('max-time').value : 30;
        if(get('max-time').value > 0){
            get('time-max').innerHTML = ' out of <b>' + get('max-time').value + '</b>';
        }

    }else if(get('max-points').value > 0){
        get('score-max').innerHTML = ' out of <b>' + get('max-points').value + '</b>';
    }

    get('start-button').value = 'End (ESC)';
    get('start-button').onclick = function(){
        stop();
    };

    game_running = 1;
    interval = setInterval('decisecond()', 100);
}

function setup(){
    if(get('start-button').disabled || grid_side != get('grid-dimensions').value){
        /* fetch settings from localStorage */
        get('grid-dimensions').value = ls.getItem('speedbutton-0') === null ? 5 : parseInt(ls.getItem('speedbutton-0'));
        get('game-mode').value = ls.getItem('speedbutton-1') === null ? 1 : parseInt(ls.getItem('speedbutton-1'));
        get('max-points').value = ls.getItem('speedbutton-2') === null ? 50 : parseInt(ls.getItem('speedbutton-2'));
        get('max-time').value = ls.getItem('speedbutton-3') === null ? 30 : parseInt(ls.getItem('speedbutton-3'));
        get('green-frequency').value = ls.getItem('speedbutton-4') === null ? 1 : parseInt(ls.getItem('speedbutton-4'));
        get('green-points').value = ls.getItem('speedbutton-5') === null ? 1 : parseInt(ls.getItem('speedbutton-5'));
        get('red-frequency').value = ls.getItem('speedbutton-6') === null ? 1 : parseInt(ls.getItem('speedbutton-6'));
        get('red-onclick').value = ls.getItem('speedbutton-7') === null ? 0 : parseInt(ls.getItem('speedbutton-7'));
        get('red-points').value = ls.getItem('speedbutton-8') === null ? 1 : parseInt(ls.getItem('speedbutton-8'));
        get('audio-volume').value = ls.getItem('speedbutton-9') === null ? 1 : parseFloat(ls.getItem('speedbutton-9'));
        get('y-margin').value = ls.getItem('speedbutton-10') === null ? 0 : parseInt(ls.getItem('speedbutton-10'));

        if(ls.getItem('speedbutton-11') === null){
            get('start-key').value = 'H';
        }else{
            get('start-key').value = ls.getItem('speedbutton-11');
            get('start-button').value = 'Start (' + get('start-key').value + ')';
        }
        get('lol-a-table').style.marginTop = get('y-margin').value + 'px';
        grid_side = get('grid-dimensions').value;

        /* create game area buttons */
        var j = [''];
        for(i = 0; i < (grid_side * grid_side); i++){
            if(i % grid_side === 0 && i !== 0){
                j.push('<br>');
            }
            j.push('<input class="buttons color2" disabled id=' + i + ' onclick=randomize_buttons(' + i + ') type=button value=->');
        }
        get('game-area').innerHTML = j.join('');

        j = 0;
        get('start-button').disabled = 0;
    }
}

function showhide(){
    i = get('showhide-button').value === '-' ? 1 : 0;
    get('settings-span').style.display = ['inline', 'none'][i];
    get('showhide-button').value = ['-', '+'][i];
}

function stop(){
    clearInterval(interval);
    game_running = 0;

    /* diable buttons to prevent further clicks */
    i = grid_side * grid_side - 1;
    do{
        get(i).disabled = 1;
    }while(i--);

    /* enable settings to allow editing */
    set_settings_disable(0);

    get('start-button').value = 'Start (' + get('start-key').value + ')';
    get('start-button').onclick = function(){
        start();
    };
}

var game_running = 0;
var grid_side = 5;
var i = 0;
var interval = 0;
var ls = window.localStorage;

window.onkeydown = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;

    if(String.fromCharCode(i) === get('start-key').value){
        stop();
        start();

    }else if(i === 27){/* ESC */
        stop();
    }
};

window.onload = setup;
