/*
* Classimate 1.0 - Created by Are Sundnes @ www.hyper.no
*
*
* This plugin lets you make frame based animation using css classes.
* Create an individual class for each frame, and initiate with ie:
* 
*  $(target).classimate(['class1','class2','class2'],{loop:true,rounds:3,duration:500});
*
* This code would animate between the three classes with 500ms on each frame, and stopping after 3 rounds.
* 
* A class can have any porperty like background image, position, color, border etc.
*
* ------

$().classimate('pause'); 							// Pauses all animations
$().classimate('play'); 							// Pauses all animations
$().classimate('fps',25); 							// Overrides default FPS (30)
$(target).classimate(['class1','class2']);			// Animates classes

*
* With settings:

$(target).classimate(
		[  											// Frames array
			"class1",								// Array content can be just a string if you have no frame-specific settings					  
			{										// Or a object if you also want other frame-specific settings than just the cssClass
				cssClass:"class2",				// Class must be supplied with name of the frame class		
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

*/

(function( $ ){
	var settings = {
			fps: 30	 // Frame rate of animation. Can be changed by setting $().classimate('fps',24);
	}
	var interval;
	var init = false;
	var classimated = [];
	var presets = {};	
	
	var methods = {		
		setAnimation : function($frames,$settings) {
			return this.each(function(){
				$this = $(this);				
				deleteAnimation($this);	
				if($frames) {
					$this.data("classimate",{});
					var d = $this.data("classimate");
					if(!d.animation) classimated.push($this);
					if(!$settings) $settings = {};
				
					d.animation = $.extend({
						duration: 1000,
						loop: true,
						rounds: false,
						complete: false,
						frame: false,
						onLoop: false,
						hold: false					
					},$settings);
					d.animation.frames = $frames;	
					setFrame($this);	
				}							
			});
		},
		
		preset : function($name,$settings){
			if(presets[$name]) {
				if(!$settings) $settings = {};
				var p = [];
				p.push(presets[$name][0]);
				p.push($.extend(presets[$name][1],$settings));
				
				return methods['setAnimation'].apply( this, p);		
				
			} else {
				pause();
				$.error( 'Stopping: Preset ' +  $name + ' does not exist in Classimate' );
			}
		},
		
		addPreset : function($name,$frames,$settings){
			presets[$name] = [$frames,$settings];
		},

		pause : function() {
			pause();
		},
		
		start : function() {
			play();
			return this;
		},
		
		fps : function(fps) {
			if(fps) {
				pause();
				settings.fps = fps;
				play();
				return this;								
			} else return settings.fps;


		}			
	
		
	 }

	$.fn.classimate = function(method) {  
		if(!init) initClassimate();

		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    	} else if ( typeof method === 'object' || ! method ) {
			return methods.setAnimation.apply( this, arguments );
		} else {
			pause();
			$.error( 'Stopping: Method ' +  method + ' does not exist on jQuery.classimate' );
		}  
	};

	var initClassimate = function( options ) {			
		init = true;
		play();				                  
     }
  
	var frame = function() {
	
		for(var x in classimated) {
			setFrame(classimated[x]);
		}
	}	
	
	var setFrame = function(o) {
			if(!o || !o.data() || !o.data('classimate')) return;
			var d = o.data('classimate');
			var a = d.animation;
			
			if(!a.started) {
				a.started = true;
				a.currentFrame = 0;
				a.currentLength = 0;
				a.hasRounds = 1;
				a.currentDuration = 0;
			}
			

			if(a.currentFrame>=a.frames.length) {
				if(a.loop && (!a.rounds || a.hasRounds<a.rounds)) {
					if(a.rounds) a.hasRounds++;
					a.currentFrame = 0;
					if(a.onLoop) a.onLoop(o);
				} else {
					a.currentFrame--;
					a.ended = true;		
				}
			}
			
			
			if(!a.lastTime || new Date().getTime()>a.lastTime+a.currentDuration) {
				if(a.ended) {
					deleteAnimation(o,a.hold);			
					if(a.complete) a.complete(o);					
				} else {
					if(typeof a.frames[a.currentFrame] === "string") a.frames[a.currentFrame] = {cssClass:a.frames[a.currentFrame]}
										
					if(!a.frames[a.currentFrame].cssClass) {
						pause();
						$.error( 'Stopping: No class set for frame ' +  a.currentFrame + ' in Classimate' );
					} else {
						a.lastTime = new Date().getTime();
						if(a.lastClass) o.removeClass(a.lastClass);
						a.lastClass = a.frames[a.currentFrame].cssClass;
						o.addClass(a.lastClass);	
						a.currentDuration = (a.frames[a.currentFrame].duration) ? a.frames[a.currentFrame].duration : a.duration					

						if(a.frames[a.currentFrame].action) a.frames[a.currentFrame].action(o);	
						if(a.frame) a.frame(o,a.currentFrame);							

						a.currentFrame++;										
					}
				}
			}
				

	}
	
	var deleteAnimation = function(o,hold) {
		var d = o.data("classimate");
		if(d && d.animation) {	
			for(x in classimated) if($(classimated[x]).is(o)) classimated = classimated.splice(x,0);
			if(!hold) o.removeClass(d.animation.lastClass);
			o.data("classimate",false);
		}		
	}
	
	var pause = function() {
		if(interval) clearInterval(interval);
	}
	
	var play = function(fps) {
		if(fps) settings.fps = fps;
		var i = 1000/settings.fps;
		interval = setInterval(frame,i);
	}
	

	



})( jQuery );