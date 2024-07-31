import { isValidCoordinates } from './validators';

export default class Timeline {
  constructor() {
    this._allPosts = [];
    this._container = undefined;
    this._content = undefined;
    this._coords = undefined;
    this._element = undefined;
    this._form = undefined;
    this._modal = undefined;
    this._posts = undefined;

    this.onResetModalForm = this.onResetModalForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onSubmitModalForm = this.onSubmitModalForm.bind(this);
  }

  addPost() {
    const input = this._form.querySelector(Timeline.selectorFormInput);

    this._allPosts.push({ text: input.value, coords: this._coords, time: Date.now() });

    input.value = '';
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

    document.body.insertAdjacentHTML('beforeend', Timeline.markupModal);
    this._modal = document.body.querySelector(Timeline.selectorModal);
    const modalForm = this._modal.querySelector('form');

    modalForm.addEventListener('reset', this.onResetModalForm);
    modalForm.addEventListener('submit', this.onSubmitModalForm);

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

  onResetModalForm() {
    this._modal.classList.remove('active');
    this._modal.querySelector(Timeline.selectorModalFormHint).textContent = '';
    this._modal.querySelector(Timeline.selectorModalFormInput).value = '';
  }

  onSubmitForm(event) {
    console.log('onSubmitForm', event);

    event.preventDefault();

    if (this._coords) {
      this.addPost();
      this.redrawDOM();

      return;
    }

    this.getGeolocation(
      (position) => {
        this._coords = position.coords;

        console.log('lat ' + this._coords.latitude);
        console.log('long ' + this._coords.longitude);

        this.addPost();
        this.redrawDOM();
      },
      (positionError) => {
        console.log(positionError);

        this._modal.classList.add('active');
      },
    );
  }

  onSubmitModalForm(event) {
    console.log('onSubmitModalForm', event);

    event.preventDefault();

    const modalFormHint = this._modal.querySelector(Timeline.selectorModalFormHint);
    const modalFormInput = this._modal.querySelector(Timeline.selectorModalFormInput);

    modalFormHint.textContent = '';

    try {
      this._coords = isValidCoordinates(modalFormInput.value);

      this.addPost();

      this._modal.classList.remove('active');
      modalFormInput.value = '';

      this.redrawDOM();
    }
    catch (error) {
      console.error(error);

      modalFormHint.textContent = error.message;
    }
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

  static get markupModal() {
    return `
      <div class="modal-coords">
        <form class="modal-coords__content">
          <div class="modal-coords__header">
            <h2 class="modal-coords__title">Что-то пошло не так</h2>
          </div>
          <div class="modal-coords__body">
            <p class="modal-coords__description">
              К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте
              разрешение на использование геолокации, либо введите координаты вручную.
            </p>
            <div class="modal-coords__form-group">
              <label class="modal-coords__form-label" for="modal-coords-input">
                Широта и долгота через запятую
              </label>
              <input class="modal-coords__form-input" id="modal-coords-input" placeholder="51.50851, -0.12572">
              <div class="modal-coords__form-hint"></div>
            </div>
          </div>
          <div class="modal-coords__footer">
            <button class="modal-coords__btn-reset" type="reset">Отмена</button>
            <button class="modal-coords__btn-submit" type="submit">OK</button>
          </div>
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

  static get selectorModal() { return '.modal-coords'; }

  static get selectorModalFormHint() { return '.modal-coords__form-hint'; }

  static get selectorModalFormInput() { return '.modal-coords__form-input'; }

  static get selectorPosts() { return '.timeline__posts'; }
}
