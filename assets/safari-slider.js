/**
 * Safari Store — <safari-slider>
 * Carrusel liviano basado en scroll-snap, sin dependencias.
 *
 * Marcado esperado dentro del elemento:
 *   [data-slider-track]   contenedor desplazable (position: relative)
 *   [data-slider-slide]   cada diapositiva
 *   [data-slider-prev]    botón anterior (opcional)
 *   [data-slider-next]    botón siguiente (opcional)
 *   [data-slider-dot]     un botón por diapositiva (opcional)
 *   [data-slider-toggle]  botón pausar/reanudar (opcional; data-label-pause / data-label-play)
 *
 * Atributos del elemento:
 *   data-autoplay="true|false"
 *   data-speed="5"  segundos entre diapositivas
 */
if (!customElements.get('safari-slider')) {
  class SafariSlider extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-slider-track]');
      this.slides = Array.from(this.querySelectorAll('[data-slider-slide]'));
      if (!this.track || this.slides.length < 2) return;

      this.dots = Array.from(this.querySelectorAll('[data-slider-dot]'));
      this.toggleButton = this.querySelector('[data-slider-toggle]');
      this.index = 0;
      this.userPaused = false;
      this.hovering = false;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.speed = Math.max(2, Number(this.dataset.speed) || 5) * 1000;
      this.autoplay = this.dataset.autoplay === 'true';

      this.abortController = new AbortController();
      const options = { signal: this.abortController.signal };

      this.querySelector('[data-slider-prev]')?.addEventListener('click', () => this.goTo(this.index - 1), options);
      this.querySelector('[data-slider-next]')?.addEventListener('click', () => this.goTo(this.index + 1), options);
      this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.goTo(i), options));
      this.toggleButton?.addEventListener('click', () => this.setUserPaused(!this.userPaused), options);

      this.track.addEventListener('keydown', (event) => this.onKeydown(event), options);
      this.addEventListener('mouseenter', () => this.setHovering(true), options);
      this.addEventListener('mouseleave', () => this.setHovering(false), options);
      this.addEventListener('focusin', () => this.setHovering(true), options);
      this.addEventListener('focusout', () => this.setHovering(false), options);
      document.addEventListener('visibilitychange', () => (document.hidden ? this.stop() : this.play()), options);

      // Editor de temas de Shopify: mostrar el bloque seleccionado y detener la rotación.
      this.addEventListener(
        'shopify:block:select',
        (event) => {
          const i = this.slides.indexOf(event.target.closest('[data-slider-slide]'));
          if (i < 0) return;
          this.editorPaused = true;
          this.stop();
          this.goTo(i, true);
        },
        options,
      );
      this.addEventListener(
        'shopify:block:deselect',
        () => {
          this.editorPaused = false;
          this.play();
        },
        options,
      );

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            this.index = this.slides.indexOf(entry.target);
            this.update();
          });
        },
        { root: this.track, threshold: 0.6 },
      );
      this.slides.forEach((slide) => this.observer.observe(slide));

      this.classList.add('is-ready');
      this.update();
      this.play();
    }

    disconnectedCallback() {
      this.stop();
      this.observer?.disconnect();
      this.abortController?.abort();
    }

    goTo(target, instant = false) {
      const count = this.slides.length;
      this.index = ((target % count) + count) % count;
      const slide = this.slides[this.index];
      const left = slide.offsetLeft;
      const behavior = instant || this.reducedMotion.matches ? 'auto' : 'smooth';
      this.track.scrollTo({ left, behavior });
      this.update();
    }

    update() {
      this.slides.forEach((slide, i) => slide.classList.toggle('is-active', i === this.index));
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === this.index);
        if (i === this.index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }

    onKeydown(event) {
      if (event.target !== this.track) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.goTo(this.index + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.goTo(this.index - 1);
      }
    }

    setHovering(value) {
      this.hovering = value;
      if (value) this.stop();
      else this.play();
    }

    setUserPaused(value) {
      this.userPaused = value;
      this.classList.toggle('is-paused', value);
      if (this.toggleButton) {
        const label = value ? this.toggleButton.dataset.labelPlay : this.toggleButton.dataset.labelPause;
        if (label) this.toggleButton.setAttribute('aria-label', label);
      }
      if (value) this.stop();
      else this.play();
    }

    play() {
      this.stop();
      if (!this.autoplay || this.userPaused || this.hovering || this.editorPaused) return;
      if (this.reducedMotion.matches || document.hidden) return;
      this.timer = window.setInterval(() => this.goTo(this.index + 1), this.speed);
    }

    stop() {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  customElements.define('safari-slider', SafariSlider);
}
