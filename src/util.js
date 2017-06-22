/**
 * Created by michael on 2017/6/22.
 */

export {Point}

function Point(width, x, y) {
    this.width = width;
    this.x = x - 1;
    this.y = y - 1;
}

Point.prototype.index = function () {
    return this.x + this.y * this.width
};