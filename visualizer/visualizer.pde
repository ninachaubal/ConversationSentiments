import pbox2d.*;
import org.jbox2d.collision.shapes.*;
import org.jbox2d.common.*;
import org.jbox2d.dynamics.*;
import org.json.*;

class Sentiment {
    int pos;
    String[] col;
    String text;
    int index;
    Sentiment(int pos, String[] col, String text, int index){
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

Point[] textPositions;      

// A reference to our box2d world
PBox2D box2d;

// A list for all of our rectangles
ArrayList<Circle> circles;

PFont myFont;

void setup(){
    size(600,600);
    smooth();
    
    myFont = createFont("ARLRDBD.TTF", 13);
    
    //Initialize Buffer
    sentimentBuffer = new ArrayList<Sentiment>();
    
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

    //display sentiments
    while(!sentimentBuffer.isEmpty()){
        Sentiment sentiment = sentimentBuffer.remove(0);
        addText(sentiment.text,
                 textPositions[sentiment.pos].x,textPositions[sentiment.pos].x,
                 sentiment.col);
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
    
    // circles that leave the screen, we delete them
    // (note they have to be deleted from both the box2d world and our list
    for (int i = circles.size()-1; i >= 0; i--) {
        Circle b = circles.get(i);
        if (b.done()) {
            circles.remove(i);
        }
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
                JSONArray colorArr = element.getJSONArray("color");
                String[] colorStrs = new String[colorArr.length()];
                for(int j = 0; j < colorArr.length(); j++){
                    colorStrs[i] = colorArr.getString(i);
                }
                sentimentBuffer.add(new Sentiment(element.getInt("pos"),
                                                  colorStrs,
                                                  element.getString("text"),
                                                  element.getInt("index")));
            }
        }
    } catch(JSONException e){
        println("JSON parsing error");
    }        
}


void addText(String txt,int x, int y, String[] col){

    for(int i = 0; i < txt.length(); i++){
        int[] rgb = strToRgb(col[i]);
        Circle p = new Circle(x, y + (int) random(0,10),
                              rgb[0], rgb[1], rgb[2],
                              (int) random(5,7), 0, 0,
                              txt.charAt(i));
        circles.add(p);
    } 
}

int[] strToRgb(String s){
    int[] ret = new int[3];
    ret[0] = parseInt(s.substring(1,3),16);
    ret[1] = parseInt(s.substring(3,5),16);
    ret[2] = parseInt(s.substring(5,7),16);
    return ret;
}
