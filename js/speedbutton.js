'use strict';

function decisecond(){
    // If in max-time mode and time is less than or equal to 0 and max-time isn't 0...
    if(document.getElementById('game-mode').value == 1
      && parseFloat(document.getElementById('time').innerHTML) <= 0
      && document.getElementById('max-time').value > 0){
        stop();

    // ...else if in max-points mode and score is not greater than max-points and max-points is not equal to 0...
    }else if(document.getElementById('game-mode').value == 0
      && document.getElementById('max-points').value !== 0
      && parseInt(document.getElementById('score').innerHTML) >= document.getElementById('max-points').value){
        stop();

    // ...else increase time if max-time is equal to 0 or in max-points mode, else decrease time.
    }else{
        document.getElementById('time').innerHTML =
          (parseFloat(document.getElementById('time').innerHTML)
            + ((document.getElementById('game-mode').value == 1
              && document.getElementById('max-time').value > 0)
                ? -.1
                : .1
            )
          ).toFixed(1);
    }
}

function randomize_buttons(clicked_button_id){
    if(game_running){
        // Stop game if clicking on a red button ends the game and clicked on a red button.
        if(document.getElementById('red-onclick').value == 1
          && document.getElementById(clicked_button_id).value.lastIndexOf('-', 0) === 0){
            stop();
            return;
        }
    }

    // Increase or decrease time based on settings value for clicked button.
    document.getElementById('score').innerHTML = parseInt(document.getElementById('score').innerHTML)
      + (document.getElementById(clicked_button_id).value.lastIndexOf('+', 0) === 0
        ? parseInt(document.getElementById('green-points').value)
        : -parseInt(document.getElementById('red-points').value));

    // Reset buttons to disabled, value=-, and black backgrounds if game has not ended with this click.
    var game_ended = !(document.getElementById('game-mode').value == 1
      || document.getElementById('max-points').value == 0
      || parseInt(document.getElementById('score').innerHTML) < document.getElementById('max-points').value);

    var loop_counter = grid_side * grid_side - 1;
    do{
        document.getElementById(loop_counter).disabled = true;

        if(game_ended){
            continue;
        }

        document.getElementById(loop_counter).classList.remove('color0');
        document.getElementById(loop_counter).classList.remove('color1');
        document.getElementById(loop_counter).classList.add('color2');
        document.getElementById(loop_counter).value = '-';
    }while(loop_counter--);

    if(game_ended){
        return;
    }

    var space_taken = 0;

    // Randomize locations of and setup green buttons that currently exist.
    if(document.getElementById('green-frequency').value > 0){
        loop_counter = document.getElementById('green-frequency').value > (grid_side * grid_side) - 1
          ? (grid_side * grid_side) - 1
          : document.getElementById('green-frequency').value - 1;
        space_taken = loop_counter + 1;
        do{
            do{
                var button = Math.floor(Math.random() * (grid_side * grid_side));
            }while(!document.getElementById(button).disabled);

            document.getElementById(button).classList.remove('color2');
            document.getElementById(button).classList.add('color1');
            document.getElementById(button).disabled = false;
            document.getElementById(button).value = '+' + parseInt(document.getElementById('green-points').value);
        }while(loop_counter--);
    }

    // If there are no green buttons or space for red buttons is available.
    if(document.getElementById('green-frequency').value == 0
      || (document.getElementById('grid-dimensions').value > 1
      && (grid_side * grid_side) - space_taken > 0)){
        // Create and randomize enough red buttons to fill available space or just number of red buttons.
        loop_counter = document.getElementById('red-frequency').value > (grid_side * grid_side) - space_taken - 1
          ? (grid_side * grid_side) - space_taken - 1
          : document.getElementById('red-frequency').value - 1;
        if(loop_counter >= 0){
            do{
                do{
                    var button = Math.floor(Math.random() * (grid_side * grid_side));
                }while(!document.getElementById(button).disabled);

                document.getElementById(button).classList.remove('color2');
                document.getElementById(button).classList.add('color0');
                document.getElementById(button).disabled = false;
                document.getElementById(button).value = '-' + parseInt(document.getElementById('red-points').value);
            }while(loop_counter--);
        }
    }
}

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    stop();

    var ids = {
      'audio-volume': 1,
      'game-mode': 1,
      'green-frequency': 1,
      'green-points': 1,
      'grid-dimensions': 5,
      'max-points': 50,
      'max-time': 30,
      'red-frequency': 1,
      'red-onclick': 0,
      'red-points': 1,
      'score': 0,
      'start-key': 'H',
      'time': 0,
      'y-margin': 0,
    };
    for(var id in ids){
        document.getElementById(id).value = ids[id];
    }

    save();
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = {
      'audio-volume': 1,
      'game-mode': 1,
      'green-frequency': 1,
      'green-points': 1,
      'grid-dimensions': 5,
      'max-points': 50,
      'max-time': 30,
      'red-frequency': 1,
      'red-onclick': 0,
      'red-points': 1,
      'start-key': 'H',
      'y-margin': 0,
    };
    for(var id in ids){
        var value = document.getElementById(id).value;
        if(value == ids[id]){
            window.localStorage.removeItem('SpeedButton.htm-' + id);

        }else{
            window.localStorage.setItem(
              'SpeedButton.htm-' + id,
              value
            );
        }
    }
}

