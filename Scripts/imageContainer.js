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

    page.ImageContainer = function (self) {
        var interval;

        self = self || {};

        self.images = self.tag.querySelectorAll("img");
        self.images = Array.apply(Array, self.images);

        self.fitImages = function () {
            self.images.filter(function (image) {
                return image.complete;
            }).forEach(function (image) {
                var width, height, ratio;

                width = window.getComputedStyle(image.offsetParent).width;
                width = Math.round(parseFloat(width));

                height = window.getComputedStyle(image.offsetParent).height;
                height = Math.round(parseFloat(height));

                ratio = image.naturalHeight / image.naturalWidth;

                image.width = image.naturalWidth;
                image.height = image.naturalHeight;

                if (image.width > width) {
                    image.width = width;
                    image.height = ratio * width;
                }

                if (image.height > height) {
                    image.height = height;
                    image.width = image.height / ratio;
                }
            });

            return self;
        };

        interval = window.setInterval(function () {
            var allComplete;

            allComplete = self.images.every(function (image) {
                return image.complete;
            });

            if (allComplete) {
                window.clearInterval(interval);

                if (self.onImagesLoad) {
                    self.onImagesLoad();
                }
            }
        }, 1000);

        return self;
    };
}(window, page));
