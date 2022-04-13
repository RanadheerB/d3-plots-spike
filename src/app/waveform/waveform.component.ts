import { Component, OnInit } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { SpectrumData } from "../shared/spectrum-data"
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
Y: any;
 cursor_readout:any;
 basic_cursor_A: any;
 basic_cursor_B: any;
 current_cursor: any;
 active_cursor:number = 0;
cursor_event_A = new BehaviorSubject<number>(0);
cursor_event_B = new BehaviorSubject<number>(0);
 index:any;
 isHarmonic_A: boolean = false;
 isHarmonic_B: boolean = false;
 highest_X:any;
 highest_Y:any;
 image_A: any;
 image_B:any;
 index_A : number = 16;
 index_B : number = 16;
 x_TickClass: string='';
 y_TickClass: string='';
 tickColor: string='';
 cursor_A_Click: number = 0;
 cursor_B_Click: number = 0;

 private line: d3Shape.Line<[number, number]> | undefined;

 constructor() {
  this.width = 800 - this.margin.left - this.margin.right;
  this.height = 400 - this.margin.top - this.margin.bottom;
  this.cursor_readout = d3.select('readout')
 }

 ngOnInit() {
  this.initSvg();
  this.initAxis();
  this.drawAxis();
  this.drawLine();
  this.renderCursor();

  d3.select('body')
  .on('keydown', (event:any)=>this.keydown(event))
  // .on('keyup', (event:any)=>this.keyup(event));
 }

 keydown(event:any){
   const key:number = event.keyCode
   console.log(key);
     if(key==67){
      this.cursor_B_Click=0;
       if(this.cursor_A_Click==0){
         this.isHarmonic_A = false;
         this.disableHarmonic_A();
         this.active_cursor = 0;
       }
       else if(this.cursor_A_Click==1){
         this.isHarmonic_A = true;
         this.ClickCursorHarmonicA();
       }
       this.cursor_A_Click++;
       if(this.cursor_A_Click>1) this.cursor_A_Click=0;
     }
     else if(key==86){
       this.cursor_A_Click=0
       console.log(this.cursor_B_Click);
         if(this.cursor_B_Click==0){
         this.isHarmonic_B = false;
         this.disableHarmonic_B();
         this.active_cursor = 1;
       }
       else if(this.cursor_B_Click==1){
         this.isHarmonic_B = true;
         this.ClickCursorHarmonicB();
       }
       this.cursor_B_Click++;
       if(this.cursor_B_Click>1) this.cursor_B_Click=0;
     }
    if(key==37){
      this.moveCursor("left");
    }
    else if(key==39){
      this.moveCursor("right");
    }
 }

 moveCursor(movement:string){

    let curr_index:number = 0;
    this.changeCurrentCursor();
    this.svg.select("."+this.x_TickClass).remove();
    this.svg.select("."+this.y_TickClass).remove();

   if(movement=="left"){
    if(this.active_cursor==0){
     this.index_A -=1;
     curr_index = this.index_A;
    }
    else{
          this.index_B -= 1;
          curr_index = this.index_B;
    }
   }
   else{
      if(this.active_cursor==0){
     this.index_A +=1;
     curr_index = this.index_A;
    }
    else{
          this.index_B += 1;
          curr_index = this.index_B;
    }
   }
     console.log(curr_index);
      this.current_cursor.attr("x",this.x(SpectrumData[curr_index].x_value)-5)
    .attr("y", this.y(SpectrumData[curr_index].y_value)-5)

     if(this.active_cursor==0)
      this.cursor_event_A.next(SpectrumData[curr_index].x_value);
      else
      this.cursor_event_B.next(SpectrumData[curr_index].x_value);

    this.svg
    .select(".Xaxis")
    .append("g")
    .attr('class', this.x_TickClass)
   .call(d3Axis.axisBottom(this.x).tickSize(10).tickValues([SpectrumData[curr_index].x_value]))
    .select("line")
   .style("stroke", this.tickColor)
   .style("stroke-width", "2")

   this.svg.select("."+this.x_TickClass+" text")
     .style("fill", "none")

 }

 changeCurrentCursor(){
     this.x_TickClass = "x-Axis"+this.active_cursor;
     this.y_TickClass = "y-Axis"+this.active_cursor;
   if(this.active_cursor==0){
      this.tickColor = "orange";
     this.current_cursor = this.basic_cursor_A;
   }
   else{
    this.tickColor = "green";
    this.current_cursor = this.basic_cursor_B;

   }
 }



 private initSvg() {
   this.X=SpectrumData.map((data:any)=>data.x_value)
   this.Y=SpectrumData.map((data:any)=>data.y_value)
   this.highest_X = d3.max(this.X);
   this.highest_Y = d3.max(this.Y);


  this.svg = d3Selection
   .select('svg')
   .on("click", (event:any)=>this.mouseClick(event))
   .append('g')
   .attr(
    'transform',
    'translate(' + this.margin.left + ',' + this.margin.top + ')'
   );

   this.image_A = d3Selection.select('image')
  }

 private initAxis() {
  this.x = d3Scale.scaleLinear().range([0, this.width]);
  this.y = d3Scale.scaleLinear().range([this.height, 0]);
  this.x.domain(d3Array.extent(SpectrumData, (d:any) => d.x_value));
  this.y.domain(d3Array.extent(SpectrumData, (d:any) => d.y_value));
 }

 private drawAxis() {
  this.svg
   .append('g')
   .attr('class', 'Xaxis')
   .attr('transform', 'translate(0,' + this.height + ')')
   .call(
     d3Axis.axisBottom(this.x))


  this.svg
   .append('g')
   .attr('class', 'Yaxis')
   .call(d3Axis.axisLeft(this.y))

 }

 private drawLine() {
  this.line = d3Shape
   .line()
   .x((d: any) => this.x(d.x_value))
   .y((d: any) => this.y(d.y_value));

    this.svg.append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", this.y(0))
    .attr("x2", 0).attr("y2", this.y(200))
  .selectAll("stop")
    .data([
      {offset: "0%", color: "red"},
      {offset: "50%", color: "blue"},
      // {offset: "100%", color: "lawngreen"}
    ])
  .enter().append("stop")
    .attr("offset", function(d:any) { return d.offset; })
    .attr("stop-color", function(d:any) { return d.color; });

  this.svg
    .append('path')
    .datum(SpectrumData)
    .attr('class', 'line')
    .attr("d", this.line)
    .style("fill", "none")
    // .style('stroke', (d:any)=>{
    //           return this.colorPicker(d);
    //  })
    .style('stroke', "black")
    .style("stroke-width", "1");
 }

 colorPicker(v:any){
    console.log(v," ");
    if(v.x_value<20) return "blue"
    else if(v.x_value<40) return "green"
    return "red";
 }
 private mouseClick = (event:any) => {

   console.log(d3.pointer(event)[0]-49,"pointer event");

    this.index = d3.bisectCenter(this.X, this.x.invert(d3.pointer(event)[0]-49));
    console.log(this.index,"basic");

    const text = d3.select('.readout');
    const Xaxis = SpectrumData[this.index].x_value;
    const Yaxis = SpectrumData[this.index].y_value;
    text.text(`X : ${SpectrumData[this.index].x_value} Y: ${SpectrumData[this.index].y_value} `);

    if(this.active_cursor == 0){
    this.tickColor = "orange";
    this.index_A = this.index;
   this.cursor_event_A.next(Xaxis);
    this.current_cursor = this.basic_cursor_A;
    }
    else{
    this.index_B = this.index;
    this.tickColor = "green";
   this.cursor_event_B.next(Xaxis);
    this.current_cursor = this.basic_cursor_B;
    }
    this.current_cursor.attr("x",this.x(SpectrumData[this.index].x_value)-5)
    .attr("y", this.y(SpectrumData[this.index].y_value)-5)

    console.log("X:",SpectrumData[this.index].x_value, "Y:", SpectrumData[this.index].y_value);

    this.x_TickClass = "x-Axis"+this.active_cursor;
     this.y_TickClass = "y-Axis"+this.active_cursor;

    this.svg.select("."+this.x_TickClass).remove();
    this.svg.select("."+this.y_TickClass).remove();

     this.svg
    .select(".Xaxis")
    .append("g")
    .attr('class', this.x_TickClass)
   .call(d3Axis.axisBottom(this.x).tickSize(10).tickValues([Xaxis]))
    .select("line")
   .style("stroke", this.tickColor)
   .style("stroke-width", "2")

   this.svg.select("."+this.x_TickClass+" text")
     .style("fill", "none")

     this.svg
    .select(".Yaxis")
    .append("g")
    .attr('class', this.y_TickClass)
   .call(d3Axis.axisLeft(this.y).tickSize(10).tickValues([Yaxis]))
    .select("line")
   .style("stroke", this.tickColor)
   .style("stroke-width", "2")

   this.svg.select("."+this.y_TickClass+" text")
     .style("fill", "none")

  };

  private renderCursor(){
    let cursorA_index = d3.maxIndex(this.Y)

    this.index = cursorA_index;

    this.basic_cursor_A = this.svg.append('g')
    .append("image")
    .attr("xlink:href",'../../assets/starburst.svg')
    .style("width","10px")
    .style("height","10px")
    .attr('class', 'image_A')
    .attr('x',this.x(SpectrumData[cursorA_index].x_value)-5)
    .attr('y',this.y(SpectrumData[cursorA_index].y_value)-5)
    .on("click", (event:any)=>this.selectImage(event))
    .on("mouseover", (event:any)=>this.hoverImage(event))

     this.basic_cursor_B = this.svg.append('g')
    .append("image")
    .attr("xlink:href",'../../assets/machine.svg')
    .style("width","10px")
    .style("height","10px")
    .style("fill","red")
    .attr('class', 'image_B')
    .attr('x',this.x(SpectrumData[cursorA_index].x_value)-5)
    .attr('y',this.y(SpectrumData[cursorA_index].y_value)-5)
    .on("click", (event:any)=>this.selectImage(event))

      this.cursor_event_A.next(SpectrumData[cursorA_index].x_value);
      this.cursor_event_B.next(SpectrumData[cursorA_index].x_value);

  }
   selectImage(event:any){
    if(event.srcElement.className.baseVal == "image_A"){
      this.active_cursor = 0;
    }
    else
    this.active_cursor = 1;
   }
   hoverImage(event:any){
     console.log(event);
   }
 public ClickCursorHarmonicA(){
    let harmonic_index = 0;

    this.isHarmonic_A = true;
     let c = 1;let image_link: string='';
     let harmonic_cursor;
      this.cursor_event_A.subscribe(data=>{
        if( this.isHarmonic_A){
          this.svg.
        selectAll(".cursor_A")
        .remove()
        c=1;
           harmonic_index = 0;
           image_link ='../../assets/starburst.svg';
    while(1){
      if(c*data>this.highest_X || c>5) break;
     harmonic_index = d3.bisectCenter(this.X, c*data);
     harmonic_cursor = this.svg
    .append("image")
    .attr('class', 'cursor_A')
    .attr("xlink:href",image_link)
    .style("width","10px")
    .style("height","10px")
    .attr('x',(this.x(SpectrumData[harmonic_index].x_value)-5))
    .attr('y',(this.y(SpectrumData[harmonic_index].y_value)-5))
    console.log("X:",SpectrumData[harmonic_index].x_value, "Y:", SpectrumData[harmonic_index].y_value);
    c++;
  }
}
  })
  }

  public disableHarmonic_A(){
    this.isHarmonic_A = false;
     if(!this.isHarmonic_A){
         this.svg.
        selectAll(".cursor_A")
        .remove()
    }
  }
  public disableHarmonic_B(){
    this.isHarmonic_B = false;
      if(!this.isHarmonic_B){
         this.svg.
        selectAll(".cursor_B")
        .remove()
    }
  }
  public ClickCursorHarmonicB(){
    this.isHarmonic_B = true;
      this.cursor_event_B.subscribe(data=>{
        if( this.isHarmonic_B){
          const image_link = '../../assets/machine.svg';
         this.svg.
        selectAll(".cursor_B")
        .remove()
          let c=2;
           let harmonic_index = 0;
    while(1){
      if(c*data>this.highest_X) break;
     harmonic_index = d3.bisectCenter(this.X, c*data);
     let harmonic_cursor = this.svg
    .append("image")
    .attr('class', 'cursor_B')
    .attr("xlink:href",image_link)
    .style("width","10px")
    .style("height","10px")
    .attr('x',(this.x(SpectrumData[harmonic_index].x_value)-5))
    .attr('y',(this.y(SpectrumData[harmonic_index].y_value)-5))
    console.log("X:",SpectrumData[harmonic_index].x_value, "Y:", SpectrumData[harmonic_index].y_value);
    c++;
    }
  }
      })
  }
  public ToggleCursor(){
     this.active_cursor = this.active_cursor^1;
  }
}
