import { Component, OnInit } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { WaveformData } from "../shared/machine-data"
import * as d3 from 'd3';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss']
})
export class WaveformComponent implements OnInit {
 private margin = { top: 20, right: 20, bottom: 30, left: 50 };
 private width: number;
 private height: number;
 private x: any;
 private y: any;
 private svg: any;
 map1 = new Map;
 X : any;
 cursor_readout:any;
 basic_cursor_A: any;
 basic_cursor_B: any;
 current_cursor: any;
 c_id:number = 0;
cursor_point = new BehaviorSubject<number>(0);
 index:any;
 isHarmonic: boolean = false;
 private line: d3Shape.Line<[number, number]> | undefined;

 constructor() {
  this.width = 900 - this.margin.left - this.margin.right;
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.cursor_readout = d3.select('readout')
 }

 ngOnInit() {
  this.initSvg();
  this.initAxis();
  this.drawAxis();
  this.drawLine();
  this.renderCursor();
 }

 private initSvg() {
  this.svg = d3Selection
   .select('svg')
   .on("click", (event:any)=>this.mouseClick(event))
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
 }

 private drawLine() {
  this.line = d3Shape
   .line()
   .x((d: any) => this.x(d.x_value))
   .y((d: any) => this.y(d.y_value));

  this.svg
    .append('path')
    .datum(WaveformData)
    .attr('class', 'line')
    .attr("d", this.line)
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .style("stroke-width", "1");
 }

 public mouseClick = (event:any) => {

  let i=0;
   this.X=WaveformData.map((data)=>data.x_value)

   WaveformData.forEach(data=>{
     this.map1.set(data.x_value,i++)
   })
  //  this.cursor_point.next(d3.pointer(event)[0]-49);
   console.log(d3.pointer(event)[0]-49,"pointer event");

    this.index = d3.bisectCenter(this.X, this.x.invert(d3.pointer(event)[0]-49));
    console.log(this.index,"basic");

    const text = d3.select('.readout');
    const Xaxis = WaveformData[this.index].x_value;
    const Yaxis = WaveformData[this.index].y_value;
    text.text(`X : ${WaveformData[this.index].x_value} Y: ${WaveformData[this.index].y_value} `);

    if(this.c_id == 0)
    this.current_cursor = this.basic_cursor_A;
    else
    this.current_cursor = this.basic_cursor_B;

    this.current_cursor.attr("x",this.x(WaveformData[this.index].x_value)-5)
    .attr("y", this.y(WaveformData[this.index].y_value)-5)
    console.log("X:",WaveformData[this.index].x_value, "Y:", WaveformData[this.index].y_value);
   this.cursor_point.next(Xaxis);
  };

  private renderCursor(){
    this.basic_cursor_A = this.svg.append('g')
    .selectAll(".cursor")
    .data([1])
    .enter()
    .append("image")
    .attr("xlink:href",'../../assets/starburst.svg')
    .style("width","10px")
    .style("height","10px")
    .attr('x',this.x(WaveformData[80].x_value)-5)
    .attr('y',this.y(WaveformData[80].y_value)-5)

     this.basic_cursor_B = this.svg.append('g')
    .append("image")
    .attr("xlink:href",'../../assets/machine.svg')
    .style("width","10px")
    .style("height","10px")
    .style("fill","red")
    .attr('x',this.x(WaveformData[160].x_value)-5)
    .attr('y',this.y(WaveformData[160].y_value)-5)

  }

 public ToggleEnable(){
    let harmonic_index = 0;
    // let index_1:any,index_2:any;
    this.isHarmonic = !this.isHarmonic;
     let c = 1;let image_link: string='';
     let harmonic_cursor;
      this.cursor_point.subscribe(value=>{
         if(this.isHarmonic){
        this.svg.
        selectAll("basic")
        .remove()
        c=1;
        harmonic_index = 0;
        if(this.c_id==0){
           image_link ='../../assets/starburst.svg';
        }
        else{
          image_link = '../../assets/machine.svg';
        }
        console.log(this.X.length);

    while(harmonic_index<2000){
     harmonic_index = d3.bisectCenter(this.X, value*c);
     harmonic_cursor = this.svg.append('g')
    .append("image")
    .attr('class', 'basic')
    .attr("xlink:href",image_link)
    .style("width","10px")
    .style("height","10px")
    .attr('x',(this.x(WaveformData[harmonic_index].x_value)-5))
    .attr('y',(this.y(WaveformData[harmonic_index].y_value)-5))
    console.log("X:",WaveformData[harmonic_index].x_value, "Y:", WaveformData[harmonic_index].y_value);
    c++;
    }
  }
      })
  }

  public ToggleCursor(){
     this.c_id = this.c_id^1;
  }
}
