import CreateEvent from '../utils/createEvents';

export default class CarouselController {
    constructor(config) {
        this.eventService = new CreateEvent();
        this.imageDelete = new Event('imageDelete');
        this.carousel = config.carousel;
        this.control = config.control;
        this.dots = config.dots;

        this.imagesCount = 0;
        this.carouseContainer = this.carousel.querySelector('.carousel-container');
        this.slideIndex = 1;

        if (this.control && !this.carousel.querySelector('.next')) this.createControl();
        if (this.dots && !this.carousel.querySelector('.dots')) this.createDots();
        else this.updateDots();

        this.showSlides(this.slideIndex);

        this.carousel.querySelectorAll('.close-slide').forEach((close) => {
            close.on('click', (e) => {
                this.deleteImages(e.target.dataset.images);
            });
        });
    }
    showSlides(n) {
        const slides = this.carousel.querySelectorAll('.slides');
        const dots = this.carousel.querySelectorAll('.dot');
        if (n > slides.length) this.slideIndex = 1;
        if (n < 1) this.slideIndex = slides.length;

        for (let i = 0; i < slides.length; i++) {
            slides[i].hide();
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(' active', '');
        }
        if (slides.length >= 1) slides[this.slideIndex - 1].show();
        if (dots.length >= 1) dots[this.slideIndex - 1].className += ' active';
    }

    createControl() {
        this.next = document.createElement('a');
        this.prev = document.createElement('a');

        this.next.addClass('next');
        this.prev.addClass('prev');

        this.prev.innerHTML = '&#10095;';
        this.next.innerHTML = '&#10094;';

        this.carouseContainer.appendChild(this.next);
        this.carouseContainer.appendChild(this.prev);

        // ordem foi alterada next recebe menos (-) e prev recebe mais (+)
        this.next.on('click', (e) => {
            this.showSlides((this.slideIndex -= 1));
        });
        this.prev.on('click', (e) => {
            this.showSlides((this.slideIndex += 1));
        });
    }

    createDots() {
        const dots = document.createElement('div');
        dots.addClass('dots');

        for (
            let i = 0;
            i < document.querySelector('#container-document-preview').children.length;
            i++
        ) {
            let dot = document.createElement('div').addClass('dot');
            dots.appendChild(dot);
        }
        this.carouseContainer.appendChild(dots);
    }

    updateDots() {
        const dots = document.querySelector('.dots');
        while (dots.firstChild) {
            dots.removeChild(dots.firstChild);
        }
        dots.addClass('dots');

        for (
            let i = 0;
            i < document.querySelector('#container-document-preview').children.length;
            i++
        ) {
            let dot = document.createElement('div').addClass('dot');
            dots.appendChild(dot);
        }
        this.carouseContainer.appendChild(dots);
    }
    deleteImages(id) {
        this.carousel.querySelectorAll('.slides').forEach((value, index) => {
            value.querySelectorAll('.close-slide i').forEach((slide) => {
                if (slide.dataset.images == id) {
                    if (value.childElementCount > 0) {
                        value.remove();
                        this.showSlides((this.slideIndex += 1));
                        this.carousel
                            .querySelector('#container-document-preview')
                            .dispatchEvent(this.imageDelete);
                    }
                }
            });
        });
        document.querySelectorAll('#preview-image-slide span').forEach((span) => {
            if (span.dataset.images == id) {
                span.remove();
            }
        });

        this.carousel.querySelectorAll('.dot').forEach((dot) => {
            if (dot.hasClass('active')) dot.remove();
        });
    }
}
