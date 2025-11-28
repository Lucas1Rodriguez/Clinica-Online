import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, Router } from '@angular/router';
import { ComponenteMenu } from './components/componente-menu/componente-menu';
import { trigger, transition, style, animate, query, group, animateChild } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, ComponenteMenu, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          })
        ], { optional: true }),
        query(':enter', [style({ left: '100%', opacity: 0 })], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        group([
          query(':leave', [animate('300ms ease-out', style({ left: '-100%', opacity: 0 }))], { optional: true }),
          query(':enter', [animate('300ms ease-out', style({ left: '0%', opacity: 1 }))], { optional: true })
        ]),
        query(':enter', animateChild(), { optional: true }),
      ])
    ])
  ]
})
export class App {

  constructor(private router: Router){}

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  EstaEnComponente(ruta: string): boolean {
    return this.router.url === ruta;
  }
}
