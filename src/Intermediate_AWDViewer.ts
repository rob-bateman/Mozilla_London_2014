/*

AWD file loading example in Away3d

Demonstrates:

How to use the Loader object to load an embedded internal awd model.

Code by Rob Bateman
rob@infiniteturtles.co.uk
http://www.infiniteturtles.co.uk

This code is distributed under the MIT License

Copyright (c) The Away Foundation http://www.theawayfoundation.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import AssetType					= require("awayjs-core/lib/library/AssetType");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import Keyboard						= require("awayjs-core/lib/ui/Keyboard");
import PerspectiveProjection		= require("awayjs-core/lib/projections/PerspectiveProjection");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import Loader						= require("awayjs-display/lib/containers/Loader");
import View							= require("awayjs-display/lib/containers/View");
import HoverController				= require("awayjs-display/lib/controllers/HoverController");

import DefaultRenderer				= require("awayjs-stagegl/lib/render/DefaultRenderer");

import SkeletonAnimator				= require("awayjs-renderergl/lib/animators/SkeletonAnimator");
import SkeletonClipNode				= require("awayjs-renderergl/lib/animators/nodes/SkeletonClipNode");
import CrossfadeTransition			= require("awayjs-renderergl/lib/animators/transitions/CrossfadeTransition");
import AnimationStateEvent			= require("awayjs-renderergl/lib/events/AnimationStateEvent");
import AWDParser					= require("awayjs-renderergl/lib/parsers/AWDParser");

class Intermediate_AWDViewer
{
	
	//engine variables
	private _view:View;
	private _cameraController:HoverController;
	private _animator:SkeletonAnimator;

	private _timer:RequestAnimationFrame;
	private _time:number = 0;

	//navigation
	private _lastPanAngle:number;
	private _lastTiltAngle:number;
	private _lastMouseX:number;
	private _lastMouseY:number;
	private _move:boolean;
	private _stateTransition:CrossfadeTransition = new CrossfadeTransition(0.5);
	private static IDLE_NAME:string = "idle";
	
	/**
	 * Constructor
	 */
	constructor()
	{
		this.init();
	}
	
	/**
	 * Global initialise function
	 */
	private init():void
	{
		this.initEngine();
		this.initObjects();
		this.initListeners();
	}
	
	/**
	 * Initialise the engine
	 */
	private initEngine():void
	{
		//create the view
		this._view = new View(new DefaultRenderer());
		this._view.backgroundColor = 0x333338;
		
		//create custom lens
		this._view.camera.projection = new PerspectiveProjection(70);
		this._view.camera.projection.far = 5000;
		this._view.camera.projection.near = 1;
		
		//setup controller to be used on the camera
		this._cameraController = new HoverController(this._view.camera, null, 0, 0, 150, 10, 90);
		this._cameraController.lookAtPosition = new Vector3D(0,60, 0);
		this._cameraController.tiltAngle = 0;
		this._cameraController.panAngle = 0;
		this._cameraController.minTiltAngle = 5;
		this._cameraController.maxTiltAngle = 60;
		this._cameraController.autoUpdate = false;
	}

	/**
	 * Initialise the scene objects
	 */
	private initObjects():void
	{
		AssetLibrary.enableParser(AWDParser);

		//kickoff asset loading
		var loader:Loader = new Loader();
		loader.addEventListener(AssetEvent.ASSET_COMPLETE, (event:AssetEvent) => this.onAssetComplete(event));

		loader.load(new URLRequest("assets/shambler.awd"));

		this._view.scene.addChild(loader);
	}

	/**
	 * Initialise the listeners
	 */
	private initListeners():void
	{
		window.onresize  = (event) => this.onResize(event);

		document.onmousedown = (event) => this.onMouseDown(event);
		document.onmouseup = (event) => this.onMouseUp(event);
		document.onmousemove = (event) => this.onMouseMove(event);
		document.onmousewheel = (event) => this.onMouseWheel(event);
		document.onkeydown = (event) => this.onKeyDown(event);

		this.onResize();

		this._timer = new RequestAnimationFrame(this.onEnterFrame, this);
		this._timer.start();

	}
	
	/**
	 * loader listener for asset complete events
	 */		
	private onAssetComplete(event:AssetEvent):void
	{
		if (event.asset.assetType == AssetType.ANIMATOR) {
			this._animator = <SkeletonAnimator> event.asset;
			this._animator.play(Intermediate_AWDViewer.IDLE_NAME);
		} else if (event.asset.assetType == AssetType.ANIMATION_NODE) {
			console.log(event.asset.name);
			var node:SkeletonClipNode = <SkeletonClipNode> event.asset;
			
			if (node.name == Intermediate_AWDViewer.IDLE_NAME) {
				node.looping = true;
			} else {
				node.looping = false;
				node.addEventListener(AnimationStateEvent.PLAYBACK_COMPLETE, (event:AnimationStateEvent) => this.onPlaybackComplete(event));
			}
		}
	}
	
	/**
	 * Key down listener for animation
	 */
	private onKeyDown(event:KeyboardEvent):void
	{
		switch (event.keyCode) {
			case Keyboard.NUMBER_1:
				this.playAction("attack01");
				break;
			case Keyboard.NUMBER_2:
				this.playAction("attack02");
				break;
			case Keyboard.NUMBER_3:
				this.playAction("attack03");
				break;
			case Keyboard.NUMBER_4:
				this.playAction("attack04");
				break;
			case Keyboard.NUMBER_5:
				this.playAction("attack05");
		}
	}
	
	private playAction(name:string):void
	{
		this._animator.play(name, this._stateTransition, 0);
	}
	
	private onPlaybackComplete(event:AnimationStateEvent):void
	{
		if (this._animator.activeState != event.animationState)
			return;

		this._animator.play(Intermediate_AWDViewer.IDLE_NAME, this._stateTransition);
	}
	
	/**
	 * Render loop
	 */
	private onEnterFrame(dt:number):void
	{
		this._time += dt;
		
		//update camera controler
		this._cameraController.update();
	
		
		//update view
		this._view.render();
	}

	/**
	 * Mouse down listener for navigation
	 */
	private onMouseDown(event):void
	{
		this._lastPanAngle = this._cameraController.panAngle;
		this._lastTiltAngle = this._cameraController.tiltAngle;
		this._lastMouseX = event.clientX;
		this._lastMouseY = event.clientY;
		this._move = true;
	}

	/**
	 * Mouse up listener for navigation
	 */
	private onMouseUp(event):void
	{
		this._move = false;
	}

	private onMouseMove(event)
	{
		if (this._move) {
			this._cameraController.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
			this._cameraController.tiltAngle = 0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
		}
	}

	/**
	 * Mouse wheel listener for navigation
	 */
	private onMouseWheel(event):void
	{
		this._cameraController.distance -= event.wheelDelta * 5;

		if (this._cameraController.distance < 100)
			this._cameraController.distance = 100;
		else if (this._cameraController.distance > 2000)
			this._cameraController.distance = 2000;
	}

	/**
	 * window listener for resize events
	 */
	private onResize(event = null):void
	{
		this._view.y         = 0;
		this._view.x         = 0;
		this._view.width     = window.innerWidth;
		this._view.height    = window.innerHeight;
	}
}

window.onload = function()
{
	new Intermediate_AWDViewer();
}