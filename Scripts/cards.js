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

    page.Cards = function (self) {
        self = self || {};

        self.sort = function () {
            self.toLoad.sort(function (first, second) {
                return second.order - first.order;
            });

            return self;
        };

        self.clean = function () {
            var loading;

            if (self.cleaning) {
                return;
            }

            self.cleaning = true;

            loading = self.tag.querySelector(".loading");
            if (loading) {
                self.tag.removeChild(loading);
            }

            if (self.loaded.length === 0) {
                self.loaded = [];
                self.toLoad = [];
                self.removals = [];
                self.removing = false;
                self.cleaning = false;

                if (self.onClean) {
                    self.onClean();
                }
                return;
            }

            self.tag.style["transition-duration"] = "1s";
            window.setTimeout(function () {
                self.tag.style.left = "-" + window.innerWidth + "px";
                self.tag.style.opacity = "0";
                self.tag.addEventListener("transitionend", function f() {
                    if (window.getComputedStyle(self.tag).opacity !== "0") {
                        return;
                    }

                    self.tag.removeEventListener("transitionend", f);

                    self.loaded.forEach(function (card) {
                        self.tag.removeChild(card.outline);
                    });

                    self.tag.style["transition-duration"] = "0s";
                    self.tag.style.left = "0px";
                    self.tag.style.opacity = "1";
                    self.loaded = [];
                    self.toLoad = [];
                    self.removals = [];
                    self.removing = false;
                    self.cleaning = false;

                    if (self.onClean) {
                        self.onClean();
                    }
                });
            });

            return self;
        };

        self.select = function (name, callback) {
            var card, cards;

            cards = self.loaded.filter(function (card) {
                return card.name === name;
            });

            if (cards.length < 1) {
                if (self.toLoad.length !== 0) {
                    self.load(true, function () {
                        self.select(name);
                    });
                }
            } else {
                self.loaded.forEach(function (card) {
                    card.tag.classList.remove("selected");
                });

                card = cards[0];
                card.tag.classList.add("selected");
                card.tag.scrollIntoView(true);

                if (callback) {
                    callback();
                }
            }

            return self;
        };

        self.removeEnd = function (card, callback) {
            card.shrink(function () {
                self.tag.removeChild(card.outline);

                if (callback) {
                    callback();
                }
            });

            return self;
        };

        self.removeMiddle = function (card, callback) {
            var distance, moving, container;

            distance = parseFloat(window.getComputedStyle(card.outline).height);

            moving = self.loaded.filter(function (loaded) {
                return loaded.order < card.order;
            });

            container = window.document.createElement("div");
            container.style.position = "relative";
            container.style.transition = "top 1s";
            container.style.top = "0px";
            self.tag.insertBefore(container, moving[0].outline);
            moving.forEach(function (card) {
                container.appendChild(card.outline);
            });

            container.addEventListener("transitionend", function f() {
                var top;

                top = "-" + distance + "px";
                if (window.getComputedStyle(container).top !== top) {
                    return;
                }

                container.removeEventListener("transitionend", f);

                moving.forEach(function (card) {
                    self.tag.insertBefore(card.outline, container);
                });

                self.tag.removeChild(container);
                self.tag.appendChild(card.outline);
                card.shrink(function () {
                    self.tag.removeChild(card.outline);

                    if (callback) {
                        callback();
                    }
                });
            });

            window.setTimeout(function () {
                container.style.top = "-" + distance + "px";
            });

            return self;
        };

        self.remove = function (card, callback) {
            var pop;

            pop = function () {
                var removal, last, finish;

                finish = function () {
                    self.removing = false;

                    self.scroll();

                    if (removal.callback) {
                        removal.callback();
                    }

                    if (self.removals.length > 0) {
                        pop();
                    }
                };

                self.removing = true;
                removal = self.removals.pop();
                last = self.loaded.slice(-1)[0];
                self.loaded = self.loaded.filter(function (loaded) {
                    return loaded.name !== removal.card.name;
                });

                if (last === removal.card) {
                    self.removeEnd(removal.card, finish);
                } else {
                    self.removeMiddle(removal.card, finish);
                }
            };

            self.removals.push({
                card: card,
                callback: callback
            });

            if (self.removing === false) {
                pop();
            }

            return self;
        };

        self.scroll = function () {
            var last;

            if (self.loaded.lenght === 0) {
                return self;
            }

            last = self.loaded.slice(-1)[0].outline;

            if (last && window.innerHeight > last.getBoundingClientRect().top) {
                window.removeEventListener("scroll", self.scroll);
                self.load(false);
            }

            return self;
        };

        self.load = function (show, callback) {
            var message, loading, count;

            if (self.toLoad.length === 0) {
                if (callback) {
                    callback();
                }

                return;
            }

            message = window.document.createElement("p");
            message.classList.add("loading");
            message.appendChild(window.document.createTextNode("LOADING"));
            self.tag.appendChild(message);

            if (show) {
                message.scrollIntoView(true);
            }

            loading = self.toLoad.splice(0, Math.min(self.toLoad.length, 6));
            count = loading.length;

            loading.forEach(function (card) {
                self.tag.appendChild(card.outline);
                card.load(function () {
                    count = count - 1;

                    if (count !== 0) {
                        return;
                    }

                    count = loading.length;
                    self.tag.removeChild(message);
                    self.loaded = self.loaded.concat(loading);

                    loading.forEach(function (card) {
                        card.show(function () {
                            count = count - 1;

                            if (count !== 0) {
                                return;
                            }

                            if (self.toLoad.length !== 0) {
                                window.addEventListener("scroll", self.scroll);
                                self.scroll();
                            }

                            if (callback) {
                                callback();
                            }
                        });
                    });
                });
            });

            return self;
        };

        self.loaded = [];
        self.toLoad = [];
        self.removals = [];
        self.removing = false;
        self.cleaning = false;

        self.tag = window.document.querySelector("#cards");
        self.tag.style.left = "0px";
        self.tag.style.opacity = "1";

        return self;
    };
}(window, page));
