import { Directive, ElementRef, Input, OnChanges, Sanitizer, SecurityContext, SimpleChanges } from "@angular/core";

@Directive({
    selector: '[safeMarkup]'
})
export class SafeMarkupDirective implements OnChanges {
  @Input() safeMarkup: string;

  constructor(private elementRef: ElementRef, private sanitizer: Sanitizer) { }

  ngOnChanges(changes: SimpleChanges): any {
      if ('safeMarkup' in changes) {
          this.elementRef.nativeElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.safeMarkup);
      }
  }
}
