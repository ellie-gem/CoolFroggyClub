var slideIndex = 1;
var timeoutID;

const slideshowVue = Vue.createApp({
    data() {
        return {
            slides: [
                { image: 'images/img1.jpg', alt: 'Cool Froggy Royal Club', text: 'Cool Froggy Royal Club' },
                { image: 'images/img2.jpg', alt: 'Cool Froggy Party Club', text: 'Cool Froggy Party Club' },
                { image: 'images/img3.jpg', alt: 'Cool Froggy Comedy Club', text: 'Cool Froggy Comedy Club' }
            ]
        };
    },
    mounted() {
        this.showSlides(slideIndex);
    },
    methods: {
        showSlides(n) {
            let i;
            let slides = document.getElementsByClassName("mySlides");
            let dots = document.getElementsByClassName("dot");

            if (n > slides.length) {
                slideIndex = 1;
            }

            if (n < 1) {
                slideIndex = slides.length;
            }

            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }

            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }

            slides[slideIndex - 1].style.display = "block";
            dots[slideIndex - 1].className += " active";

            // this helps to reset the setTimeout that's called with every showSlides called
            clearTimeout(timeoutID);

            timeoutID = setTimeout( () => {
                this.showSlides(slideIndex += 1);
            }, 5000);
        },
        plusSlides(n) {
            this.showSlides(slideIndex += n);
        },
        currentSlide(n) {
            this.showSlides(slideIndex = n);
        }
    }

});

slideshowVue.mount('#show-slides');
