**Pixel Ruler**

A project designed to solve a common need for front-end developers and designers: quickly measuring areas on a webpage.
With this extension, you can measure the dimensions of any part of the page where the extension is active.

<br/>
**Features**

📏 Measures width and height in pixels

🔄 Converts values from px → rem

📋 Copies the final measurement result to the clipboard (if selected Yes on popup   button)

<br/>
**Output format:**

w: 0px | h: 0px

<br>
**How to Use**

Activate the extension in a Google Chrome tab.

Click and hold the left mouse button on the area you want to measure.

Drag to define the measurement area.

When you release the mouse button:

The measurement is completed and pops up a question 'Copy?' with Y (yes) or N (no) options.

The value is copied to the clipboard after Y (yes) selected.

<br/>
**Measurement Units**

px → pixel

rem → root em

The conversion is based on the page’s root font-size (typically 16px).

<br/>

**Extension Behavior**

When activated in a tab, the extension remains active until it is manually deactivated or the page is reloaded.

The extension is always deactivated automatically after a page reload.

You can activate and use the extension in multiple tabs simultaneously.

However, deactivation must be done manually in each tab.

<br/>

**Project Structure**

chrome_ruler_extension/

│

├── content.js        // Handles measurement logic injected into the webpage

├── manifest.json     // Extension configuration and permissions

├── popup.html        // Popup UI layout

├── background.js     // clean chrome.session.storage to reset extension and buttons

├── popup.js          // Popup logic and interactions

└── style.css         // Styles for popup interface

<br/>
<br/>

Created and Designed by
Raone Ferreira

