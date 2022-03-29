import { Component, OnInit } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { WaveformData } from '../shared/machine-data';

@Component({
  selector: 'app-event-markers',
  templateUrl: './event-markers.component.html',
  styleUrls: ['./event-markers.component.scss'],
})
export class EventMarkersComponent implements OnInit {
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]> | undefined;
  private tooltip: any;
  private setpoints = [
    {
      x_value: 20.469,
      y_value: 0.05,
      t: 'point 1',
    },
    {
      x_value: 40.469,
      y_value: 0.05,
      t: 'point 2',
    },
    {
      x_value: 240.469,
      y_value: 0.05,
      t: 'point 3',
    },
    {
      x_value: 440.469,
      y_value: 0.05,
      t: 'point 4',
    },
  ];
  private setpointsDashed = [
    {
      x_value: 0,
      y_value: 0.05,
      color: 'black',
      direction: 'up',
    },
    {
      x_value: 0,
      y_value: 60,
      color: 'red',
      direction: 'up',
    },
    {
      x_value: 40,
      y_value: 60,
      color: 'blue',
      direction: 'down',
    },
    {
      x_value: 0,
      y_value: 90,
      color: 'green',
      direction: 'down',
    },
    {
      x_value: 0,
      y_value: 210,
      color: 'orange',
      direction: 'up',
    },
  ];
  private markers = [
    {
      x_value: 120.469,
      y_value: 0.05,
      img: '../../assets/arrow.svg',
      tooltip_text: 'arrow',
    },
    {
      x_value: 180.469,
      y_value: 0.05,
      img: '../../assets/access-point.svg',
      tooltip_text: 'access point',
    },
    {
      x_value: 269.469,
      y_value: 0.05,
      img: '../../assets/access-point-check.svg',
      tooltip_text: 'access point check',
    },
    {
      x_value: 320.469,
      y_value: 0.05,
      img: '../../assets/access-point-off.svg',
      tooltip_text: 'access point off',
    },
  ];
  constructor() {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawLine();
  }

  private initSvg() {
    this.svg = d3Selection
      .select('svg')
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }

  private initAxis() {
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(WaveformData, (d) => d.x_value));
    this.y.domain(d3Array.extent(WaveformData, (d) => d.y_value));
  }

  private drawAxis() {
    this.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Price ($)');
    this.tooltip = d3Selection
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  }

  private drawLine() {
    this.line = d3
      .line()
      .x((d: any) => this.x(d.x_value))
      .y((d: any) => this.y(d.y_value));
    //draw waveform
    this.svg
      .append('path')
      .datum(WaveformData)
      .attr('class', 'line')
      .attr('d', this.line)
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '1');
    //draw vertical lines
    this.svg
      .selectAll('.line')
      .data(this.setpoints)
      .enter()
      .append('line')
      .attr('x1', (d: any) => {
        return d.x_value + 20;
      })
      .attr('y1', (d: any) => {
        return d.y_value;
      })
      .attr('x2', (d: any) => {
        return d.x_value + 20;
      })
      .attr('y2', this.height)
      .style('stroke-width', 2)
      .style('stroke', 'blue')
      .style('fill', 'blue');
    //draw dashed horizontal lines
    this.svg
      .selectAll('.line')
      .data(this.setpointsDashed)
      .enter()
      .append('line')
      .attr('x1', (d: any) => {
        return d.x_value;
      })
      .attr('y1', (d: any) => {
        console.log('t--', d);
        return d.y_value;
      })
      .attr('x2', (d: any) => {
        return this.width;
      })
      .attr('y2', (d: any) => {
        return d.y_value;
      })
      .style('stroke-width', 2)
      .style('stroke', (d: any) => {
        return d.color;
      })
      .style('stroke-dasharray', '3, 3');
    //draw dashed horizontal lines with starting triangles
    this.svg
      .selectAll('.line')
      .data(this.setpointsDashed)
      .enter()
      .append('path')
      .attr('d', d3.symbol().type(d3Shape.symbolTriangle))
      .attr('transform', (d: any) => {
        console.log('test', d);
        if (d.direction == 'up')
          return 'translate(' + (d.x_value + 5) + ',' + (d.y_value - 2.5) + ')';
        return (
          'translate(' +
          (d.x_value + 5) +
          ',' +
          (d.y_value + 2.5) +
          ') rotate(180)'
        );
      })
      .attr('width', 10)
      .attr('height', 10)
      .on('mouseover', (d: any) => {
        // return this.tooltip.style('visibility', 'visible');
        this.tooltip.transition().duration(200).style('opacity', 0.9);
        this.tooltip
          // .html(d.target.__data__.x_value + '<br/>' + d.target.__data__.y_value)
          .html('<html><body><h6>hello..</h6></body></html>')
          .style('left', d.pageX + 'px')
          .style('top', d.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        this.tooltip.transition().duration(500).style('opacity', 0);
        // return this.tooltip.style('visibility', 'hidden');
      })
      .on('click', this.click.bind(this))
      .style('fill', (d: any) => {
        return d.color;
      })
      .style('cursor', 'pointer');

    //draw dashed horizontal lines with ending triangles

    this.svg
      .selectAll('.line')
      .data(this.setpointsDashed)
      .enter()
      .append('path')
      .attr('d', d3.symbol().type(d3Shape.symbolTriangle))
      .attr('transform', (d: any) => {
        console.log('test', d);
        if (d.direction == 'up')
          return (
            'translate(' + (this.width - 3) + ',' + (d.y_value - 2.5) + ')'
          );
        return (
          'translate(' +
          (this.width - 3) +
          ',' +
          (d.y_value + 2.5) +
          ') rotate(180)'
        );
      })
      .attr('width', 10)
      .attr('height', 10)
      .on('mouseover', (d: any) => {
        this.tooltip.transition().duration(200).style('opacity', 0.9);
        this.tooltip
          .html('<html><body><h6>hello..</h6></body></html>')
          // .html('./test.html',(d:any)=>{
          //   console.log('html',d)
          // })
          .style('left', d.pageX + 'px')
          .style('top', d.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        this.tooltip.transition().duration(500).style('opacity', 0);
      })
      .on('click', this.click.bind(this))
      .style('fill', (d: any) => {
        return d.color;
      })
      .style('cursor', 'pointer');
    //draw markers
    this.svg
      .selectAll('.line')
      .data(this.markers)
      .enter()
      .append('image')
      .attr('x', (d: any) => {
        return d.x_value;
      })
      .attr('y', (d: any) => {
        return d.y_value;
      })
      .attr('width', 20)
      .attr('height', 24)
      .attr('xlink:href', (d: any) => {
        return d.img;
      })
      .on('mouseover', (d: any) => {
        this.tooltip.transition().duration(200).style('opacity', 0.9);
        this.tooltip
          .html(
            '<h5 style="margin: 0px;">' +
              d.target.__data__.tooltip_text +
              '</h5>'
          )
          .style('left', d.pageX + 'px')
          .style('top', d.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        this.tooltip.transition().duration(500).style('opacity', 0);
      })
      .on('click', this.click.bind(this))
      .on('dblclick', (d: any) => {
        alert('Double clicked');
      })
      .on('contextmenu', (d: any) => {
        d.preventDefault(); //stops rendering default browser options on right click
        this.tooltip.transition().duration(200).style('opacity', 0.9);
        this.tooltip
          .html('<div class="dropdown"> <button>Test</button></div>')
          .style('left', d.pageX + 'px')
          .style('top', d.pageY - 28 + 'px');
      })
      .style('cursor', 'pointer');
  }
  private click() {
    console.log('clicked');
  }
}
