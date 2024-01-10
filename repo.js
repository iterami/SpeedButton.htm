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
        if(document.getElementById('negative-onclick').value === 1
          && document.getElementById(clicked_button_id).value.lastIndexOf('-', 0) === 0){
            stop();
            return;
        }
    }

    score += document.getElementById(clicked_button_id).value.lastIndexOf('+', 0) === 0
      ? core_storage_data['positive-points']
      : core_storage_data['negative-points'];
    document.getElementById('score').textContent = score;

    const game_ended = !(core_storage_data['game-mode'] === 1
      || core_storage_data['max'] === 0
      || score < core_storage_data['max']);

    let loop_counter = grid_dimensions_squared - 1;
    do{
        const element = document.getElementById(loop_counter);
        element.disabled = true;

        if(game_ended){
            continue;
        }

        element.style.backgroundColor = '#2a2a2a';
        element.value = ' ';
    }while(loop_counter--);

    if(game_ended){
        return;
    }

    let space_taken = 0;

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

            const element = document.getElementById(button);
            element.style.backgroundColor = '#206620';
            element.disabled = false;
            element.value = core_storage_data['positive-points'] > 0
              ? '+'
              : '-';
        }while(loop_counter--);
    }

    if(core_storage_data['positive-frequency'] === 0
      || (core_storage_data['grid-dimensions'] > 1
        && grid_dimensions_squared - space_taken > 0)
    ){
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

                const element = document.getElementById(button);
                element.style.backgroundColor = '#663366';
                element.disabled = false;
                element.value = core_storage_data['negative-points'] > 0
                  ? '+'
                  : '-';
            }while(loop_counter--);
        }
    }
}

function repo_escape(){
    if(!core_intervals['interval']
      && !core_menu_open){
        core_repo_reset();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start-button': {
          'onclick': core_repo_reset,
        },
      },
      'globals': {
        'grid_dimensions_squared': 0,
        'score': 0,
        'time': 0,
      },
      'info': '<input id=start-button type=button value=Restart>',
      'menu': true,
      'reset': function(){
          stop();
          if(core_menu_open){
              core_escape();
          }
          start();
      },
      'storage': {
        'game-mode': 1,
        'grid-dimensions': 5,
        'height': '50px',
        'max': 30,
        'negative-frequency': 1,
        'negative-onclick': 0,
        'negative-points': -1,
        'positive-frequency': 1,
        'positive-points': 1,
        'width': '50px',
      },
      'storage-menu': '<table><tr><td><input class=mini id=height type=text><td>Button Height'
        + '<tr><td><input class=mini id=width type=text><td>Button Width'
        + '<tr><td><input class=mini id=grid-dimensions min=1 step=any type=number><td>Dimensions'
        + '<tr><td><input class=mini id=max step=any type=number><td>Max <select id=game-mode><option value=0>Points<option value=1>Time</select>'
        + '<tr><td><select id=negative-onclick><option value=0>Lose Points<option value=1>End Game</select><td>Negative Click'
        + '<tr><td><input class=mini id=negative-frequency step=any type=number><td>Negative Frequency'
        + '<tr><td><input class=mini id=negative-points step=any type=number><td>Negative Points'
        + '<tr><td><input class=mini id=positive-frequency step=any type=number><td>Positive Frequency'
        + '<tr><td><input class=mini id=positive-points step=any type=number><td>Positive Points</table>',
      'title': 'SpeedButton.htm',
    });
    audio_create({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
    });
    core_html_store([
      'time',
    ]);
}

function start(){
    grid_dimensions_squared = Math.max(
      core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'],
      1
    );

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
        document.getElementById(loop_counter).style.backgroundColor = '#2a2a2a';
    }while(loop_counter--);

    loop_counter = grid_dimensions_squared - 1;
    do{
        const element = document.getElementById(loop_counter);
        element.disabled = true;
        element.style.backgroundColor = '#2a2a2a';
        element.style.height = core_storage_data['height'];
        element.style.width = core_storage_data['width'];
        element.value = ' ';
    }while(loop_counter--);

    document.getElementById('score-max').textContent = '';
    document.getElementById('time-max').textContent = '';

    randomize_buttons(
      core_random_integer({
        'max': grid_dimensions_squared,
      })
    );

    score = 0;
    time = 0;

    document.getElementById('score').textContent = score;
    core_elements['time'].textContent = 0;

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

    let loop_counter = grid_dimensions_squared - 1;
    do{
        const element = document.getElementById(loop_counter);

        if(!element){
            break;
        }

        element.disabled = true;
    }while(loop_counter--);
}
