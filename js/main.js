'use strict';

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
      'storage-menu': '<table><tr><td><input class=mini id=height><td>Button Height'
        + '<tr><td><input class=mini id=width><td>Button Width'
        + '<tr><td><input class=mini id=grid-dimensions min=1 step=any type=number><td>Dimensions'
        + '<tr><td><input class=mini id=max step=any type=number><td>Max <select id=game-mode><option value=0>Points</option><option value=1>Time</option></select>'
        + '<tr><td><select id=negative-onclick><option value=0>Lose Points</option><option value=1>End Game</option></select><td>Negative Click'
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
    core_html_store({
      'ids': [
        'time',
      ],
    });
}
