import pbox2d.*;
import org.jbox2d.collision.shapes.*;
import org.jbox2d.common.*;
import org.jbox2d.dynamics.*;
import org.json.*;

class Sentiment {
    int pos;
    String col;
    String text;
    int index;
    Sentiment(int pos, String col, String text, int index){
        this.pos = pos;
        this.col = col;
        this.text = text;
        this.index = index;
    }
}

class Point {
    int x;
    int y;
    Point(int x, int y){
        this.x = x;
        this.y = y;
    }
}

//stream vars
int lastSentiment = -1;

//sentiment buffer
ArrayList<Sentiment> sentimentBuffer;

/*
positions
0---------1
|         |
|         |
|         |
3---------2
*/
Point[] positions;

Point[] textPositions;      

int diam = 40;


// A reference to our box2d world
PBox2D box2d;

// A list for all of our rectangles
ArrayList<Circle> circles;

void setup(){
    size(600,600);
    smooth();
    
    //Initialize Buffer
    sentimentBuffer = new ArrayList<Sentiment>();
    
    //Positions
    positions = new Point[4];
    positions[0] = new Point(25,25);
    positions[1] = new Point(width-25, 25);
    positions[2] = new Point(width-25,height-25);
    positions[3] = new Point(25, height-25);
    //TODO: change these
    textPositions = new Point[4];
    textPositions[0] = new Point(25,25);
    textPositions[1] = new Point(width-25, 25);
    textPositions[2] = new Point(width-25,height-25);
    textPositions[3] = new Point(25, height-25);
    
    // Initialize box2d physics and create the world
    box2d = new PBox2D(this);
    box2d.createWorld();
    // We are setting a custom gravity
    box2d.setGravity(0, 0);

    // Create ArrayLists	
    circles = new ArrayList<Circle>();
}


void draw(){
    background(30);

    // We must always step through time!
    box2d.step();

    //get updates from server
    update();
    //draw the table
    
    //display sentiments
    while(!sentimentBuffer.isEmpty()){
        Sentiment sentiment = sentimentBuffer.remove(0);
        int r = parseInt(sentiment.col.substring(1,3),16);
        int g = parseInt(sentiment.col.substring(3,5),16);
        int b = parseInt(sentiment.col.substring(5,7),16);
        drawText(sentiment.text,
                 textPositions[sentiment.pos].x,textPositions[sentiment.pos].x,
                 r,g,b);
    }
    
    for (Circle b: circles) {
        b.attract(width/2,height/2);
    }

    rectMode(CENTER);
    stroke(0);
    // Display all the circles
    for (Circle b: circles) {
        b.display();
    }
}

void update(){
    //sentiments
    String sentimentRequest = "http://conversationsentiments.herokuapp.com/sentiments?last="+lastSentiment;
    String sentimentResult = join(loadStrings(sentimentRequest),"");
    try{
        JSONArray sentimentData = new JSONArray(sentimentResult);
        for(int i =0; i < sentimentData.length(); i++){
            JSONObject element = sentimentData.getJSONObject(i);
            if(element.getInt("index") > lastSentiment){
                lastSentiment = element.getInt("index");
                sentimentBuffer.add(new Sentiment(element.getInt("pos"),
                                                  element.getString("color"),
                                                  element.getString("text"),
                                                  element.getInt("index")));
            }
        }
    } catch(JSONException e){
        println("JSON parsing error");
    }        
}


void drawText(String txt,float x, float y, int r, int g, int b){
    //placeholder code
    fill(r,g,b);
    text(txt,x,y);
    
    if (random(1) < 0.6) {
        Circle p = new Circle(x, y, r, g, b, diam/2, 0, 0);
        circles.add(p);
    }  
}

