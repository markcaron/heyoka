window.addEventListener('load', function(event) {
  let body = document.querySelector('body'),
      rhythmBtn = document.createElement('button');

  // build button for showing horizontal rhythm
  rhythmBtn.innerHTML = 'Show rhythm';
  rhythmBtn.classList.add('btn-rhythm');
  rhythmBtn.setAttribute('aria-hidden', 'true'); // this is strictly a visual element

  rhythmBtn.addEventListener('click', function (e) {
    rhythmBtn.classList.toggle('selected');
    document.body.classList.toggle('horiz-rhythm');
  });
  // add button for showing horizontal rhythm
  document.body.prepend(rhythmBtn);
});
