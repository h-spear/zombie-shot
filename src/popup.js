'use strict'

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector('.pop-up');
    this.popUpText = document.querySelector('.pop-up__message');
    this.popUpRefresh = document.querySelector('.pop-up__btn');
    this.popUpIcon = document.querySelector('.pop-up__icon');
    this.popUpHome = document.querySelector('.pop-up__home-btn');
    this.popUpRefresh.addEventListener('click', () => {
      this.onClick && this.onClick();
      this.hide();
    });
    this.popUpHome.addEventListener('click', () => {
      this.hide();
      this.onHomeClick && this.onHomeClick();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  setHomeClickListener(onClick) {
    this.onHomeClick = onClick;
  }

  hide() {
    this.popUp.classList.add('pop-up--hide');
  }

  showWithText(text) {
    this.popUpText.innerHTML = text;
    this.popUp.classList.remove('pop-up--hide');
  }

  changeNextButton() {
    this.popUpIcon.classList.add('fa-arrow-right');
    this.popUpIcon.classList.remove('fa-redo');
  }
  
  changeRedoButton() {
    this.popUpIcon.classList.remove('fa-arrow-right');
    this.popUpIcon.classList.add('fa-redo');
  }

  hideHomeButton(){
    this.popUpHome.style.display = 'none';
  }

  showHomeButton(){
    this.popUpHome.style.display = 'inline';
  }
}