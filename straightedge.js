(function() {

  // List of colours for use.
  var colours = [
    "rgb(117, 255,  51)", 
    "rgb(219, 255,  51)",
    "rgb(155, 223, 211)",
    "rgb(255, 189,  51)",
    "rgb(162,  63,  78)",
    "rgb( 42,  84, 109)",
    "rgb(255, 139, 128)",
    "rgb(163, 222, 156)",
    "rgb(179,  51,  50)",
    "rgb(255, 146,  66)",
    "rgb( 66, 133, 244)",
    "rgb(234,  67,  53)",
    "rgb(251, 188,   5)",
    "rgb( 52, 168,  83)"
  ];

  // Line thickness.
  var thickness = 1;
  
  // Line dashes.
  var dashes = 14;
  
  // Radius of a point.
  var dotradius = 5;
  
  // Label font size.
  var labelfontsize = 14;
  
  // Constructed points.
  var points = [
    {
      label: "0"
      , x: 0
      , y: 0
      , labelx: -15
      , labely: 15
    }, 
    {
      label: "1"
      , x: 100
      , y: 0
      , labelx: -15
      , labely: 15
    }, 
    {
      label: "2"
      , x: 200
      , y: 0
      , labelx: -15
      , labely: 15
    },
  ];
  
  // Lines.
  var lines = [
    ["0", "1"],
  ];
  
  // Circles.
  var circles = [
    ["1", "0"],
  ];
  
  // SVG viewbox.
  var viewbox = [-400, -200, 800, 400];
  
  // Add SVG.
  var vis = d3.select("#plane")
              .attr("viewBox", viewbox.join(' '));
  
  // Calculate the extreme points of the lines.
  var extremes = [];
  for (line of lines) {
    // Get points by label from points array.
    var p1 = points.filter(obj => obj.label == line[0])[0];
    var p2 = points.filter(obj => obj.label == line[1])[0];
    
    // Locations.
    var x1 = p1['x'];
    var x2 = p2['x'];
    var y1 = p1['y'];
    var y2 = p2['y'];
  
    // Check if line is vertical.
    if ((x2 - x1) == 0) {
      // Draw vertical line
      console.log("IMPLEMENT VERTICAL");
    } else {
      // Slope of line.
      var m = (y2 - y1) / (x2 - x1);
      // Y intercept.
      var c = y1 - (m * x1);
      // Left point.
      var x = viewbox[0];
      var left = [x, (m * x) + c];
      // Right point.
      var x = viewbox[0] + viewbox[2];
      var right = [x, (m * x) + c];
  
      // Append line's extreme points.
      extremes.push([left, right]);
    }
  }
  
  // Draw the lines.
  vis.selectAll('.line')
  .data(extremes)
  .enter()
  .append("line")
  .attr('class', 'line')
  .attr("x1", function(d) { return d[0][0]; })
  .attr("y1", function(d) { return d[0][1]; })
  .attr("x2", function(d) { return d[1][0]; })
  .attr("y2", function(d) { return d[1][1]; })
  .attr("stroke-width", thickness)
  .attr("stroke-dasharray", dashes); 
  
  // Find centres and radii of circles.
  var centre_r = [];
  for (circle of circles) {
    // Get points by label from points array.
    var p1 = points.filter(obj => obj.label == circle[0])[0];
    var p2 = points.filter(obj => obj.label == circle[1])[0];
  
    // Locations.
    var x1 = p1['x'];
    var x2 = p2['x'];
    var y1 = p1['y'];
    var y2 = p2['y'];
  
    var a = x2 - x1;
    var b = y2 - y1;
  
    // Calculate radius.
    var r = Math.sqrt(a * a + b * b);
  
    // Append circle centre and radius.
    centre_r.push([[x1, y1], r]);
  
  }
  
  // Draw the circles.
  vis.selectAll('.circle')
  .data(centre_r)
  .enter()
  .append("circle")
  .attr('class', 'circle')
  .attr("cx", function(d) { return d[0][0]; })
  .attr("cy", function(d) { return d[0][1]; })
  .attr("r", function(d) { return d[1]; })
  .attr("stroke-width", thickness)
  .attr("stroke-dasharray", dashes);
  
  
  // Draw the points.
  var gs = vis.selectAll('.point')
              .data(points)
              .enter()
              .append('g')
              .attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")"});
  
  gs.append("circle")
    .attr('class', 'point')
    //.attr("cx", function(d) { return d['x']; })
    //.attr("cy", function(d) { return d['y']; })
    .attr("r", dotradius);
  
  gs.append('text')
    .attr('dx', function(d) { return d.labelx; })
    .attr('dy', function(d) { return d.labely; })
    .attr('class', 'label')
    .attr('font-size', labelfontsize)
    .text(function(d) { return d.label; });
  
  })(this);