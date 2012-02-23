# Classimate
## By Are Sundnes @ www.hyper.no

This jQuery plugin lets you make frame based animation using css classes.
Create an individual class for each frame, and initiate with ie:
<pre>$(target).classimate(['class1','class2','class2'],{loop:true,rounds:3,duration:500});</pre>
This code would animate between the three classes with 500ms on each frame, and stopping after 3 rounds.
A class can have any porperty like background image, position, color, border etc.

<pre>
$(target).classimate(['cssClass','cssClass']);	// Animates classes
$().classimate('pause'); 							// Pauses all animations
$().classimate('play'); 							// Starts animations again after pause
$().classimate('fps',25); 							// Overrides default FPS (30)

// All settings:

$(target).classimate(
		[  											// Frames array
			"cssClass",							// Array content can be just a string if you have no frame-specific settings					  
			{										// Or a object if you also want other frame-specific settings than just the cssClass
				cssClass:"cssClass",				// Class must be supplied with name of the frame class		
				duration: 1000,						// Duration in ms for this frame
				action: function(object){}			// Function to run on this frame
			}
		],

		{  	// Settings object
		loop: true, 								// Setting to false will only play animation once
		rounds: false, 								// Number of rounds to loop. Setting to false loops forever. (If loop is true)
		duration: 1000, 							// Default duration for every frame in animation - can be overriden on individual frames
		hold: false, 								// If the last frame of the animation should stay when animation is finished

		complete: function(object){}, 				// Function to run when animation is completed
		onLoop: function(object){}, 				// Function to run when animation is looped
		frame: function(object,frameNumber){} 		// Function to run when changing frame in animation				
});
</pre>