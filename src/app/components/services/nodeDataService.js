(function() {
	'use strict';

	angular.module('awkwardAnnie')
		.service('nodeDataService', nodeDataService);

	/** @ngInject */
	function nodeDataService($log, userGameInfo) {//levelDataHandler,
		// console.log(testNewStructure);

		function DialogNode(data){
	    	this.parent = null;
	        this.children = {};
	        this.isRoot = true;
	        this.score = 0;
			this.currentScore = 0;
	        if (data != null) { //if it is not the root node then add all the properties
				angular.extend(this, {
		            pcText: data.PC_Text,
		            npcText: data.NPC_Response,
		          	negative: data.negative,
		          	positive: data.positive,
					animation:  userGameInfo.isGamePositive() ? data.positive.animation : data.negative.animation
				});

	          	this.isRoot = false;
	          	this.code = data.code; //what we will use to triverse the tree
	          	if (data.code==='CCCC') {
	          		$log.log('CCCC node',this);
	          		$log.log(userGameInfo.isGamePositive());
	          	}
	          	this.choiceCode = data.code[data.code.length - 1];
	    	}
		}//end of constuctor

	    var pnt = DialogNode.prototype;

	    pnt.addChild = function(childNode){
	      this.children[childNode.choiceCode] = childNode;
	    };

	    function DialogTree(nodeArray, scoringData) {
      		// do some stuff...
      		this.setupTree(nodeArray, scoringData);
    	}

		var pt = DialogTree.prototype;

		pt.findParent = function(code) {
			if (code) {
	    		return this.nodeDict[code.substr(0, code.length - 1)];
	    	} else {
	    		return null;
	    	}
    	};

	    pt.setupTree = function(nodeArray, scoringData) {
	    	
	    	function isNotANumb(n) {
	    		if (typeof(n)==='string') {n=n.trim();}
	    		return (n==='' || isNaN(n))
	    	}

	    	var i;
	      	this.rootNode = new DialogNode(null);
	      	this.rootNode.code = "";
	      	this.nodeDict = {
	        	'': this.rootNode
	     	};

		    var that = this;

		    nodeArray.forEach(function(data) {
	        	var node = new DialogNode(data);
	        	that.nodeDict[node.code] = node;
	      	});

	    	angular.forEach(this.nodeDict, function(node, nodeCode) {
	    		if (node===that.rootNode) {
	    			$log.log('parsing root node', that.findParent(node.code));
	    		}
		        var parent = that.findParent(node.code);
		        if (parent) {
			        node.parent = parent;
			        parent.addChild(node);
		        } else if (node !== that.rootNode) {
		        	$log.error('something is wrong!!! this implies that node "'+nodeCode+'" has no parent (so probably an author error)');
		        }
		    });

	    	// now can find the 'leaves' of the tree... //// this right here image refrence!
	    	angular.forEach(this.nodeDict, function(node, nodeCode) {
	    		if (Object.keys(node.children).length===0) {
	    			// this is a leaf

	    			if (isNotANumb(node.negative.score)) {
	    				node.negative.score = 0;
	    				for (i=0; i<node.code.length; i++) {
		    				node.negative.score+= scoringData.negative[node.code[i]];
	    				}
	    			}
	    			if (node.negative.success !== 0 && node.negative.success !== 1) {
	    				node.negative.success = (node.negative.score/node.code.length>=scoringData.negative.successThreshold ? 1 : 0);
	    			}
	    			
	    			if (isNotANumb(node.positive.score)) {
	    				node.positive.score = 0;
	    				for (i=0; i<node.code.length; i++) {
		    				node.positive.score+= scoringData.positive[node.code[i]];
	    				}
	    			}
    				if (nodeCode==='CCCC') {
    					$log.log('CCCC-----');
    					$log.log(node.positive);
    					$log.log(node.negative);
    				}
	    			if (node.positive.success !== 0 && node.positive.success !== 1) {
	    				node.positive.success = (node.positive.score/node.code.length>=scoringData.positive.successThreshold ? 1 : 0);
	    			}

	    			if (userGameInfo.isGamePositive()) {
	    				node.score = node.positive.score;
	    				node.success = (node.positive.success==1);
	    			} else {
	    				node.score = node.negative.score;
	    				node.success = (node.negative.success==1);
	    			}



			      //   // for now, grab this from the existing parse via levelDataHandler
						// 	console.log("testing: ", levelDataHandler.successPaths.indexOf(nodeCode) ); //gives - 1  i.e. false - i.e. does not exusut in the sucsess paths - got it!
			      //   if (levelDataHandler.successPaths.indexOf(nodeCode)>=0) { 								//liner will always be false ? because the new path is not a sucsess path ( xxxxxx)
						// 		console.log("this was true!");
			      //   	node.success = true;
			      //   } else {
						// 		node.success = false; // it is undefined but for testing purposes so I can see it better
						// 	}
			      //   node.score = 0;
			      //   for (var i=0; i<nodeCode.length; i++) {
			      //   	node.score += levelDataHandler.choiceScores[nodeCode[i]]; // i sthis in place of scores
						// 		node.currentScore  += node.score ;
						// 		console.log("Valueees"+ node.currentScore);
            //
            //
			      //   }
	    		}
	    	});

	    };

		var service = {
	       dialogTrees : {},
	       parseNewStructure: parseNewStructure,
	       parseFromDialogTree: parseFromDialogTree
		};

	    return service;

	    function parseFromDialogTree(dialogKey) {
	        return dialogService.getDialogs(dialogKey).then(function(oldStyleContent){
	          // console.log(oldStyleContent);
	          var newStyleContent = changeIntoArray(oldStyleContent);
	          // console.log(newStyleContent);
	          console.log(parseNewStructure(newStyleContent));
	          return parseNewStructure(newStyleContent);
	        });
	    }

	    function parseNewStructure(nodeArray, scoringData) {
	        var testTree = new DialogTree(nodeArray, scoringData);

	        return testTree;
	    }

		function changeIntoArray(obj){
		  var resultArray = [];
		  for ( var key in obj){ //looping through main keys
		    if(Array.isArray( obj[key])){ //child is an array
		      loopAndAdd(obj[key], resultArray);
		    }
		    else {
		      for( var key2 in obj[key]){
		        var newKey = obj[key];
		        loopAndAdd(newKey[key2], resultArray);

		      }
		    }
		  }
		  return resultArray;
		}

		function loopAndAdd (arr, resultArray){
			for (var i = 0; i < arr.length; i++) {
				resultArray.push(arr[i]);
			}
		}

	} //end of service


})();
