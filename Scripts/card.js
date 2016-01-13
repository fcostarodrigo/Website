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

(function (window, XMLHttpRequest, page) {
    "use strict";

    page.Card = function (self) {
        self = self || {};
        self.realPath = self.realPath || "";
        self.hashPath = self.hashPath || "";
        self.name = self.name || "";

        self.resize = function () {
            page.fixHeight(self.outline, function () {
                var height;

                self.fitImages();

                height = window.getComputedStyle(page.footer).height;
                page.cards.tag.style["padding-bottom"] = height;
            });
        };

        self.load = function (callback) {
            var request;

            request = new XMLHttpRequest();
            request.open("GET", self.realPath);
            request.addEventListener("load", function () {
                var a, text, header, date;

                text = window.document.createTextNode(self.name);
                header = window.document.createElement("h2");
                header.appendChild(text);

                a = window.document.createElement("a");
                a.href = self.hashPath;
                a.appendChild(header);

                text = new Date(request.getResponseHeader("Last-Modified"));
                text = window.document.createTextNode(text.toLocaleString());
                date = window.document.createElement("p");
                date.classList.add("date");
                date.appendChild(text);

                self.tag = window.document.createElement("div");
                self.tag.classList.add("card");
                self.tag.innerHTML = request.response;
                self.tag.insertBefore(a, self.tag.children[0]);
                self.tag.appendChild(date);

                if (callback) {
                    callback();
                }
            });

            request.send();

            return self;
        };

        self.show = function (callback) {
            window.addEventListener("resize", self.resize);

            page.ImageContainer(self);
            self.onImagesLoad = self.fitImages;

            page.Swipeable(self).onSwipe = function () {
                page.cards.remove(self);
            };

            self.outline.appendChild(self.tag);
            self.outline.style.opacity = "1";
            self.outline.addEventListener("transitionend", function f() {
                if (window.getComputedStyle(self.outline).opacity === "1") {
                    self.outline.removeEventListener("transitionend", f);

                    if (callback) {
                        callback();
                    }
                }
            });

            return self;
        };

        self.shrink = function (callback) {
            var height;

            height = window.getComputedStyle(self.outline).height;
            self.outline.style.height = height;

            window.setTimeout(function () {
                self.outline.style.height = "0px";
                self.outline.addEventListener("transitionend", function f() {
                    height = window.getComputedStyle(self.outline).height;

                    if (height === "0px") {
                        self.outline.removeEventListener("transitionend", f);
                        window.removeEventListener("resize", self.resize);

                        if (callback) {
                            callback();
                        }
                    }
                });
            });
        };

        self.outline = window.document.createElement("div");
        self.outline.classList.add("outline");
        self.outline.style.opacity = "0";

        return self;
    };
}(window, XMLHttpRequest, page));
