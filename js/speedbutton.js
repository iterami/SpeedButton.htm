'use strict';

function click_button(clicked_button_id){
    audio_start({
      'id': 'boop',
      'volume-multiplier': storage_data['audio-volume'],
    });

    randomize_buttons(clicked_button_id);
}

function decisecond(){
    time = (storage_data['game-mode'] === 1
      && storage_data['max'] > 0)
      ? (parseFloat(time) - .1).toFixed(1)
      : (parseFloat(time) + .1).toFixed(1);

    document.getElementById('time').innerHTML = time;

    // If in max-time mode and time is less than or equal to 0 and max-time isn't 0...
    if(storage_data['game-mode'] === 1
      && time <= 0
      && storage_data['max'] > 0){
        stop();

    // ...else if in max-points mode and score is not greater than max-points and max-points is not equal to 0.
    }else if(storage_data['game-mode'] === 0
      && storage_data['max'] !== 0
      && score >= storage_data['max']){
        stop();
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
    score = score
      + (document.getElementById(clicked_button_id).value.lastIndexOf('+', 0) === 0
        ? parseInt(storage_data['green-points'], 10)
        : -parseInt(storage_data['red-points'], 10));
    document.getElementById('score').innerHTML = score;

    // Reset buttons to disabled, value=-, and black backgrounds if game has not ended with this click.
    var game_ended = !(storage_data['game-mode'] === 1
      || storage_data['max'] === 0
      || score < storage_data['max']);

    var loop_counter = storage_data['grid-dimensions'] * storage_data['grid-dimensions'] - 1;
    do{
        document.getElementById(loop_counter).disabled = true;

        if(game_ended){
            continue;
        }

        document.getElementById(loop_counter).style.background = colors['default'];
        document.getElementById(loop_counter).value = ' ';
    }while(loop_counter--);

    if(game_ended){
        return;
    }

    var space_taken = 0;

    // Randomize locations of and setup green buttons that currently exist.
    if(storage_data['green-frequency'] > 0){
        loop_counter = storage_data['green-frequency'] > (storage_data['grid-dimensions'] * storage_data['grid-dimensions']) - 1
          ? (storage_data['grid-dimensions'] * storage_data['grid-dimensions']) - 1
          : storage_data['green-frequency'] - 1;
        space_taken = loop_counter + 1;
        do{
            do{
                var button = core_random_integer({
                  'max': storage_data['grid-dimensions'] * storage_data['grid-dimensions'],
                });
            }while(!document.getElementById(button).disabled);

            document.getElementById(button).style.background = colors[1];
            document.getElementById(button).disabled = false;
            document.getElementById(button).value = '+'
              + parseInt(
                storage_data['green-points'],
                10
              );
        }while(loop_counter--);
    }

    // If there are no green buttons or space for red buttons is available.
    if(storage_data['green-frequency'] == 0
      || (storage_data['grid-dimensions'] > 1
        && (storage_data['grid-dimensions'] * storage_data['grid-dimensions']) - space_taken > 0)
    ){
        // Create and randomize enough red buttons to fill available space or just number of red buttons.
        loop_counter = storage_data['red-frequency'] > (storage_data['grid-dimensions'] * storage_data['grid-dimensions']) - space_taken - 1
          ? (storage_data['grid-dimensions'] * storage_data['grid-dimensions']) - space_taken - 1
          : storage_data['red-frequency'] - 1;
        if(loop_counter >= 0){
            do{
                do{
                    var button = core_random_integer({
                      'max': storage_data['grid-dimensions'] * storage_data['grid-dimensions'],
                    });
                }while(!document.getElementById(button).disabled);

                document.getElementById(button).style.background = colors[0];
                document.getElementById(button).disabled = false;
                document.getElementById(button).value = '-'
                  + parseInt(
                    storage_data['red-points'],
                    10
                  );
            }while(loop_counter--);
        }
    }
}

function setup(){
    document.getElementById('start-button').value = 'Start [' + storage_data['start-key'] + ']';

    // Adjust margin-top of entire game.
    document.getElementById('game-div').style.marginTop = storage_data['y-margin'] + 'px';

    // Create game-div buttons.
    var dimensions = storage_data['grid-dimensions'] * storage_data['grid-dimensions'];
    var output = '';
    for(var loop_counter = 0; loop_counter < dimensions; loop_counter++){
        if(loop_counter % storage_data['grid-dimensions'] === 0
          && loop_counter !== 0){
            output += '<br>';
        }

        output += '<input class=gridbuttonclickable disabled id=' + loop_counter
          + ' onclick=click_button(' + loop_counter
          + ') type=button value=" ">';
    }
    document.getElementById('game-div').innerHTML = output + '<br>';

    var loop_counter = dimensions - 1;
    do{
        document.getElementById(loop_counter).style.background = colors['default'];
    }while(loop_counter--);
}

function settings_toggle(state){
    state = state == void 0
      ? document.getElementById('settings-button').value === '+'
      : state;

    if(state){
        document.getElementById('settings').style.display = 'inline-block';
        document.getElementById('settings-button').value = '-';

    }else{
        document.getElementById('settings').style.display = 'none';
        document.getElementById('settings-button').value = '+';
    }
}

function start(){
    storage_save();
    setup();

    // Reset game buttons.
    var loop_counter = storage_data['grid-dimensions'] * storage_data['grid-dimensions'] - 1;
    do{
        document.getElementById(loop_counter).disabled = true;
        document.getElementById(loop_counter).style.background = colors['default'];
        document.getElementById(loop_counter).value = ' ';
    }while(loop_counter--);

    document.getElementById('score-max').innerHTML = '';
    document.getElementById('time-max').innerHTML = '';

    // Generate green and red buttons.
    randomize_buttons(
      core_random_integer({
        'max': storage_data['grid-dimensions'] * storage_data['grid-dimensions'],
      })
    );

    score = 0;
    time = 0;

    document.getElementById('score').innerHTML = score;
    document.getElementById('time').innerHTML = 0;

    // Setup max-time or max-points displays.
    if(storage_data['game-mode'] === 1){
        time = storage_data['max'] >= 0
          ? (storage_data['max'] === ''
            ? 0
            : storage_data['max']
          )
          : 30;
        if(storage_data['max'] > 0){
            document.getElementById('time-max').innerHTML = ' / ' + storage_data['max'];
        }

    }else if(storage_data['max'] > 0){
        document.getElementById('score-max').innerHTML = ' / ' + storage_data['max'];
    }

    document.getElementById('start-button').onclick = stop;
    document.getElementById('start-button').value = 'End [ESC]';

    game_running = true;
    interval = window.setInterval(
      decisecond,
      100
    );
}

function stop(){
    window.clearInterval(interval);
    game_running = false;

    // Disable buttons to prevent further clicks.
    var loop_counter = storage_data['grid-dimensions'] * storage_data['grid-dimensions'] - 1;
    do{
        document.getElementById(loop_counter).disabled = true;
    }while(loop_counter--);

    document.getElementById('start-button').onclick = start;
    document.getElementById('start-button').value = 'Start [' + storage_data['start-key'] + ']';
}

var colors = {
  'default': '#2a2a2a',
  '0': '#c83232',
  '1': '#262',
};
var game_running = false;
var interval = 0;
var score = 0;
var time = 0;

window.onload = function(){
    storage_init({
      'data': {
        'audio-volume': 1,
        'game-mode': 1,
        'green-frequency': 1,
        'green-points': 1,
        'grid-dimensions': 5,
        'max': 30,
        'red-frequency': 1,
        'red-points': 1,
        'red-onclick': 0,
        'start-key': 'H',
        'y-margin': 0,
      },
      'prefix': 'SpeedButton.htm-',
    });
    audio_init({
      'volume': storage_data['audio-volume'],
    });
    audio_create({
      'id': 'boop',
      'properties': {
        'duration': .1,
        'volume': .1,
      },
    });

    document.getElementById('settings').innerHTML =
      '<tr><td colspan=2><input id=reset-button onclick=storage_reset() type=button value=Reset>'
        + '<tr><td><input id=audio-volume max=1 min=0 step=0.01 type=range><td>Audio'
        + '<tr><td><input id=green-frequency><td>Green Frequency'
        + '<tr><td>+<input id=green-points><td>Green Points'
        + '<tr><td><select id=grid-dimensions><option value=1>1x1</option><option value=2>2x2</option><option value=3>3x3</option><option value=4>4x4</option><option value=5>5x5</option></select><td>Grid'
        + '<tr><td><input id=max><td>Max <select id=game-mode><option value=0>Points</option><option value=1>Time</option></select>'
        + '<tr><td><input id=red-frequency><td>Red Frequency'
        + '<tr><td>-<input id=red-points><td>Red Points'
        + '<tr><td><select id=red-onclick><option value=0>Lose Points</option><option value=1>End Game</option></select><td>Red Click'
        + '<tr><td><input id=start-key maxlength=1><td>Start'
        + '<tr><td><input id=y-margin><td>Y Margin';

    storage_update();
    setup();

    document.getElementById('settings-button').onclick = function(){
        settings_toggle();
    };
    document.getElementById('start-button').onclick = start;

    window.onkeydown = function(e){
        var key = e.keyCode || e.which;

        if(String.fromCharCode(key) === storage_data['start-key']){
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
};
