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
        'green-frequency': 1,
        'green-points': 1,
        'grid-dimensions': 5,
        'max': 30,
        'red-frequency': 1,
        'red-points': -1,
        'red-onclick': 0,
      },
      'storage-menu': '<table><tr><td><input id=green-frequency><td>Green Frequency<tr><td><input id=green-points><td>Green Points<tr><td><select id=grid-dimensions><option value=1>1x1</option><option value=2>2x2</option><option value=3>3x3</option><option value=4>4x4</option><option value=5>5x5</option></select><td>Dimensions<tr><td><input id=max><td>Max <select id=game-mode><option value=0>Points</option><option value=1>Time</option></select><tr><td><input id=red-frequency><td>Red Frequency<tr><td><input id=red-points><td>Red Points<tr><td><select id=red-onclick><option value=0>Lose Points</option><option value=1>End Game</option></select><td>Red Click</table>',
      'title': 'SpeedButton.htm',
    });

    // Create game-div buttons.
    var dimensions = core_storage_data['grid-dimensions'] * core_storage_data['grid-dimensions'];
    var output = '';
    for(var loop_counter = 0; loop_counter < dimensions; loop_counter++){
        if(loop_counter % core_storage_data['grid-dimensions'] === 0
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
        document.getElementById(loop_counter).style.background = '#2a2a2a';
    }while(loop_counter--);
}
