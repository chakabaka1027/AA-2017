(function() {
  'use strict';
  angular.module('importContent')
    .service('parseAAContentService', parseAAContentService);

  /** @ngInject */
  function parseAAContentService($log, xlsxService, $q) {
    var defaultUrl = 'assets/AwkwardAnnieDialogContent_all.xlsx';
    var templatesSample = [];

    var service = {
      parsedContent: {},
      TemplateSheets:[],
      levelDataInformation:{}, //test only 1
      templateSampleForTestingOnly:{},


      parseContentFromGameType: parseContentFromGameType,
      parseContentFromFile: parseContentFromFile,

      // mostly internal; exposed for testing...
      parseAllSheets: parseAllSheets,
      parseSheet: parseSheet,
      findSectionHeaders: findSectionHeaders,
      testingNewTemplates:testingNewTemplates
      // TestAndgetSampleTemplatValuewillchangename:TestAndgetSampleTemplatValuewillchangename
      // templateSample: templateSample
    };

    return service;

    function findSectionHeaders(sheet) {
      var hdrIndexes = [];
      var numRows = xlsxService.findSheetSize(sheet).r;

      for (var r = 0; r < numRows; r++) {
        if (('' + xlsxService.cellValue(sheet, 0, r)).toLowerCase() === 'annie') {
          hdrIndexes.push(r);
        }
      }
      return hdrIndexes;
    }//end of findsectionHeaders

    function utfClean(s) {
      return s.trim();
    }

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

    function parseSheet(sheet, gameType) { //reached this poiint

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

    }// end of parseSheet


    function   parseTemplateSheet (sheet, gameType){ //for the sake of testing - duplicated some aspects at this point
      // console.log("sample values ", xlsxService.cellValue(sheet, 2, 11));


      var levelData = {};
      var gameCaseData = {
        levelData: levelData,
        audioSetting: true,
        display: true
      };

      var numRows = xlsxService.findSheetSize(sheet).r;
      var startRow = 0, r = 0;

      /*
      for (var r = 0; r < numRows ; r++) { //or manually add it in ---
        if (('' + xlsxService.cellValue(sheet, 0, r)).toLowerCase() === 'level') {
              startRow = r + 1;
        }
      }
      */

      var inHead = true;
      while (r<numRows && inHead) {
        var rowKey = ('' + xlsxService.cellValue(sheet, 0, r)).toLowerCase();
        $log.log('Row Key "'+rowKey+'"');
        switch (rowKey) {
          case 'audio setting':
            gameCaseData.audioSetting = xlsxService.cellValue(sheet, 1, r)==='on';
            break;
          case 'display':
            gameCaseData.display = xlsxService.cellValue(sheet, 1, r)==='on';
            break;
          case 'level':
            inHead = false;
            break;
        }
        r += 1;
      }

      var templateRows = []; //works
      for (; r < numRows ; r++){
        if (xlsxService.cellValue(sheet, 0, r)!='') {//where 0,1,2,3,4 corresuponds to level - cahr ...etc in excel
          var templateRow = {
            level : 'level_'+xlsxService.cellValue(sheet, 0, r),
            character : xlsxService.cellValue(sheet, 1, r),
            convo : xlsxService.cellValue(sheet, 2, r),
            room : xlsxService.cellValue(sheet, 3, r),
            room_pos : xlsxService.cellValue(sheet, 4, r)
          };

          if (angular.isUndefined(levelData[templateRow.level])) {
            levelData[templateRow.level] = {
              requiredConversations: [],
              rooms: {}
            };
          }

          var roomsData = levelData[templateRow.level].rooms;
          if (angular.isUndefined(roomsData[templateRow.room])) {
            roomsData[templateRow.room] = {};
          }

          var roomData = roomsData[templateRow.room];
          if (angular.isUndefined(roomData[templateRow.character])) {
            roomData[templateRow.character] = {dialogInfo: []};
          }

          roomData[templateRow.character].dialogInfo.push({
            position: templateRow.room_pos,
            key: templateRow.convo
          });

          if (templateRow.convo !== '') {
            levelData[templateRow.level].requiredConversations.push(templateRow.convo);
          }

        }
      }

      // console.log(templateRows);
      return gameCaseData;

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

    function parseAllSheets(book, gameType) {
      var parsed = {};
      var parsedLevelData ={};

      var sheetNames = book.SheetNames;
      sheetNames.forEach(function(sheetName) {
        if (sheetName !== 'Template') {
          var sheet = book.Sheets[sheetName];
          var sheetParsed = parseSheet(sheet, gameType);
          if (sheetParsed) {

            parsed[sheetName] = sheetParsed;
            // console.log("sheet being patsed  parsed[sheetName]", parsed[sheetName]);

          } else {

            if(sheetName.toLowerCase().includes("temp")){
              $log.warn(sheetName + ': template file parsing ');
              var sheetParsed = parseTemplateSheet(sheet, gameType);  //TODO-new  parsedLevelDatause this instead of json levels
              parsedLevelData[sheetName] = sheetParsed;
              service.levelDataInformation[sheetName] = sheetParsed;
              service.TemplateSheets.push(sheetName);

            } else {
              $log.warn(sheetName + ': unparseable');
            }

          }

        } else { // it is a template - maybe add this here later defind as tempkate then do this -
          $log.log(sheetName + ': skipping');
        }

      });

      // console.log("parsed Levels ", parsedLevelData);
      // console.log("levelData parser info :  ", service.levelDataInformation.template2.levelData);
      if(service.levelDataInformation.template2.levelData != undefined){
        service.templateSampleForTestingOnly = service.levelDataInformation.template2.levelData;
        // console.log("hello world ",  service.templateSampleForTestingOnly);
      }


      // console.log("parsed Sheets", service.TemplateSheets);
      // orgnizeNamesWithContent(service.TemplateSheets, parsedLevelData);
      return parsed;
    }

    function testingNewTemplates(){
      var q = $q.defer();
      if(service.levelDataInformation.template2.levelData!= undefined){
        q.resolve(service.levelDataInformation.template2.levelData);
      } else {
        console.warn("promise failed to resolve");
      }
      return q.promise;

        // return service.levelDataInformation; //returns a whole ds of parsed data
    }
    //
    // function TestAndgetSampleTemplatValuewillchangename(){
    //
    //   // I know this is wrong but a temp fix --- tried it with another method written here but did not work - promises gha
    //   return xlsxService.loadWorkbookFromUrl(defaultUrl)
    //     .then(function(book) {
    //       // service.parsedContent = parseAllSheets(book, gameType);
    //       return service.levelDataInformation; //returns a whole ds of parsed data
    //     });
    //
    // }

    // function orgnizeNamesWithContent(namesArray, contentArrays){
    // }

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


    function parseContentFromGameType(gameType) { //!reached
      return xlsxService.loadWorkbookFromUrl(defaultUrl)
        .then(function(book) {
          service.parsedContent = parseAllSheets(book, gameType);
          return service.parsedContent; //returns a whole ds of parsed data
        });
    }




    function parseContentFromFile(fileObject) {
      return xlsxService.loadWorkbookFromFile(fileObject)
        .then(function(book) {
          service.parsedContent = parseAllSheetsFromFile(book, fileObject);
          return service.parsedContent;
        });
    }

  }

})();
