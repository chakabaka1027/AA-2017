(function() {
  'use strict';
  angular.module('importContent')
    .service('parseAAContentService', parseAAContentService);

  /** @ngInject */
  function parseAAContentService($log, xlsxService, $q, $location, nodeDataService) {
    // var defaultUrl = 'assets/AwkwardAnnieDialogContent_all.xlsx';
    var defaultUrl = 'assets/newFormatDialogs.xlsx';

    // var testingNewSheets = 'assets/newFormatDialogs.xlsx';
    var templatesSample = [];

    var service = {
      parsedContent: {},  //dictionary keyed by dialog key - yeilding objects of the form:
                          // {
                          //  scoring: < scoring data >, 
                          //  dialogTree: < tree of dialog text> 
                          // }

      levelDataInformation: {},   // dictionary that inculdes template-<game-name>  - yeilding objects of the form
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

      // findSectionHeaders: findSectionHeaders,
      // templateSample: templateSample
      // parseSheet: parseSheet,
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

    function parseDialogSheet(sheet) {

      var hdrIndex = findSectionHeaderswithTarget(sheet, "code");
      // console.log("hdrIndex", hdrIndex.length); //or add another keyword to distinguish it

      if (hdrIndex.length !== 1) { //oh for annie;s use got it but -
        $log.warn(" this isn't a dialoug - only include ONE \"code\" word for a dialog  ");
        return null;
      }

      var numRows = xlsxService.findSheetSize(sheet).r;
      var startRow = 0,
        r = 0;
      var dialogTexts = [];
      var scoring = { //shoud this be done this way ?
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
        col0 = xlsxService.cellValue(sheet, 0, r).toLowerCase().split(' ')[0];

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
              $log.warn('warning there is a missing code value! ');
            } else {
              var row = { //so it looks like the original ds
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
        $log.warn(" thhis is a dialog - with no dialog text?????");
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

    function parseAllSheets(book, gameType) {
      console.log( "parsed all sheets called? <<<<<<<<<");

      var parsedDialogs = {};
      var parsedLevelData = {};
      var sheetNames = book.SheetNames;

      sheetNames.forEach(function(sheetName) {
        if (sheetName !== 'Template') { // parse anything if its not template
          var sheet = book.Sheets[sheetName];
          var sheetParsed = parseDialogSheet(sheet, gameType); //SheetParsing new excel
          // console.log("------>>>>sheetParsed", sheetParsed);
          if (sheetParsed) {

            $log.log('sheetName', sheetName);

            parsedDialogs[sheetName]= {
              scoring: sheetParsed.scoring,
              dialogTree: nodeDataService.parseNewStructure(sheetParsed.dialogTexts, sheetParsed.scoring)
            };

          } else { //Template parsing
            if (sheetName.toLowerCase().includes("temp")) {
              $log.warn(sheetName + ': template file parsing ');
              var sheetParsed = parseGameCaseSheet(sheet, gameType); //TODO-new  parsedLevelDatause this instead of json levels
              parsedLevelData[sheetName] = sheetParsed;
              service.levelDataInformation[sheetName] = sheetParsed;
            } else { //q about other types of sheets - if the first is not parsble how do we define it?
              $log.warn(sheetName + ': unparseable');
            }
          }
        }

      }); //end of forEach function

      console.log( "TT___TT parsed information <<<<<<<<<<<<<<",parsedDialogs);

      return parsedDialogs;
    }

    function getLevelDataForURL(){
      //I KNOW THIS WAS  done another way but I'm not sure how to acsess levels since before was done though json - --

      var levelKey = "template-"+$location.path().replace("/","");
      var levelData = service.levelDataInformation[levelKey];

      if(angular.isUndefined(levelData)){
        $log.warn("undefined url path - make sure you typed it in correctly")
        return  service.levelDataInformation["template-negative"];
      } else {
        return levelData;
      }

    }

    function parseContentFromGameType(gameType) { //!reached
      return xlsxService.loadWorkbookFromUrl(defaultUrl)
        .then(function(book) {
          service.parsedContent = parseAllSheets(book, gameType);
          return service.parsedContent; //returns a whole ds of parsed data
        });
    }



    /////////////////////////////////
    /////////////////////////////////
    /////////////////////////////////
    /////////////////////////////////
    /////////////////////////////////
    /////////////////////////////////
    /////////////////////////////////
    /////////////////////////////////
    /////////////////////////////////
    /////////////////////////////////
    // BEGIN OLD STYLE PARSING CODE
    /////////////////////////////////

    function findSectionHeaders(sheet) {
      var hdrIndexes = [];
      var numRows = xlsxService.findSheetSize(sheet).r;

      for (var r = 0; r < numRows; r++) {
        if (('' + xlsxService.cellValue(sheet, 0, r)).toLowerCase() === 'annie') {
          hdrIndexes.push(r);
        }
      }
      return hdrIndexes;
    } //end of findsectionHeaders

    function createBlock(row, col, code, isLinear) {

      var d = {
        'code': code,
        'PC_Text': utfClean(row[col]),
        'NPC_Response': utfClean(row[col + 2])

      };

      if (!isLinear) { //check line 53 -

        d.animationNegative = row[col + 4].toLowerCase();
        d.animationPositive = row[col + 5].toLowerCase();
        d.animationNegative = (d.animationNegative === 'neutral' ? '' : d.animationNegative);
        d.animationNegative = d.animationNegative.replace('surprise_', 'surprised_');
        d.animationPositive = (d.animationPositive === 'neutral' ? '' : d.animationPositive);
        d.animationPositive = d.animationPositive.replace('surprise_', 'surprised_');
      } else {
        d.animation = row[col + 4].toLowerCase();
        d.animation = (d.animation === 'neutral' ? '' : d.animation);
        d.animation = d.animation.replace('surprise_', 'surprised_');
      }
      return d;
    }

    function parseSheetFromFile(sheet, fileObject) {

      var hdrIndexes = findSectionHeaders(sheet);

      if (hdrIndexes.length !== 1 && hdrIndexes.length !== 3) {
        return null;
      }

      var parsed = {};
      var row, i, j, code;
      var hdrIndex, hdrOffset;
      var choice1, choice2;


      if (hdrIndexes.length === 1) {
        // it's a 'linear' exchange...
        row = sheetRow(hdrIndexes[0] + 1);

        if (fileObject[0] == "q") {
          for (i = 0, code = 'C'; i < 4; i++, code += 'C') {
            if (i === 0) {
              parsed['node' + (i + 1)] = [createBlock(row, 5 * i, code)];
            } else {
              parsed['node' + (i + 1)] = {}
              parsed['node' + (i + 1)][code.substr(1)] = [createBlock(row, 5 * i, code)];

            }
          }
        }
        if (fileObject[0] == "assets/AwkwardAnnieDialogContent_positive.xlsx") {
          for (i = 0, code = 'A'; i < 4; i++, code += 'A') {
            if (i === 0) {
              parsed['node' + (i + 1)] = [createBlock(row, 5 * i, code)];
            } else {
              parsed['node' + (i + 1)] = {}
              parsed['node' + (i + 1)][code.substr(1)] = [createBlock(row, 5 * i, code)];

            }
          }
        }

        return parsed;
      }

      // it's not 'linear', so (hopefully!) it fits the following ad-hoc pattern...

      parsed['node1'] = [
        createBlock(sheetRow(hdrIndexes[0] + 1), 0, 'A'),
        createBlock(sheetRow(hdrIndexes[1] + 1), 0, 'B'),
        createBlock(sheetRow(hdrIndexes[2] + 1), 0, 'C')
      ];

      var node2 = {};
      for (i = 0; i < 3; i++) {
        hdrIndex = hdrIndexes[i];
        choice1 = 'ABC' [i];
        node2[choice1] = [
          createBlock(sheetRow(hdrIndex + 1), 5, choice1 + 'A'),
          createBlock(sheetRow(hdrIndex + 5), 5, choice1 + 'B'),
          createBlock(sheetRow(hdrIndex + 9), 5, choice1 + 'C')
        ];
      }
      parsed['node2'] = node2

      var node3 = {};
      for (i = 0; i < 3; i++) {
        hdrIndex = hdrIndexes[i];
        choice1 = 'ABC' [i];
        for (j = 0; j < 3; j++) {
          hdrOffset = [0, 4, 8][j];
          choice2 = 'ABC' [j];
          var pfx = choice1 + choice2
          var rowOffset = hdrIndex + hdrOffset
          node3[pfx] = [
            createBlock(sheetRow(rowOffset + 1), 10, pfx + 'A'),
            createBlock(sheetRow(rowOffset + 2), 10, pfx + 'B'),
            createBlock(sheetRow(rowOffset + 3), 10, pfx + 'C')
          ];
        }
      }
      parsed['node3'] = node3;

      return parsed;


      function sheetRow(rowIx) {
        return xlsxService.sheetRow(sheet, rowIx);
      }

    }

    function parseOldStyleSheet(sheet, gameType) { //reached this poiint --- for the old style

      var hdrIndexes = findSectionHeaders(sheet);

      if (hdrIndexes.length !== 1 && hdrIndexes.length !== 3) {
        return null;
      }

      var parsed = {};
      var row, i, j, code;
      var hdrIndex, hdrOffset;
      var choice1, choice2;


      if (hdrIndexes.length === 1) {

        row = sheetRow(hdrIndexes[0] + 1);


        if (gameType === "negative") {
          for (i = 0, code = 'C'; i < 4; i++, code += 'C') {
            if (i === 0) {
              parsed['node' + (i + 1)] = [createBlock(row, 5 * i, code, true)];
            } else {
              parsed['node' + (i + 1)] = {}
              parsed['node' + (i + 1)][code.substr(1)] = [createBlock(row, 5 * i, code, true)];

            }

          }
        } else {

          for (i = 0, code = 'A'; i < 4; i++, code += 'A') {
            if (i === 0) {
              parsed['node' + (i + 1)] = [createBlock(row, 5 * i, code, true)];
            } else {
              parsed['node' + (i + 1)] = {}
              parsed['node' + (i + 1)][code.substr(1)] = [createBlock(row, 5 * i, code, true)];

            }
          }


        }

        return parsed;
      }

      // it's not 'linear', so (hopefully!) it fits the following ad-hoc pattern...

      parsed['node1'] = [
        createBlock(sheetRow(hdrIndexes[0] + 1), 0, 'A'),
        createBlock(sheetRow(hdrIndexes[1] + 1), 0, 'B'),
        createBlock(sheetRow(hdrIndexes[2] + 1), 0, 'C')
      ];

      var node2 = {};
      for (i = 0; i < 3; i++) {
        hdrIndex = hdrIndexes[i];
        choice1 = 'ABC' [i];
        node2[choice1] = [
          createBlock(sheetRow(hdrIndex + 1), 6, choice1 + 'A'),
          createBlock(sheetRow(hdrIndex + 5), 6, choice1 + 'B'),
          createBlock(sheetRow(hdrIndex + 9), 6, choice1 + 'C')
        ];
      }
      parsed['node2'] = node2;

      var node3 = {};
      for (i = 0; i < 3; i++) {
        hdrIndex = hdrIndexes[i];
        choice1 = 'ABC' [i];
        for (j = 0; j < 3; j++) {
          hdrOffset = [0, 4, 8][j];
          choice2 = 'ABC' [j];
          var pfx = choice1 + choice2;
          var rowOffset = hdrIndex + hdrOffset;
          node3[pfx] = [
            createBlock(sheetRow(rowOffset + 1), 12, pfx + 'A'),
            createBlock(sheetRow(rowOffset + 2), 12, pfx + 'B'),
            createBlock(sheetRow(rowOffset + 3), 12, pfx + 'C')
          ];
        }
      }
      parsed['node3'] = node3;

      return parsed;

      function sheetRow(rowIx) {
        return xlsxService.sheetRow(sheet, rowIx);
      }

    } // end of parseSheet

    function parseAllSheetsFromFile(book, fileObject) { //not being used
      var parsed = {};
      var sheetNames = book.SheetNames;
      sheetNames.forEach(function(sheetName) {
        if (sheetName !== 'Template') {
          var sheet = book.Sheets[sheetName];
          var sheetParsed = parseSheetFromFile(sheet, fileObject);
          if (sheetParsed) {
            parsed[sheetName] = sheetParsed;

          } else {
            $log.warn(sheetName + ':is this being used or the other  unparseable');
          }
        } else {
          $log.log(sheetName + ':is this being used or the other   skipping');
        }
      });
      return parsed;

    }

    function parseContentFromFile(fileObject) {
      return xlsxService.loadWorkbookFromFile(fileObject)
        .then(function(book) {
          service.parsedContent = parseAllSheetsFromFile(book, fileObject);
          return service.parsedContent;
        });
    }

    /////////////////////////////////
    // END OLD STYLE PARSING CODE
    /////////////////////////////////



  }

})();

