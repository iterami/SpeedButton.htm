function decisecond(){
    if(document.getElementById('game-mode').value === 1 && parseFloat(document.getElementById('time').innerHTML) <= 0
      && document.getElementById('max-time').value > 0){
        // if in max-time mode and time is less than or equal to 0 and max-time isn't 0
        stop();

    }else if(document.getElementById('game-mode').value === 0 && document.getElementById('max-points').value !== 0
      && parseInt(document.getElementById('score').innerHTML) >= document.getElementById('max-points').value){
        // if in max-points mode and score is not greater than max-points and max-points is not equal to 0
        stop();

    }else{
        // increase time if max-time is equal to 0 or in max-points mode, else decrease time
        document.getElementById('time').innerHTML =
          (parseFloat(document.getElementById('time').innerHTML)
            + ((document.getElementById('game-mode').value === 1
              && document.getElementById('max-time').value > 0)
                ? -.1
                : .1)
          ).toFixed(1);
    }
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function randomize_buttons(clicked_button_id){
    i = document.getElementById(clicked_button_id).value;

    if(game_running){
        // stop game if clicking on a red button ends the game and clicked on a red button
        if(document.getElementById('red-onclick').value === 1 && i.lastIndexOf('-', 0) === 0){
            stop();
            return;
        }
    }

    // increase or decrease time based on settings value for clicked button
    document.getElementById('score').innerHTML = parseInt(document.getElementById('score').innerHTML)
      + (i.lastIndexOf('+', 0) === 0
        ? parseInt(document.getElementById('green-points').value)
        : -parseInt(document.getElementById('red-points').value));

    // reset buttons to disabled, value=-, and black backgrounds if game has not ended with this click
    i = grid_side * grid_side - 1;
    var p = (document.getElementById('game-mode').value == 1
      || document.getElementById('max-points').value == 0
      || parseInt(document.getElementById('score').innerHTML) < document.getElementById('max-points').value);

    do{
        if(p){
            document.getElementById(i).classList.remove('color0');
            document.getElementById(i).classList.remove('color1');
            document.getElementById(i).classList.add('color2');
            document.getElementById(i).value = '-';
        }
        document.getElementById(i).disabled = 1;
    }while(i--);

    // if game has not ended with this click
    if(p){
        var ti = 0;

        // randomize locations of and setup green buttons that currently exist
        if(document.getElementById('green-frequency').value > 0){
            i = document.getElementById('green-frequency').value > (grid_side * grid_side) - 1
              ? (grid_side * grid_side) - 1
              : document.getElementById('green-frequency').value - 1;
            ti = i + 1;
            do{
                do{
                    var b = random_number(grid_side * grid_side);
                }while(!document.getElementById(b).disabled);

                document.getElementById(b).classList.remove('color2');
                document.getElementById(b).classList.add('color1');
                document.getElementById(b).disabled = 0;
                document.getElementById(b).value = '+' + parseInt(document.getElementById('green-points').value);
            }while(i--);
        }

        // if there are no green buttons or space for red buttons is available
        if(document.getElementById('green-frequency').value == 0
          || (document.getElementById('grid-dimensions').value > 1 && (grid_side * grid_side) - ti > 0)){
            // create and randomize enough red buttons to fill available space or just number of red buttons
            i = document.getElementById('red-frequency').value > (grid_side * grid_side) - ti - 1
              ? (grid_side * grid_side) - ti - 1
              : document.getElementById('red-frequency').value - 1;
            if(i >= 0){
                do{
                    do{
                        var c = random_number(grid_side * grid_side);
                    }while(!document.getElementById(c).disabled);

                    document.getElementById(c).classList.remove('color2');
                    document.getElementById(c).classList.add('color0');
                    document.getElementById(c).disabled = 0;
                    document.getElementById(c).value = '-' + parseInt(document.getElementById('red-points').value);
                }while(i--);
            }
        }
    }
}

function reset(){
    if(confirm('Reset settings?')){
        stop();
        document.getElementById('audio-volume').value = 1;
        document.getElementById('game-mode').value = 1;
        document.getElementById('green-frequency').value = 1;
        document.getElementById('green-points').value = 1;
        document.getElementById('grid-dimensions').value = 5;
        document.getElementById('max-points').value = 50;
        document.getElementById('max-time').value = 30;
        document.getElementById('red-frequency').value = 1;
        document.getElementById('red-onclick').value = 0;
        document.getElementById('red-points').value = 1;
        document.getElementById('score').value = 0;
        document.getElementById('start-key').value = 'H';
        document.getElementById('time').value = 0;
        document.getElementById('y-margin').value = 0;
        save();
    }
}

function save(){
    // save settings into localStorage if they differ from default
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
        if(document.getElementById(j[i]).value === [5, 1, 50, 30, 1, 1, 1, 0, 1, 1, 0, 'H'][i]){
            window.localStorage.removeItem('speedbutton-' + i);
        }else{
            window.localStorage.setItem(
              'speedbutton-' + i,
              document.getElementById(j[i]).value
            );
        }
    }while(i--);
    j = 0;
}
function set_settings_disable(i){
    // enable or disable most setting inputs
    document.getElementById('grid-dimensions').disabled = i;
    document.getElementById('game-mode').disabled = i;
    document.getElementById('green-frequency').disabled = i;
    document.getElementById('green-points').disabled = i;
    document.getElementById('max-points').disabled = i;
    document.getElementById('reset-button').disabled = i;
    document.getElementById('max-time').disabled = i;
    document.getElementById('red-frequency').disabled = i;
    document.getElementById('red-onclick').disabled = i;
    document.getElementById('red-points').disabled = i
}

