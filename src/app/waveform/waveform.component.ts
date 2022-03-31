import { Component, OnInit } from '@angular/core';
import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { WaveformData } from "../shared/machine-data"
import * as d3 from 'd3';
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
  private line: d3Shape.Line<[number, number]> | undefined;
 //  cursor_readout:any;
  basic_cursorA: any=null;
  basic_cursorB: any;
  is_cursorA_enabled= false;
  is_cursorB_enabled= false;
  active_basic_cursor= "";
 
 
  constructor() {
   this.width = 900 - this.margin.left - this.margin.right;
   this.height = 500 - this.margin.top - this.margin.bottom;
   // this.cursor_readout = d3.select('readout')
  }
 
  ngOnInit() {
   this.initSvg();
   this.initAxis();
   this.drawAxis();
   this.drawLine();
   this.handleCursorAButtonClick();
  }
 
  private initSvg() {
 
   this.svg = d3Selection
    .select('.waveform') 
    .on("click", (event:any)=>this.mouseClick(event))   
    .append('g')
    .attr(
     'transform',
     'translate(' + this.margin.left + ',' + this.margin.top + ')'
    )  
    
   
    }
 
  private initAxis() {
   
   this.x = d3.scaleLinear().range([0, this.width]);
   this.y = d3.scaleLinear().range([this.height, 0]);
   this.x.domain(d3Array.extent(WaveformData, (d) => d.x_value));
   this.y.domain(d3Array.extent(WaveformData, (d) => d.y_value));
  }
 
  private drawAxis() {
   this.svg
    .append('g')
    .attr('class', 'xAxis')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(d3Axis.axisBottom(this.x));
 
   this.svg
    .append('g')
    .attr('class', 'yAxis')
    .call(d3Axis.axisLeft(this.y))
    .append('text')
    .attr('class', 'axis-title')
    .attr('transform', 'rotate(-90)')
   //  .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Price ($)');
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
     .style("stroke", "#039be5")
     // .style("stroke-width", "1");
 
 
 //   this.svg.append('g')
 //     .selectAll("dot")
 //     .datum(SpectrumData)
 //     .enter()
 //     .append("circle")
 //     .attr("cx", function (d:any) { return SpectrumData[d].x_value; } )
 //     .attr("cy", function (d:any) { return SpectrumData[d].y_value; } )
 //     .attr("r", 0.2)
 //      .attr("transform", "translate(" + 100 + "," + 100 + ")")
 //     .style("fill", "#000000");
  }
 
 
  public mouseClick = (event:any) => {   
   
   const X=WaveformData.map((data)=>data.x_value)
     // this.cursor_readout.style("opacity", 1);
   //  console.log(d3.pointer(event))
     const i = d3.bisectCenter(X, this.x.invert(d3.pointer(event)[0]-49));
     // console.log("click ",this.x(5))
 
     // console.log("invert",this.x.invert(83))
     // console.log("click",i,d3.pointer(event)[0],this.x.invert(d3.pointer(event)[0]-49))
     // console.log("cursor B active",this.basic_cursorA.attr("x"),this.basic_cursorB.attr("x"),SpectrumData[i].x_value-5)
     //  if(this.is_cursorA_enabled&&this.basic_cursorA.attr("x")==this.x(SpectrumData[i].x_value)-5 && this.basic_cursorA.attr("y")==this.y(SpectrumData[i].y_value)-5){
     //    this.active_basic_cursor="cursorA"
     //  }
     //  else
     //   if(this.is_cursorB_enabled&&this.basic_cursorB.attr("x")==this.x(SpectrumData[i].x_value)-5 && this.basic_cursorB.attr("y")==this.y(SpectrumData[i].y_value)-5){
     //     this.active_basic_cursor="cursorB"
     //   }
 
     // console.log("ca",this.basic_cursorA.attr('xlink:href'))
      
      if(this.active_basic_cursor!="cursorA"&&this.active_basic_cursor!="cursorB"){
        this.renderCursorA();
      }
    
 
 
     if(this.active_basic_cursor=="cursorA"){
     this.basic_cursorA.attr("x",this.x(WaveformData[i].x_value)-10)
     .attr("y", this.y(WaveformData[i].y_value)-15)
     // console.log("click", this.svg.selectAll(".axis axis--x"))
     this.svg.selectAll(".xAxis").selectAll(".AX").attr("transform", "translate(" + this.x(WaveformData[i].x_value) + "," + 0 + ")") 
     this.svg.selectAll(".yAxis").select(".AY").attr("transform", "translate(" + 0 + "," + this.y(WaveformData[i].y_value) + ")") 
      console.log("cursor A active")
      const text = d3.select('.readoutA');   
     text.text(` Cursor A: X : ${WaveformData[i].x_value} Y: ${WaveformData[i].y_value} `);
   }
     else  if(this.active_basic_cursor=="cursorB"){
       this.basic_cursorB.attr("x",this.x(WaveformData[i].x_value)-10)
     .attr("y", this.y(WaveformData[i].y_value)-15)
     this.svg.selectAll(".xAxis").selectAll(".BX").attr("transform", "translate(" + this.x(WaveformData[i].x_value) + "," + 0 + ")") 
     this.svg.selectAll(".yAxis").select(".BY").attr("transform", "translate(" + 0 + "," + this.y(WaveformData[i].y_value) + ")") 
     // console.log("cursor B active")
     const text = d3.select('.readoutB');   
     text.text(` Cursor B: X : ${WaveformData[i].x_value} Y: ${WaveformData[i].y_value} `);
     }
 
 //             //harmonic cursors
 //       this.svg.append('g')
 //     .selectAll(".harmonicCursor")
 //     .data([1,2,3])
 //     .enter()    
 //     .append("image")   
 //     .attr("xlink:href",'../../assets/starburst.svg')
 //     .style("width","10px")
 //     .style("height","10px")
     
 //     .attr('x', this.harmonicX(i))
 //  .attr('y',function(yVal:number){ return 0; })
             
           
     
   };
 //  private harmonicX(i:number){
 //   SpectrumData[i].x_value)*1);
 //  }
  
 cursorAClick(event:any){
   if(this.active_basic_cursor=="cursorB"){
     this.basic_cursorB   
       .attr("xlink:href",'../../assets/cursorB.svg')
   }
   this.active_basic_cursor="cursorA"
   this.basic_cursorA   
       .attr("xlink:href",'../../assets/ACursorActive.svg')
 }
 cursorBClick(event:any){
   if(this.active_basic_cursor=="cursorA"){
     this.basic_cursorA   
       .attr("xlink:href",'../../assets/cursorA.svg')
   }
   this.active_basic_cursor="cursorB"
   this.basic_cursorB   
       .attr("xlink:href",'../../assets/BCursorActive.svg')
 }
 
 
   private renderCursorA(){
     if(this.is_cursorB_enabled && this.active_basic_cursor=="cursorB"){
       this.basic_cursorB   
       .attr("xlink:href",'../../assets/cursorB.svg')
       
      }
     this.active_basic_cursor="cursorA"   
     if(this.basic_cursorA==null){
     this.basic_cursorA= this.svg.append('g')
     .selectAll(".cursorA")
     .data([1])
     .enter()    
     .append("image")   
     .attr("xlink:href",'../../assets/ACursorActive.svg')
     // .attr('class','cursorA')
     .on("click", (event:any)=>this.cursorAClick(event))   
     .style("width","20px")
     .style("height","20px")
     .attr('x',this.x(WaveformData[80].x_value)-10)
     .attr('y',this.y(WaveformData[80].y_value)-15)   
    
     const aAxis=this.svg
    .append('g')
    .attr('class', 'aAXis')
    .attr("transform", "translate(" + this.x(WaveformData[80].x_value) + "," + 0 + ")")
    
   
    .call(d3Axis.axisLeft(this.y))

    aAxis.attr("stroke", "coral")
    .attr("y2",2)
    aAxis.selectAll("text").remove()
    // .append('text')
  //   .attr('class', 'axis-title')
    // .attr('transform', 'rotate(-90)')
  //  //  .attr('y', 6)
  //  .attr('dy', '.71em')
    // .style('text-anchor', 'end')
    // .text('Price ($)');
    //  this.svg.select(".xAxis").selectAll(".AX")
    //  .data([1])
    //  .enter().append('g').attr('class', 'AX'). attr("transform", "translate(" + this.x(WaveformData[80].x_value) + "," + 0 + ")").append('line').attr("stroke", "coral").attr("y2",8)
     
      this.svg.select(".yAxis").selectAll(".AY")
     .data([1])
     .enter().append('g').attr('class', 'AY'). attr("transform", "translate(" + 0 + "," + this.y(WaveformData[80].y_value) + ")").append('line').attr("stroke", "coral").attr("y2",8) .attr('transform', 'rotate(90)')
     // if(!this.is_cursorB_enabled){
     //   this.active_basic_cursor="cursorA"
     // }
     const text = d3.select('.readoutA');   
     text.text(` Cursor A: X : ${WaveformData[80].x_value} Y: ${WaveformData[80].y_value} `);
     }
     else if(this.active_basic_cursor=="cursorA"){
       this.basic_cursorA   
       .attr("xlink:href",'../../assets/ACursorActive.svg')
     }
   }
   
   private renderCursorB(){  
     if( this.active_basic_cursor=="cursorA"){
       this.basic_cursorA
       .attr("xlink:href",'../../assets/cursorA.svg')
 
       
      }
     this.active_basic_cursor="cursorB"
    
     this.basic_cursorB= this.svg
     .selectAll(".cursorB")
     .data([1])
     .enter()  
     .append('g')
    
     .append("image")   
     // .attr('class','cursorB') 
     
     .attr("xlink:href",'../../assets/BCursorActive.svg')  
 
     .on("click", (event:any)=>this.cursorBClick(event))
     .style("width","20px")
     .style("height","20px")
     .attr('x',this.x(WaveformData[85].x_value)-10)
     .attr('y',this.y(WaveformData[85].y_value)-15)  
     this.svg.select(".xAxis").selectAll(".BX")
     .data([1])
     .enter().append('g').attr('class', 'BX'). attr("transform", "translate(" + this.x(WaveformData[85].x_value) + "," + 0 + ")").append('line').attr("stroke", "green").attr("y2",8)
     
      this.svg.select(".yAxis").selectAll(".BY")
     .data([1])
     .enter().append('g').attr('class', 'BY'). attr("transform", "translate(" + 0 + "," + this.y(WaveformData[85].y_value) + ")").append('line').attr("stroke", "green").attr("y2",8) .attr('transform', 'rotate(90)')
     
     // if(!this.is_cursorA_enabled){
     //   this.active_basic_cursor="cursorB"
     // }
     const text = d3.select('.readoutB');   
     text.text(` Cursor B: X : ${WaveformData[85].x_value} Y: ${WaveformData[85].y_value} `);
   }
 
   public handleCursorAButtonClick(){
     this.is_cursorA_enabled=!this.is_cursorA_enabled;
     if(!this.is_cursorA_enabled ){
       d3.selectAll("#cursorA").style("background-color","white")
 
       console.log("A")
       this.basic_cursorA.remove();
       this.basic_cursorA=null;
       d3.select('.readoutA').text('');
 
       this.svg.select(".yAxis").selectAll(".AY").remove()
       this.svg.select(".xAxis").selectAll(".AX").remove()
       
       if(this.is_cursorB_enabled && this.active_basic_cursor!="cursorB"){
         this.active_basic_cursor="cursorB"
         this.basic_cursorB        
         .attr("xlink:href",'../../assets/BCursorActive.svg')}
         else{
           this.active_basic_cursor="";
         }
         }
     else{
      
       this.renderCursorA();
       
       d3.selectAll("#cursorA").style("background-color","coral")
     }
     
 
   }
   public handleCursorBButtonClick(){
     this.is_cursorB_enabled=!this.is_cursorB_enabled;
     if(!this.is_cursorB_enabled){
      d3. selectAll("#cursorB").style("background-color","white")
       console.log("basic B",this.basic_cursorB)
       this.basic_cursorB.remove();
       console.log("basic B",this.basic_cursorB)
       d3.select('.readoutB').text('');
       this.svg.select(".yAxis").selectAll(".BY").remove()
       this.svg.select(".xAxis").selectAll(".BX").remove()
       if(this.is_cursorA_enabled && this.active_basic_cursor!="cursorA"){
         this.active_basic_cursor="cursorA"
         this.basic_cursorA     
     .attr("xlink:href",'../../assets/ACursorActive.svg')
     }
     else{
       this.active_basic_cursor="";
     }
       
     }
     else{
       this.renderCursorB();
       d3.selectAll("#cursorB").style("background-color","green")
     }
     console.log("B")
    
   }
}
