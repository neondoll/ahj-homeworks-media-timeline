import Timeline from './timeline';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#app');

  const timeline = new Timeline();
  timeline.bindToDOM(container);
  timeline.drawUI();
});
