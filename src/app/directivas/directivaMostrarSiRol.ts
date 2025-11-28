import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[mostrarSiRol]'
})
export class MostrarSiRolDirective {
  private roles: string[] = [];
  private rolActual: string = '';

  @Input()
  set mostrarSiRol(data: { roles: string[], rolActual: string }) {
    this.roles = data.roles;
    this.rolActual = data.rolActual;
    this.updateView();
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  private updateView() {
    this.viewContainer.clear();
    if (this.roles.includes(this.rolActual)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}