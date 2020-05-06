d3.json("data.json").then((primData) => {
  const data = primData.data;

 
  const height = 400;
  const width = 800;

  let barWidth = width / data.length


  let visHolder = d3.select('.visHolder')
  
 var overlay = visHolder.append('div')
                            .attr('class', 'overlay')
                            .style('opacity', 0)

 var tooltip = visHolder.append('div')                           
                            .attr('id', 'tooltip')
                            .style('opacity', 0)

  var svgContainer = visHolder   //Creating SVG for all visualization
  .append("svg")
  .attr('class', 'svg-container')
  .attr("width", width + 100)
  .attr("height", height + 60);
  


  const yearsDate = data.map(singleData=>{
    return new Date(singleData[0])
  })
  console.log(yearsDate[0]+ 'yearsData Works!😎')
  
  const years = data.map(singleData=>{
    var quarter;
    var month = singleData[0].substring(5, 7)
    if (month === "01") {
      quarter = "Jan-Mar";  
    } else if (month === "04") {
      quarter = "April-June";
    } else if (month === "07") {     //Setting the Quarter for each month & Assigning in the  Variable
      quarter = "July-Sep";
    } else if (month === "10") {
      quarter = "Oct-Dec";
    }

    return singleData[0].substring(0, 4) + " " + quarter;
  })

  console.log(years[0] + ' Year for tooltip works!😎')



  const xMax = new Date(d3.max(yearsDate))
  xMax.setMonth(xMax.getMonth() + 3)

  
  console.log(xMax+ "the Latest year🆕")

  const xScale = d3.scaleTime()
                    .domain([d3.min(yearsDate), xMax])
                    .range([0, width])
  
  const xAxis = d3.axisBottom().scale(xScale);  //Because we're using scale

  const xAxisGroup = svgContainer.append('g')
                      .call(xAxis)
                      .attr('id', 'x-axis')
                      .attr("transform", `translate(60, ${height})`)


  
  let GDP = data.map(singleData=>{
    return singleData[1]
  })
  
  let scaledGDP = [];
  
  let gdpMax = d3.max(GDP)
  let gdpMin = d3.min(GDP)
  
  let linearScale= d3.scaleLinear()
              .domain([0, gdpMax])
              .range([0, height])
  
  
  
  scaledGDP = GDP.map(singleData=>{
    return linearScale(singleData)
  })
  
  console.log(scaledGDP[0] + "  GDP is Scaled 😁")
  
  const yAxisScale = d3.scaleLinear()
                    .domain([0, gdpMax])
                    .range([height, 0])

  const yAxis = d3.axisLeft(yAxisScale)                  
                    
  const yAxisGroup = svgContainer.append('g')
                          .call(yAxis)
                          .attr('id', 'y-axis')
                          .attr('transform', 'translate(60, 0)')
    
    svgContainer.selectAll('rect')
    .data(scaledGDP)
    .enter()
    .append('rect')
    .attr('x', (d, i)=> xScale(yearsDate[i]))
    .attr('y', d=> height - d)
    .attr('width', barWidth)
    .attr('height', d=> d)
    .attr('class', 'bar')
    .attr('data-date', (d, i)=>data[i][0])
    .attr('data-gdp', (d,i)=>data[i][1])
    .attr('transform', 'translate(60, 0)')
    .on('mouseover', (d, i)=>{
      overlay  //Transition for the Background
      .transition()
      .duration(0)   //duration for the transition
      .style("height", d + "px")
      .style("width", barWidth + "px")
      .style("opacity", 0.9)
      .style("left", i * barWidth + 0 + "px")
      .style("top", height - d + "px")
      .style("transform", "translateX(60px)");
      
      tooltip.transition().duration(200).style("opacity", 0.9);  //transition for the text of the Tooltip
      
      tooltip
      .html(
        years[i] +  //Years Variable created Above🚩  & [i] is for Index
        "<br>" +
        "$" +  //Dollar sign before the money
        GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + //Regex for inserting & replacing ','
        " Billion"
        )
        .attr("data-date", data[i][0])  // [i] for Index & data[0] for date
        .style("left", i * barWidth + 30 + "px")  //Positioning the Whole tooltip
        .style("top", height - 100 + "px")
        .style("transform", "translateX(50px)");     
      })

      .on('mouseout', d=>{
      tooltip.transition().duration(200).style('opacity', 0)
      overlay.transition().duration(200).style('opacity', 0)
    })
});

