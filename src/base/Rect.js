import Point from "src/base/Point.js"

/**
 * A 2-d rectangle.
 */
export default class Rect {
    /**
     * A 2-d rectangle.
     * @param {!number} x
     * @param {!number} y
     * @param {!number} w
     * @param {!number} h
     */
    constructor(x, y, w, h) {
        /** @type {!number} */
        this.x = x;
        /** @type {!number} */
        this.y = y;
        /** @type {!number} */
        this.w = w;
        /** @type {!number} */
        this.h = h;
    }

    /**
     * @param {!Rect|*} obj
     * @returns {!boolean}
     */
    isEqualTo(obj) {
        if (!(obj instanceof Rect)) {
            return false;
        }
        /** @type {Rect!} */
        var other = obj;
        return other.x === this.x &&
            other.y === this.y &&
            other.w === this.w &&
            other.h === this.h;
    };

    /**
     * @param {!Rect|*} obj
     * @param {!number} epsilon
     * @returns {!boolean}
     */
    isApproximatelyEqualTo(obj, epsilon) {
        if (!(obj instanceof Rect)) {
            return false;
        }
        /** @type {Rect!} */
        var other = obj;
        return Math.abs(other.x - this.x) <= epsilon &&
            Math.abs(other.y - this.y) <= epsilon &&
            Math.abs(other.right() - this.right()) <= epsilon &&
            Math.abs(other.bottom() - this.bottom()) <= epsilon;
    };

    toString() {
        return `[${this.x}:${this.right()}]x[${this.y}:${this.bottom()}]`;
    };

    /**
     *
     * @param {!Point} center The x/y point at the center of the square.
     * @param {!number} radius Half of the diameter of the square.
     * @returns {!Rect}
     */
    static centeredSquareWithRadius(center, radius) {
        return new Rect(center.x - radius, center.y - radius, radius*2, radius*2);
    };

    /**
     * @returns {!Point}
     */
    center() {
        return new Point(this.x + this.w / 2, this.y + this.h / 2);
    };

    /**
     * @returns {!Point}
     */
    topLeft() {
        return new Point(this.x, this.y);
    };

    /**
     * @returns {!Point}
     */
    topRight() {
        return new Point(this.x + this.w, this.y);
    };

    /**
     * @returns {!Point}
     */
    bottomLeft() {
        return new Point(this.x, this.y + this.h);
    };

    /**
     * @returns {!Point}
     */
    bottomRight() {
        return new Point(this.x + this.w, this.y + this.h);
    };

    /**
     * @returns {!Point}
     */
    centerLeft() {
        return new Point(this.x, this.y + this.h/2);
    };

    /**
     * @returns {!Point}
     */
    centerRight() {
        return new Point(this.x + this.w, this.y + this.h/2);
    };

    /**
     * @returns {!Point}
     */
    topCenter() {
        return new Point(this.x + this.w/2, this.y);
    };

    /**
     * @returns {!Point}
     */
    bottomCenter() {
        return new Point(this.x + this.w/2, this.y + this.h);
    };


    /**
     * @returns !number
     */
    right() {
        return this.x + this.w;
    };

    /**
     * @returns !number
     */
    bottom() {
        return this.y + this.h;
    };

    /**
     * Returns the result of removing the given width from the left side of the rectangle.
     * The cut is clamped so it doesn't go into negative heights.
     *
     * @param {!number} lostWidth
     * @returns !Rect
     */
    skipLeft(lostWidth) {
        var d = Math.min(lostWidth, this.w);
        return new Rect(this.x + d, this.y, this.w - d, this.h);
    };

    /**
     * Returns the result of removing the given width from the right side of the rectangle.
     * The cut is clamped so it doesn't go into negative heights.
     *
     * @param {!number} lostWidth
     * @returns !Rect
     */
    skipRight(lostWidth) {
        var d = Math.min(lostWidth, this.w);
        return new Rect(this.x, this.y, this.w - d, this.h);
    };

    /**
     * Returns the result of removing the given height from the top side of the rectangle.
     * The cut is clamped so it doesn't go into negative heights.
     *
     * @param {!number} lostHeight
     * @returns !Rect
     */
    skipTop(lostHeight) {
        var d = Math.min(lostHeight, this.h);
        return new Rect(this.x, this.y + d, this.w, this.h - d);
    };

    /**
     * Returns the result of removing the given height from the bottom side of the rectangle.
     * The cut is clamped so it doesn't go into negative heights.
     *
     * @param {!number} lostHeight
     * @returns !Rect
     */
    skipBottom(lostHeight) {
        var d = Math.min(lostHeight, this.h);
        return new Rect(this.x, this.y, this.w, this.h - d);
    };

