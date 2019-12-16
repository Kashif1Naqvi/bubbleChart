function render(data){
  let width  = 600,
      height = 500,
      margin = { top:90 , left:70 , right:20 , bottom:60 },
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;
      // last_updated
      // PopMale

      let allGroup = ['PopTotal','PopMale','PopFemale',]
      let dropDown = d3.select("#selectButton")
        dropDown.selectAll("option").data(allGroup).enter().append("option")
        .text(function(d,i){
          return d
        })
        .attr("value",function(d,i){
          return d
        })
      const color = d3.scaleOrdinal(d3.schemeAccent)
      color      .domain([0,d3.max(data,function(d) { return Math.max([d.PopTotal]);})])
.range(["red","blue","green"])
      let yValue =  d => d.PopTotal
      let xValue = d=>new Date(d.Time )
      // let xValue = data.map( d=> d.PopTotal )

      let yScale = d3.scaleLinear()
      .domain([0,d3.max(data,function(d) { return Math.max([d.PopTotal]);})])
      .range([innerHeight,0])
      // let xScale = d3.scaleLinear().domain([d3.min(xValue),d3.max(xValue)]).range([0,innerWidth])
      let xScale = d3.scaleTime()
      .domain(d3.extent(data,function(d){
        return d.Time
      }))
      .range([innerWidth,0])
      var z = d3.scaleSqrt()
    .domain([200000, 1310000000])
    .range([ 2, 30]);


    let tickFormat = number => d3.format(".3s")(number).replace("G","B")

    let line  = d3.line()
    .x(function(d){
      return xScale(d.Time)
    })
    .y(function(d){
      return yScale(d.PopTotal)
    })


      let xAxis = d3.axisBottom(xScale)
      let yAxis = d3.axisLeft(yScale).tickFormat(tickFormat)
      let svg = d3.select("#chart").append("svg")
                  // .attr("viewBox",`0 0 ${width} ${height}`)
                  .attr("height",height)
                  .attr("width",width)
      let g = svg.append("g").attr("transform",`translate(${margin.top},${margin.left})`)
      let tooltip =d3.select("#chart").append("g").attr("transform",`translate(0,${height/2  })`).attr("class","tooltip")
      let text = g.append("text").attr("transform",`translate(0,${-innerHeight})`).text("Hello world")

    let lineData =   g.append("path")
        .attr("d",line(data))
        .attr("stroke","red")
        .attr("fill","none")
    let circle=  g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",d=>xScale(xValue(d)))
        .attr("cy",d=>yScale(yValue(d)))
        .attr("r",d=>z(d.PopTotal))
        .style("fill","blue")
        .attr("id","my")
        .on("mouseover", function(d,i){
          tooltip.html(`
            <div class="tooltip bs-tooltip-top" role="tooltip" >
            <div class="arrow"></div>
              <div class="tooltip-inner">
                  <p>Location:<br>${d.Location}</p>
                  <hr>
                  <p>Population By</p>
                   <li>Male:${Math.round(d.PopMale)}</li>
                   <li>Female:${Math.round(d.PopFemale)}</li>
                  <li>Total:${Math.round(d.PopTotal)}</li>
              </div>
            </div>`)
                  .style("top",  (d3.event.pageY-150 ) + "px")
                  .style("left",(d3.event.pageX + 20 )+ "px")
          })
        .on("mouseout",function(d,i){
          tooltip.html("")
        })



    let xGroup =   g.append("g").call(xAxis).attr("transform",`translate(0,${innerHeight})`)
    let yGroup =  g.append("g").call(yAxis).attr("transform",`translate(0,0)`)
      g.append("text").attr("x",210).attr("y",50).text("Time").attr("text-anchor","middle").attr("transform",`translate(0,${innerHeight})`).attr("font-size",28).attr("class","text-data")
      g.append("text").attr("x",250).attr("y",30).text("Population Vs Years").attr("text-anchor","middle").attr("transform",`translate(0,${-innerHeight/8})`).attr("font-size",28).attr("class","text-data")
      g.append("text").attr("x",-270).attr("y",-60).text("Population").attr("font-size",28).attr("transform","rotate(-90)").attr("class","text-data")
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
          .attr("cx",d=>xScale(d.Time))
          .attr("cy",d=>yScale(d.value))

      }

      d3.select("#selectButton").on("change", function(d) {
              var selectedOption = d3.select(this).property("value")
              update(selectedOption)
          })
}

d3.csv("WPP2019_PopulationBySingleAgeSex_2020-2100.csv").then(data=>{
  data.forEach(d=>{
    d.Time = new Date(d.Time)
    d.PopMale = d.PopMale
    d.PopFemale = d.PopFemale
    d.PopTotal = d.PopTotal
  })
  render(data)
})
