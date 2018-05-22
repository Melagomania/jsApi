# Task: Create tabbed page and implement tabs functionality with use of History, Fullscreen, Geolocation and WebWorker APIs

###  Requirements

####  Markup and styles
Edit `public/index.html` and `public/styles.css` and create interface with tabs shown on wireframes `wireframes/1-Default.png`, `wireframes/2-Geolocation.png`, `wireframes/3-Sync.png`, `wireframes/5-Worker.png`.

#### History API (All tabs)
*You should implement updates of URL updates for all links for localhost:3001 host and routing*
1. Routes:
	a. `http://localhost:3001/geolocation` should activate Geolocation tab
	b. `http://localhost:3001/synccalculation` should activate Sync calculation tab
	c. `http://localhost:3001/webworker` should activate WebWorker tab
	d. `http://localhost:3001/` should activate Default tab
	e. Any other url not mentioned above (e.g. `http://localhost:3001/randomurl`) should be rewritten to `http://localhost:3001/` (use `replaceState` method) and Default tab should be activated.
2. When user enters url in the address bar and navigates to the page you should perform routing as described above.
3. When user clicks any link on the page
	a. If link points to a host other than `localhost:3001` - perform navigation as usually
	b. Update url in the address bar (use `pushState` method) and perform routing as described above
4. When user clicks Back button in the browser - perform routing in handler for proper event as described above .
>**NOTE:** You shouldn't activate tabs directly from click event handlers. All tabs should be activated accordingly to new URL

#### Fullscreen API (All tabs)
*You should implement switch to full screen mode and back for each tab*
1. Check if browser supports Fullscreen API and display "toggle fullscreen" button in top right corner of every tab content block.
2. Edit `public/index.html` and `public/styles.css` and implement fullscreen mode for every content block as shown on wireframes `wireframes/7-FS Default.png`, `wireframes/8-FS Geolocation.png`, `wireframes/9-FS Sync.png`, `wireframes/11-FS Worker.png`.

>**NOTE:** All content blocks cover full screen size and contain heading in fullscreen mode
>**NOTE: ** Image with map covers full screen, and heading is rendered above it on Geolocation tab
>**NOTE:** WebWorker content block have two columns in fullscreen mode: left with heading, text, form elements, and right with results table

3. When user clicks on "toggle fullscreen" button, current active tab should be displayed in fullscreen mode.
4. In fullscreen mode "toggle fullscreen" button should change appearence to indicate that next click will perform exit from full screen mode.
5. When user clicks on "toggle fullscreen" again, you should perform exit from fullscreen mode

#### Geolocation tab
*You should implement map with markers for fisrt 10 coordinates of device*

For this tab you should use Google Static Maps API
URL format for static maps: `https://maps.googleapis.com/maps/api/staticmap?size=<WIDTH>x<HEIGHT>&scale=<SCALE>&markers=label:<LABEL_INDEX>%7C<LAT>,<LONG>`
	`<WIDTH>` - width of map in pixels (maximum 640)
	`<HEIGHT>` - height of map in pixels (maximum 640)
	`<LABEL_INDEX>` - index of current marker (integers from 0-9)
	`<LAT>` - latitude of current marker
	`<LONG>` - longitude of current marker
	>**NOTE:** URL might contain several `markers` parameters (e.g. `https://maps.googleapis.com/maps/api/staticmap?size=640x480&scale=1&markers=label:0%7C50.012879,36.226945&markers=label:1%7C50.026060,36.223125`)
	>**NOTE:** It is better to keep `<WIDTH>/<HEIGHT>` ratio same as aspect ratio of users screen to avoid stretches in fullscreen mode.
	>**NOTE:** It is better to use scale 2 for fullscreen mode. (This will return image with higher resolution up to 1280x1280)

**More info**: https://developers.google.com/maps/documentation/static-maps/intro

1. Start watching for coordinates change when user navigates to `/geolocation` .
2. Update map on each position change so it will display markers for all detected coordinates (with labels from `0` to `9`).
3. Stop watching for changes when coordinates history contains 10 of user navigates away from Geolocation tab.
4. Clear coordinates history and start watching when user navigates `/geolocation` again.
>**NOTE:** You can use `public/waiting.gif` as `src` for image until first position became available.
>**NOTE:** You can use "Sensors" panel in Chrome, "Emulate" panel in Edge/IE

#### Sync calculation tab
*This is example tab no additional functionality required*
This tab contains example of calculation that block page for about 5-10 seconds.
Click on button and try to navigate to other tab on the page or activate fullscreen.

#### WebWorker tab
*You should create WebWorker instance and perform long running calculations with regular updates of current result*
1. Create Iterations, Results every input fields and Start async calculations button.
	'Iterations' will contain total number of iterations used for Pi calculation (use `100000000` as default value)
	'Results every' will contain number that shows how often you should display intermediate result. (Display intermediate result every time when the iterations count is a multiple of this value) (use `1000000` as default value)
	For example: if 'iterations' is equal to `1000` and `Results every` is `100` than you should display intermediate results for `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `1000`.
2. Create JavaScript file for WebWorker
	a. Use `computePi` and `generatePoint` as main functions for Pi calculation
	b. Start calculation when message with 'iterations' and 'results every' values are received from main process.
	c. Send current iteration count and intermediate result to main process every time when the iterations count is a multiple of 'results every' value
	d. After all iterations send specific message to enable button.
3. When Start async calculations button is clicked:
	a. Instantiate WebWorker if there are no active instance.
	b. Start listening for messages event
	c. Clear table from previous results if necessary
	d. Disable button
	e. Send 'iteration' and 'results every' values to worker instance to start calculations
4. Every time when WebWorker instance emits event with intermediate result - add it to the results table
5. When WebWorker emits specific event - enable button.


### Server setup:

1. Download and install Node.js from http://nodejs.org/
2. Open folder with ```package.json``` in console
3. Run ```npm install```
4. Run ```npm start```
5. Open http://localhost:3001/ in browser


https://gomockingbird.com/projects/82zeppg/dutE3H