function setup(){
    if(!document.getElementById('start-button').disabled
      && grid_side == document.getElementById('grid-dimensions').value){
        return;
    }

    // Fetch settings from window.localStorage.
    document.getElementById('audio-volume').value =
      parseFloat(window.localStorage.getItem('SpeedButton.htm-audio-volume')) || 1;
    var ids = {
      'game-mode': 1,
      'green-frequency': 1,
      'green-points': 1,
      'grid-dimensions': 5,
      'max-points': 50,
      'max-time': 30,
      'red-frequency': 1,
      'red-onclick': 0,
      'red-points': 1,
      'y-margin': 0,
    };
    for(var id in ids){
        document.getElementById(id).value =
          parseInt(window.localStorage.getItem('SpeedButton.htm-' + id)) || ids[id];
    }

    if(window.localStorage.getItem('SpeedButton.htm-start-key') === null){
        document.getElementById('start-key').value = 'H';
    }else{
        document.getElementById('start-key').value = window.localStorage.getItem('SpeedButton.htm-start-key');
        document.getElementById('start-button').value = 'Start [' + document.getElementById('start-key').value + ']';
    }
    document.getElementById('game-area').style.marginTop = document.getElementById('y-margin').value + 'px';
    grid_side = document.getElementById('grid-dimensions').value;

    // Create game area buttons.
    var dimensions = grid_side * grid_side;
    var output = '';

    for(var loop_counter = 0; loop_counter < dimensions; loop_counter++){
        if(loop_counter % grid_side === 0
          && loop_counter !== 0){
            output += '<br>';
        }

        output +=
          '<input class="buttons color2" disabled id=' + loop_counter
          + ' onclick=randomize_buttons(' + loop_counter
          + ') type=button value=->';
    }
    document.getElementById('game-area').innerHTML = output;

    document.getElementById('start-button').disabled = false;
}

function settings_toggle(state){
    state = state == void 0
      ? document.getElementById('settings-button').value === '+'
      : state;

    if(state){
        document.getElementById('settings').style.display = 'block';
        document.getElementById('settings-button').value = '-';

    }else{
        document.getElementById('settings').style.display = 'none';
        document.getElementById('settings-button').value = '+';
    }
}

function start(){
    // Verify settings are numbers and greater than or equal to 0.
    var ids = {
      'audio-volume': 1,
      'green-frequency': 1,
      'green-points': 1,
      'max-points': 50,
      'max-time': 30,
      'red-frequency': 1,
      'red-points': 1,
      'y-margin': 0,
    };
    for(var id in ids){
        var value = document.getElementById(id).value;
        if(isNaN(value)
          || value < 0){
            document.getElementById(id).value = ids[id]
        }
    }

    // Adjust margin-top of entire game.
    document.getElementById('game-area').style.marginTop = document.getElementById('y-margin').value + 'px';

    // Save settings into window.localStorage and create game area.
    save();
    setup();

    // Reset game buttons.
    var loop_counter = grid_side * grid_side - 1;
    do{
        document.getElementById(loop_counter).disabled = true;
        document.getElementById(loop_counter).classList.remove('color0');
        document.getElementById(loop_counter).classList.remove('color1');
        document.getElementById(loop_counter).classList.remove('color2');
        document.getElementById(loop_counter).classList.add('color2');
        document.getElementById(loop_counter).value = '-';
    }while(loop_counter--);

    document.getElementById('score-max').innerHTML = '';
    document.getElementById('time-max').innerHTML = '';

    // Generate green and red buttons.
    randomize_buttons(Math.floor(Math.random() * (grid_side * grid_side)));

    document.getElementById('score').innerHTML = 0;
    document.getElementById('time').innerHTML = 0;

    // Setup max-time or max-points displays.
    var max_time = document.getElementById('max-time').value;
    if(document.getElementById('game-mode').value == 1){
        document.getElementById('time').innerHTML = max_time >= 0
          ? (max_time === ''
            ? 0
            : max_time
          )
          : 30;
        if(max_time > 0){
            document.getElementById('time-max').innerHTML = ' out of <b>' + max_time + '</b>';
        }

    }else if(document.getElementById('max-points').value > 0){
        document.getElementById('score-max').innerHTML = ' out of <b>' + max_time + '</b>';
    }

    document.getElementById('start-button').onclick = stop;
    document.getElementById('start-button').value = 'End [ESC]';

    game_running = true;
    interval = window.setInterval(
      'decisecond()',
      100
    );
}

function stop(){
    window.clearInterval(interval);
    game_running = false;

    // Disable buttons to prevent further clicks.
    var loop_counter = grid_side * grid_side - 1;
    do{
        document.getElementById(loop_counter).disabled = true;
    }while(loop_counter--);

    document.getElementById('start-button').onclick = start;
    document.getElementById('start-button').value =
      'Start [' + document.getElementById('start-key').value + ']';
}

var game_running = false;
var grid_side = 5;
var interval = 0;

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    if(String.fromCharCode(key) === document.getElementById('start-key').value){
        stop();
        start();

    // ESC: stop current game.
    }else if(key === 27){
        stop();

    // +: show settings.
    }else if(key === 187){
        settings_toggle(true);

    // -: hide settings.
    }else if(key === 189){
        settings_toggle(false);
    }
};

window.onload = setup;
