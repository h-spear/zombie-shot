export default class PopUp {
    constructor() {
        this.popUp = document.querySelector('.pop-up');
        this.popUpText = document.querySelector('.pop-up__message');
        this.popUpIcon = document.querySelector('.pop-up__icon');
        this.popUpRedo = document.querySelector('.pop-up__redo-btn');
        this.popUpHome = document.querySelector('.pop-up__home-btn');
        this.popUpWrite = document.querySelector('.pop-up__write-btn');
        this.popUpWriteBox = document.querySelector('.pop-up__write');
        this.popUpWriteForm = document.querySelector('.pop-up__write-form');
        this.popUpFormName = document.querySelector('.form-name');
        this.popUpFormComment = document.querySelector('.form-comment');
        this.popUpFormSubmit = document.querySelector('.pop-up__write-submit');
        this.popUpRedo.addEventListener('click', () => {
            this.onClick && this.onClick();
            this.hide();
        });
        this.popUpHome.addEventListener('click', () => {
            this.hide();
            this.onHomeClick && this.onHomeClick();
        });
        this.popUpWrite.addEventListener('click', () => {
            this.onWriteClick && this.onWriteClick();
        });
        this.popUpFormSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            this.onSubmit && this.onSubmit(e);
        });
    }

    setClickListener(onClick) {
        this.onClick = onClick;
    }

    setHomeClickListener(onClick) {
        this.onHomeClick = onClick;
    }

    setWriteClickListener(onClick) {
        this.onWriteClick = onClick;
    }

    setSubmitListener(onSubmit) {
        this.onSubmit = onSubmit;
    }

    hide() {
        this.popUp.classList.add('invisible');
    }

    showWithText(text) {
        this.popUpText.innerHTML = text;
        this.popUp.classList.remove('invisible');
    }

    changeNextButton() {
        this.popUpIcon.classList.add('fa-arrow-right');
        this.popUpIcon.classList.remove('fa-redo');
    }

    changeRedoButton() {
        this.popUpIcon.classList.remove('fa-arrow-right');
        this.popUpIcon.classList.add('fa-redo');
    }

    hideHomeButton() {
        this.popUpHome.style.display = 'none';
    }

    showHomeButton() {
        this.popUpHome.style.display = 'inline';
    }

    hideWriteForm() {
        this.popUp.classList.remove('pop-up-wide');
        this.popUpWriteBox.classList.add('invisible');
        this.popUpFormName.value = '';
        this.popUpFormComment.value = '';
    }

    toggleWriteForm() {
        if (this.popUp.classList.contains('pop-up-wide')) {
            this.hideWriteForm();
        } else {
            this.popUp.classList.add('pop-up-wide');
            this.popUpWriteBox.classList.remove('invisible');
        }
    }

    hideWriteButton() {
        this.popUpWrite.style.display = 'none';
    }

    showWriteButton() {
        this.popUpWrite.style.display = 'inline';
    }

    getFormData() {
        return {
            name: this.popUpFormName.value,
            comment: this.popUpFormComment.value,
        };
    }
}
