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
        'grid_dimensions_squared': 0,
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
        'height': '50px',
        'max': 30,
        'negative-frequency': 1,
        'negative-onclick': 0,
        'negative-points': -1,
        'positive-frequency': 1,
        'positive-points': 1,
        'width': '50px',
      },
      'storage-menu': '<table><tr><td><input id=height><td>Button Height'
        + '<tr><td><input id=width><td>Button Width'
        + '<tr><td><input id=grid-dimensions><td>Dimensions'
        + '<tr><td><input id=max><td>Max <select id=game-mode><option value=0>Points</option><option value=1>Time</option></select>'
        + '<tr><td><select id=negative-onclick><option value=0>Lose Points</option><option value=1>End Game</option></select><td>Negative Click'
        + '<tr><td><input id=negative-frequency><td>Negative Frequency'
        + '<tr><td><input id=negative-points><td>Negative Points'
        + '<tr><td><input id=positive-frequency><td>Positive Frequency'
        + '<tr><td><input id=positive-points><td>Positive Points</table>',
      'title': 'SpeedButton.htm',
    });
}
