'use strict';

function click_button(clicked_button_id){
    if(core_menu_open){
        return;
    }

    audio_start({
      'id': 'boop',
    });

    randomize_buttons(clicked_button_id);
}

function decisecond(){
    if(core_mode === 0){
        return;
    }

    time = Number.parseFloat(time);
    if(core_storage_data['game-mode'] === 1
      && core_storage_data['max'] > 0){
        time -= .1;

    }else{
        time += .1;
    }
    time = core_round({
      'decimals': 1,
      'number': time,
    });

    core_elements['time'].textContent = core_number_format({
      'decimals-min': 1,
      'number': time,
    });;

    if(core_storage_data['game-mode'] === 1
      && time <= 0
      && core_storage_data['max'] > 0){
        stop();

    }else if(core_storage_data['game-mode'] === 0
      && core_storage_data['max'] !== 0
      && score >= core_storage_data['max']){
        stop();
    }
}

function randomize_buttons(clicked_button_id){
    if(core_mode === 1){
        // Stop game if clicking on a negative button ends the game and clicked on a negative button.
        if(document.getElementById('negative-onclick').value === 1
          && document.getElementById(clicked_button_id).value.lastIndexOf('-', 0) === 0){
            stop();
            return;
        }
    }

    // Increase or decrease time based on settings value for clicked button.
    score += document.getElementById(clicked_button_id).value.lastIndexOf('+', 0) === 0
      ? core_storage_data['positive-points']
      : core_storage_data['negative-points'];
    document.getElementById('score').textContent = score;

    // Reset buttons to disabled, value=-, and black backgrounds if game has not ended with this click.
    let game_ended = !(core_storage_data['game-mode'] === 1
      || core_storage_data['max'] === 0
      || score < core_storage_data['max']);

    let loop_counter = grid_dimensions_squared - 1;
    do{
        let element = document.getElementById(loop_counter);
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

    let space_taken = 0;

    // Randomize locations of and setup positive buttons that currently exist.
    if(core_storage_data['positive-frequency'] > 0){
        loop_counter = core_storage_data['positive-frequency'] > grid_dimensions_squared - 1
          ? grid_dimensions_squared - 1
          : core_storage_data['positive-frequency'] - 1;
        space_taken = loop_counter + 1;
        do{
            let button = '';
            do{
                button = core_random_integer({
                  'max': grid_dimensions_squared,
                });
            }while(!document.getElementById(button).disabled);

            let element = document.getElementById(button);
            element.style.background = core_storage_data['color-positive'];
            element.disabled = false;
            element.value = core_storage_data['positive-points'] > 0
              ? '+'
              : '-';
        }while(loop_counter--);
    }

    // If there are no positive buttons or space for negative buttons.
    if(core_storage_data['positive-frequency'] === 0
      || (core_storage_data['grid-dimensions'] > 1
        && grid_dimensions_squared - space_taken > 0)
    ){
        // Create and randomize enough negative buttons to fill available space or just number of negative buttons.
        loop_counter = core_storage_data['negative-frequency'] > grid_dimensions_squared - space_taken - 1
          ? grid_dimensions_squared - space_taken - 1
          : core_storage_data['negative-frequency'] - 1;
        if(loop_counter >= 0){
            do{
                let button = '';
                do{
                    button = core_random_integer({
                      'max': grid_dimensions_squared,
                    });
                }while(!document.getElementById(button).disabled);

                let element = document.getElementById(button);
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
    grid_dimensions_squared = Math.max(
      core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'],
      1
    );

    // Create game-div buttons.
    let output = '';
    for(let loop_counter = 0; loop_counter < grid_dimensions_squared; loop_counter++){
        if(loop_counter % core_storage_data['grid-dimensions'] === 0
          && loop_counter !== 0){
            output += '<br>';
        }

        output += '<input class=gridbuttonclickable disabled id=' + loop_counter
          + ' onclick=click_button(' + loop_counter
          + ') type=button value=" ">';
    }
    document.getElementById('game-div').innerHTML = output + '<br>';

    let loop_counter = grid_dimensions_squared - 1;
    do{
        document.getElementById(loop_counter).style.background = '#2a2a2a';
    }while(loop_counter--);

    // Reset game buttons.
    loop_counter = grid_dimensions_squared - 1;
    do{
        let element = document.getElementById(loop_counter);
        element.disabled = true;
        element.style.background = '#2a2a2a';
        element.style.height = core_storage_data['height'];
        element.style.width = core_storage_data['width'];
        element.value = ' ';
    }while(loop_counter--);

    document.getElementById('score-max').textContent = '';
    document.getElementById('time-max').textContent = '';

    // Generate positive and negative buttons.
    randomize_buttons(
      core_random_integer({
        'max': grid_dimensions_squared,
      })
    );

    score = 0;
    time = 0;

    document.getElementById('score').textContent = score;
    core_elements['time'].textContent = 0;

    // Setup max-time or max-points displays.
    if(core_storage_data['game-mode'] === 1){
        time = core_storage_data['max'] >= 0
          ? (core_storage_data['max'] === ''
            ? 0
            : core_storage_data['max']
          )
          : 30;
        if(core_storage_data['max'] > 0){
            document.getElementById('time-max').textContent = ' / ' + core_storage_data['max'];
        }

    }else if(core_storage_data['max'] > 0){
        document.getElementById('score-max').textContent = ' / ' + core_storage_data['max'];
    }

    core_mode = 1;
    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': decisecond,
    });
}

function stop(){
    core_interval_pause_all();
    core_mode = 0;

    // Disable buttons to prevent further clicks.
    let loop_counter = grid_dimensions_squared - 1;
    do{
        let element = document.getElementById(loop_counter);

        if(!element){
            break;
        }

        element.disabled = true;
    }while(loop_counter--);
}
