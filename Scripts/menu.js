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

(function (window, page) {
    "use strict";

    page.Menu = function (self) {
        self = self || {};

        self.shouldCollapse = function () {
            var first;

            if (self.loaded.length === 0) {
                return false;
            }

            window.document.body.classList.remove("collapsed");

            first = self.loaded[0].tag.getBoundingClientRect().top;

            return self.loaded.every(function (option) {
                return first === option.tag.getBoundingClientRect().top;
            });
        };

        self.resize = function () {
            if (self.shouldCollapse()) {
                window.document.body.classList.remove("collapsed");
            } else {
                window.document.body.classList.add("collapsed");
            }
            page.fixHeight(self.tag);
        };

        self.sort = function () {
            self.toLoad.sort(function (first, second) {
                return first.order - second.order;
            });

            return self;
        };

        self.clean = function (callback) {
            if (self.loaded.length === 0) {
                if (callback) {
                    callback();
                }

                return self;
            }

            self.loaded.forEach(function (option) {
                option.remove(function () {
                    self.tag.removeChild(option.tag);
                    self.loaded.pop();

                    if (self.loaded.length === 0) {
                        if (callback) {
                            callback();
                        }
                    }
                });
            });

            return self;
        };

        self.load = function (path, callback) {
            return self.clean(function () {
                var option, hashPath;

                if (path.option.hashPath.length === 1) {
                    option = new page.Option({
                        name: "Back",
                        path: page.defaultOption
                    });
                    self.loaded.push(option);
                    self.tag.appendChild(option.tag);
                    option.show();
                } else if (path.option.hashPath.length > 1) {
                    hashPath = path.hashPath.slice(0, -1).join("/");
                    option = new page.Option({name: "Back", path: hashPath});
                    self.loaded.push(option);
                    self.tag.appendChild(option.tag);
                    option.show();
                }

                self.toLoad.forEach(function (option) {
                    self.tag.appendChild(option.tag);
                    option.show();
                });

                self.loaded = self.loaded.concat(self.toLoad);
                self.toLoad = [];

                self.resize();

                if (callback) {
                    callback();
                }
            });
        };

        self.select = function (name) {
            self.loaded.forEach(function (option) {
                if (option.name === name) {
                    option.tag.classList.add("selected");
                } else {
                    option.tag.classList.remove("selected");
                }
            });

            return self;
        };

        self.toLoad = [];
        self.loaded = [];

        self.tag = window.document.querySelector("#menu");
        self.tag.style.height = "0px";
        window.addEventListener("resize", self.resize);

        return self;
    };
}(window, page));
