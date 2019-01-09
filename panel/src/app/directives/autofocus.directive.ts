import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {
  private focus: boolean = true;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.focus) {
      requestAnimationFrame(() => {
        this.el.nativeElement.focus();
      });
    }
  }

  @Input() set autofocus(condition: boolean){
    this.focus = condition !== false;
  }
}
