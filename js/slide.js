export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = {
            finalPosition: 0,
            startX: 0,
            movement: 0
        }
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.6;
        const startPosition = this.dist.finalPosition - this.dist.movement;
        return startPosition;
    }

    onStart(event){
        // esta variavel vai guardar o tipo do movimento, se é com o mouse ou com o touch
        let moveType;

        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.startX = event.clientX;
            moveType = 'mousemove'

        } else {
            // no evento de toque o clientX esta dentro de cada item da propriedade de changedTouches, que grava informações de multiplos toques. O item [0] dessa lista seria o primeiro toque mesmo
            this.dist.startX = event.changedTouches[0].clientX;
            moveType = 'touchmove'
            
        }
        this.wrapper.addEventListener(moveType, this.onMove);
    }

    onMove(event){
        // estipula a posição do pointer considerando o tipo do evento (se é de mouse ou touch)
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;

        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onFinish(event){
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';

        this.wrapper.removeEventListener(moveType, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
    }

    addSlideEvents(){
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onFinish);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('touchend', this.onFinish);
    }

    bindEvents(){
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onFinish = this.onFinish.bind(this);
    }

    slidePosition(slide){
        const margin  = (this.wrapper.offsetWidth - slide.offsetWidth) / 2
        console.log(margin);

        return -(slide.offsetLeft - margin);
    }

    slideConfig(){
        this.slideArray = [...this.slide.children].map(element => {
            const position = this.slidePosition(element);

            return {
                position: position,
                element: element,
            }
        })
    }

    slideIndexNav(index){
        const last = this.slideArray.length -1;

        this.index = {
            prev: index ? index -1 : undefined,
            active: index,
            next: index === last ? undefined : index +1,
        }
    }

    changeSlide(index){
        const activeSlide = this.slideArray[index];

        this.moveSlide(activeSlide.position);
        this.slideIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    init(){
        this.bindEvents();
        this.addSlideEvents();
        this.slideConfig();
        return this;
    }
}
