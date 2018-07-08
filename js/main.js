'use strict';

function repo_init(){
    core_repo_init({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
      'events': {
        'start-button': {
          'onclick': function(){
              core_escape();
              start();
          },
        },
      },
      'globals': {
        'game_running': false,
        'score': 0,
        'time': 0,
      },
      'info': '<input id=start-button type=button value=Restart>',
      'keybinds': {
        72: {
          'todo': function(){
              stop();
              start();
          },
        },
      },
      'menu': true,
      'storage': {
        'game-mode': 1,
        'grid-dimensions': 5,
        'max': 30,
        'negative-frequency': 1,
        'negative-onclick': 0,
        'negative-points': -1,
        'positive-frequency': 1,
        'positive-points': 1,
      },
      'storage-menu': '<table><tr><td><select id=grid-dimensions><option value=1>1x1</option><option value=2>2x2</option><option value=3>3x3</option><option value=4>4x4</option><option value=5>5x5</option></select><td>Dimensions<tr><td><input id=max><td>Max <select id=game-mode><option value=0>Points</option><option value=1>Time</option></select><tr><td><select id=negative-onclick><option value=0>Lose Points</option><option value=1>End Game</option></select><td>Negative Click<tr><td><input id=negative-frequency><td>Negative Frequency<tr><td><input id=negative-points><td>Negative Points<tr><td><input id=positive-frequency><td>Positive Frequency<tr><td><input id=positive-points><td>Positive Points</table>',
      'title': 'SpeedButton.htm',
    });

    // Create game-div buttons.
    let dimensions = core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'];
    let output = '';
    for(let loop_counter = 0; loop_counter < dimensions; loop_counter++){
        if(loop_counter % core_storage_data['grid-dimensions'] === 0
          && loop_counter !== 0){
            output += '<br>';
        }

        output += '<input class=gridbuttonclickable disabled id=' + loop_counter
          + ' onclick=click_button(' + loop_counter
          + ') type=button value=" ">';
    }
    document.getElementById('game-div').innerHTML = output + '<br>';

    let loop_counter = dimensions - 1;
    do{
        document.getElementById(loop_counter).style.background = '#2a2a2a';
    }while(loop_counter--);
}
