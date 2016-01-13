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

(function (require, module) {
    "use strict";

    var addIndexEntry, fs, path, sort, clean;

    fs = require("fs");
    path = require("path");

    clean = function (index) {
        return index.map(function (pair) {
            if (typeof pair === "string") {
                return pair.split(" ").slice(1).join(" ").split(".")[0];
            }

            return clean(pair);
        });
    }

    sort = function (index) {
        if (typeof index === "string") {
            return;
        }

        index.sort(function (first, second) {
            if (typeof first !== "string") {
                first = Number(first[0].split(" ")[0]);
            } else {
                first = Number(first.split(" ")[0]);
            }

            if (typeof second !== "string") {
                second = Number(second[0].split(" ")[0]);
            } else {
                second = Number(second.split(" ")[0]);
            }

            return first - second;
        });

        index.forEach(function (pair) {
            if (typeof pair === "string") {
                return;
            }

            sort(pair[1]);
        });

        return index;
    };

    addIndexEntry = function (index, entry) {
        var folders;

        if (path.extname(entry) !== ".html") {
            return;
        }

        folders = entry.split(path.sep).slice(0, -1);
        folders.forEach(function (folder) {
            if (!index.some(function (pair) {
                var name, files;

                name = pair[0];
                files = pair[1];

                if (name === folder) {
                    index = files;
                    return true;
                }

                return false;
            })) {
                index.push([folder, []]);
                index = index[index.length - 1][1];
            }
        });

        index.push(path.basename(entry));
    };

    module.exports = function (callback, folder, index) {
        var root, pending, recursion;

        recursion = function (folder) {

            pending = pending + 1;
            fs.readdir(folder, function (error, entries) {
                pending = pending - 1;

                if (error) {
                    throw error;
                }

                entries.forEach(function (entry) {
                    entry = path.join(folder, entry);

                    pending = pending + 1;
                    fs.stat(entry, function (error, stat) {
                        var folders;

                        pending = pending - 1;

                        if (error) {
                            throw error;
                        }

                        if (stat.isDirectory()) {
                            recursion(entry);
                        } else {
                            addIndexEntry(index, entry);
                        }

                        if (pending === 0) {
                            callback(clean(sort(index[0][1][0][1])));
                        }
                    });
                });
            });
        };

        folder = folder || "../Content";
        index = index || [];
        root = folder;
        pending = 0;

        recursion(folder);
    };
}(require, module));
