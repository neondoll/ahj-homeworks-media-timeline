(()=>{"use strict";class t{constructor(){this._data=[]}addDataItem(t,e){this._data.push({text:t,coords:e,time:Date.now()})}loadData(){localStorage.getItem("timeline-state")&&(this._data=JSON.parse(localStorage.getItem("timeline-state")))}saveData(){localStorage.setItem("timeline-state",JSON.stringify(this._data))}get data(){return this._data}}class e{constructor(){this._container=void 0,this._content=void 0,this._coords=void 0,this._element=void 0,this._form=void 0,this._modal=void 0,this._posts=void 0,this._state=new t,this.onResetModalForm=this.onResetModalForm.bind(this),this.onSubmitForm=this.onSubmitForm.bind(this),this.onSubmitModalForm=this.onSubmitModalForm.bind(this)}addPost(){const t=this._form.querySelector(e.selectorFormInput);this._state.addDataItem(t.value,this._coords),t.value=""}bindToDOM(t){if(!(t instanceof HTMLElement))throw new Error("container is not HTMLElement");this._container=t}checkBinding(){if(void 0===this._container)throw new Error("Timeline not bind to DOM")}drawUI(){this.checkBinding(),document.body.insertAdjacentHTML("beforeend",e.markupModal),this._modal=document.body.querySelector(e.selectorModal);const t=this._modal.querySelector("form");t.addEventListener("reset",this.onResetModalForm),t.addEventListener("submit",this.onSubmitModalForm),this._container.innerHTML=e.markup,this._element=this._container.querySelector(e.selector),this._content=this._element.querySelector(e.selectorContent),this._form=this._element.querySelector(e.selectorForm),this._posts=this._content.querySelector(e.selectorPosts),this._form.addEventListener("submit",this.onSubmitForm),this._state.loadData(),this.redrawDOM()}getGeolocation(t,e){navigator.geolocation?navigator.geolocation.getCurrentPosition(t,e,{enableHighAccuracy:!0}):e({code:999,message:"User browser does not support Geolocation"})}onResetModalForm(){this._modal.classList.remove("active"),this._modal.querySelector(e.selectorModalFormHint).textContent="",this._modal.querySelector(e.selectorModalFormInput).value=""}onSubmitForm(t){if(console.log("onSubmitForm",t),t.preventDefault(),this._coords)return this.addPost(),this.redrawDOM(),void this._state.saveData();this.getGeolocation((t=>{this._coords=t.coords,console.log("lat "+this._coords.latitude),console.log("long "+this._coords.longitude),this.addPost(),this.redrawDOM(),this._state.saveData()}),(t=>{console.log(t),this._modal.classList.add("active")}))}onSubmitModalForm(t){console.log("onSubmitModalForm",t),t.preventDefault();const o=this._modal.querySelector(e.selectorModalFormHint),s=this._modal.querySelector(e.selectorModalFormInput);o.textContent="";try{this._coords=function(t){const e=/^\[?(-?\d+(?:\.\d+)?),\s?(-?\d+(?:\.\d+)?)\]?$/,o=t.match(e);if(console.log(t,e,o),null===o)throw new Error("Некорректный формат координат");return{latitude:Number(o[1]),longitude:Number(o[2])}}(s.value),this.addPost(),this._modal.classList.remove("active"),s.value="",this.redrawDOM(),this._state.saveData()}catch(t){console.error(t),o.textContent=t.message}}redrawDOM(){this._posts.innerHTML="",this._state.data.length?(this._posts.style.height="",this._posts.classList.remove("timeline__posts--empty"),this._state.data.forEach((t=>{this._posts.insertAdjacentHTML("afterbegin",e.markupPost(t))})),this._posts.style.height=this._posts.offsetHeight>this._content.offsetHeight?this._posts.offsetHeight+"px":this._content.offsetHeight+"px"):(this._posts.classList.add("timeline__posts--empty"),this._posts.style.height=this._content.offsetHeight+"px")}static get markup(){return'\n      <div class="timeline">\n        <div class="timeline__content">\n          <div class="timeline__posts timeline__posts--empty"></div>\n        </div>\n        <form class="timeline__form timeline-form">\n          <input class="timeline-form__input">\n          \x3c!--<button class="timeline-form__btn-submit" type="submit">\n            <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">\n              <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />\n            </svg>\n          </button>--\x3e\n        </form>\n      </div>\n    '}static get markupModal(){return'\n      <div class="modal-coords">\n        <form class="modal-coords__content">\n          <div class="modal-coords__header">\n            <h2 class="modal-coords__title">Что-то пошло не так</h2>\n          </div>\n          <div class="modal-coords__body">\n            <p class="modal-coords__description">\n              К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте\n              разрешение на использование геолокации, либо введите координаты вручную.\n            </p>\n            <div class="modal-coords__form-group">\n              <label class="modal-coords__form-label" for="modal-coords-input">\n                Широта и долгота через запятую\n              </label>\n              <input class="modal-coords__form-input" id="modal-coords-input" placeholder="51.50851, -0.12572">\n              <div class="modal-coords__form-hint"></div>\n            </div>\n          </div>\n          <div class="modal-coords__footer">\n            <button class="modal-coords__btn-reset" type="reset">Отмена</button>\n            <button class="modal-coords__btn-submit" type="submit">OK</button>\n          </div>\n        </form>\n      </div>\n    '}static markupPost(t){const e=new Date(t.time),o=e.getFullYear(),s=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0"),n=String(e.getHours()).padStart(2,"0"),r=String(e.getMinutes()).padStart(2,"0"),a=`${o}-${s}-${i}T${n}:${r}:${String(e.getSeconds()).padStart(2,"0")}`,l=`${i}.${s}.${o} ${n}:${r}`;return`\n      <div class="timeline__post timeline-post">\n        <div class="timeline-post__description">\n          <p class="timeline-post__text">${t.text}</p>\n          <span class="timeline-post__coordinates">\n            [${t.coords.latitude}, ${t.coords.longitude}]\n          </span>\n        </div>\n        <time class="timeline-post__datetime" datetime="${a}">${l}</time>\n      </div>\n    `}static get selector(){return".timeline"}static get selectorContent(){return".timeline__content"}static get selectorForm(){return".timeline-form"}static get selectorFormInput(){return".timeline-form__input"}static get selectorModal(){return".modal-coords"}static get selectorModalFormHint(){return".modal-coords__form-hint"}static get selectorModalFormInput(){return".modal-coords__form-input"}static get selectorPosts(){return".timeline__posts"}}document.addEventListener("DOMContentLoaded",(()=>{const t=document.querySelector("#app"),o=new e;o.bindToDOM(t),o.drawUI()}))})();