    /**
     * Returns the result of removing all but the given width from the left side of the rectangle.
     * The cut is clamped so it doesn't go into negative heights.
     *
     * @param {!number} keptWidth
     * @returns !Rect
     */
    takeLeft(keptWidth) {
        var d = Math.max(keptWidth, 0);
        return new Rect(this.x, this.y, d, this.h);
    };

    /**
     * Returns the result of removing all but the given width from the right side of the rectangle.
     * The cut is clamped so it doesn't go into negative heights.
     *
     * @param {!number} keptWidth
     * @returns !Rect
     */
    takeRight(keptWidth) {
        var d = Math.max(keptWidth, 0);
        return new Rect(this.x + this.w - d, this.y, d, this.h);
    };

    /**
     * Returns the result of removing all but the given height from the top side of the rectangle.
     * The cut is clamped so it doesn't go into negative heights.
     *
     * @param {!number} keptHeight
     * @returns !Rect
     */
    takeTop(keptHeight) {
        var d = Math.max(keptHeight, 0);
        return new Rect(this.x, this.y, this.w, d);
    };

    /**
     * Returns the result of removing all but the given height from the bottom side of the rectangle.
     * The cut is clamped so it doesn't go into negative heights.
     *
     * @param {!number} keptHeight
     * @returns !Rect
     */
    takeBottom(keptHeight) {
        var d = Math.max(keptHeight, 0);
        return new Rect(this.x, this.y + this.h - d, this.w, d);
    };

    /**
     * Returns the result of padding to each side of the rectangle by the given amount.
     *
     * @param {!number} p The margin from the receiving rect's outside to the returned rect's inside.
     * @returns !Rect
     */
    paddedBy(p) {
        return new Rect(this.x - p, this.y - p, this.w + p * 2, this.h + p * 2);
    };

    /**
     * Returns the result of scaling the rectangle w.r.t. its center by the given scaling factor.
     * @param {!number} factor
     * @returns {!Rect}
     */
    scaledOutwardBy(factor) {
        var c = this.center();
        var w2 = this.w * factor;
        var h2 = this.h * factor;
        return new Rect(c.x - w2/2, c.y - h2/2, w2, h2);
    };

    /**
     * Determines if the given point is in the receiving rect or not.
     *
     * Note that the top and left of the rectangle are inclusive, but the bottom and right are exclusive.
     *
     * @param {!Point} p The query point.
     * @returns {!boolean}
     */
    containsPoint(p) {
        return p.x >= this.x &&
            p.x < this.x + this.w &&
            p.y >= this.y &&
            p.y < this.y + this.h;
    };

    /**
     * @param {!number} proportion
     * @returns {!Rect}
     */
    takeLeftProportion(proportion) {
        return this.takeLeft(this.w * proportion);
    };

    /**
     * @param {!number} proportion
     * @returns {!Rect}
     */
    takeRightProportion(proportion) {
        return this.takeRight(this.w * proportion);
    };

    /**
     * @param {!number} proportion
     * @returns {!Rect}
     */
    takeTopProportion(proportion) {
        return this.takeTop(this.h * proportion);
    };

    /**
     * @param {!number} proportion
     * @returns {!Rect}
     */
    takeBottomProportion(proportion) {
        return this.takeBottom(this.h * proportion);
    };

    /**
     * @returns {!Rect}
     */
    leftHalf() {
        return this.skipRight(this.w / 2);
    };

    /**
     * @returns {!Rect}
     */
    rightHalf() {
        return this.skipLeft(this.w / 2);
    };

    /**
     * @returns {!Rect}
     */
    topHalf() {
        return this.skipBottom(this.h / 2);
    };

    /**
     * @returns {!Rect}
     */
    bottomHalf() {
        return this.skipTop(this.h / 2);
    };

    /**
     * @param {!number} dx The displacement to move the rect horizontally.
     * @param {!number} dy The displacement to move the rect vertically.
     * @returns {!Rect}
     */
    shiftedBy(dx, dy) {
        return new Rect(this.x + dx, this.y + dy, this.w, this.h);
    };


    /**
     * @param {!number} dx The proportional amount to move the rect horizontally.
     * @param {!number} dy The proportional amount to move the rect vertically.
     * @returns {!Rect}
     */
    proportionalShiftedBy(dx, dy) {
        return this.shiftedBy(dx * this.w, dy * this.h);
    };

    /**
     * @param {!number} newX
     * @returns {!Rect}
     */
    withX(newX) {
        return new Rect(newX, this.y, this.w, this.h);
    };

    /**
     * @param {!number} newY
     * @returns {!Rect}
     */
    withY(newY) {
        return new Rect(this.x, newY, this.w, this.h);
    };

    /**
     * @param {!number} newW
     * @returns {!Rect}
     */
    withW(newW) {
        return new Rect(this.x, this.y, newW, this.h);
    };
    /**
     * @param {!number} newH
     * @returns {!Rect}
     */
    withH(newH) {
        return new Rect(this.x, this.y, this.w, newH);
    };
}
