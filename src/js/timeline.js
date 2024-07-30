export default class Timeline {
  constructor() {
    this._allPosts = [];
    this._container = undefined;
    this._content = undefined;
    this._element = undefined;
    this._form = undefined;
    this._posts = undefined;

    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this._container = container;
  }

  checkBinding() {
    if (this._container === undefined) {
      throw new Error('Timeline not bind to DOM');
    }
  }

  drawUI() {
    this.checkBinding();

    this._container.innerHTML = Timeline.markup;
    this._element = this._container.querySelector(Timeline.selector);
    this._content = this._element.querySelector(Timeline.selectorContent);
    this._form = this._element.querySelector(Timeline.selectorForm);
    this._posts = this._content.querySelector(Timeline.selectorPosts);

    this._form.addEventListener('submit', this.onSubmitForm);

    this.redrawDOM();
  }

  getGeolocation(successCallback, errorCallback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        { enableHighAccuracy: true },
      );
    }
    else {
      errorCallback({ code: 999, message: 'User browser does not support Geolocation' });
    }
  }

  onSubmitForm(event) {
    console.log('onSubmitForm', event);

    event.preventDefault();

    const input = this._form.querySelector(Timeline.selectorFormInput);

    this.getGeolocation(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log('lat ' + latitude);
        console.log('long ' + longitude);

        this._allPosts.push({ text: input.value, coords: position.coords, time: Date.now() });

        input.value = '';
        this.redrawDOM();
      },
      (positionError) => {
        console.log(positionError);
      },
    );
  }

  redrawDOM() {
    this._posts.innerHTML = '';

    if (this._allPosts.length) {
      this._posts.style.height = '';
      this._posts.classList.remove('timeline__posts--empty');

      this._allPosts.forEach((post) => {
        this._posts.insertAdjacentHTML('afterbegin', Timeline.markupPost(post));
      });

      this._posts.style.height = this._posts.offsetHeight > this._content.offsetHeight
        ? (this._posts.offsetHeight + 'px')
        : (this._content.offsetHeight + 'px');
    }
    else {
      this._posts.classList.add('timeline__posts--empty');
      this._posts.style.height = this._content.offsetHeight + 'px';
    }
  }

  static get markup() {
    return `
      <div class="timeline">
        <div class="timeline__content">
          <div class="timeline__posts timeline__posts--empty"></div>
        </div>
        <form class="timeline__form timeline-form">
          <input class="timeline-form__input">
          <!--<button class="timeline-form__btn-submit" type="submit">
            <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
            </svg>
          </button>-->
        </form>
      </div>
    `;
  }

  static markupPost(post) {
    const postDate = new Date(post.time);
    const postDateYear = postDate.getFullYear();
    const postDateMonth = String(postDate.getMonth() + 1).padStart(2, '0');
    const postDateDay = String(postDate.getDate()).padStart(2, '0');
    const postDateHour = String(postDate.getHours()).padStart(2, '0');
    const postDateMinute = String(postDate.getMinutes()).padStart(2, '0');
    const postDateSecond = String(postDate.getSeconds()).padStart(2, '0');

    const postDateDatetime = `${postDateYear}-${postDateMonth}-${postDateDay}T${postDateHour}:${postDateMinute}:${postDateSecond}`;
    const postDateValue = `${postDateDay}.${postDateMonth}.${postDateYear} ${postDateHour}:${postDateMinute}`;

    return `
      <div class="timeline__post timeline-post">
        <div class="timeline-post__description">
          <p class="timeline-post__text">${post.text}</p>
          <span class="timeline-post__coordinates">
            [${post.coords.latitude}, ${post.coords.longitude}]
          </span>
        </div>
        <time class="timeline-post__datetime" datetime="${postDateDatetime}">${postDateValue}</time>
      </div>
    `;
  }

  static get selector() { return '.timeline'; }

  static get selectorContent() { return '.timeline__content'; }

  static get selectorForm() { return '.timeline-form'; }

  static get selectorFormInput() { return '.timeline-form__input'; }

  static get selectorPosts() { return '.timeline__posts'; }
}
