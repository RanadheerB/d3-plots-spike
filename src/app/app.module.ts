import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { WaveformComponent } from './waveform/waveform.component';
import { EventMarkersComponent } from './event-markers/event-markers.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { SelectComponent } from './select/select.component'

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    WaveformComponent,
    EventMarkersComponent,
    SelectComponent
  ],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
