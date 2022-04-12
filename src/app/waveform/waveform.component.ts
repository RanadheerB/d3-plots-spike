import { Component, OnInit } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { SpectrumData } from '../shared/spectrum-data';
import * as d3 from 'd3';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss'],
})
export class WaveformComponent implements OnInit {
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  map1 = new Map();
  X: any;
  Y: any;
  cursor_readout: any;
  basic_cursor_A: any;
  basic_cursor_B: any;
  current_cursor: any;
  c_id: number = 0;
  cursor_event_A = new Subject<number>();
  cursor_event_B = new Subject<number>();
  index: any;
  isHarmonic_A: boolean = false;
  isHarmonic_B: boolean = false;
  highest_X = 0;
  highest_Y = 0;

  private line: d3Shape.Line<[number, number]> | undefined;

  constructor() {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.cursor_readout = d3.select('readout');
  }

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawLine();
    this.renderCursor();
  }

  private initSvg() {
    this.X = SpectrumData.map((data) => data.x_value);
    this.Y = SpectrumData.map((data) => data.y_value);

    SpectrumData.forEach((data: any) => {
      this.highest_X = Math.max(this.highest_X, data.x_value);
      this.highest_Y = Math.max(this.highest_Y, data.y_value);
    });

    this.svg = d3Selection
      .select('svg')
      .on('click', (event: any) => this.mouseClick(event))
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }

  private initAxis() {
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(SpectrumData, (d) => d.x_value));
    this.y.domain(d3Array.extent(SpectrumData, (d) => d.y_value));
  }

  private drawAxis() {
    this.svg
      .append('g')
      .attr('class', 'Xaxis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.svg.append('g').attr('class', 'Yaxis').call(d3Axis.axisLeft(this.y));
  }

  private drawLine() {
    this.line = d3Shape
      .line()
      .x((d: any) => this.x(d.x_value))
      .y((d: any) => this.y(d.y_value));

    this.svg
      .append('path')
      .datum(SpectrumData)
      .attr('class', 'line')
      .attr('d', this.line)
      .style('fill', 'none')
      .style('stroke', 'blue')
      .style('stroke-width', '1');
  }

  public mouseClick = (event: any) => {
    console.log(d3.pointer(event)[0] - 49, 'pointer event');

    this.index = d3.bisectCenter(
      this.X,
      this.x.invert(d3.pointer(event)[0] - 49)
    );
    console.log(this.index, 'basic');

    const text = d3.select('.readout');
    const Xaxis = SpectrumData[this.index].x_value;
    const Yaxis = SpectrumData[this.index].y_value;
    text.text(
      `X : ${SpectrumData[this.index].x_value} Y: ${
        SpectrumData[this.index].y_value
      } `
    );

    let x_TickClass = '',
      y_TickClass = '',
      tickColor = '';
    if (this.c_id == 0) {
      tickColor = 'orange';
      this.cursor_event_A.next(Xaxis);
      this.current_cursor = this.basic_cursor_A;
    } else {
      tickColor = 'green';
      this.cursor_event_B.next(Xaxis);
      this.current_cursor = this.basic_cursor_B;
    }
    this.current_cursor
      .attr('x', this.x(SpectrumData[this.index].x_value) - 5)
      .attr('y', this.y(SpectrumData[this.index].y_value) - 5);

    console.log(
      'X:',
      SpectrumData[this.index].x_value,
      'Y:',
      SpectrumData[this.index].y_value
    );

    x_TickClass = 'x-Axis' + this.c_id;
    y_TickClass = 'y-Axis' + this.c_id;

    this.svg.select('.' + x_TickClass).remove();
    this.svg.select('.' + y_TickClass).remove();

    this.svg
      .select('.Xaxis')
      .append('g')
      .attr('class', x_TickClass)
      .call(d3Axis.axisBottom(this.x).tickSize(10).tickValues([Xaxis]))
      .select('line')
      .style('stroke', tickColor)
      .style('stroke-width', '2');

    this.svg.select('.' + x_TickClass + ' text').style('fill', 'none');

    this.svg
      .select('.Yaxis')
      .append('g')
      .attr('class', y_TickClass)
      .call(d3Axis.axisLeft(this.y).tickSize(10).tickValues([Yaxis]))
      .select('line')
      .style('stroke', tickColor)
      .style('stroke-width', '2');

    this.svg.select('.' + y_TickClass + ' text').style('fill', 'none');
  };

  private renderCursor() {
    console.log(this.highest_Y, 'highrst');
    console.log(this.Y);

    let cursorA_index = d3.bisectCenter(this.Y, this.highest_Y);
    let cursorB_index = d3.bisectCenter(this.Y, this.highest_Y);

    console.log(cursorA_index);

    this.basic_cursor_A = this.svg
      .append('g')
      .append('image')
      .attr('xlink:href', '../../assets/starburst.svg')
      .style('width', '10px')
      .style('height', '10px')
      .attr('x', this.x(SpectrumData[16].x_value) - 5)
      .attr('y', this.y(SpectrumData[16].y_value) - 5);

    this.basic_cursor_B = this.svg
      .append('g')
      .append('image')
      .attr('xlink:href', '../../assets/machine.svg')
      .style('width', '10px')
      .style('height', '10px')
      .style('fill', 'red')
      .attr('x', this.x(SpectrumData[cursorB_index].x_value) - 5)
      .attr('y', this.y(SpectrumData[cursorB_index].y_value) - 5);
  }

  public ClickCursorHarmonicA() {
    let harmonic_index = 0;
    this.isHarmonic_A = !this.isHarmonic_A;
    if (!this.isHarmonic_A) {
      this.svg.selectAll('.cursor_A').remove();
    }
    let c = 1;
    let image_link: string = '';
    let harmonic_cursor;
    this.cursor_event_A.subscribe((data) => {
      if (this.isHarmonic_A) {
        this.svg.selectAll('.cursor_A').remove();
        c = 1;
        harmonic_index = 0;
        image_link = '../../assets/starburst.svg';
        while (harmonic_index < 800) {
          harmonic_index = d3.bisectCenter(this.X, c * data);
          harmonic_cursor = this.svg
            .append('image')
            .attr('class', 'cursor_A')
            .attr('xlink:href', image_link)
            .style('width', '10px')
            .style('height', '10px')
            .attr('x', this.x(SpectrumData[harmonic_index].x_value) - 5)
            .attr('y', this.y(SpectrumData[harmonic_index].y_value) - 5);
          console.log(
            'X:',
            SpectrumData[harmonic_index].x_value,
            'Y:',
            SpectrumData[harmonic_index].y_value
          );
          c++;
        }
      }
    });
  }

  public ClickCursorHarmonicB() {
    this.isHarmonic_B = !this.isHarmonic_B;
    if (!this.isHarmonic_B) {
      this.svg.selectAll('.cursor_B').remove();
    }
    this.cursor_event_B.subscribe((data) => {
      const image_link = '../../assets/machine.svg';
      if (this.isHarmonic_B) {
        this.svg.selectAll('.cursor_B').remove();
        let c = 2;
        let harmonic_index = 0;
        console.log(this.X.length);
        while (harmonic_index < 800) {
          harmonic_index = d3.bisectCenter(this.X, c * data);
          let harmonic_cursor = this.svg
            .append('image')
            .attr('class', 'cursor_B')
            .attr('xlink:href', image_link)
            .style('width', '10px')
            .style('height', '10px')
            .attr('x', this.x(SpectrumData[harmonic_index].x_value) - 5)
            .attr('y', this.y(SpectrumData[harmonic_index].y_value) - 5);
          console.log(
            'X:',
            SpectrumData[harmonic_index].x_value,
            'Y:',
            SpectrumData[harmonic_index].y_value
          );
          c++;
        }
      }
    });
  }

  public ToggleCursor() {
    this.c_id = this.c_id ^ 1;
  }
}
