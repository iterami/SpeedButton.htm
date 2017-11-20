'use strict';

function click_button(clicked_button_id){
    if(core_menu_open){
        return;
    }

    core_audio_start({
      'id': 'boop',
    });

    randomize_buttons(clicked_button_id);
}

function decisecond(){
    time = (core_storage_data['game-mode'] === 1
      && core_storage_data['max'] > 0)
      ? (parseFloat(time) - .1).toFixed(1)
      : (parseFloat(time) + .1).toFixed(1);

    document.getElementById('time').innerHTML = time;

    // If in max-time mode and time is less than or equal to 0 and max-time isn't 0...
    if(core_storage_data['game-mode'] === 1
      && time <= 0
      && core_storage_data['max'] > 0){
        stop();

    // ...else if in max-points mode and score is not greater than max-points and max-points is not equal to 0.
    }else if(core_storage_data['game-mode'] === 0
      && core_storage_data['max'] !== 0
      && score >= core_storage_data['max']){
        stop();
    }
}

function randomize_buttons(clicked_button_id){
    if(game_running){
        // Stop game if clicking on a negative button ends the game and clicked on a negative button.
        if(document.getElementById('negative-onclick').value == 1
          && document.getElementById(clicked_button_id).value.lastIndexOf('-', 0) === 0){
            stop();
            return;
        }
    }

    // Increase or decrease time based on settings value for clicked button.
    score = score
      + (document.getElementById(clicked_button_id).value.lastIndexOf('+', 0) === 0
        ? core_storage_data['positive-points']
        : core_storage_data['negative-points']);
    document.getElementById('score').innerHTML = score;

    // Reset buttons to disabled, value=-, and black backgrounds if game has not ended with this click.
    var game_ended = !(core_storage_data['game-mode'] === 1
      || core_storage_data['max'] === 0
      || score < core_storage_data['max']);

    var loop_counter = core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'] - 1;
    do{
        var element = document.getElementById(loop_counter);
        element.disabled = true;

        if(game_ended){
            continue;
        }

        element.style.background = '#2a2a2a';
        element.value = ' ';
    }while(loop_counter--);

    if(game_ended){
        return;
    }

    var space_taken = 0;

    // Randomize locations of and setup positive buttons that currently exist.
    if(core_storage_data['positive-frequency'] > 0){
        loop_counter = core_storage_data['positive-frequency'] > (core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions']) - 1
          ? (core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions']) - 1
          : core_storage_data['positive-frequency'] - 1;
        space_taken = loop_counter + 1;
        do{
            do{
                var button = core_random_integer({
                  'max': core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'],
                });
            }while(!document.getElementById(button).disabled);

            var element = document.getElementById(button);
            element.style.background = core_storage_data['color-positive'];
            element.disabled = false;
            element.value = core_storage_data['positive-points'] > 0
              ? '+'
              : '-';
        }while(loop_counter--);
    }

    // If there are no positive buttons or space for negative buttons is available.
    if(core_storage_data['positive-frequency'] == 0
      || (core_storage_data['grid-dimensions'] > 1
        && (core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions']) - space_taken > 0)
    ){
        // Create and randomize enough negative buttons to fill available space or just number of negative buttons.
        loop_counter = core_storage_data['negative-frequency'] > (core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions']) - space_taken - 1
          ? (core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions']) - space_taken - 1
          : core_storage_data['negative-frequency'] - 1;
        if(loop_counter >= 0){
            do{
                do{
                    var button = core_random_integer({
                      'max': core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'],
                    });
                }while(!document.getElementById(button).disabled);

                var element = document.getElementById(button);
                element.style.background = core_storage_data['color-negative'];
                element.disabled = false;
                element.value = core_storage_data['negative-points'] > 0
                  ? '+'
                  : '-';
            }while(loop_counter--);
        }
    }
}

function start(){
    // Reset game buttons.
    var loop_counter = core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'] - 1;
    do{
        var element = document.getElementById(loop_counter);
        element.disabled = true;
        element.style.background = '#2a2a2a';
        element.value = ' ';
    }while(loop_counter--);

    document.getElementById('score-max').innerHTML = '';
    document.getElementById('time-max').innerHTML = '';

    // Generate positive and negative buttons.
    randomize_buttons(
      core_random_integer({
        'max': core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'],
      })
    );

    score = 0;
    time = 0;

    document.getElementById('score').innerHTML = score;
    document.getElementById('time').innerHTML = 0;

    // Setup max-time or max-points displays.
    if(core_storage_data['game-mode'] === 1){
        time = core_storage_data['max'] >= 0
          ? (core_storage_data['max'] === ''
            ? 0
            : core_storage_data['max']
          )
          : 30;
        if(core_storage_data['max'] > 0){
            document.getElementById('time-max').innerHTML = ' / ' + core_storage_data['max'];
        }

    }else if(core_storage_data['max'] > 0){
        document.getElementById('score-max').innerHTML = ' / ' + core_storage_data['max'];
    }

    game_running = true;
    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': decisecond,
    });
}

function stop(){
    core_interval_pause_all();
    game_running = false;

    // Disable buttons to prevent further clicks.
    var loop_counter = core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'] - 1;
    do{
        document.getElementById(loop_counter).disabled = true;
    }while(loop_counter--);
}
