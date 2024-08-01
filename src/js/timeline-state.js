export default class TimelineState {
  constructor() { this._data = []; }

  addDataItem(text, coords) { this._data.push({ text, coords, time: Date.now() }); }

  loadData() {
    if (localStorage.getItem('timeline-state')) {
      this._data = JSON.parse(localStorage.getItem('timeline-state'));
    }
  }

  saveData() { localStorage.setItem('timeline-state', JSON.stringify(this._data)); }

  get data() { return this._data; }
}
