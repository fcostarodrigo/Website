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

    page.Option = function (self) {
        self = self || {};
        self.name = self.name || "";
        self.path = self.path || "";

        self.show = function () {
            window.setTimeout(function () {
                self.tag.style.opacity = "1";
            });

            self.tag.addEventListener("mousedown", function () {
                self.tag.classList.add("pressed");
            });

            self.tag.addEventListener("mouseup", function () {
                self.tag.classList.remove("pressed");
            });

            return self;
        };

        self.remove = function (callback) {
            self.tag.style.opacity = "0";
            self.tag.addEventListener("transitionend", function () {
                if (window.getComputedStyle(self.tag).opacity !== "0") {
                    return;
                }

                if (callback) {
                    callback();
                }
            });

            return self;
        };

        self.tag = window.document.createElement("a");
        self.tag.appendChild(window.document.createTextNode(self.name));
        self.tag.href = "#" + encodeURI(self.path);
        self.tag.style.opacity = "0";

        return self;
    };
}(window, page));
