import pbox2d.*;
import org.jbox2d.collision.shapes.*;
import org.jbox2d.common.*;
import org.jbox2d.dynamics.*;

// A reference to our box2d world
PBox2D box2d;

// A list we'll use to track fixed objects
ArrayList<Boundary> boundaries;
// A list for all of our rectangles
ArrayList<Circle> circles;

void setup() {
  size(1000,1000);
  smooth();

  // Initialize box2d physics and create the world
  box2d = new PBox2D(this);
  box2d.createWorld();
  // We are setting a custom gravity
  box2d.setGravity(0, 0);

  // Create ArrayLists	
  circles = new ArrayList<Circle>();
  boundaries = new ArrayList<Boundary>();

  // Add a bunch of fixed boundaries
  //boundaries.add(new Boundary(300,0,500,5));
  //boundaries.add(new Boundary(3*width/4,height-50,width/2-50,10));
}

void draw() {
  background(30);

  // We must always step through time!
  box2d.step();

/*
  if (mousePressed) {
    for (Circle b: circles) {
     b.attract(mouseX,mouseY);
    }
  }
*/




  addCircle(0+(int) random(0,200), 0+(int) random(0,width), (int) random(100,200), 0, (int) random(100,200), (int) random(2,5)); //4,10
  addCircle(width-(int) random(0,200), height-(int) random(0,width), 0, (int) random(100,160), (int) random(100,200), (int) random(2,5));
  addCircle(0+(int) random(0,height), height-(int) random(0,200), (int) random(240,255), (int) random(80,190), 0, (int) random(2,5));
  addCircle(width-(int) random(0,height), 0+(int) random(0,200), (int) random(100,200), (int) random(100,200), 0, (int) random(2,5));



for (Circle b: circles) {
      b.attract(width/2,height/2);
    }

rectMode(CENTER);
stroke(0);
  // Display all the circles
  for (Circle b: circles) {
    b.display();
  }

  // circles that leave the screen, we delete them
  // (note they have to be deleted from both the box2d world and our list
  /*
  for (int i = circles.size()-1; i >= 0; i--) {
    Circle b = circles.get(i);
    if (b.done()) {
      circles.remove(i);
    }
  }
  */
  
}

void addCircle(int x, int y, int r, int g, int b, int rad){
    // circles fall from the top every so often
  if (random(1) < 0.6) {
    Circle p = new Circle(x, y, r, g, b, rad, 0, 0); //source position: x,y; color: r, g, b; radius; xvel, yvel 
    circles.add(p);
  }  
}


