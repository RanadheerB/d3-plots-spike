import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  displaySelect = false;
  clickSelect(value: boolean) {
    this.displaySelect = value;
  }
  title = 'line-chart';
}
