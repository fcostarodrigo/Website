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

(function (page) {
    "use strict";

    page.Path = function (self) {
        self.equals = function (path) {
            if (self.hashPath.length !== path.hashPath.length) {
                return false;
            }

            return self.hashPath.every(function (name, i) {
                return name === path.hashPath[i];
            });
        };

        self.belong = function (path) {
            if (!self.hashPath.length || !path.hashPath.length) {
                return false;
            }

            return self.option.equals(path.option);
        };

        self.load = function (old) {
            if (!old || !self.leaf.equals(old.leaf)) {
                page.cards.onClean = function () {
                    self.leaf.pathCards.forEach(function (card) {
                        page.cards.toLoad.push(card);
                    });
                    page.cards.sort();
                    page.cards.load(false, function () {
                        if (self.type === "card") {
                            page.cards.select(self.name);
                        }
                    });
                };
                page.cards.clean();
            } else if (self.type === "card") {
                page.cards.select(self.name);
            }

            if (!old || !self.belong(old)) {
                self.option.pathOptions.forEach(function (option) {
                    page.menu.toLoad.push(option);
                });
                page.menu.sort();
                page.menu.load(self, function () {
                    if (self.type !== "option") {
                        page.menu.select(self.leaf.name);
                    }
                });
            } else if (self.type !== "option") {
                page.menu.select(self.leaf.name);
            }

            return self;
        };

        if (typeof self.url === "string") {
            self.url = decodeURI(self.url);
            if (self.url.indexOf("#") === -1) {
                self.hashPath = [];
            } else {
                self.hashPath = self.url.split("#")[1].split("/");
            }
        } else {
            self.hashPath = self.url;
        }

        self.realPath = ["Content"];
        self.node = page.index;

        self.hashPath.forEach(function (name) {
            self.node.some(function (pair, i) {
                if (typeof pair === "string" && name === pair) {
                    self.node = pair;
                    self.realPath.push(i + " " + pair + ".html");
                    return true;
                }
                if (name === pair[0]) {
                    self.node = pair[1];
                    self.realPath.push(i + " " + pair[0]);
                    return true;
                }
                return false;
            });
        });

        self.name = self.hashPath.slice(-1)[0];

        if (typeof self.node === "string") {
            self.type = "card";
            self.leaf = new page.Path({url: self.hashPath.slice(0, -1)});
            self.option = self.leaf.option;
            return self;
        }

        self.pathCards = [];
        self.pathOptions = [];
        self.node.forEach(function (pair, i) {
            var realPath, hashPath;

            if (typeof pair === "string") {
                realPath = i + " " + pair + ".html";
                realPath = self.realPath.concat(realPath).join("/");
                realPath = encodeURI(realPath);
                hashPath = "#" + self.hashPath.concat(pair).join("/");
                self.pathCards.push(new page.Card({
                    name: pair,
                    realPath: realPath,
                    hashPath: hashPath,
                    order: i
                }));
            } else {
                hashPath = self.hashPath.concat(pair[0]).join("/");
                self.pathOptions.push(new page.Option({
                    name: pair[0],
                    path: hashPath,
                    order: i
                }));
                self.option = true;
            }
        });

        if (self.hashPath.length && !self.option) {
            self.type = "leaf";
            self.leaf = self;
            self.option = new page.Path({url: self.hashPath.slice(0, -1)});
        } else {
            self.type = "option";
            self.leaf = self;
            self.option = self;
        }

        return self;
    };
}(page));
