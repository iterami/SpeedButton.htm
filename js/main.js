'use strict';

function repo_escape(){
    stop();
}

function repo_init(){
    core_repo_init({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
      'events': {
        'start-button': {
          'onclick': start,
        },
      },
      'globals': {
        'game_running': false,
        'interval': 0,
        'score': 0,
        'time': 0,
      },
      'keybinds': {
        72: {
          'todo': function(){
              stop();
              start();
          },
        },
      },
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

    setup();
}
