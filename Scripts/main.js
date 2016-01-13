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

    window.addEventListener("load", function () {
        height = window.getComputedStyle(page.footer).height;
        page.cards.tag.style["padding-bottom"] = height;
    });

    window.addEventListener("DOMContentLoaded", function () {
        var path, height;

        page.index = new page.Index();
        page.menu = new page.Menu();
        page.cards = new page.Cards();
        page.footer = window.document.querySelector("#footer");

        window.addEventListener("hashchange", function (event) {
            var oldPath, newPath;

            oldPath = new page.Path({url: event.oldURL});
            newPath = new page.Path({url: event.newURL});
            newPath.load(oldPath);
        });

        if (window.location.hash) {
            path = new page.Path({url: window.location.hash});
            path.load();
        } else {
            window.location.hash = "#" + page.defaultOption;
        }
    });
}(window, page));
