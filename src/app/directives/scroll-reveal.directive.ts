import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

@Directive({ selector: '[appScrollReveal]', standalone: true })
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const el = this.el.nativeElement;
    el.classList.add('reveal');

    if (typeof window === 'undefined') { el.classList.add('revealed'); return; }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('revealed');
      return;
    }

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('revealed');
        this.observer?.unobserve(el);
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    this.observer.observe(el);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
