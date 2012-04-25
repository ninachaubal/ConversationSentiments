import pbox2d.*;
import org.jbox2d.collision.shapes.*;
import org.jbox2d.common.*;
import org.jbox2d.dynamics.*;
import com.ning.http.client.*;
import java.util.concurrent.Future;

int width = 800;
int height = 800;

//stream vars
int lastSentiment = -1;

//sentiment buffer
var sentimentBuffer = [];

//table 
var table;

/*
positions
0---------1
|         |
|         |
|         |
3---------2
*/
var positions = [{x:25,y:25},{x:width-25,y:25},{x:width-25,y:height-25},{x:25,y:height-25}];

var textPositions = [{x:25,y:25},{x:width-25,y:25},{x:width-25,y:height-25},{x:25,y:height-25}];
                 
int diam = 40;


// A reference to our box2d world
PBox2D box2d;

// A list for all of our rectangles
ArrayList<Circle> circles;

void setup(){
    size(width,height);
    smooth();
    
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
    for(var i in table){
        var r = parseInt(table[i].color.substring(1,3),16);
        var g = parseInt(table[i].color.substring(3,5),16);
        var b = parseInt(table[i].color.substring(5,7),16);
        fill(r,g,b);
        ellipse(positions[i].x,positions[i].y, diam, diam);
    }
    while(sentimentBuffer.length>0){
        var sentiment = sentimentBuffer.pop();
        var r = parseInt(sentiment.color.substring(1,3),16);
        var g = parseInt(sentiment.color.substring(3,5),16);
        var b = parseInt(sentiment.color.substring(5,7),16);
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
    //table
    AsyncHttpClient tableClient = new AsyncHttpClient();
    tableClient.prepareGet("http://conversationsentiments.herokuapp.com//table").execute(
        new AsyncCompletionHandler<Response>(){
        
        @Override
        public Response onCompleted(Response response) throws Exception{
            String content = reponse.getResponseBody();
            System.out.println(content);
            return response;
            /*
            table = data;
            */
        };
        
        @Override
        public void onThrowable(Throwable t){
            //do nothing
        }
    });

    //sentiments
    AsyncHttpClient tableClient = new AsyncHttpClient();
    tableClient.prepareGet("http://conversationsentiments.herokuapp.com/sentiments?last="+lastSentiment).execute(
        new AsyncCompletionHandler<Response>(){
        
        @Override
        public Response onCompleted(Response response) throws Exception{
            String content = reponse.getResponseBody();
            System.out.println(content);
            /*
            for(var i in data){
                if(data[i].index > lastSentiment){
                    lastSentiment = data[i].index;
                    sentimentBuffer.push(data[i]);
                }
            }
            */
            return response;
        };
        
        @Override
        public void onThrowable(Throwable t){
            //do nothing
        }
    });
}


void drawText(String txt,float x, float y, float r, float g, float b){
    //placeholder code
    fill(r,g,b);
    text(txt,x,y);
    
    if (random(1) < 0.6) {
        Circle p = new Circle(x, y, r, g, b, rad, 0, 0);
        circles.add(p);
    }  
}

