import java.util.HashMap;

// The Nature of Code
// <http://www.shiffman.net/teaching/nature>
// Spring 2010
// PBox2D example

// A rectangular circle
class Circle {

  // We need to keep track of a Body and a width and height
  Body body;
  float rad;
  int r, g, b, xvel, yvel, initX, initY;
  float startTime;
  boolean dynamic;
  char letter;
  // Constructor
  Circle(int x, int y, int newR, int newG, int newB, float newRad, int newXvel, int newYvel, char newLetter) {
    rad=newRad;
    r=newR;
    g=newG;
    b=newB;
    xvel = newXvel;
    yvel = newYvel;
    initX = x;
    initY = y;
    startTime=millis();
    // Add the box to the box2d world
    makeBody(new Vec2(x, y), rad);
    dynamic = false;
    letter = newLetter;
  }

  // This function removes the particle from the box2d world
  void killBody() {
    box2d.destroyBody(body);
  }

  // Is the particle ready for deletion?
  boolean done() {
    // Let's find the screen position of the particle
    Vec2 pos = box2d.getBodyPixelCoord(body);
    // Is it off the bottom of the screen?
    if ((pos.y > height+2*rad)|(pos.y < -(2*rad))|(pos.x > width+2*rad)|(pos.x < -(2*rad))) {
      killBody();
      return true;
    }
    return false;
  }

  void attract(float x,float y) {
    // From BoxWrap2D example
    Vec2 worldTarget = box2d.coordPixelsToWorld(x,y);   
    Vec2 bodyVec = body.getWorldCenter();
    // First find the vector going from this body to the specified point
    worldTarget.subLocal(bodyVec);
    // Then, scale the vector to the specified force
    worldTarget.normalize();
    worldTarget.mulLocal((float) 50);
    // Now apply it to the body's center of mass.
    body.applyForce(worldTarget, bodyVec);
  }



  // Drawing the circle
  void display() {
    // We look at each body and get its screen position
    Vec2 pos = box2d.getBodyPixelCoord(body);
    // Get its angle of rotation
    float a = body.getAngle();

    rectMode(CENTER);
    pushMatrix();
    translate(pos.x, pos.y);
    rotate(-a);
    //fill(r, g, b);
    stroke(0);
    //ellipse(0, 0, 18, 18);
    if(dynamic!=true){
      fill(r, g, b);
      ellipse(0, 0, 16, 16);
      fill(0);
      textFont(myFont);
      text(letter, -5, 5);
    }
    else {fill(r, g, b); ellipse(0, 0, rad*2, rad*2);}
    popMatrix();
    
    if(dynamic!=true){
      if((millis()-startTime)>2000) {makeBodyDynamic(pos,rad); dynamic = true;}
    }
    
  }

  // This function adds the rectangle to the box2d world
  void makeBody(Vec2 center, float rad_) {

    // Define a polygon (this is what we use for a rectangle)
//    PolygonShape sd = new PolygonShape();
//    float box2dW = box2d.scalarPixelsToWorld(w_/2);
//    float box2dH = box2d.scalarPixelsToWorld(h_/2);
//    sd.setAsBox(box2dW, box2dH);

    CircleShape cs = new CircleShape();
    cs.m_radius = box2d.scalarPixelsToWorld(rad_);

    // Define a fixture
    FixtureDef fd = new FixtureDef();
    fd.shape = cs;
    // Parameters that affect physics
    fd.density = 5;        //1
    fd.friction = 0.5;     //0.3
    fd.restitution = 0.1;  //0.5

    // Define the body and make it from the shape
    BodyDef bd = new BodyDef();
    bd.type = BodyType.STATIC;  //STATIC means wont move
    bd.position.set(box2d.coordPixelsToWorld(center));

    body = box2d.createBody(bd);
    body.createFixture(fd);

    // Give it some initial random velocity
    //body.setLinearVelocity(new Vec2(random(-5, 5), random(2, 5)));
    //body.setAngularVelocity(random(-5, 5));
    body.setLinearVelocity(new Vec2(0,0));
    body.setAngularVelocity(0);
  }


  void makeBodyDynamic(Vec2 center, float rad_) {
    box2d.destroyBody(body);
    //define a circle
    CircleShape cs = new CircleShape();
    cs.m_radius = box2d.scalarPixelsToWorld(rad_);

    // Define a fixture
    FixtureDef fd = new FixtureDef();
    fd.shape = cs;
    // Parameters that affect physics
    fd.density = 5;        //1
    fd.friction = 0.5;     //0.3
    fd.restitution = 0.1;  //0.5

    // Define the body and make it from the shape
    BodyDef bd = new BodyDef();
    bd.type = BodyType.DYNAMIC;  //STATIC means wont move
    bd.position.set(box2d.coordPixelsToWorld(center));

    body = box2d.createBody(bd);
    body.createFixture(fd);

    // Give it some initial random velocity
    //body.setLinearVelocity(new Vec2(random(-5, 5), random(2, 5)));
    //body.setAngularVelocity(random(-5, 5));
    body.setLinearVelocity(new Vec2(0,0));
    body.setAngularVelocity(0);
  }
  
  //returns a HashMap that can be converted to a JSONObject
  HashMap<String,String> getJSON(){
    HashMap<String, String> map = new HashMap <String, String>();
    Vec2 pos = box2d.getBodyPixelCoord(body);
    map.put("x",pos.x); //x coor
    map.put("y",pos.y); //y coord
    map.put("rad",rad); //radius
    map.put("ang",body.getAngle()); //angle of rotation
    if(!dynamic){
        map.put("chr",letter); //char
    } else {
        map.put("chr","");
    }
    map.put("col",getColorString()); //color
    return map;    
  }
  
  String getColorString(){
    String col = "#";
    col += Integer.toString(r,16);
    col += Integer.toString(g,16);
    col += Integer.toString(b,16);
    return col;
  }
}
