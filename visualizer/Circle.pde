// The Nature of Code
// <http://www.shiffman.net/teaching/nature>
// Spring 2010
// PBox2D example

// A rectangular circle
class Circle {

  // We need to keep track of a Body and a width and height
  Body body;
  float rad;
  int r, g, b, xvel, yvel, statCount, killCount;
  boolean isStatic, isKill;
  Vec2 currPos;
  // Constructor
  Circle(float x, float y, int newR, int newG, int newB, float newRad, int newXvel, int newYvel) {
    rad=newRad;
    r=newR;
    g=newG;
    b=newB;
    xvel = newXvel;
    yvel = newYvel;
    isStatic = false;
    statCount=0;
    killCount =0;
    // Add the box to the box2d world
    makeBody(new Vec2(x, y), rad);
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
    if(!isStatic){
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
  }



  // Drawing the circle and killing and stuff
  void display() {
    

      // We look at each body and get its screen position
    if(!isKill) currPos = box2d.getBodyPixelCoord(body);

    //if(!isKill){   //NOTE: uncomment this conditional if you wanna see how only pbox2d performs 
      fill(r,g,b);
      ellipse(currPos.x, currPos.y, rad*2, rad*2);
    //}
    
    if(!isKill){
      if(!isStatic){
        Vec2 vel = body.getLinearVelocity();
        float x_vel = vel.x;
        float y_vel = vel.y;
        if((x_vel*x_vel+y_vel*y_vel) < 4) {
          //NOTE: make <60 into <60000 if you never wanna go into optimized mode (awesome server and shit)
          if(statCount<60) {statCount++;} else {makeBodyStatic(currPos,rad); isStatic = true;}
        }
      } 
      else{
        if(killCount<5*sqrt((currPos.x-width/2)*(currPos.x-width/2)+(currPos.y-height/2)*(currPos.y-height/2)) ) {killCount++;} else {box2d.destroyBody(body); isKill=true;}       
      }
    }
    
  }

  // This function adds the rectangle to the box2d world
  void makeBody(Vec2 center, float rad_) {
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


  // This function converts body to static
  void makeBodyStatic(Vec2 center, float rad_) {
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
}
