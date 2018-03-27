(function() {
  'use strict';
  angular.module('importContent')
    .service('parseAAContentService', parseAAContentService);

  /** @ngInject */
  function parseAAContentService($log, xlsxService, $q, $location, nodeDataService, roomData) {

    var defaultUrl = 'assets/ETS-ConfigSys.xlsx';
    var templatesSample = [];

    var service = {
      parsedDialogContent: {},  //dictionary keyed by dialog key - yeilding objects of the form:
                          // {
                          //  scoring: < scoring data >,
                          //  dialogTree: < tree of dialog text>
                          // }

      levelDataInformation: {},   // dictionary that includes template-<game-name>  - yeilding objects of the form
                                  //  {
                                  //    levels: < structure of the whole level - based on templates >
                                  //    audioSetting: true,
                                  //    display: true ...etc
                                  //  };

      parsedLevelNames:[],

      parseContentFromGameType: parseContentFromGameType,
      getLevelDataForURL:getLevelDataForURL,

      // mostly internal; exposed for testing...
      parseAllSheets: parseAllSheets,

      parseContentFromFile: parseContentFromFile

    };

    return service;

    ///updated section headers - ask if other is used
    function findSectionHeaderswithTarget(sheet, targetValue) {
      var hdrIndexes = [];
      var numRows = xlsxService.findSheetSize(sheet).r;

      for (var r = 0; r < numRows; r++) {
        if (('' + xlsxService.cellValue(sheet, 0, r)).toLowerCase() === targetValue) {
          hdrIndexes.push(r);
        }
      }
      return hdrIndexes;
    } //end of findsectionHeaders

    function utfClean(s) {
      return s.trim();
    }

    function parseDialogSheet(sheet, sheetName) {

      var numRows = xlsxService.findSheetSize(sheet).r;
      var startRow = 0,
        r = 0;
      var dialogTexts = [];
      var scoring = {
        positive: {
          A:5, B:3, C:10, D:0, successThreshold: 3.33
        },
        negative: {
          A:0, B:3, C:5, D:0, successThreshold: 3.33
        }
      };

      var col0;

      var parserState = 'inHeader';

      while (r<numRows) {
        col0 = (xlsxService.cellValue(sheet, 0, r)+'').toLowerCase().split(' ')[0];

        switch(parserState) {

          case 'inHeader':
            if (col0==='outcome') {
              parserState = 'inScoring';
            } else if (col0==='code') {
              parserState = 'inDialogNodes';
            }
            break;

          case 'inScoring':
            if (col0==='') {
              // do nothing
            } else if (col0==='success') {
              scoring.negative.successThreshold = xlsxService.cellValue(sheet, 1, r);
              scoring.positive.successThreshold = xlsxService.cellValue(sheet, 2, r);
              parserState = 'inHeader';
            } else {
              col0 = col0.toUpperCase();
              scoring.negative[col0] = xlsxService.cellValue(sheet, 1, r);
              scoring.positive[col0] = xlsxService.cellValue(sheet, 2, r);
            }
            break;

          case 'inDialogNodes':
            if (xlsxService.cellValue(sheet, 0, r).trim()==='') {
              // skip any empty rows
            } else {
              var row = {
                code: xlsxService.cellValue(sheet, 0, r),
                PC_Text: xlsxService.cellValue(sheet, 1, r),
                NPC_Response: xlsxService.cellValue(sheet, 2, r),
                negative: {
                  animation: xlsxService.cellValue(sheet, 3, r),
                  score: xlsxService.cellValue(sheet, 4, r),
                  success: xlsxService.cellValue(sheet, 5, r)
                },
                positive: {
                  animation: xlsxService.cellValue(sheet, 6, r),
                  score: xlsxService.cellValue(sheet, 7, r),
                  success: xlsxService.cellValue(sheet, 8, r)
                },
                rowNumber: r+1
              };
              dialogTexts.push(row);
            }
            break;
          }

          r+=1;
      }

      if (dialogTexts.length > 1) {
        return { scoring:scoring, dialogTexts:dialogTexts } ;
      } else {
        $log.warn("'"+sheetName+"' is a dialog - with no dialog text?????");
        return null;
      }

    }

    function parseGameCaseSheet(sheet) {

      var reachedENDselection = false;
      var levels = {};
      var gameCaseData = {
        levels: levels,
        audioSetting: true,
        display: true,
        remapRooms: false,
        introduction:false,
        tutorial:false,
        roomSelection:{room1:"test1",room2:"test2",room3:"",room4:"",room5:""}
      };

      var numRows = xlsxService.findSheetSize(sheet).r;
      var startRow = 0,
        r = 0;
      var inHead = true;
      while (r < numRows && inHead) {
        var rowKey = ('' + xlsxService.cellValue(sheet, 0, r)).toLowerCase();
        // $log.log('Row Key "'+rowKey+'"');
        switch (rowKey) {
          case 'audio':
          case 'audio setting':
            gameCaseData.audioSetting = xlsxService.cellValue(sheet, 1, r) === 'on';
            break;
          case 'display':
          case 'display score':
            gameCaseData.display = xlsxService.cellValue(sheet, 1, r) === 'on';
            break;
          case 'school':
          case 'roomset':
            gameCaseData.remapRooms = xlsxService.cellValue(sheet, 1, r) === 'on';
            if(!reachedENDselection){
              for (var i=0; i<5; i++) {
                gameCaseData.roomSelection['room'+(i+1)] = xlsxService.cellValue(sheet, 1, r+i+1);
              }
              /*
              gameCaseData.roomSelection.room1 = xlsxService.cellValue(sheet, 1, r+1);
              gameCaseData.roomSelection.room2 = xlsxService.cellValue(sheet, 1, r+2);
              gameCaseData.roomSelection.room3 = xlsxService.cellValue(sheet, 1, r+3);
              gameCaseData.roomSelection.room4 = xlsxService.cellValue(sheet, 1, r+4);
              gameCaseData.roomSelection.room5 = xlsxService.cellValue(sheet, 1, r+5);
              */
              reachedENDselection = true;
            }
            r += 5;
            break;
          case 'level':
            inHead = false;
            break;
          case 'instructions':
            gameCaseData.instructions = xlsxService.cellValue(sheet, 1, r) === 'on';
            break;
          case 'tutorial':
          case 'introduction':
            gameCaseData.tutorial = xlsxService.cellValue(sheet, 1, r) === 'on';
            break;
        }
        r += 1;
      }



      var templateRows = []; //works
      for (; r < numRows; r++) {
        if (xlsxService.cellValue(sheet, 0, r) != '') { //where 0,1,2,3,4 corresuponds to level - cahr ...etc in excel
          var templateRow = {
            level: 'level_' + xlsxService.cellValue(sheet, 0, r),
            character: xlsxService.cellValue(sheet, 1, r).toLowerCase(),
            convo: xlsxService.cellValue(sheet, 2, r),
            room: xlsxService.cellValue(sheet, 3, r),
            room_pos: xlsxService.cellValue(sheet, 4, r)
          };

          if (angular.isUndefined(levels[templateRow.level])) {
            levels[templateRow.level] = {
              requiredConversations: [],
              rooms: {}
            };
          }

          var roomsData = levels[templateRow.level].rooms;
          if (angular.isUndefined(roomsData[templateRow.room])) {
            roomsData[templateRow.room] = {};
          }

          var roomData = roomsData[templateRow.room];
          if (angular.isUndefined(roomData[templateRow.character])) {
            roomData[templateRow.character] = {
              dialogInfo: []
            };
          }

          roomData[templateRow.character].dialogInfo.push({
            position: templateRow.room_pos,
            key: templateRow.convo
          });

          if (templateRow.convo !== '') {
            levels[templateRow.level].requiredConversations.push(templateRow.convo);
          }

        }
      }
      return gameCaseData;

    }

    function parseAllSheets(book) {

      var parsedDialogs = {};
      var parsedLevelData = {};
      var sheetNames = book.SheetNames;

      sheetNames.forEach(function(sheetName) {
        if (sheetName !== 'Template') { // parse anything if it's not called "Template"
          var sheet = book.Sheets[sheetName];
          if (sheetName.indexOf('game-')<0) {
            var sheetParsed = parseDialogSheet(sheet, sheetName); //SheetParsing new excel
            // console.log("------>>>>sheetParsed", sheetParsed);
            if (sheetParsed) {
              var dialogTree = nodeDataService.parseNewStructure(sheetParsed.dialogTexts, sheetParsed.scoring);
              parsedDialogs[sheetName]= {
                scoring: sheetParsed.scoring,
                dialogTree: dialogTree
              };
              if (dialogTree.errorList.length>0) {
                $log.warn(sheetName+' has Errors');
                $log.log(dialogTree.errorList.join('\n'));
              }
            } else {
              $log.warn(sheetName + ': unparseable');
            }

          } else { //Template parsing... ?
              var sheetParsed = parseGameCaseSheet(sheet); //TODO-new  parsedLevelDatause this instead of json levels
              if (sheetParsed) {
                parsedLevelData[sheetName] = sheetParsed;
                service.levelDataInformation[sheetName] = sheetParsed;
                var legalSheetName = sheetName.replace("game-",'');
                service.parsedLevelNames.push(legalSheetName);
              } else {
                $log.warn(sheetName + ': unparseable');
              }
          }
        }

      }); //end of forEach function

      $log.warn( "TT___TT parsed information <<<<<<<<<<<<<<",parsedDialogs);

      if (getLevelDataForURL().remapRooms) {
        roomData.setupRoomMapping(getLevelDataForURL().roomSelection);
      } else {
        roomData.setupRoomMapping(null);
      }

      return parsedDialogs;
    }

    function getLevelDataForURL(){
      //I KNOW THIS WAS  done another way but I'm not sure how to acsess levels since before was done though json - --

      var pathComponents = $location.path().split('/');
      var trailingComponent = pathComponents[pathComponents.length-1];
      var levelKey = "game-"+trailingComponent;

      var levelData = service.levelDataInformation[levelKey];

      if(angular.isUndefined(levelData)){
        if (trailingComponent && trailingComponent!=='dialogTestBed') {
          $log.warn('undefined url path "'+$location.path()+'" - make sure you typed it in correctly'); //or just use it here
        }
        return  service.levelDataInformation["game-negative"];
      } else {
        return levelData;
      }

    }

    function parseContentFromGameType(gameType) { //!reached
      return xlsxService.loadWorkbookFromUrl(defaultUrl)
        .then(function(book) {
          service.parsedDialogContent = parseAllSheets(book, gameType);
          return service.parsedDialogContent; //returns a whole ds of parsed data
        });
    }

    function parseContentFromFile(fileObject) {
      service.parsedDialogContent = {};
      service.levelDataInformation = {};
      return xlsxService.loadWorkbookFromFile(fileObject)
        .then(function(book) {
          service.parsedDialogContent = parseAllSheets(book);
          return service.parsedDialogContent; //returns a whole ds of parsed data
        });
    }

  }

})();



            // var roomNumbers = Object.keys(obj.roomSelection).length
            // for(i = 0 ; i< roomNumbers; i++){
            //   var tempString = "room"+i;
            //   gameCaseData.roomSelection.tempString = xlsxService.cellValue(sheet, 1, r+i) === 'on';
            //   }
