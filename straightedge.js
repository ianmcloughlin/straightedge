  
// (function() {

  /***************************************************************************
   * Parameters and preliminaries for display.
  ***************************************************************************/

  // Line thickness.
  const thickness = 1;
  
  // Line dashes.
  const dashes = 5;
  
  // Radius of a point.
  const dotradius = 10;
  
  // Label font size.
  const labelfontsize = 14;

  // Toolbar size.
  const tb = 30;

  // Circle mode is false, line mode is true.
  let ui_mode = true;
  
  // The construction, in order.
  let cons = [
    {
      type: 'point', 
      label: '0',
      x: 0,
      y: 0,
      labelx: -15,
      labely: 15,
    }, 
    {
      type: 'point',
      label: '1',
      x: 100,
      y: 0,
      labelx: -15,
      labely: 15,
    }, 
    {
      type: 'point',
      label: '2',
      x: 200,
      y: 0,
      labelx: -15,
      labely: 15,
    },
    {
      type: 'point',
      label: 'A',
      x: 100,
      y: 100,
      labelx: -15,
      labely: 15,
    },
    {
      type: 'point',
      label: 'B',
      x: 200,
      y: -100,
      labelx: -15,
      labely: 15,
    },
    {
      type: 'line',
      point1: '0',
      point2: '1',
    },
    {
      type: 'line',
      point1: '0',
      point2: 'A',
    },
    {
      type: 'line',
      point1: '1',
      point2: 'B',
    },
    {
      type: 'circle',
      centre: '1',
      point: '0',
    },
    {
      type: 'circle',
      centre: '0',
      point: '1',
    },
  ];

  // SVG parameters.
  let svg_params = {
    viewbox: {
      minx: -200,
      miny: -200,
      width: 500,
      height: 500,
    },
    width: window.innerWidth, // '100%', //5000,
    height: window.innerHeight, //'100%', //5000,
  }

  // Find the drawing svg.
  let vis = d3.select('.parent_of_plane')
              .append("svg")
              .attr("width", svg_params.width)
              .attr("height", svg_params.height)
              .attr('viewBox', `${svg_params.viewbox.minx},${svg_params.viewbox.miny},${svg_params.viewbox.width},${svg_params.viewbox.height}`);



  /***************************************************************************
   * Functions for geometry etc.
  ***************************************************************************/

  // Slope and y-intercept of line from two points - checks for vertical lines.
  function equation_of_line(p1, p2) {    
    
    // Slope and y intercept.
    let m, c;
    
    // Vertical line check.
    if (p1.x === p2.x) {
      
      // Slope is infinite or something like that.
      m = Infinity;
      // Set c to the x intercept.
      c = p1.x;
    
    } else {
      
      // Slope: (y2 - y1) / (x2 - x1).
      m = (p2.y - p1.y) / (p2.x - p1.x);
      // Y intercept: y - y1 = m(x - x1) => c = y1 - m(x1).
      c = p1.y - m * p1.x;
    
    }
    
    // Return.
    return {m, c};
  }

  // Point of intersection of two lines.
  function intersection(L1, L2) {

    // x and y coords of points of intersection.
    let x, y;

    // Non intersection or same line check.
    if (L1.m == L2.m) {
      
      // Use null to signify no such point.
      x = null;
      y = null;

    } else {
      
      // x of intercept.
      let x = (L1.c - L2.c) / (L2.m - L1.m);
      
      // y of intercept.
      let y = L1.m * x + L1.c;
      
    }

    // Return.
    return {x, y};

  }

  // Extreme points in viewbox of line from two points.
  function extreme_points(p1, p2) {
    
    // The four values we're gonig to calculate.
    let x1, y1, x2, y2;

    // Equation of the line.
    let {m, c} = equation_of_line(p1, p2)
        
    // Check if line is vertical.
    if (m === Infinity) {

      // The y values are just the top and bottom of the viewbox.
      y1 = svg_params.viewbox.miny;
      y2 = svg_params.viewbox.miny + svg_params.viewbox.height;
      
      // The x values are the x intercept.
      x1 = c;
      x2 = c;

    } else {

      // If the line is steep then use the y's as inputs.
      if (Math.abs(m) > 1) {
        
      // The y values are just the top and bottom of the viewbox.
      y1 = svg_params.viewbox.miny;
      y2 = svg_params.viewbox.miny + svg_params.viewbox.height;
        
        // x = (y - c) / m
        x1 = (y1 - c) / m;
        x2 = (y2 - c) / m;
      
      } else {
        
        // The x values are the left and right of the viewbox.
        x1 = svg_params.viewbox.minx;
        x2 = svg_params.viewbox.minx + svg_params.viewbox.width;
        
        // y = mx + c
        y1 = (m * x1) + c;
        y2 = (m * x2) + c;
    
      }
    }

    // Return the extreme line points.
    return {x1, x2, y1, y2};
  }

  // Centre and radius of a circle from two points in an array.
  function centre_and_radius(p1, p2) {
  
    // Calculate radius.
    let a = p2.x - p1.x;
    let b = p2.y - p1.y;
    let r = Math.sqrt(a * a + b * b);

    // Return the circle parameters for the SVG element.
    return {cx: p1.x, cy: p1.y, r};

  }


  /***************************************************************************
   * Painting the ponts, lines, and circles.
  ***************************************************************************/

  function paint_circle(circle) {

    // Get the centre and point.
    let centre = cons.filter(obj => obj.label == circle.centre)[0];
    let point = cons.filter(obj => obj.label == circle.point)[0];

    let circle_svg = centre_and_radius(centre, point);
    
    // Draw the circle.
    vis.append('circle')
       .datum(circle)
       .attr('class', 'circle')
       .attr('cx', circle_svg.cx)
       .attr('cy', circle_svg.cy)
       .attr('r', circle_svg.r)
       .attr('stroke-width', thickness)
       .attr('stroke-dasharray', dashes);

  }

  function paint_line(line) {
    
    // Get the points with the labels in line.
    let point1 = cons.filter(obj => obj.label == line.point1)[0];
    let point2 = cons.filter(obj => obj.label == line.point2)[0];
    
    // Calculate the SVG parameters.
    let line_svg = extreme_points(point1, point2);
    
    // Draw the line.
    vis.append('line')
       .datum(line)
       .attr('class', 'line')
       .attr('x1', line_svg.x1)
       .attr('y1', line_svg.y1)
       .attr('x2', line_svg.x2)
       .attr('y2', line_svg.y2)
       .attr('stroke-width', thickness)
       .attr('stroke-dasharray', dashes);

  }

  function paint_point(point) {
    
    // Group the point and the label.
    let g = vis.append('g')
               .datum(point)
               .classed('point_group', true)
               .classed('point_inactive', true)
               .attr('transform', `translate(${point.x},${point.y})`);

    // Draw the point.
    g.append('circle')
     .classed('point', true)
     .attr('r', dotradius);
  
    // Draw the labels.
    g.append('text')
     .attr('dx', point.labelx)
     .attr('dy', point.labely)
     .classed('label', true)
     .attr('font-size', labelfontsize)
     .text(point.label);

  }

  function repaint() {
    d3.selectAll("svg > *").remove();

    for (const shape of cons) {
      switch (shape.type) {
        case 'point':
          paint_point(shape);
          break;
        case 'line':
          paint_line(shape);
          break;
        case 'circle':
          paint_circle(shape);
          break;
      }
    }
    raise_points();
    interactions();
  }

  function paint(shape) {
    switch (shape.type) {
      case 'point':
        paint_point(shape);
        break;
      case 'line':
        paint_line(shape);
        break;
      case 'circle':
        paint_circle(shape);
        break;
    }
    raise_points();
    interactions();
  }

  function raise_points() {
    d3.selectAll('.point_group').raise();
  }


  /***************************************************************************
   * Interactions.
  ***************************************************************************/
  // The already selected point (null if none).
  let point1 = null;
  // The possible modes (css classes).
  let modes = ['point_inactive', 'point_active_line', 'point_active_circle'];
  // The current mode.
  let mode = 0;

  function interactions() {
    vis.selectAll('.point_group')
       .on('click', function(e, d) {
         if (point1 == null || point1 == d.label) {
           // Store this as the first point.
           point1 = d.label;
           // Demode.
           d3.select(this).classed(`${modes[mode]}`, false);
           // Change mode.
           mode = (mode + 1) % modes.length;
           // Remode.
           d3.select(this).classed(`${modes[mode]}`, true);
         } else {
           // The shape to be drawn. 
           let shape;
           // Get this point.
           let point2 = d.label;
           // Mode 1 is a line.
           if (mode === 1) {
             shape = {type: 'line', point1, point2};
           // Mode 2 is a circle.
           } else if (mode === 2) {
             shape = {type: 'circle', centre: point1, point: point2};
           }
           // Push the shape to the shape list.
           cons.push(shape);
           // Paint the shape.
           paint(shape);
           // Clear the first point.
           point1 = null;
           // Demode.
           d3.selectAll('.point_group').classed(`${modes[mode]}`, false);
           // Reset the mode to zero.
           mode = 0;
           // Remode.
           d3.selectAll('.point_group').classed(`${modes[mode]}`, true);
         }
       });
  }


  // Start the show.
  repaint();
  
// })(this);