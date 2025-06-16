'use strict';

function click_button(clicked_button_id){
    if(core_menu_open){
        return;
    }

    core_elements[clicked_button_id].blur();
    randomize_buttons(clicked_button_id);
    audio_start('boop');
}

function decisecond(){
    if(core_mode === 0){
        return;
    }

    if(core_storage_data.mode === 1
      && core_storage_data.max > 0){
        time -= .1;

    }else{
        time += .1;
    }
    time = core_round({
      'decimals': 1,
      'number': time,
    });

    core_ui_update({
      'ids': {
        'time': core_number_format({
          'decimals_min': 1,
          'number': time,
        }),
      },
    });

    if(core_storage_data.mode === 1
      && time <= 0
      && core_storage_data.max > 0){
        stop();

    }else if(core_storage_data.mode === 0
      && core_storage_data.max !== 0
      && score >= core_storage_data.max){
        stop();
    }
}

function randomize_buttons(clicked_button_id){
    if(core_storage_data.negative_onclick === 1
      && core_elements[clicked_button_id].textContent.lastIndexOf('-', 0) === 0){
        stop();
        return;
    }

    score += core_elements[clicked_button_id].textContent.lastIndexOf('+', 0) === 0
      ? core_storage_data.positive_points
      : core_storage_data.negative_points;
    core_ui_update({
      'ids': {
        'score': score,
      },
    });

    const game_ended = !(core_storage_data.mode === 1
      || core_storage_data.max === 0
      || score < core_storage_data.max);

    let loop_counter = grid_total - 1;
    do{
        core_elements[loop_counter].disabled = true;
        if(game_ended){
            continue;
        }
        core_elements[loop_counter].style.backgroundColor = '';
        core_elements[loop_counter].textContent = ' ';
    }while(loop_counter--);

    if(game_ended){
        return;
    }

    let space_taken = 0;
    const available_buttons = [...buttons];

    if(core_storage_data.positive_frequency > 0){
        loop_counter = core_storage_data.positive_frequency > grid_total - 1
          ? grid_total - 1
          : core_storage_data.positive_frequency - 1;
        space_taken = loop_counter + 1;
        do{
            const element = core_elements[core_random_splice(available_buttons)];
            element.style.backgroundColor = '#206620';
            element.disabled = false;
            element.textContent = core_storage_data.positive_points > 0
              ? '+'
              : '-';
        }while(loop_counter--);
    }

    if(core_storage_data.positive_frequency === 0
      || grid_total - space_taken > 0){
        loop_counter = core_storage_data.negative_frequency > grid_total - space_taken - 1
          ? grid_total - space_taken - 1
          : Math.floor(core_storage_data.negative_frequency) - 1;
        if(loop_counter >= 0){
            do{
                const element = core_elements[core_random_splice(available_buttons)];
                element.style.backgroundColor = '#663366';
                element.disabled = false;
                element.textContent = core_storage_data.negative_points > 0
                  ? '+'
                  : '-';
            }while(loop_counter--);
        }
    }
}

function repo_escape(){
    if(!core_intervals.interval
      && !core_menu_open){
        reset();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start-button': {
          'onclick': reset,
        },
      },
      'globals': {
        'buttons': [],
        'grid_total': 0,
        'score': 0,
        'time': 0,
      },
      'info': '<button id=start-button type=button>Restart</button>',
      'menu': true,
      'storage': {
        'grid_x': 5,
        'grid_y': 5,
        'height': 50,
        'max': 30,
        'mode': 1,
        'negative_frequency': 1,
        'negative_onclick': 0,
        'negative_points': -1,
        'positive_frequency': 1,
        'positive_points': 1,
        'width': 50,
      },
      'storage-menu': '<table><tr><td><input class=mini id=height min=1 step=any type=number><td>Button Height'
        + '<tr><td><input class=mini id=width min=1 step=any type=number><td>Button Width'
        + '<tr><td><input class=mini id=grid_x min=1 step=1 type=number><td>Grid X'
        + '<tr><td><input class=mini id=grid_y min=1 step=1 type=number><td>Grid Y'
        + '<tr><td><input class=mini id=max step=any type=number><td>Max <select id=mode><option value=0>Points<option value=1>Time</select>'
        + '<tr><td><select id=negative_onclick><option value=0>Lose Points<option value=1>End Game</select><td>Negative Click'
        + '<tr><td><input class=mini id=negative_frequency step=1 type=number><td>Negative Frequency'
        + '<tr><td><input class=mini id=negative_points step=any type=number><td>Negative Points'
        + '<tr><td><input class=mini id=positive_frequency step=1 type=number><td>Positive Frequency'
        + '<tr><td><input class=mini id=positive_points step=any type=number><td>Positive Points</table>',
      'title': 'SpeedButton.htm',
      'ui-elements': [
        'game',
      ],
    });
}

function reset(){
    if(score !== 0
      && !globalThis.confirm('Start new game?')){
        return;
    }
    stop();
    if(core_menu_open){
        core_escape();
    }
    start();
}

function start(){
    core_object_reset(buttons);
    grid_total = Math.floor(Math.max(
        core_storage_data.grid_x,
        1
      )) * Math.floor(Math.max(
        core_storage_data.grid_y,
        1
      ));

    let output = '';
    for(let loop_counter = 0; loop_counter < grid_total; loop_counter++){
        if(loop_counter % core_storage_data.grid_x === 0
          && loop_counter !== 0){
            output += '<br>';
        }

        output += '<button class=gridbuttonclickable disabled id=' + loop_counter
          + ' onclick=click_button(' + loop_counter
          + ') type=button> </button>';
    }
    core_elements.game.innerHTML = output + '<br>';
    core_elements.game.style.lineHeight = core_storage_data.height + 'px';

    for(const element in core_elements){
        if(!globalThis.isNaN(element)){
            delete core_elements[element];
        }
    }
    let loop_counter = grid_total - 1;
    do{
        core_elements[loop_counter] = document.getElementById(loop_counter);
        core_elements[loop_counter].disabled = true;
        core_elements[loop_counter].style.fontSize = Math.ceil(core_storage_data.height / 2) + 'px';
        core_elements[loop_counter].style.height = core_storage_data.height + 'px';
        core_elements[loop_counter].style.lineHeight = Math.ceil(core_storage_data.height / 2) + 'px';
        core_elements[loop_counter].style.width = core_storage_data.width + 'px';
        core_elements[loop_counter].textContent = ' ';
        buttons.push(loop_counter);
    }while(loop_counter--);

    randomize_buttons(core_random_integer(grid_total));

    score = 0;
    time = 0;
    core_ui_update({
      'ids': {
        'score': 0,
        'score_max': '',
        'time': 0,
        'time_max': '',
      },
    });

    if(core_storage_data.mode === 1){
        time = core_storage_data.max >= 0
          ? (core_storage_data.max === ''
            ? 0
            : core_storage_data.max
          )
          : 30;
        if(core_storage_data.max > 0){
            core_elements.time_max.textContent = ' / ' + core_storage_data.max;
        }

    }else if(core_storage_data.max > 0){
        core_elements.score_max.textContent = ' / ' + core_storage_data.max;
    }

    core_mode = 1;
    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': decisecond,
    });
}

function stop(){
    core_mode = 0;
    core_interval_pause_all();

    let loop_counter = grid_total - 1;
    do{
        if(!core_elements[loop_counter]){
            break;
        }
        core_elements[loop_counter].disabled = true;
    }while(loop_counter--);
}
