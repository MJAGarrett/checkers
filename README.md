# Simple Checkers Game
This is a personal training project consisting of a very simple (currently only singleplayer/locally multiplayer) and unfinished game of checkers designed to be run on a web browser. Created using create-react-app running v18.2.0. The goal of this project was to familiarize myself with React and basic JavaScript programming.

## Technologies
React v18.2.0

## Launch
At the moment, a local environment will need to be set up to run the game.
You will need to have Node and NPM installed to set up a local environment. After that run npm start in the install directory.

## General Info
* [Project Status](#status)
* [How It Works](#How-It-Works) 
* [Future Plans](#plans)
* [What I Have Learned](#learnings)
* [Thank You](#thanks)

### Project Status <a name="status" />
As of writing this Readme, July 21, 2022, this is an ongoing project and will likely be for some time. 
* The HTML and CSS are not final by any means (<i>especially</i> not the CSS). 
* The JavaScript for the game itself is quite close to a final product, I will likely add some code to handle new HTML elements/add functionality for new components, but the game-focused JavaScript is likely nearly done. 
* There is no back-end code yet, however, I plan to code a server using Node.js and a database to implement multiplayer functionality and chat. However, this will likely take me a while to learn and construct, as while I know the basics of HTTP and database manipulation, I don't know how to create individual sessions for particular IPs, nor an efficient way to clear them on a disconnect.
* The game needs to be checked for any browser/device irregularities. Currently, testing has been done only with Chrome on desktop and a Galaxy Note 20.

### How It Works <a name="How-It-Works"/>
This uses React to create a basic webpage consisting of a checkerboard of HTML buttons and "pieces" (really just text content inside a `<button />` html tag representing pieces). Checkers are selected with the mouse and JavaScript will directly change the content of the selected buttons based on the rules of checkers and the board's state. For example, checkers cannot be "moved" if there is already a checker in the diagonal spaces above or below them - or both, depending on where it can move - and the blocking checker cannot be captured.

### Future Plans (as of 07/21/2022) <a name="plans" />
The game is currently functional; it has proper movement/jumping, limits movement based on appropriate factors, has end-states and even accounts for an unlikely tie. However, there are many improvements that could be made, and I plan to continue using this project as a learning experience/coding example. 

To that end, there are a couple things I plan to add/modify. Among them are:

#### Short-term Goals
* Adding an options selection screen to change game rules (i.e. requiring a capture -or not- if it is available)
* Highlighting a piece that can move and highlighting its potential moves.
* Changing styles to a more modern, visually-appealing design and making sure the design is displayed appropriately on all screen sizes.

#### Long(er)-term Goals
* Researching accessibility concerns and rectifying them as best as I can. (This is a longer-term goal not because I consider accessibility low-priority, but simply because there is much I do not know regarding the subject and it will likely take me time to identify the issues in this program and then learn how to correct them)
* A backend server using Node.js that will allow for browser-based multiplayer and a simple chat box.
* An option to choose to play either checkers or chess. This will require the writing of an entirely different game, however, and will take time for me to learn how to properly integrate them.
* Ultimately, once I have a finished project, I would like to integrate this game with a seperate Resumé-style website and host it online.

### What I Have Learned <a name="learnings" />
This project has helped me learn a lot. While I have not fully utilized the power of React to create compartmentalized components, I have learned a good deal about the library. 
* I have familiarized myself with the way React renders components and how state is handled. For example: I had run into an issue where a particular section of code (calculating a winner) required a rendered DOM to function, but my only knowledge of running code on a render update was to include it in the render method. This gave me a greater insight into how React works and lead me to the componentDidUpdate(), which solved the issue completely.
* Various other things such a first project would teach a new programmer, such as how to use an array to represent a 2D board and the issues that arise with such an abstract representation (i.e. calculating moves near the edges of a board could select non-existant indexes or illogical ones).

### Thank You <a name="thanks" />
If you have gotten this far down the Readme, thank you for your interest! I am just beginning my coding journey and as such there are likely many things I did inefficiently, or perhaps there are anti-patterns I used that I was unaware were not recommended, or my comment style could be better, etc. If so, please let me know a better way. My pride can take it.

Also if you are new to coding as well, I hope that my code can help you in some way. Either through inspiration or serving as some kind of example.
