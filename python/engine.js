CLASSIC = 1;
SPOOKY = 2;
COLLAPSE = 3;
START_SPOOKY = 1;
FINISH_SPOOKY = 2;
MEASURE = 3;

function State() {
    this.square = function (d) {
        return this.squares[d - 1]
    };
    this.update = function () {
        this._findCycle();
        this.validMoves = this.getValidMoves();
        this.validSquares = [];
        if (this.outcome = this.getOutcome()) for (var d = 0; d < 9; d++) for (var g = 0; g < this.squares[d].marks.length; g++) {
                    var e = this.squares[d].marks[g];
                    e.type == SPOOKY && e.destroy()
        } else {
            this.turn = !this.moves.length || this.moves.length && (last = this.moves[this.moves.length - 1]) && last.player == 2 && last.type != COLLAPSE || last.player == 1 && last.type == COLLAPSE ? 1 : 2;
            g = [];
            if (this.cycleSquares) {
                e = this.cycleSquares;
                for (d = 0; d < e.length; d++) g[e[d]] = true;
                this.nextAction = MEASURE;
                this.turn == 1 && qtpy.status.queue("Your turn (Make a measurement)")
            } else {
                e = this.validMoves;
                for (d = 0; d < e.length; d++) {
                    g[parseInt(e[d][0])] = true;
                    g[parseInt(e[d][1])] = true
                }
                if (e.length > 1) {
                    this.nextAction = START_SPOOKY;
                    this.turn == 1 && window.qtpy && qtpy.status && qtpy.status.queue("Your turn (1 of 2)")
                }
            } if (this.turn == 1) {
                this.validSquares = g;
                this.botSquares = null
            } else this.botSquares = g
        }
    };
    this.step = function (d) {
        if (this.moves.length) {
            var g =
                this.moves[this.moves.length - 1];
            if (g.sq1 == d.sq1 && g.sq2 == d.sq2 && g.autoCollapsed) return
        }
        var e = this;
        if (d.type == CLASSIC) {
            g = this.square(d.sq1);
            ra.circle(g.rect.attr("x") + g.rect.attr("width") / 2, g.rect.attr("y") + g.rect.attr("height") / 2, 0).attr({
                fill: qtpy.color(d.player),
                stroke: qtpy.color(d.player)
            }).animate({
                r: 35
            }, 500, "bounce");
            g.marks = [new Mark(g, CLASSIC, d.player, d.weight)]
        } else if (d.type == SPOOKY) {
            a = new Mark(this.square(d.sq1), SPOOKY, d.player, d.weight);
            b = new Mark(this.square(d.sq2), SPOOKY, d.player, d.weight,
                a);
            a.link = b;
            this.square(d.sq1).marks.push(a);
            this.square(d.sq2).marks.push(b);
            if (d.player == 2) {
                this.square(d.sq1).startSpooky(2, this.weight);
                this.square(d.sq2).finishSpooky(2, this.square(d.sq1), this.weight)
            }
        } else d.type == COLLAPSE && this.square(d.sq2).collapse(this.cycleSquares.slice(0));
        this.moves.push(d);
        this.weight++;
        this.update();
        if (this.outcome) {
            e.moves[e.moves.length - 1].player == 1 && $.post("/getmove", {
                state: e.dumps()
            });
            safeTimeout($game, function () {
                for (var f = e.outcome[2], h = [], c = 0; c < f.length; c++) for (var j =
                        1; j < f[c].length; j++) if (!h[f[c][j]]) {
                            e.square(f[c][j]).rect.animate({
                                fill: qtpy.lightColor(f[c][0])
                            }, 500);
                            h[f[c][j]] = true
                        }
                for (c = 1; c <= 9; c++) h[c] || e.square(c).rect.animate({
                        fill: "#FFF"
                    }, 500);
                var n, o;
                if (e.outcome[0] == e.outcome[1]) {
                    n = "No winner";
                    o = "#000"
                } else {
                    if (e.outcome[0] > e.outcome[1]) {
                        f = ["You", 0, 1];
                        o = "#00F"
                    } else {
                        f = ["I", 1, 0];
                        o = "#F00"
                    }
                    h = function (k) {
                        if (k == 0.5) return "&#189;";
                        if (k == 1.5) return "1&#189;";
                        return k.toString()
                    };
                    n = f[0] + " win (" + h(e.outcome[f[1]]) + " to " + h(e.outcome[f[2]]) + ")"
                } if ($(document.body).is(".mobileSafari")) var p = function () {
                        qtpy.status.queue(n, o);
                        safeTimeout($game, function () {
                            qtpy.status.queue("Flip for new game");
                            safeTimeout($game, p, 3E3)
                        }, 3E3)
                };
                else {
                    safeTimeout($game, function () {
                        $(document.body).dblclick(safeCallback($game, function () {
                            $(document.body).is(".info") || qtpy.newGame()
                        }))
                    }, 500);
                    $('<div id="capture">').prependTo(document.body);
                    p = function () {
                        qtpy.status.queue(n, o);
                        safeTimeout($game, function () {
                            qtpy.status.queue("Double-click for new game");
                            safeTimeout($game, p, 3E3)
                        }, 3E3)
                    }
                }
                p()
            })
        } else {
            if (d.player == 1 && d.type !=
                COLLAPSE) {
                qtpy.status.queue("My turn (Thinking...)");
                (function (f) {
                    safeTimeout($game, function () {
                        $.post("/getmove", {
                            state: f,
                            difficulty: window.difficulty
                        }, safeCallback($game, function (h) {
                            bot = h[0];
                            if (bot.length) {
                                h = bot.split("/");
                                for (var c = function (n) {
                                    safeTimeout($game, function () {
                                        e.step(new Move(2, e.weight, parseInt(n[0]), parseInt(n[1])))
                                    })
                                }, j = 0; j < h.length; j++) c(h[j])
                            }
                        }))
                    }, 2)
                })(e.dumps())
            }
            if (e.cycleSquares) {
                g = false;
                for (var i = 1; i <= 9; i++) if (e.diverseSquares[i]) {
                        g = true;
                        break
                    }
                if (!g) {
                    var m = e.cycleSquares.slice(0);
                    m.sort();
                    safeTimeout($game, function () {
                        e.step(new Move(parseInt(!(d.player - 1) + 1), e.weight, 0, m[0], true))
                    });
                    return
                }
            }
            e.indicateValidSquares(function () {
                if (e.validMoves.length == 1) {
                    var f = parseInt(e.validMoves[0][0]);
                    safeTimeout($game, function () {
                        e.step(new Move(1, e.weight, f, f))
                    })
                } else if ((d.player == 2 && d.type != COLLAPSE || d.player == 1 && d.type == COLLAPSE) && !e.cycleSquares && e.validMoves.length == 2 && e.validMoves[0][0] == e.validMoves[1][1] && e.validMoves[0][1] == e.validMoves[1][0]) {
                    var h = parseInt(e.validMoves[0][0]),
                        c = parseInt(e.validMoves[0][1]);
                    safeTimeout($game, function () {
                        e.step(new Move(1, e.weight, h, c));
                        e.square(h).startSpooky(1, e.weight);
                        e.square(c).finishSpooky(1, e.square(h), e.weight)
                    })
                }
            });
            for (i = 0; i < 9; i++) this.squares[i].clicked = false
        }
    };
    this.indicateValidSquares = function (d) {
        function g() {
            ++i == e && d && d()
        }
        var e = 0,
            i = 0;
        if (this.cycleSquares) {
            for (var m = [], f = 0; f < 9; f++) {
                for (var h = false, c = 0; c < this.cycleSquares.length; c++) if (this.cycleSquares[c] == f + 1) {
                        h = true;
                        break
                    }
                if (!h) {
                    m[f + 1] = true;
                    e++;
                    this.squares[f].rect.animate({
                        fill: "#666"
                    },
                        250, g)
                }
            }
            for (f = 1; f <= 9; f++) {
                var j = this.square(f);
                h = false;
                for (c = 0; c < this.cycleSquares.length; c++) if (this.cycleSquares[c] == f) {
                        h = true;
                        break
                    }
                if (h && !this.diverseSquares[f]) {
                    j.marked = true;
                    m[j.num] = true;
                    e++;
                    j.rect.animate({
                        fill: "#CCC"
                    }, 250, g);
                    c = function (r, s, q, w) {
                        return safeCallback($game, function () {
                            r.hide();
                            s.attr({
                                cx: q,
                                cy: w
                            });
                            g()
                        })
                    };
                    var n = function (r, s, q, w) {
                        return safeCallback($game, function () {
                            r.toFront().attr({
                                cx: q,
                                cy: w
                            });
                            g()
                        })
                    }, o = false;
                    h = false;
                    for (var p, k = 0; k < j.marks.length; k++) for (var l = 0; l < this.cycleMarks.length; l++) if (j.marks[k] ==
                                this.cycleMarks[l]) {
                                p = j.marks[k].player;
                                break
                            }
                    var t = qtpy.color(p),
                        x = j.rect.attr("x") + j.rect.attr("width") / 2,
                        y = j.rect.attr("y") + j.rect.attr("height") / 2;
                    for (k = 0; k < j.marks.length; k++) {
                        o = false;
                        if (l = j.marks[k].spooky) {
                            if (j.marks[k].player == p) {
                                if (!h) o = h = true;
                                e += 2;
                                l.stop().hide();
                                var u = ra.circle(l.attr("cx"), l.attr("cy"), l.attr("r")).attr({
                                    fill: t,
                                    stroke: t
                                });
                                u.behindBoard().animate({
                                    cx: x,
                                    cy: y,
                                    r: 35
                                }, 250, "bounce", o ? n(u, l, x, y) : c(u, l, x, y));
                                l.orbit.animate({
                                    opacity: 0
                                }, 250, g);
                                l.animation = u;
                                l.hide()
                            }
                        } else if (j.spooky) {
                            j.spooky.stop().hide();
                            j.spooky.orbit.hide()
                        }
                    }
                }
            }
            var z = function (r) {
                r.animateCollapse();
                for (var s = r.square, q = 0; q < s.marks.length; q++) s.marks[q] != r && z(s.marks[q].link)
            };
            for (f = 0; f < this.cycleSquares.length; f++) {
                j = this.square(this.cycleSquares[f]);
                for (c = 0; c < j.marks.length; c++) {
                    l = j.marks[c];
                    h = false;
                    for (k = 0; k < this.cycleMarks.length; k++) if (this.cycleMarks[k] == l) h = true;
                    h || z(l.link)
                }
            }
            for (f = 1; f <= 9; f++) if (!m[f]) {
                    e++;
                    this.square(f).rect.animate({
                        fill: "#FFF"
                    }, 250, g)
                }
        } else if (!this.cycleSquares) {
            e = 9;
            m = this.validSquares;
            if (this.turn == 2) m =
                    this.botSquares;
            for (f = 1; f <= 9; f++) m[f] ? this.square(f).rect.animate({
                    fill: "#FFF"
                }, 250, g) : this.square(f).rect.animate({
                    fill: "#CCC"
                }, 250, g)
        }
    };
    this.getOutcome = function () {
        function d(j) {
            return m.squares[j].marker()
        }
        function g(j, n) {
            return m.squares[j * 3 + n].marks[0].weight
        }
        function e(j, n, o) {
            return Math.max(Math.max(j, n), o)
        }
        function i(j, n, o, p, k, l, t) {
            f[j - 1].push(e(g(n, o), g(p, k), g(l, t)));
            h.push([j, n * 3 + o + 1, p * 3 + k + 1, l * 3 + t + 1])
        }
        var m = this,
            f = [
                [],
                []
            ],
            h = [],
            c = [
                [d(0), d(1), d(2)],
                [d(3), d(4), d(5)],
                [d(6), d(7), d(8)]
            ];
        c[0][0] &&
            c[0][0] == c[0][1] && c[0][0] == c[0][2] && i(c[0][0], 0, 0, 0, 1, 0, 2);
        c[1][0] && c[1][0] == c[1][1] && c[1][0] == c[1][2] && i(c[1][0], 1, 0, 1, 1, 1, 2);
        c[2][0] && c[2][0] == c[2][1] && c[2][0] == c[2][2] && i(c[2][0], 2, 0, 2, 1, 2, 2);
        c[0][0] && c[0][0] == c[1][0] && c[0][0] == c[2][0] && i(c[0][0], 0, 0, 1, 0, 2, 0);
        c[0][1] && c[0][1] == c[1][1] && c[0][1] == c[2][1] && i(c[0][1], 0, 1, 1, 1, 2, 1);
        c[0][2] && c[0][2] == c[1][2] && c[0][2] == c[2][2] && i(c[0][2], 0, 2, 1, 2, 2, 2);
        c[0][0] && c[0][0] == c[1][1] && c[0][0] == c[2][2] && i(c[0][0], 0, 0, 1, 1, 2, 2);
        c[0][2] && c[0][2] == c[1][1] && c[0][2] ==
            c[2][0] && i(c[0][2], 0, 2, 1, 1, 2, 0);
        if (f[0].length) {
            if (f[0].length == 1) {
                if (f[1].length) {
                    if (f[0][0] < f[1][0]) return [1, 0.5, h];
                    return [0.5, 1, h]
                }
                return [1, 0, h]
            }
            if (f[0][0] == f[0][1]) return [2, 0, h];
            return [1.5, 0, h]
        } else if (f[1].length) return [0, 1, h];
        empty = false;
        for (c = 0; c < 9; c++) m.squares[c].isClassic() || (empty = true);
        if (!empty) return [0, 0, h];
        return null
    };
    this.getValidMoves = function () {
        for (var d = false, g = 0, e = [], i = 0; i < 9; i++) if (this.squares[i].marks.length) if (this.squares[i].marks[0].type == CLASSIC) g++;
                else e.push(i);
                else {
                    d =
                        i + 1;
                    e.push(i)
                }
        if (g == 8 && d !== false) return [d.toString() + d.toString()];
        valid = [];
        if (cycle = this.cycleSquares) {
            for (i = 0; i < cycle.length; i++) valid.push("0" + cycle[i].toString());
            return valid
        }
        e.sort();
        for (i = 0; i < e.length; i++) for (d = 0; d < e.length; d++) i != d && valid.push((e[i] + 1).toString() + (e[d] + 1).toString());
        return valid
    };
    this._findCycle = function () {
        for (var d = 0; d < 9; d++) if (path = this.squares[d].findPath()) {
                this.cycleSquares = path[0];
                this.cycleMarks = path[1];
                this.diverseSquares = [];
                for (d = 0; d < this.cycleSquares.length; d++) {
                    for (var g =
                        this.square(this.cycleSquares[d]), e = false, i = null, m = this.cycleMarks.slice(0), f = 0; f < g.marks.length; f++) {
                        for (var h = g.marks[f], c = 0; c < m.length; c++) if (m[c] == h) {
                                if (i === null) i = h.player;
                                else if (i != h.player) {
                                    e = true;
                                    break
                                }
                                m.splice(c, 1)
                            }
                        if (e) break
                    }
                    if (e) this.diverseSquares[g.num] = true
                }
                return
            }
        this.diverseSquares = this.cycleMarks = this.cycleSquares = null
    };
    this.validMove = function (d) {
        moves = this.validMoves;
        notation = d.dumps();
        for (d = 0; d < moves.length; d++) if (moves[d] == notation) return true;
        return false
    };
    this.dumps = function () {
        for (var d = [], g = 0; g < this.moves.length; g++) d.push(this.moves[g].dumps());
        return d.join("/")
    };
    this.weight = 1;
    this.squares = [];
    this.moves = [];
    this.cycleMarks = this.cycleSquares = this.outcome = null;
    this.nextAction = START_SPOOKY;
    for (var v = 0; v < 9; v++) this.squares[v] = new Square(v + 1);
    this.update()
};

