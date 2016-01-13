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

    page.Swipeable = function (self) {
        self = self || {};

        self.tag.addEventListener("touchstart", function (event) {
            var touches, touch, identifier, x, y, move, end, width;

            move = function (event) {
                var deltaX, deltaY, inside, ratio, box, previous;

                touches = Array.apply(Array, event.changedTouches);

                touches = touches.filter(function (touch) {
                    return identifier === touch.identifier;
                });

                if (touches.length !== 1) {
                    return;
                }

                previous = touch;
                touch = touches[0];

                box = self.tag.getBoundingClientRect();

                inside = true;
                inside = inside && touch.clientX > box.left;
                inside = inside && touch.clientX < box.right;
                inside = inside && touch.clientY > box.top;
                inside = inside && touch.clientY < box.bottom;

                deltaX = previous.clientX - touch.clientX;
                deltaY = previous.clientY - touch.clientY;

                if (!inside || Math.abs(deltaY) > Math.abs(deltaX)) {
                    self.tag.style["transition-duration"] = "1s";
                    self.tag.style.left = "0px";
                    self.tag.style.opacity = "1";
                    self.tag.removeEventListener("touchmove", move);
                    self.tag.removeEventListener("touchend", end);
                    return;
                }

                deltaX = touch.clientX - x;
                deltaY = touch.clientY - y;

                event.preventDefault();
                event.stopPropagation();

                ratio = Math.abs(deltaX) / width;

                self.tag.style.left = deltaX + "px";
                self.tag.style.opacity = 1 - ratio;

                previous = touch;
            };

            end = function (event) {
                var deltaX, deltaY, direction;

                touches = Array.apply(Array, event.changedTouches);

                touches = touches.filter(function (touch) {
                    return identifier === touch.identifier;
                });

                if (touches.length !== 1) {
                    return;
                }

                touch = touches[0];

                deltaX = touch.clientX - x;
                deltaY = touch.clientY - y;

                self.tag.removeEventListener("touchmove", move);
                self.tag.removeEventListener("touchend", end);

                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    return;
                }

                self.tag.style["transition-duration"] = "1s";

                if (Math.abs(deltaX) < width / 4) {
                    self.tag.style.left = "0px";
                    self.tag.style.opacity = "1";
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                self.tag.style.opacity = "0";

                if (deltaX < 0) {
                    self.tag.style.left = "-100%";
                    direction = "left";
                } else {
                    self.tag.style.left = "100%";
                    direction = "right";
                }

                self.tag.addEventListener("transitionend", function listener() {
                    if (window.getComputedStyle(self.tag).opacity === "0") {
                        self.tag.removeEventListener("transitionend", listener);
                        if (self.onSwipe) {
                            self.onSwipe(direction);
                        }
                    }
                });
            };

            touches = Array.apply(Array, event.changedTouches);

            if (touches.length !== 1) {
                return;
            }

            touch = touches[0];

            x = touch.clientX;
            y = touch.clientY;
            identifier = touch.identifier;

            width = window.getComputedStyle(self.tag.parentNode).width;
            width = parseFloat(width);

            self.tag.style["transition-duration"] = "0s";

            self.tag.addEventListener("touchmove", move);
            self.tag.addEventListener("touchend", end);
        });

        self.tag.style["transition-property"] = "left, opacity";
        self.tag.style["transition-timing"] = "linear";
        self.tag.style.position = "relative";

        return self;
    };
}(window, page));
