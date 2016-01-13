# My website

Author: Rodrigo Fernandes da Costa

E-mail: rodrigo5244@gmail.com

## Design

To design this website I followed two principles: Everything that does not need to be generated by a server should be static and all data should be stored and organized using the file system instead of a database. I used the file system instead of a database for convenience and because I am not planning to have enough data that justifies using a database.

By following the first principle I realized that the website could be static and have a dynamic feel at the same time without refreshing. The website can have a dynamic feel by fetching content as the user navigates in it. This can be accomplished using frames, but a single page with a script that fetches content as the user navigates offers a better experience. The user should still be able to use this page like old pages, the back and forward browser buttons should work as links to specific parts of the page. To make this work I encoded a classic path in the hash part of the URL.

The second principle allowed me to make adding content very convenient. Like the menu options of a page, the file system is also a tree. I can make that tree mirror the structure of my website, not just the path of files. Meaning that folders become menu options and HTML files become content. So to create a new section I just have to create a new folder, and to add content I just have to add HTML files. The file system is a tree that does not store the order of the nodes, but in a page the order of the menu options is important. To solve this, I encoded the order of the nodes in the file system by adding a number before the name of files and folders.

## Server side assembly

The script that fetches content dynamically needs an index with the content. Since this index is based on files and folders it can be generated as content is added by a script. Another thing that needs to be done before the page can be uploaded is to minified the scripts and the style. The script that generates the final HTML generates this index and minify the script and style.

One problem with single page applications is that crawlers may not work well with them. To help this issue, the script that builds the final HTML, adds links to all the content. This part of the page is removed as soon as possible.

The final index.html is generated by a script because the content for crawlers need to be added in the middle of it. Having an script to assemble the page also allows the page to point to the minified script and style optionally.

## Client side

The hardest part was to make the animations work properly. I used CSS3 hoping that it would make them fast and simple, but there were some problems. For some reason when you shrink a tag in Firefox for Android the other tags move to occupy the space in a very laggy motion. I had to experiment with different ways of doing that animation until finding one that works well in that browser. Also I had to use a work around to animate tags with transition as soon as they are inserted in the document. Additionally some tags needed to be animated from and to calculated values so I had to use transitions and inline styles.

Another problem was dependencies between files. Coding in several different files allows me to find specific pieces of code faster. But the native solution for dependencies between JavaScript files was not implemented yet by all major browsers. My solution was to concatenate all the files together in a particular order that solves the dependencies. It may not be the most efficient way of solving the issue, but is definitely the easiest.

## Usage

To use the code of this website in your project, first you have to notice the license. The visual part is licensed under Creative commons and code is licensed under gpl3.

The files in the markup folder are the HTML code that comes before and after the code generated by the make page script. Use these files to modify the footer and the head of the final HTML file.

Any folder in the content folder are menu options. The name of the folders need to be a number followed by the name that is going to be used as an option. The contents that are displayed in cards are retrieved from files with the HTML extension. Those files also need to have numbers to indicate their order. Is important to know that the greatest number is going to be shown on top. This allows to newly added content to stay on top. Files that don't have the HTML extension and folders that don't have those files recursively are ignored. This allows you to add things like images close to the HTML code that makes a reference to it. The number before the name of files and folder should be unique and start at zero. The last modified date of HTML files are added to the cards automatically, and the title is taken from the name of the file.

The path inside the hash is a little different from the real path of files. It does not have the number before the name nor the extension. To make references to cards and menu options, you should use the hash path, to make references to files like images, you should use the real path including the content folder, numbers, and extensions. Notice that updates is the default option. You can change it in the page script file.

After the content is added, generate the HTML file by running the make page script in the assembler folder. Pass expand as a command line argument to generate the non minified version. The files that need be uploaded are: Content, Script/script-min.js, Style/style-min.js, and index.html. Only index.html change when new content is added.