function Status() {
    this.flash = function (d, c) {
        if (!this.flashing) {
            this.flashing = true;
            var b = [this.el.html(), this.el.css("color")];
            this.queue(d, c, b);
            d = this
        }
    };
    this.queue = function (d, c, b) {
        c = c || "#000";
        var a = this,
            h = a.msg.length + 1,
            g = safeCallback($game, function () {
                if (b || a.msg.length == h) {
                    var e;
                    e = b ? a.msg[0] : a.msg.pop();
                    a.el.html(e[0]).css("color", e[1]).animate({
                        opacity: 1
                    }, 500);
                    if (b) a.msg = a.msg.slice(1);
                    else {
                        a.msg = [];
                        a.snoozing = false
                    }
                }
                b && safeTimeout($game, function () {
                    a.el.stop().animate({
                        opacity: 0
                    }, 500, null, safeCallback($game, function () {
                        a.flashing = false;
                        var f = a.msg.pop();
                        a.queue(f[0], f[1])
                    }))
                }, 1500)
            });
        if (b) {
            this.msg.push(b);
            this.msg = [
                [d, c]
            ].concat(this.msg)
        } else this.msg.push([d, c]); if (b || !this.snoozing && !this.flashing) {
            this.snoozing = true;
            this.el.stop().animate({
                opacity: 0
            }, 500, null, g)
        } else this.flashing || safeTimeout($game, g, 500)
    };
    this.el = $('<div id="status">').appendTo($game);
    this.msg = []
};

