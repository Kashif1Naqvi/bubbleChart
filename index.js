function render(data){
  let width  = window.innerWidth,
      height = window.innerHeight ,
      margin = { top:100 , left:70 , right:90 , bottom:60 },
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;
      // last_updated
      // PopMale
      var myColor = d3.scaleOrdinal().domain(data)
.range(d3.schemeSet3);
      let allGroup = ['PopTotal','PopMale','PopFemale',]
      let dropDown = d3.select("#selectButton")
        dropDown.selectAll("option").data(allGroup).enter().append("option")
        .text(function(d,i){
          return d
        })
        .attr("value",function(d,i){
          return d
        }).attr("text-anchor","middle")


      let yScale = d3.scaleLinear()
      .domain([0,d3.max(data,function(d) { return Math.max([d.PopTotal])})])
      .range([innerHeight,0])
      let xScale = d3.scaleTime()
      .domain(d3.extent(data,function(d){
        return d.Time
      })).range([0,innerWidth])

      var z = d3.scaleLinear()
        .domain([0,d3.max(data,function(d) { return Math.max([d.PopTotal])})])
        .range([ 4, 40]);

    let tickFormat = number => d3.format(".3s")(number).replace("G","B")

    let line  = d3.line()
    .x(function(d){
      return xScale(d.Time)
    })
    .y(function(d){
      return yScale(d.PopTotal)
    })


                                                                                                                                                                                    let xAxis = d3.axisBottom(xScale).ticks(15)
      let yAxis = d3.axisLeft(yScale).tickFormat(tickFormat).tickSize(-innerWidth)
      let svg = d3.select("#chart").append("svg")
                  .attr("viewBox",`0 0 ${width} ${height}`)
                  // .attr("height",height)
                  // .attr("width",width).style("background-color","black")
      let g = svg.append("g").attr("transform",`translate(${margin.top},${margin.left})`)
      let tooltip =d3.select("body").append("g").attr("transform",`translate(0,${innerHeight })`).attr("class","tooltips")

    let lineData =   g.append("path")
        .attr("d",line(data))
        .attr("stroke","lightseagreen")
        .attr("fill","none")

    let circle=  g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",0)
        .attr("cy",-100)
        .attr("r",0)
        .on("mouseover", function(d,i){
          tooltip.html(`
                  <b>Location:${d.Location}</b>
                  <hr>
                  Population By:
                   Male:${Math.round(d.PopMale)}
                   Female:${Math.round(d.PopFemale)}
                  Total:${Math.round(d.PopTotal)}
            `)
                  .style("top",  (d3.event.pageY-85 ) + "px")
                  .style("left",(d3.event.pageX -59 )+ "px")
          })
        .on("mouseout",function(d,i){
          tooltip.html("")
        })
        circle.transition()
        .attr("cx",function(d){
          return xScale(d.Time)
        })
        .attr("cy",function(d){
          return yScale(d.PopTotal)
        })
        .attr("r",function(d,i){return z(d.PopTotal)})
        .attr("fill", function(d){return myColor(d) })

        .duration(8000)
        let text = g.selectAll("text").data(data)
                .enter()
                .append("text")
                .attr("x",0)
                .attr("y",0)
                .attr("text-anchor","middle")
                .text(function(d,i){
                  return d.PopTotal
                })
      text.transition()
                .attr("x",function(d){
                  return xScale(d.Time)
                })
                .attr("y",function(d){
                  return yScale(d.PopTotal)
                })
                .attr("fill", "grey" )
                .duration(8000)

    let xGroup =   g.append("g").call(xAxis).attr("transform",`translate(0,${innerHeight})`)
    let yGroup =  g.append("g").call(yAxis).attr("transform",`translate(-10,0)`)
      g.append("text").attr("x",0).attr("y",70).text("Time").attr("text-anchor","middle").attr("transform",`translate(${innerWidth/2},${innerHeight})`).attr("font-size",28).attr("class","text-data")
      g.append("text").attr("x",0 ).attr("y",30).text("Population Vs Years").attr("text-anchor","middle").attr("transform",`translate(${innerWidth/2},${-innerHeight/12})`).attr("font-size",28).attr("class","text-data")
      g.append("text").attr("x",-innerHeight/2).attr("y",-60).text("Population").attr("font-size",28).attr("transform","rotate(-90)").attr("class","text-data")
      xGroup.select(".domain").remove()
      yGroup.select(".domain").remove()
      function update(selectedGroup){
        let dataFilter = data.map(function(d){
          return {
            Time:d.Time,
            value:d[selectedGroup],
            Location:d.Location,
            PopFemale:d.PopFemale,
            PopMale: d.PopMale,
            PopTotal:d.PopTotal
          }
        })

        lineData.datum(dataFilter)
        .transition()
        .duration(1000)
        .attr("d",d3.line().x(d=>xScale(d.Time)).y(d=>yScale(d.value)))

        circle.data(dataFilter)
          .transition()
          .duration(1000)
          .attr("cx",function(d){
            return xScale(d.Time)
          })
          .attr("cy",function(d){
            return yScale(d.value)
          })
          text.data(dataFilter)
              .transition()
              .attr("x",function(d){
                return xScale(d.Time)
              })
              .attr("y",function(d){
                return yScale(d.value)
              })
              .attr("fill", "grey" )
              .duration(3000)


      }

      d3.select("#selectButton").on("change", function(d) {
              var selectedOption = d3.select(this).property("value")
              update(selectedOption)
            })
}
    d3.csv("code.csv").then(data=>{
        data.forEach(d=>{
          d.Time = new Date(d.Time)
          d.PopMale = Math.round(d.PopMale)
          d.PopFemale = Math.round(d.PopFemale)
          d.PopTotal = Math.round(d.PopTotal)
        })
    render(data)
})
