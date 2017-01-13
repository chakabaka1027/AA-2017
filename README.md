#Programming Notes for future developers

###To Begin developing on the game
	you can git clone from the lastest build at https://github.com/Alma-Sanchez/Awkward-Annie-Candidate
		cd path\to\Awkward-Annie-Beta
		npm install
    bower install

  Then gulp serve should work and you can go ahead and begin programming!

###Notes
  To change the address of where the User Data Logs are being saved, change the hostBaseAddress variable in the UserDataService.js file.
  If you add more json files, you'll need to update the totalConvosAvailable variable in the main.controller.js file
  To disble creating data files, change the enabled varaible in the userDataService.js file.
  I probably should have just used one giant main.html and used an ng-if to show and hide pages. But I figured that out too late into the project.

###Using p5.js Add Ons
  Need to update p5.js's bower.json fileS to incude add ons you want to use. <br>
  For example to use the sound library<br>
  bower.json<br>
    "main": ["lib/p5.min.js", "lib/addons/p5.sound.js"],<br>
  .bower.json<br>
    "main": ["lib/p5.min.js", "lib/addons/p5.sound.js"],