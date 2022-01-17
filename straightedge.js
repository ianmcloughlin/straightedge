
// (function() {

  /***************************************************************************
   * Parameters and preliminaries for display.
  ***************************************************************************/

  // Number of of SVG units between 0 and 1.
  const unit = 100;

  // Line thickness.
  const thickness = 1;
  
  // Line dashes.
  const dashes = 14;
  
  // Radius of a point.
  const dotradius = 5;
  
  // Label font size.
  const labelfontsize = 14;

  // Toolbar size.
  const tb = 30;

  // Circle mode is false, line mode is true.
  let ui_mode = true;

  // SVG viewbox.
  let viewbox = [-400, -400, 800, 800];

  // Find the drawing svg.
  let vis = d3.select('.plane')
              .attr('viewBox', viewbox.join(' '))
              .attr('preserveAspectRatio', 'xMinYMin meet');


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
      y1 = viewbox[1];
      y2 = viewbox[1] + viewbox[3];
      
      // The x values are the x intercept.
      x1 = c;
      x2 = c;

    } else {

      // If the line is steep then use the y's as inputs.
      if (Math.abs(m) > 1) {
        
        // The y values are the top and bottom of the viewbox.
        y1 = viewbox[1];
        y2 = viewbox[1] + viewbox[3];
        
        // x = (y - c) / m
        x1 = (y1 - c) / m;
        x2 = (y2 - c) / m;
      
      } else {
        
        // The x values are the left and right of the viewbox.
        x1 = viewbox[0];
        x2 = viewbox[0] + viewbox[2];
        
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
   * Initial ponts, lines, and circles.
  ***************************************************************************/
  let cons = {
    // Constructed points.
    points: [
      {
        label: '0'
        , x: 0
        , y: 0
        , labelx: -15
        , labely: 15
      }, 
      {
        label: '1'
        , x: 100
        , y: 0
        , labelx: -15
        , labely: 15
      }, 
      {
        label: '2'
        , x: 200
        , y: 0
        , labelx: -15
        , labely: 15
      },
      {
        label: 'A'
        , x: 100
        , y: 100
        , labelx: -15
        , labely: 15
      },
      {
        label: 'B'
        , x: 200
        , y: -100
        , labelx: -15
        , labely: 15
      },
    ],
  
    // Constructed lines.
    lines: [
      ['0', '1'],
      ['0', 'A'],
      ['1', 'B'],
    ],

    // Constructed circles.
    circles: [
      ['1', '0'],
      ['0', '1']
    ],
  };

  /***************************************************************************
   * Painting the ponts, lines, and circles.
  ***************************************************************************/

  function paint_circles() {
    
    // Calculate the SVG circles from the circles.
    let svg_circles = cons.circles.map(circle => {
    
      // Get the points with the labels in line.
      let p1 = cons.points.filter(obj => obj.label == circle[0])[0];
      let p2 = cons.points.filter(obj => obj.label == circle[1])[0];
    
      // Calculate the radius and centre.
      return centre_and_radius(p1, p2);
    
    });

    // Draw the circles.
    vis.selectAll('.circle')
       .data(svg_circles)
       .enter()
       .append('circle')
       .attr('class', 'circle')
       .attr('cx', d => d.cx)
       .attr('cy', d => d.cy)
       .attr('r', d => d.r)
       .attr('stroke-width', thickness)
       .attr('stroke-dasharray', dashes);

  }

  function paint_lines() {
    // Calculate the SVG circles from the circles.
    
    let svg_lines = cons.lines.map(line => {
    
      // Get the points with the labels in line.
      let p1 = cons.points.filter(obj => obj.label == line[0])[0];
      let p2 = cons.points.filter(obj => obj.label == line[1])[0];
    
      // Calculate the extreme points.
      return extreme_points(p1, p2);
    
    });

    // Draw the lines.
    vis.selectAll('.line')
       .data(svg_lines)
       .enter()
       .append('line')
       .attr('class', 'line')
       .attr('x1', d => d.x1)
       .attr('y1', d => d.y1)
       .attr('x2', d => d.x2)
       .attr('y2', d => d.y2)
       .attr('stroke-width', thickness)
       .attr('stroke-dasharray', dashes); 
  }

  function paint_points() {
    
    // Group the points and the labels.
    let gs = vis.selectAll('.point')
                .data(cons.points)
                .enter()
                .append('g')
                .attr('transform', d => `translate(${d.x},${d.y})`);

    // Draw the points.
    gs.append('circle')
      .attr('class', 'point point_inactive')
      .attr('r', dotradius);
  
    // Draw the labels.
    gs.append('text')
      .attr('dx', d => d.labelx)
      .attr('dy', d => d.labely)
      .attr('class', 'label')
      .attr('font-size', labelfontsize)
      .text(d => d.label);

  }

  function paint() {
    d3.selectAll("svg > *").remove();
    paint_circles();
    paint_lines();
    paint_points();
    interactions();
  }



  /***************************************************************************
   * Interactions.
  ***************************************************************************/
  let first_point = null;
  let modes = ['point_inactive', 'point_active_line', 'point_active_circle'];
  let mode = 0;

  function interactions() {
    vis.selectAll('.point')
       .on('click', function(e, d) {
        if (first_point == null || first_point == d.label) {
          console.log("YES");
          // Store this as the first point.
          first_point = d.label;
          // Demode.
          d3.select(this).classed(`${modes[mode]}`, false);
          // Remode.
          mode = (mode + 1) % modes.length;
          // Class it as active.
          d3.select(this).classed(`${modes[mode]}`, true);
        } else {
          console.log("YES");
          // Get this point.
          let second_point = d.label;
          if (mode === 1) {
            cons.lines.push([first_point, second_point]);
          } else if (mode === 2) {
            cons.circles.push([first_point, second_point]);
          }
          first_point = null;
          paint();
        }

       });


  }


  // Start the show.
  paint();
  
// })(this);