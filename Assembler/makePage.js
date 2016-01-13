#!/usr/bin/env nodejs

// Copyright 2015 Rodrigo Fernandes da Costa

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// Author: Rodrigo Fernandes da Costa
// E-mail: rodrigo5244@gmail.com

(function (require, process) {
    "use strict";

    var fs, exec, makeIndex, output, head, style, script, crawler, foot, min;

    fs = require("fs");
    exec = require("child_process").exec;
    makeIndex = require("./makeIndex.js");

    head = function () {
        var input;

        input = fs.createReadStream("../Markup/head.html");
        input.pipe(output, {end: false});
        input.on("end", style);
    };

    style = function () {
        var command, string;

        if (min === false) {
            string = "        ";
            string = string + "<link rel='stylesheet'";
            string = string + " type='text/css'";
            string = string + " href='Styles/style.css'>\n";

            output.write(string, script);
        } else {
            command = [
                "java",
                "-jar",
                "yuicompressor-2.4.8.jar",
                "../Styles/style.css",
                "-o",
                "../Styles/style-min.css"
            ];

            command = command.join(" ");

            exec(command, function () {
                string = "        ";
                string = string + "<link rel='stylesheet'";
                string = string + " type='text/css'";
                string = string + " href='Styles/style-min.css'>\n";

                output.write(string, script);
            });
        }
    };

    script = function () {
        var scriptFiles, scriptFile, indexFile, writeScripts, writeScript;

        scriptFiles = [
            "../Scripts/page.js",
            "../Scripts/index.js",
            "../Scripts/tools.js",
            "../Scripts/option.js",
            "../Scripts/swipeable.js",
            "../Scripts/imageContainer.js",
            "../Scripts/menu.js",
            "../Scripts/card.js",
            "../Scripts/cards.js",
            "../Scripts/path.js",
            "../Scripts/main.js"
        ];

        writeScript = function () {
            var command, string;

            if (min === false) {
                string = "        ";
                string = string + "<script src='Scripts/script.js'>";
                string = string + "</script>\n";

                output.write(string, crawler);
            } else {
                command = [
                    "java",
                    "-jar",
                    "yuicompressor-2.4.8.jar",
                    "../Scripts/script.js",
                    "-o",
                    "../Scripts/script-min.js"
                ];

                command = command.join(" ");

                exec(command, function () {
                    string = "        ";
                    string = string + "<script";
                    string = string + " src='Scripts/script-min.js'>";
                    string = string + "</script>\n";

                    output.write(string, crawler);
                });
            }
        };

        writeScripts = function () {
            var input;

            input = fs.createReadStream(scriptFiles.shift());

            if (scriptFiles.length) {
                input.pipe(scriptFile, {end: false});
                input.on("end", writeScripts);
            } else {
                input.pipe(scriptFile);
                input.on("end", writeScript);
            }
        };

        scriptFile = fs.createWriteStream("../Scripts/script.js");

        writeScripts();
    };

    crawler = function () {
        makeIndex(function (index) {
            var html, indent, recurse, trail, header;

            header = 2;
            html = "    </head>\n";
            html = html + "    <body>\n";
            indent = "        ";
            html = html + indent + "<div id='crawler'>\n";
            html = html + "";
            trail = ["Content"];

            recurse = function (index) {
                index.forEach(function (pair, i) {
                    if (typeof pair === "string") {
                        trail.push(i + " " + pair + ".html");

                        html = html + indent + "<a href='";
                        html = html + encodeURI(trail.join("/"));
                        html = html + "'>";
                        html = html + pair;
                        html = html + "</a>\n";
                    } else {
                        trail.push(i + " " + pair[0]);

                        html = html + indent + "<h" + header + ">";
                        html = html + pair[0];
                        html = html + "</h" + header + ">\n";
                        html = html + indent + "<div>\n";

                        indent = indent + "    ";

                        if (header < 6) {
                            header = header + 1;
                            recurse(pair[1]);
                            header = header - 1;
                        } else {
                            recurse(pair[1]);
                        }

                        indent = indent.slice(4);

                        html = html + indent + "</div>\n";
                    }

                    trail.pop();
                });
            };

            recurse(index);

            indent = "        ";
            html = html + indent + "</div>\n";

            output.write(html, foot);
        });
    };

    foot = function () {
        var input;

        input = fs.createReadStream("../Markup/foot.html");
        input.pipe(output);
        input.on("end", function () {
            exec('notify-send "Done making page."');
        });
    };

    output = fs.createWriteStream("../index.html");

    min = (process.argv[2] !== "expand");

    head();
}(require, process));
