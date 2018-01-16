(function() {
  'use strict';
  angular.module('importContent')
    .service('parseAAContentService', parseAAContentService);

  /** @ngInject */
  function parseAAContentService($log, xlsxService) {
    var defaultUrl = 'assets/AwkwardAnnieDialogContent_all.xlsx';
    var templatesSample = [];

    var service = {
      parsedContent: {},
      TemplateSheets:[],

      parseContentFromGameType: parseContentFromGameType,
      parseContentFromFile: parseContentFromFile,

      // mostly internal; exposed for testing...
      parseAllSheets: parseAllSheets,
      parseSheet: parseSheet,
      findSectionHeaders: findSectionHeaders
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
    var numRows = xlsxService.findSheetSize(sheet).r;
    var startRow = 0;

    // console.log("ssize is - ", numRows);
    for(var r = 0; r < numRows ; r++){ //or manually add it in ---
      if (('' + xlsxService.cellValue(sheet, 0, r)).toLowerCase() === 'level') {
            startRow = r + 1;
      }
  }
  // var rowDefintion = {
  //   'level': 0,
  //   'charecter': '',
  //   'convo':'',
  //   'room': '',
  //   'room_pos': 0
  // };

  var templateRows =[]; //works
  for (var r = startRow; r < numRows ; r++){
    if(xlsxService.cellValue(sheet, 0, r)!=''){//where 0,1,2,3,4 corresuponds to level - cahr ...etc in excel
      templateRows[r-10] = {
        level : xlsxService.cellValue(sheet, 0, r),
        charecter : xlsxService.cellValue(sheet, 1, r),
        convo : xlsxService.cellValue(sheet, 2, r),
        room : xlsxService.cellValue(sheet, 3, r),
        room_pos : xlsxService.cellValue(sheet, 4, r)
          }

    }
  }

  // console.log(templateRows);
  return templateRows;


// templatesSample.push(templateSample);
// console.log("template",rowDefintion);
// console.log("template",templatesSample);

  // console.log(xlsxService.cellValue(sheet, 0, startRow));
  // console.log(xlsxService.cellValue(sheet, 1, startRow));
  // console.log(xlsxService.cellValue(sheet, 2, startRow));
  // console.log(xlsxService.cellValue(sheet, 3, startRow));


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
      var TemplateSheetsTest= {};
      var ParsedTemplates =[];
      var sheetNames = book.SheetNames;
      sheetNames.forEach(function(sheetName) {
        if (sheetName !== 'Template') {
          var sheet = book.Sheets[sheetName];
          var sheetParsed = parseSheet(sheet, gameType);
          if (sheetParsed) {
            parsed[sheetName] = sheetParsed;
            // console.log("sheet being patsed  parsed[sheetName]", parsed[sheetName]);
          } //this is just for proof of concept for now

           else {
              // if(sheetName == "TestA" || sheetName == "TestB"){
              //   // console.log("was trueeeeeee");
              //   // console.log(sheetName + ': the needed sheet ');
              //   // console.log("!!!---", sheet); //reached here -
              //   // // var sheetParsed = parseTemplateSheet(sheet, gameType);
              //   // ParsedTemplates.push(parseTemplateSheet(sheet, gameType));
              //   TemplateSheetsTest[sheetName] = sheetParsed; //TODO here
              // }
               if(sheetName.toLowerCase().includes("temp")){
                 $log.warn(sheetName + ': template file parsing ');
                 var sheetParsed = parseTemplateSheet(sheet, gameType);
                 ParsedTemplates.push(parseTemplateSheet(sheet, gameType));
                 service.TemplateSheets.push(sheetName);

               }else {
                 $log.warn(sheetName + ': unparseable');

               }

          }
        }//end of not notplate
         else { // it is a template - maybe add this here later defind as tempkate then do this -
          $log.log(sheetName + ': skipping');
        }
      });
      console.log(ParsedTemplates);
      console.log("parsed Sheets", service.TemplateSheets);
      orgnizeNamesWithcontent(service.TemplateSheets, ParsedTemplates);
      return parsed;
    }

    function orgnizeNamesWithcontent(namesArray, contentArrays){


    }
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
