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

    for(let i = 0; i < grid_total; i++){
        core_elements[i].disabled = true;
        if(game_ended){
            continue;
        }
        core_elements[i].style.backgroundColor = '';
        core_elements[i].textContent = ' ';
    }

    if(game_ended){
        return;
    }

    const available_buttons = [...buttons];

    const positives = core_storage_data.positive_frequency > grid_total
      ? grid_total
      : core_storage_data.positive_frequency;
    for(let i = 0; i < positives; i++){
        const element = core_elements[core_random_splice(available_buttons)];
        element.style.backgroundColor = core_storage_data.positive_color;
        element.disabled = false;
        element.textContent = core_storage_data.positive_points > 0
          ? '+'
          : '-';
    }
    const negatives = core_storage_data.negative_frequency > grid_total - positives
      ? grid_total - positives
      : core_storage_data.negative_frequency;
    for(let i = 0; i < negatives; i++){
        const element = core_elements[core_random_splice(available_buttons)];
        element.style.backgroundColor = core_storage_data.negative_color;
        element.disabled = false;
        element.textContent = core_storage_data.negative_points > 0
          ? '+'
          : '-';
    }
}

function repo_escape(){
    audio_state_all(!core_menu_open);

    if(!core_intervals.interval
      && !core_menu_open){
        start();
    }
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(event){
            if(score !== 0){
                core_escape(true);
                event.preventDefault();
            }
        },
      },
      'events': {
        'start': {
          'onclick': start,
        },
      },
      'globals': {
        'buttons': [],
        'grid_total': 0,
        'score': 0,
        'time': 0,
      },
      'info': '<button class=medium id=start type=button>Start New Game</button>',
      'menu': true,
      'storage': {
        'grid_x': 5,
        'grid_y': 5,
        'height': '50px',
        'max': 30,
        'mode': 1,
        'negative_color': '#663366',
        'negative_frequency': 1,
        'negative_onclick': 0,
        'negative_points': -1,
        'positive_color': '#206620',
        'positive_frequency': 1,
        'positive_points': 1,
        'width': '50px',
      },
      'storage_menu': '<table><tr><td><input class=mini id=height type=text><td>Button Height'
        + '<tr><td><input class=mini id=width type=text><td>Button Width'
        + '<tr><td><input class=mini id=grid_x min=1 step=1 type=number><td>Grid X'
        + '<tr><td><input class=mini id=grid_y min=1 step=1 type=number><td>Grid Y'
        + '<tr><td><input class=mini id=max step=any type=number><td>Max <select id=mode><option value=0>Points<option value=1>Time</select>'
        + '<tr><td><input id=positive_color type=color><td>Positive Color'
        + '<tr><td><input class=mini id=positive_frequency min=0 step=1 type=number><td>Positive Frequency'
        + '<tr><td><input class=mini id=positive_points step=any type=number><td>Positive Points'
        + '<tr><td><input id=negative_color type=color><td>Negative Color'
        + '<tr><td><input class=mini id=negative_frequency min=0 step=1 type=number><td>Negative Frequency'
        + '<tr><td><select id=negative_onclick><option value=0>Lose Points<option value=1>End Game</select><td>Negative Click'
        + '<tr><td><input class=mini id=negative_points step=any type=number><td>Negative Points</table>',
      'title': 'SpeedButton.htm',
      'ui_elements': [
        'game',
      ],
    });
}

function reset(){
    core_object_reset(buttons);
    grid_total = Math.floor(Math.max(
        core_storage_data.grid_x,
        1
      )) * Math.floor(Math.max(
        core_storage_data.grid_y,
        1
      ));

    let output = '';
    for(let i = 0; i < grid_total; i++){
        if(i % core_storage_data.grid_x === 0
          && i !== 0){
            output += '<br>';
        }

        output += '<button class=gridbuttonclickable id=' + i
          + ' onclick=click_button(' + i + ') type=button> </button>';
    }
    core_elements.game.style.lineHeight = core_storage_data.height;
    core_elements.game.innerHTML = output;

    for(const element in core_elements){
        if(!globalThis.isNaN(element)){
            delete core_elements[element];
        }
    }
    for(let i = 0; i < grid_total; i++){
        core_elements[i] = document.getElementById(i);
        core_elements[i].disabled = true;
        core_elements[i].style.height = core_storage_data.height;
        core_elements[i].style.width = core_storage_data.width;
        core_elements[i].textContent = ' ';

        const half = Math.ceil(core_elements[i].offsetWidth / 2) + 'px';
        core_elements[i].style.fontSize = half;
        core_elements[i].style.lineHeight = half;
        buttons.push(i);
    }

    core_elements.game.style.minWidth = (core_elements[0].offsetWidth * core_storage_data.grid_x + core_storage_data.grid_x * 2) + 'px';
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

    let score_max = '';
    let time_max = '';
    if(core_storage_data.mode === 1){
        time = core_storage_data.max >= 0
          ? (core_storage_data.max === ''
            ? 0
            : core_storage_data.max
          )
          : 30;
        if(core_storage_data.max > 0){
            time_max = ' / ' + core_storage_data.max;
        }

    }else if(core_storage_data.max > 0){
        score_max = ' / ' + core_storage_data.max;
    }
    core_elements.score_max.textContent = score_max;
    core_elements.time_max.textContent = time_max;
}

function start(){
    if(score !== 0
      && !globalThis.confirm('Start new game?')){
        return;
    }
    reset();
    core_escape(false);

    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': decisecond,
    });
}

function stop(){
    core_interval_lock('interval');

    for(let i = 0; i < grid_total; i++){
        if(!core_elements[i]){
            break;
        }
        core_elements[i].disabled = true;
    }
}
