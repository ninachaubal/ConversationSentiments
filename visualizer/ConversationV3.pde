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
PFont myFont;

void setup() {
  size(600,600);
  smooth();

  // Initialize box2d physics and create the world
  box2d = new PBox2D(this);
  box2d.createWorld();
  // We are setting a custom gravity
  box2d.setGravity(0, 0);

  // Create ArrayLists	
  circles = new ArrayList<Circle>();
  boundaries = new ArrayList<Boundary>();
  myFont = createFont("ARLRDBD.TTF", 13);

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

for (Circle b: circles) {
     b.attract(width/2,height/2);
    }


  addString(0+(int) random(0,200), 0+(int) random(0,200), (int) random(100,200), 0, (int) random(100,200), (int) random(5,7), "hello"); //9 for static
  addString(width-(int) random(0,200), height-(int) random(0,200), 0, (int) random(100,160), (int) random(100,200), (int) random(5,7), "hello");
  addString(0+(int) random(0,200), height-(int) random(0,200), (int) random(240,255), (int) random(80,190), 0, (int) random(5,7), "hello");
  addString(width-(int) random(0,200), 0+(int) random(0,200), (int) random(100,200), (int) random(100,200), 0, (int) random(5,7), "hello");

  // Display all the boundaries
  for (Boundary wall: boundaries) {
    wall.display();
  }

  // Display all the circles
  for (Circle b: circles) {
    b.display();
  }

  // circles that leave the screen, we delete them
  // (note they have to be deleted from both the box2d world and our list
  for (int i = circles.size()-1; i >= 0; i--) {
    Circle b = circles.get(i);
    if (b.done()) {
      circles.remove(i);
    }
  }
}

void addString(int x, int y, int r, int g, int b, int rad, String input){
    // circles fall from the top every so often
  if (random(1) < 0.02) {                        //NOTE: remove this probability condition when youre using this function
    for(int i =0; i<input.length(); i++){
      Circle p = new Circle(x+i*18, y+(int) random(0,10), r, g, b, rad, 0, 0, input.charAt(i)); //source position: x,y; color: r, g, b; radius; xvel, yvel 
      circles.add(p);
    }
  }  
}