function Square(n) {
    this.findPath = function (b, a) {
        b = b || this;
        a = a || [];
        for (var f = 0; f < this.marks.length; f++) {
            for (var c = this.marks[f], d = false, e = 0; e < a.length; e++) if (a[e] == c) {
                    d = true;
                    break
                }
            if (!d) if (c.type == SPOOKY) if (c.link.square == b) return [[m.num], [c, c.link]];
                    else {
                        a.push(c);
                        a.push(c.link);
                        d = c.link.square.findPath(b, a);
                        if (d !== null) {
                            d[0].push(m.num);
                            d[1].push(c);
                            d[1].push(c.link);
                            return d
                        }
                    }
        }
        return null
    };
    this.isClassic = function () {
        if (!m.marks.length) return false;
        if (m.marks[0].type == CLASSIC) return true;
        return false
    };
    this.marker = function () {
        if (!m.marks.length) return null;
        if (m.marks[0].type == CLASSIC) return m.marks[0].player;
        return null
    };
    this.collapse = function (b) {
        var a = null;
        b.sort();
        for (var f = 0, c = qtpy.state.square(b[0]).marks; f < c.length; f++) for (var d = c[f], e = 0; e < b.length; e++) if (d.link.square.num == b[e]) if (a === null) a = d;
                    else if (d.weight < a.weight) {
            a = d;
            break
        }
        this.num == b[0] ? a.goClassic() : a.link.goClassic()
    };
    this.newSpooky = function (b, a, f) {
        function c() {
            j.animateAlong(j.orbit, o, false, safeCallback($game, function () {
                if (!(j.classic ||
                    d.marked)) {
                    if (qtpy.state.outcome) {
                        j.hide();
                        j.orbit.hide();
                        j.link.hide()
                    }
                    f ? j.attr({
                        cx: g + i / 2,
                        cy: h + l / 2 + k
                    }) : j.attr({
                        cx: g + i / 2,
                        cy: h + l / 2 - k
                    });
                    safeTimeout($game, c)
                }
            }))
        }
        if (!this.marked) {
            var d = this,
                e = this.rect,
                g = e.attr("x"),
                h = e.attr("y"),
                i = e.attr("width"),
                l = e.attr("height"),
                k = a * 5 - a * a / 20;
            e = qtpy.color(b);
            b = ra.circlePath(g + i / 2, h + l / 2, k, f).attr({
                fill: null,
                stroke: qtpy.lightColor(b),
                cx: g + i / 2,
                cy: h + l / 2,
                r: k
            }).behindBoard();
            var j = ra.circle().attr({
                fill: e,
                stroke: e,
                r: 3,
                cx: g + i / 2,
                cy: h + l / 2 + (f ? k : -k)
            });
            j.orbit = b;
            var o = a * a * 750 +
                250;
            c();
            return j
        }
    };
    this.startSpooky = function (b, a) {
        this.spooky = this.newSpooky(b, a || qtpy.state.weight);
        qtpy.state.spookySquare = this
    };
    this.finishSpooky = function (b, a, f) {
        function c() {
            h.attr("path", "M" + d.attr("cx") + "," + d.attr("cy") + "L" + e.attr("cx") + "," + e.attr("cy"))
        }
        if (!this.marked) {
            var d = a.spooky,
                e = this.newSpooky(b, f || qtpy.state.weight, true);
            f = a.marks[a.marks.length - 1];
            var g = this.marks[this.marks.length - 1],
                h = ra.path().attr("stroke", qtpy.lightColor(b)).behindBoard();
            d.link = h;
            e.link = h;
            f.spooky = d;
            f.orbit =
                d.orbit;
            f.line = d.link;
            g.spooky = e;
            g.orbit = e.orbit;
            g.line = e.link;
            delete a.spooky;
            d.onAnimation(c);
            e.onAnimation(c)
        }
    };
    this.click = function () {
        if (!(this.clicked || !qtpy.state.validSquares[this.num])) {
            switch (qtpy.state.nextAction) {
                case START_SPOOKY:
                    this.startSpooky(1);
                    qtpy.state.nextAction = FINISH_SPOOKY;
                    qtpy.status.queue("Your turn (2 of 2)");
                    break;
                case FINISH_SPOOKY:
                    if (this.spooky) return;
                    var b = qtpy.state.spookySquare.num,
                        a = this.num;
                    if (b > a) {
                        var f = b;
                        b = a;
                        a = f
                    }
                    qtpy.state.step(new Move(1, qtpy.state.weight, b, a));
                    this.finishSpooky(1, qtpy.state.spookySquare, qtpy.state.weight - 1);
                    break;
                case MEASURE:
                    if (!qtpy.state.diverseSquares[this.num]) return;
                    var c = null;
                    b = qtpy.state.cycleSquares.slice(0);
                    b.sort();
                    a = qtpy.state.square(b[0]);
                    c = null;
                    for (f = 0; f < a.marks.length; f++) for (var d = a.marks[f], e = 0; e < b.length; e++) if (d.link.square.num == b[e]) if (c === null || d.weight < c.weight) c = d;
                    var g = [],
                        h = function (i) {
                            g[i.square.num] = i.player;
                            for (var l = 0; l < i.square.marks.length; l++) {
                                var k = i.square.marks[l];
                                k == i || g[k.link.square.num] || h(k.link)
                            }
                        };
                    h(c);
                    g[this.num] == 1 ? safeTimeout($game, function () {
                        qtpy.state.step(new Move(1, c.weight, 0, c.square.num))
                    }) : safeTimeout($game, function () {
                        qtpy.state.step(new Move(1, c.weight, 0, c.link.square.num))
                    });
                    break;
                default:
                    return
            }
            m.validSquares = [];
            this.clicked = true
        }
    };
    this.num = n;
    this.marks = [];
    this.rect = ra.rect().attr({
        width: 104,
        height: 104,
        "stroke-width": 0,
        stroke: "transparent",
        fill: "#FFF"
    });
    n >= 3 && n <= 6 && this.rect.attr("height", 105);
    switch (n) {
        case 1:
            this.rect.attr({
                x: 2,
                y: 2 + qtpy.boardOffset
            });
            break;
        case 2:
            this.rect.attr({
                x: 108,
                y: 2 + qtpy.boardOffset
            });
            break;
        case 3:
            this.rect.attr({
                x: 214,
                y: 2 + qtpy.boardOffset
            });
            break;
        case 4:
            this.rect.attr({
                x: 2,
                y: 107 + qtpy.boardOffset
            });
            break;
        case 5:
            this.rect.attr({
                x: 108,
                y: 107 + qtpy.boardOffset
            });
            break;
        case 6:
            this.rect.attr({
                x: 214,
                y: 107 + qtpy.boardOffset
            });
            break;
        case 7:
            this.rect.attr({
                x: 2,
                y: 214 + qtpy.boardOffset
            });
            break;
        case 8:
            this.rect.attr({
                x: 108,
                y: 214 + qtpy.boardOffset
            });
            break;
        case 9:
            this.rect.attr({
                x: 214,
                y: 214 + qtpy.boardOffset
            });
            break
    }
    var m = this
};

