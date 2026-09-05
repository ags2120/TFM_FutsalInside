import { Directive, ElementRef, input, output, effect, OnInit } from '@angular/core';

@Directive({
  selector: '[appLazyImage]',
})
export class LazyImageDirective implements OnInit {
  src = input.required<string>({ alias: 'appLazyImage' });
  loaded = output<void>();

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit() {
    const img = this.el.nativeElement;
    img.classList.add('lazy-image');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = this.src();
          img.onload = () => {
            img.classList.add('loaded');
            this.loaded.emit();
          };
          observer.disconnect();
        }
      });
    });

    observer.observe(img);
  }
}
