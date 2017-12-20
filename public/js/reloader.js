/**
 * Handle page reload.
 */
document.addEventListener('DOMContentLoaded', function(){
  var msecsPerUpdate = 1000/60;
  var progress = document.querySelector('.progress-bar');
  var duration = 60;
  var interval = 100 / (duration*1000/msecsPerUpdate);

  var current = 0;
  var animator = function(){
    progress.style.width = current + interval + '%';
    if (current + interval < 100){
      current += interval;
      setTimeout(animator, msecsPerUpdate);
    }
    else {
      location.reload();
      progress.style.width = '100%';
    }
  };

  animator();
});