function Move(c, d, a, b, e) {
    this.dumps = function () {
        return this.sq1.toString() + this.sq2.toString()
    };
    this.player = c;
    this.weight = d;
    this.sq1 = parseInt(a);
    this.sq2 = parseInt(b);
    if (a && b && a == b) this.type = CLASSIC;
    else if (a && b) this.type = SPOOKY;
    else if (a == 0 && b) this.type = COLLAPSE;
    if (e) this.autoCollapsed = true
};

function Mark(f, g, h, i, j) {
    this.goClassic = function () {
        var c = [],
            a = this;
        for (a = 0; a < this.square.marks.length; a++) {
            var b = this.square.marks[a];
            b != this && c.push(b)
        }
        this.square.marks = [new Mark(this.square, CLASSIC, this.player, this.weight)];
        for (a = 0; a < c.length; a++) {
            b = c[a];
            b.link.square.isClassic() || b.link.goClassic()
        }
        this.classic || this.animateCollapse()
    };
    this.destroy = function () {
        if (this.spooky) {
            this.spooky.animate({
                opacity: 0
            }, 500, null, function () {
                this.hide()
            });
            this.orbit.animate({
                opacity: 0
            }, 500, null, function () {
                this.hide()
            });
            this.line.animate({
                opacity: 0
            }, 500, null, function () {
                this.hide()
            })
        }
    };
    this.animateHide = function () {
        if (this.spooky) {
            this.spooky.stop();
            this.spooky.orbit.animate({
                opacity: 0
            }, 500, null, function () {
                this.hide()
            });
            this.spooky.link.animate({
                opacity: 0
            }, 500, null, function () {
                this.hide()
            })
        }
        if (this.link && this.link.spooky) {
            this.link.spooky.orbit.animate({
                opacity: 0
            }, 500, null, function () {
                this.hide()
            });
            this.link.spooky.animate({
                r: 0
            }, 500, null, function () {
                this.hide()
            })
        }
    };
    this.animateCollapse = function () {
        var c = qtpy.color(this.player),
            a = this.square.rect.attr("x") + this.square.rect.attr("width") / 2,
            b = this.square.rect.attr("y") + this.square.rect.attr("height") / 2,
            e = ra.circle(this.spooky ? this.spooky.attr("cx") : a, this.spooky ? this.spooky.attr("cy") : b, this.spooky ? this.spooky.attr("r") : 3).attr({
                fill: c,
                stroke: c
            }).behindBoard();
        this.classic = true;
        this.animateHide();
        if (this.square.marked) this.spooky && this.spooky.hide();
        else {
            e.animate({
                cx: a,
                cy: b,
                r: 35
            }, 500, "bounce", function () {
                this.stop()
            });
            this.animation = e;
            var d = this;
            safeTimeout($game, function () {
                d.spooky &&
                    d.spooky.hide();
                d.animation.hide();
                d.animation.stop();
                ra.circle(a, b, 35).attr({
                    fill: c,
                    stroke: c
                })
            }, 500);
            if (!this.square.marked && this.spooky) this.spooky.hide();
            else this.spooky && this.spooky.link.animate({
                    opacity: 0
                }, 500); if (this.square.spooky) {
                this.square.spooky.stop().hide();
                this.square.spooky.orbit.hide()
            }
        }
    };
    this.square = f;
    this.type = g || CLASSIC;
    this.player = h || 1;
    this.weight = i || 1;
    this.link = j || null
};
jQuery(document).ready(function () {
    (function (c) {
        function e() {
            c(document.body).unbind("dblclick");
            c("#capture").remove();
            window.qtpy = {};
            i();
            f();
            j();
            window.qtpy = c.extend(qtpy, {
                status: new Status,
                state: new State,
                newGame: arguments.callee,
                mobileSafari: c(document.body).is(".mobileSafari"),
                click: p,
                color: function (a) {
                    if (a == 1) return "#00F";
                    return "#F00"
                },
                lightColor: function (a) {
                    if (a == 1) return "#DDF";
                    return "#FDD"
                }
            });
            q();
            $game.mouseup(qtpy.click);
            qtpy.status.queue("Your turn (1 of 2)")
        }
        function f() {
            qtpy.boardOffset =
                c(document.body).is(".mobileSafari:not(.standalone)") ? 98 : 78;
            window.ra && ra.clear();
            window.$game && $game.remove();
            window.$game = c('<div id="game">').appendTo(document.body);
            window.ra = Raphael("game", 320, 418)
        }
        function j() {
            function a() {
                var h = 0;
                if (--b[0] < 0) b[0] = 2;
                if (--b[1] < 0) b[1] = 2;
                if (--b[2] < 0) b[2] = 2;
                c1.attr({
                    cx: 112.154,
                    cy: 34.117,
                    fill: d[b[0]],
                    stroke: d[b[0]]
                });
                c2.attr({
                    cx: 117.965,
                    cy: 36.849,
                    fill: d[b[1]],
                    stroke: d[b[1]]
                });
                c3.attr({
                    cx: 119.809,
                    cy: 42.999,
                    fill: d[b[2]],
                    stroke: d[b[2]]
                });
                var g = safeCallback($game, function () {
                    ++h ==
                        3 && safeTimeout($game, a)
                });
                c1.animateAlong(o1, 1E3, false, g);
                c2.animateAlong(o2, 1E3, false, g);
                c3.animateAlong(o3, 1E3, false, g)
            }
            window.ti && ti.clear();
            c("#title").remove();
            c('<div id="title">').appendTo($game).css({
                position: "absolute",
                top: 0
            });
            window.ti = Raphael("title", 320, 50);
            ti.path("M140.701,14.627v1.728c0,1.536-0.672,2.4-2.4,2.4s-2.4-0.864-2.4-2.4V9.826h23.714v6.528c0,1.536-0.672,2.4-2.4,2.4 s-2.4-0.864-2.4-2.4v-1.728h-4.656v30.146c0,1.536-0.672,2.4-2.4,2.4c-1.728,0-2.4-0.864-2.4-2.4V14.627H140.701z").attr("fill",
                "black");
            ti.path("M175.261,44.773c0,1.536-0.673,2.4-2.4,2.4s-2.4-0.864-2.4-2.4V9.826h15.938c2.208,0,3.792,0.336,5.521,1.969 c2.064,1.92,2.256,3.696,2.256,6.288v6.528c0,2.448-0.191,4.177-1.968,6.145c-1.872,2.112-3.841,2.305-6.433,2.305h-10.513V44.773z M175.261,28.26h10.657c2.832,0,3.455-0.72,3.455-3.456v-6.721c0-2.736-0.623-3.456-3.455-3.456h-10.657V28.26z").attr("fill", "black");
            ti.path("M216.143,28.331V25.69c0-1.584,0.336-3.168,2.305-3.168s2.305,1.584,2.305,3.168v1.872c0,1.152-0.096,1.921-0.576,2.929 l-6.589,15.282c-1.008,2.16-1.537,2.4-3.648,2.4h-3.553c-1.344,0-3.168-0.288-3.168-2.305c0-1.968,1.633-2.304,3.168-2.304h3.168\t\tl1.818-4.643h-0.24c-1.92,0-2.016-0.864-2.734-2.448l-2.275-4.928c-0.623-1.392-1.104-2.448-1.104-3.792V25.69\t\tc0-1.584,0.336-3.168,2.305-3.168c1.967,0,2.305,1.584,2.305,3.168v2.641l2.801,5.983h1.008L216.143,28.331z").attr("fill",
                "black");
            var d = ["#000", "#666", "#999"],
                b = [0, 1, 2];
            c1 = ti.circle(112.154, 34.117, 3).attr({
                fill: d[b[0]],
                stroke: d[b[0]]
            });
            c2 = ti.circle(117.965, 36.849, 3).attr({
                fill: d[b[1]],
                stroke: d[b[1]]
            });
            ti.path("M111.47,45.493c-1.344,1.152-2.448,1.681-4.32,1.681c-1.632,0-3.12-0.624-4.224-1.824\t\tc-1.344-1.488-1.584-2.784-1.584-4.705V28.068c0-3.505,1.248-5.713,3.84-7.921l9.793-8.353c1.248-1.104,2.352-1.969,4.081-1.969\t\tc3.648,0,6,2.688,6,6.24v12.722c0,3.696-0.96,5.809-3.792,8.257L111.47,45.493z M117.711,33.876\t\tc2.208-1.823,2.544-2.496,2.544-5.376V16.547c0-0.768,0.096-1.92-0.96-1.92c-0.576,0-0.912,0.479-1.344,0.815l-9.648,8.354\t\tc-1.632,1.392-2.16,2.304-2.16,4.464v12.434c0,0.768-0.048,1.68,1.056,1.68c0.528,0,1.056-0.384,1.44-0.72L117.711,33.876z").attr("fill",
                "black");
            c3 = ti.circle(119.809, 42.999, 3).attr({
                fill: d[b[2]],
                stroke: d[b[2]]
            });
            o1 = ti.path("M112.154,34.117c-0.328-0.562-1.116-1.712-0.855-2.413c0.281-0.756,1.913,0.544,2.207,0.77c1.652,1.262,3.104,2.806,4.459,4.376").attr({
                "stroke-width": 0,
                stroke: "transparent"
            });
            o2 = ti.path("M117.965,36.849c1.354,1.571,2.666,3.236,3.67,5.056c0.223,0.403,1.087,1.79,0.582,2.226c-0.561,0.483-2.022-0.822-2.407-1.132").attr({
                "stroke-width": 0,
                stroke: "transparent"
            });
            o3 = ti.path("M119.809,42.999c-2.984-2.396-5.726-5.578-7.655-8.882").attr({
                "stroke-width": 0,
                stroke: "transparent"
            });
            a();
            ra.path("M271.738,15.103c-0.961,1.609-2.719,2.687-4.727,2.687c-3.037,0-5.5-2.462-5.5-5.5s2.463-5.5,5.5-5.5c2.856,0,5.206,2.18,5.475,4.968");
            ra.path("M270.695,11.653l2.222,1.019l1.021-2.22L270.695,11.653z");
            $game.difficultyIcons = [
                [ra.path("M292.023,10.749l1.064-1.065l-1.064-1.065V10.749z").hide(), ra.path("M292.023,15.96l1.064-1.064l-1.064-1.065V15.96z").hide(), ra.path("M282.332,14.896h9.691").hide(), ra.path("M282.332,9.684h9.691").hide()],
                [ra.path("M292.023,10.749l1.064-1.065l-1.064-1.065V10.749z").hide(),
                        ra.path("M292.023,15.96l1.064-1.064l-1.064-1.065V15.96z").hide(), ra.path("M282.332,9.684h2.361c2.881,0,2.33,5.211,5.211,5.211h2.119").hide(), ra.path("M282.332,14.896h2.361c2.881,0,2.33-5.211,5.211-5.211h2.119").hide()
                ]
            ];
            $game.infoIcon = [ra.path("M307.71,6.79c3.038,0,5.5,2.462,5.5,5.5s-2.462,5.5-5.5,5.5s-5.5-2.462-5.5-5.5S304.672,6.79,307.71,6.79z"), ra.path("M308.161,14.492h0.646c0.288,0,0.596,0.063,0.596,0.432c0,0.378-0.343,0.432-0.596,0.432h-2.195c-0.252,0-0.595-0.054-0.595-0.432c0-0.369,0.307-0.432,0.595-0.432h0.685v-3.124h-0.685c-0.252,0-0.595-0.054-0.595-0.432c0-0.369,0.307-0.432,0.595-0.432h0.909c0.494,0,0.64,0.09,0.64,0.603V14.492z").attr({
                    fill: "#000",
                    "stroke-width": 0,
                    stroke: "transparent"
                }), ra.path("M306.855,8.757c0-0.306,0.171-0.405,0.404-0.405h0.495c0.234,0,0.405,0.099,0.405,0.405v0.414c0,0.306-0.171,0.405-0.405,0.405h-0.495c-0.233,0-0.404-0.099-0.404-0.405V8.757z").attr({
                    fill: "#000",
                    "stroke-width": 0,
                    stroke: "transparent"
                })];
            c('<a id="info" class="icon" title="About" href="javascript:;" onclick="return false;" onmousedown="return false;" onmouseup="return false;" target="__blank__"></a>').appendTo($game).click(r);
            c('<a id="difficulty" class="icon" title="Difficulty" href="javascript:;" onclick="return false;" onmousedown="return false;" onmouseup="return false;"></a>').appendTo($game).click(function () {
                i();
                s()
            });
            c('<a id="newgame" class="icon" title="New game" href="javascript:;" onclick="return false;" onmousedown="return false;" onmouseup="return false;"></a>').appendTo($game).click(function () {
                c(document.body).is(".mobileSafari") && window.scrollTo(0, 1);
                e();
                return false
            });
            difficulty == 0 ? l() : m()
        }
        function t() {
            if (c(document.body).is(".mobileSafari")) {
                document.body.ontouchmove = function (a) {
                    window.scrollTo(0, 1);
                    a.preventDefault();
                    return false
                };
                c(document.body).click(function () {
                    window.scrollTo(0, 1)
                })
            }
        }
        function u() {
            if (c(document.body).is(".mobileSafari")) {
                document.body.ontouchmove = function () {};
                c(document.body).unbind("click")
            }
        }
        function q() {
            for (var a = [1, 107, 213, 319], d = qtpy.boardOffset, b = 0; b < 4; b++) ra.path("M " + a[0] + "," + (d + a[b]) + " L " + a[3] + "," + (d + a[b]));
            for (b = 0; b < 4; b++) ra.path("M " + a[b] + "," + (d + a[0]) + " L " + a[b] + "," + (d + a[3]))
        }
        function l() {
            for (var a = 0; a < 4; a++) $game.difficultyIcons[1][a].hide();
            for (a = 0; a < 4; a++) $game.difficultyIcons[0][a].show();
            localStorage.setItem("difficulty", difficulty = 0)
        }
        function m() {
            for (var a = 0; a < 4; a++) $game.difficultyIcons[0][a].hide();
            for (a = 0; a < 4; a++) $game.difficultyIcons[1][a].show();
            localStorage.setItem("difficulty", difficulty = 1)
        }
        function s() {
            if (parseInt(localStorage.getItem("difficulty"))) {
                l();
                qtpy.status.flash("Learning mode")
            } else {
                m();
                qtpy.status.flash("Challenge mode")
            }
        }
        function v() {
            function a(k) {
                if (k.children("img").length) return true
            }
            function d(k, w, x) {
                k.append('<img src="' + w + '" title="' + x + '">')
            }
            c(document.body).is(".mobileSafari") && window.scrollTo(0, 1);
            c(document.body).addClass("info");
            u();
            $game.infoIcon[0].attr("fill", "#000");
            $game.infoIcon[1].attr("fill", "#FFF");
            $game.infoIcon[2].attr("fill",
                "#FFF");
            var b = c("#rulesMarks"),
                h = c("#rulesCycle"),
                g = c("#rulesDiverse"),
                n = c("#rulesEntangled"),
                o = c("#rulesWin");
            a(b) || d(b, "rules-marks.png", "Spooky marks");
            a(h) || d(h, "rules-cycle.png", "Cycle squares");
            a(g) || d(g, "rules-diverse.png", "Cycle squares without mark diversity");
            a(n) || d(n, "rules-entangled.png", "Entangled marks");
            a(o) || d(o, "rules-win.png", "Tic-tac-toe")
        }
        function i() {
            c(document.body).removeClass("info");
            t();
            c(document.body).is(".mobileSafari") && window.scrollTo(0, 1);
            if (window.$game) {
                $game.infoIcon[0].attr("fill",
                    "#FFF");
                $game.infoIcon[1].attr("fill", "#000");
                $game.infoIcon[2].attr("fill", "#000")
            }
        }
        function r() {
            c(document.body).is(".info") ? i() : v()
        }
        function p(a) {
            if (!c(document.body).is(".info")) {
                var d = $game.position().top - (qtpy.mobileSafari ? 0 : 230),
                    b = $game.position().left - (qtpy.mobileSafari ? 0 : 160);
                b = a.pageX - b;
                a = a.pageY - d;
                a < qtpy.boardOffset || a > qtpy.boardOffset + 320 || qtpy.state.squares[(a < qtpy.boardOffset + 106 ? 0 : a < qtpy.boardOffset + 213 ? 1 : 2) * 3 + (b < 107 ? 0 : b < 213 ? 1 : 2)].click()
            }
        }
        if (navigator.userAgent.match(/iPod|iPad|iPhone/i) &&
            navigator.userAgent.match(/AppleWebKit/)) {
            c(document.body).addClass("mobileSafari");
            navigator.standalone && c(document.body).addClass("standalone")
        }
        window.safeTimeout = function () {
            var a = arguments,
                d = a[0],
                b = a[1];
            setTimeout(function () {
                $game[0] === d[0] && b()
            }, a[2] || 0)
        };
        window.safeCallback = function () {
            var a = arguments,
                d = a[0],
                b = a[1];
            return function () {
                $game[0] === d[0] && b(arguments)
            }
        };
        localStorage.setItem("difficulty", localStorage.getItem("difficulty") || 0);
        difficulty = parseInt(localStorage.getItem("difficulty"));
        e();
        msg = qtpy.status.msg[0];
        qtpy.status.flash("by John Driscoll");
        qtpy.status.queue(msg[0], msg[1])
    })(jQuery)
});
windowOnLoad = window.onload;
window.onload = function () {
    windowOnLoad && windowOnLoad();
    if ($(document.body).is(".mobileSafari")) {
        setTimeout(function () {
            window.scrollTo(0, 1)
        }, 1);
        var c = function () {
            $("#flipIndicator").remove();
            $(document.body).removeClass("landscape")
        }, e = function () {
                $(document.body).addClass("landscape");
                $('<div id="flipIndicator">Flip to play</div>').appendTo($game);
                window.scrollTo(0, 1)
            };
        window.onorientationchange = function () {
            switch (window.orientation) {
                case 90:
                case -90:
                    qtpy.newGame();
                    e();
                    break;
                case 0:
                    c();
                    setTimeout(function () {
                        window.scrollTo(0,
                            1)
                    }, 1)
            }
        };
        window.orientation != 0 && e()
    }
};
Raphael.el.behindBoard = function () {
    this.insertAfter(qtpy.state.squares[8].rect);
    return this
};
Raphael.fn.circlePath = function (c, e, f, j) {
    return window.ra.path(j ? "M" + c + "," + (e + f) + "A" + f + "," + f + ",0,1,1," + (c + 0.1) + "," + (e + f) : "M" + c + "," + (e - f) + "A" + f + "," + f + ",0,1,1," + (c - 0.1) + "," + (e - f))
};