function start(){
    // verify settings are numbers and greater than or equal to 0
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
        if(isNaN(document.getElementById(j[i]).value) || document.getElementById(j[i]).value < 0){
            document.getElementById(j[i]).value = [
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

    // adjust margin-top of entire game
    document.getElementById('lol-a-table').style.marginTop = document.getElementById('y-margin').value + 'px';

    // save settings into localStorage and create game area
    save();
    setup();

    // reset game buttons
    i = grid_side * grid_side - 1;
    do{
        document.getElementById(i).disabled = 1;
        document.getElementById(i).classList.remove('color0');
        document.getElementById(i).classList.remove('color1');
        document.getElementById(i).classList.remove('color2');
        document.getElementById(i).classList.add('color2');
        document.getElementById(i).value = '-';
    }while(i--);

    // disable many setting inputs
    set_settings_disable(1);

    document.getElementById('score-max').innerHTML = '';
    document.getElementById('time-max').innerHTML = '';

    // generate green and red buttons
    randomize_buttons(random_number(grid_side * grid_side));

    document.getElementById('score').innerHTML = 0;
    document.getElementById('time').innerHTML = 0;

    // setup max-time or max-points displays
    if(document.getElementById('game-mode').value === 1){
        document.getElementById('time').innerHTML = document.getElementById('max-time').value >= 0
          ? document.getElementById('max-time').value === '' ? 0
          : document.getElementById('max-time').value : 30;
        if(document.getElementById('max-time').value > 0){
            document.getElementById('time-max').innerHTML = ' out of <b>' + document.getElementById('max-time').value + '</b>';
        }

    }else if(document.getElementById('max-points').value > 0){
        document.getElementById('score-max').innerHTML = ' out of <b>' + document.getElementById('max-points').value + '</b>';
    }

    document.getElementById('start-button').value = 'End (ESC)';
    document.getElementById('start-button').onclick = function(){
        stop();
    };

    game_running = 1;
    interval = setInterval('decisecond()', 100);
}

function setup(){
    if(document.getElementById('start-button').disabled || grid_side != document.getElementById('grid-dimensions').value){
        // fetch settings from localStorage
        document.getElementById('grid-dimensions').value = window.localStorage.getItem('speedbutton-0') === null
          ? 5
          : parseInt(window.localStorage.getItem('speedbutton-0'));
        document.getElementById('game-mode').value = window.localStorage.getItem('speedbutton-1') === null
          ? 1
          : parseInt(window.localStorage.getItem('speedbutton-1'));
        document.getElementById('max-points').value = window.localStorage.getItem('speedbutton-2') === null
          ? 50
          : parseInt(window.localStorage.getItem('speedbutton-2'));
        document.getElementById('max-time').value = window.localStorage.getItem('speedbutton-3') === null
          ? 30
          : parseInt(window.localStorage.getItem('speedbutton-3'));
        document.getElementById('green-frequency').value = window.localStorage.getItem('speedbutton-4') === null
          ? 1
          : parseInt(window.localStorage.getItem('speedbutton-4'));
        document.getElementById('green-points').value = window.localStorage.getItem('speedbutton-5') === null
          ? 1
          : parseInt(window.localStorage.getItem('speedbutton-5'));
        document.getElementById('red-frequency').value = window.localStorage.getItem('speedbutton-6') === null
          ? 1
          : parseInt(window.localStorage.getItem('speedbutton-6'));
        document.getElementById('red-onclick').value = window.localStorage.getItem('speedbutton-7') === null
          ? 0
          : parseInt(window.localStorage.getItem('speedbutton-7'));
        document.getElementById('red-points').value = window.localStorage.getItem('speedbutton-8') === null
          ? 1
          : parseInt(window.localStorage.getItem('speedbutton-8'));
        document.getElementById('audio-volume').value = window.localStorage.getItem('speedbutton-9') === null
          ? 1
          : parseFloat(window.localStorage.getItem('speedbutton-9'));
        document.getElementById('y-margin').value = window.localStorage.getItem('speedbutton-10') === null
          ? 0
          : parseInt(window.localStorage.getItem('speedbutton-10'));

        if(window.localStorage.getItem('speedbutton-11') === null){
            document.getElementById('start-key').value = 'H';
        }else{
            document.getElementById('start-key').value = window.localStorage.getItem('speedbutton-11');
            document.getElementById('start-button').value = 'Start (' + document.getElementById('start-key').value + ')';
        }
        document.getElementById('lol-a-table').style.marginTop = document.getElementById('y-margin').value + 'px';
        grid_side = document.getElementById('grid-dimensions').value;

        // create game area buttons
        var j = [''];
        for(i = 0; i < (grid_side * grid_side); i++){
            if(i % grid_side === 0 && i !== 0){
                j.push('<br>');
            }
            j.push('<input class="buttons color2" disabled id=' + i + ' onclick=randomize_buttons(' + i + ') type=button value=->');
        }
        document.getElementById('game-area').innerHTML = j.join('');

        j = 0;
        document.getElementById('start-button').disabled = 0;
    }
}

function showhide(){
    i = document.getElementById('showhide-button').value === '-' ? 1 : 0;
    document.getElementById('settings-span').style.display = ['inline', 'none'][i];
    document.getElementById('showhide-button').value = ['-', '+'][i];
}

function stop(){
    clearInterval(interval);
    game_running = 0;

    // diable buttons to prevent further clicks
    i = grid_side * grid_side - 1;
    do{
        document.getElementById(i).disabled = 1;
    }while(i--);

    // enable settings to allow editing
    set_settings_disable(0);

    document.getElementById('start-button').value = 'Start (' + document.getElementById('start-key').value + ')';
    document.getElementById('start-button').onclick = function(){
        start();
    };
}

var game_running = 0;
var grid_side = 5;
var i = 0;
var interval = 0;

window.onkeydown = function(e){
    i = window.event ? event : e;
    i = i.charCode ? i.charCode : i.keyCode;

    if(String.fromCharCode(i) === document.getElementById('start-key').value){
        stop();
        start();

    }else if(i === 27){// ESC
        stop();
    }
};

window.onload = setup;
