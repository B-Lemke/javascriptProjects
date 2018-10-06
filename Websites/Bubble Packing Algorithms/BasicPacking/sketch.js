/*Broderick Lemke, 2018 */

//set width and height
var w = 600;
var h = 400;


//create an array of the bubbles
var bubbles = [];

var maxBubs = 2000; //just to stop it from adding too many bubbles

function setup() {

  createCanvas(w, h);
  background(50);
  //no outlines on circles
  stroke(255);
  noFill();
}


function draw() {
  background(50);
  frameRate(60);

  //number of bubbles to create each frame
  var numBubbles = 10;
  var count = 0; //total number of bubbles added this frame so far
  var attempts = 0; //number of times createBubble() has returned null, aka there wasn't a space for a new bubble

  //while count is less that number of bubbles, add a new bubble to the bubbles array.
  while (count<numBubbles){

    var result = createBubble();
    //create a new bubble

    if (result !== null){
      //if bubble is valid, add it to the array bubbles
    bubbles.push(result);
    count++;
    }
    else {
      //if not a valid bubble, up the attempts counter.
      attempts++;
    }

    if (attempts > 10000||bubbles.length>maxBubs){
      //exit condition if it can't find a place for another bubbles, however many times
      print("No more spots");
      noLoop();
      break;
    }
  }


  for (var i = 0; i < bubbles.length; i++) {
      var currentBubble = bubbles[i];
      //check if the current bubble is touching the edge of the screen, edges returns true if it is
      if(currentBubble.edges()){
        currentBubble.growing = false;
      }

      // start comparing current bubble to every other bubble in the bubbles array
      for (var j = 0; j <bubbles.length; j++) {
        //don't compary with itself
        if (i != j){
          var other = bubbles[j]; //temporary holding for the comparrison bubble
          var d = dist(currentBubble.x, currentBubble.y, other.x, other.y); //distance between the bubbles

          //distance between two touching circles is their radii
          var maxdist = currentBubble.r + other.r;

          if (d< maxdist) {
            //if the bubbles are too close, stop current from growing, the other bubble will stop when it is its turn too.
            currentBubble.growing = false;
            break;
          }
        }
      }

      //grow the bubbles out one pixel and draw to the screen
      currentBubble.grow();
      currentBubble.show();
  }

}

function bubble(){



  this.edges = function(){
    //if bubble is touching the edge, return true
    return (this.y + this.r >= h || this.y - this.r <= 0 || this.x + this.r >= w || this.x - this.r <=0)
  }


  this.grow = function() {
    //if bubble is still growing, add 0.5 to the radius
    if(this.growing){
      this.r+= 0.5;}
  }

  this.show = function() {
    //draw the bubbles
    ellipse(this.x ,this.y, this.r*2, this.r*2);
  }

  this.setup = function(x_, y_, r_){
    //Set this bubble's w y and r from the createBubble function
    this.x = x_;
    this.y = y_;
    this.r = r_;

    //bubble starts off growing
    this.growing = true;
  }

}

function createBubble() {
  //This function creates an x,y, and r value for a bubble. It will check if it is overlapping with another bubble already in existence. It returns null if it overlaps, it returns the new bubble object (already setup)
  x = floor(random(w));
  y = floor(random(h));
  //starting radius of the bubble will be random number
  r = floor(random(10));

  var valid = true;

  for (var i = 0; i < bubbles.length; i++) {
    var checkBub = bubbles[i];

    //find how far out the bubble goes
    var distance = dist(x, y, checkBub.x, checkBub.y);

    //If the distance between the random x,y and the bubble is less than the radius, this is not a valid bubble
    if (distance < checkBub.r + r){
      valid = false;
    }

  }

  //use overlapping result
  if (valid){
    //if bubble is not overlapping
    var newBubble = new bubble;
    newBubble.setup(x,y,r);
    return newBubble;
  } else if (!valid) {
    //if bubble is overlapping, return null
    return null;
  }
}
