import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[noEnRuta]'
})
export class NoEnRutaDirective implements OnDestroy {
  private rutas: string[] = [];
  private sub!: Subscription;

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private router: Router) {
    this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateView();
      }
    });
  }

  @Input()
  set noEnRuta(rutas: string[]) {
    this.rutas = rutas;
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();

    const currentUrl = this.router.url.split('?')[0]; // ignora query params
    const currentPath = currentUrl.endsWith('/') ? currentUrl.slice(0, -1) : currentUrl;

    const ocultar = this.rutas.some(ruta => {
      const rutaNormalizada = ruta.endsWith('/') ? ruta.slice(0, -1) : ruta;
      return rutaNormalizada === currentPath;
    });

    if (!ocultar) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}