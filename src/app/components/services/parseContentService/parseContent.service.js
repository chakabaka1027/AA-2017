(function() {
  'use strict';
  angular.module('importContent')
    .service('parseAAContentService', parseAAContentService);

  /** @ngInject */
  function parseAAContentService($log, xlsxService, $q, $location, nodeDataService) {
    // var defaultUrl = 'assets/AwkwardAnnieDialogContent_all.xlsx';
    // var defaultUrl = 'assets/newFormatDialogs.xlsx'; //TODO change the name
    var defaultUrl = 'assets/ETS-ConfigSys.xlsx'; //TODO change the name 

    // var testingNewSheets = 'assets/newFormatDialogs.xlsx';
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
                                  //    display: true
                                  //  };


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
                }
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

      var levels = {};
      var gameCaseData = {
        levels: levels,
        audioSetting: true,
        display: true
      };

      var numRows = xlsxService.findSheetSize(sheet).r;
      var startRow = 0,
        r = 0;
      var inHead = true;
      while (r < numRows && inHead) {
        var rowKey = ('' + xlsxService.cellValue(sheet, 0, r)).toLowerCase();
        // $log.log('Row Key "'+rowKey+'"');
        switch (rowKey) {
          case 'audio setting':
            gameCaseData.audioSetting = xlsxService.cellValue(sheet, 1, r) === 'on';
            break;
          case 'display':
            gameCaseData.display = xlsxService.cellValue(sheet, 1, r) === 'on';
            break;
          case 'level':
            inHead = false;
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
              parsedDialogs[sheetName]= {
                scoring: sheetParsed.scoring,
                dialogTree: nodeDataService.parseNewStructure(sheetParsed.dialogTexts, sheetParsed.scoring)
              }
            } else {
              $log.warn(sheetName + ': unparseable');
            }

          } else { //Template parsing... ?
              var sheetParsed = parseGameCaseSheet(sheet); //TODO-new  parsedLevelDatause this instead of json levels
              if (sheetParsed) {
                parsedLevelData[sheetName] = sheetParsed;
                service.levelDataInformation[sheetName] = sheetParsed;
              } else {
                $log.warn(sheetName + ': unparseable');
              }
          }
        }

      }); //end of forEach function

      $log.warn( "TT___TT parsed information <<<<<<<<<<<<<<",parsedDialogs);

      return parsedDialogs;
    }

    function getLevelDataForURL(){
      //I KNOW THIS WAS  done another way but I'm not sure how to acsess levels since before was done though json - --

      var levelKey = "game-"+$location.path().replace("/","");
      var levelData = service.levelDataInformation[levelKey];

      if(angular.isUndefined(levelData)){
        if ($location.path()!=='/') {
          $log.warn("undefined url path - make sure you typed it in correctly")
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
