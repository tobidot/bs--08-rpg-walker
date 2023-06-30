import { assert } from "../flow";
import { Vector2D, Vector2DLike } from "./Vector";

/**
 * A rectangle with x, y of the top left and width and height
 */
export interface RectLike {
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * A rectangle with the left, right, top and bottom
 */
export interface BoundingBox {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

/**
 * A rectangle stored as center and a size.
 * 
 * But can be access in multiple ways:
 * 
 * - As a bounding box with left, right, top and bottom
 * - As a rectangle with x, y (center) width and height
 */
export class Rect implements RectLike, BoundingBox {
    public center: Vector2D;
    public size: Vector2D;

    /**
     * Construct a rect from a rectlike object
     * @param {RectLike} other 
     */
    constructor(
        other?: RectLike
    ) {
        if (!other) {
            this.center = new Vector2D(0, 0);
            this.size = new Vector2D(0, 0);
        } else {
            this.center = new Vector2D(other.x, other.y);
            this.size = new Vector2D(other.w, other.h);
        }
    }

    /**
     * Create a rect from center and a size
     * @param bounding_box 
     * @returns 
     */
    public static fromCenterAndSize(
        center: Vector2DLike,
        size: Vector2DLike
    ): Rect {
        return new Rect({
            x: center.x,
            y: center.y,
            w: size.x,
            h: size.y,
        });
    }

    /**
     * Create a rect from a bounding box
     * @param bounding_box 
     * @returns 
     */
    public static fromBoundingBox(bounding_box: BoundingBox): Rect {
        return new Rect({
            x: bounding_box.left + (bounding_box.right - bounding_box.left) / 2,
            y: bounding_box.top + (bounding_box.bottom - bounding_box.top) / 2,
            w: bounding_box.right - bounding_box.left,
            h: bounding_box.bottom - bounding_box.top,
        });
    }

    /**
     * Create a rect from a bounding box
     * @param bounding_box 
     * @returns 
     */
    public static fromLeftTopWidthHeight(left: number, top: number, width: number, height: number): Rect {
        return Rect.fromBoundingBox({
            left, top,
            right: left + width,
            bottom: top + height,
        });
    }

    /**
     * @returns A copy of this rect
     */
    public cpy(): Rect {
        return new Rect(this);
    }

    /**
     * Set the values of this rect to the values of the given rect
     * @param other 
     * @returns 
     */
    public set(other: RectLike): this {
        this.center.x = other.x;
        this.center.y = other.y;
        this.size.x = other.w;
        this.size.y = other.h;
        return this;
    }

    /**
     * Move the rect by the given offset
     * @param offset 
     * @returns 
     */
    public move(offset: Vector2DLike): this {
        this.center.add(offset);
        return this;
    }

    /**
     * Reduce the size of the rect by the given size
     * @param size 
     */
    public inset(size: Vector2D) {
        this.size.sub(size);
        this.size.sub(size);
        return this;
    }

    /**
     * Determine the overlap between this rect and the given rect.
     * @param other 
     * @returns The rectangle that both this rect and the given rect overlap in.
     */
    public overlap(other: Rect): BoundingBox {
        return {
            left: Math.max(this.left, other.left),
            right: Math.min(this.right, other.right),
            top: Math.max(this.top, other.top),
            bottom: Math.min(this.bottom, other.bottom),
        };
    }

    /**
     * Check if the given position is inside this rect
     * @param position 
     */
    public contains(position: Vector2D): boolean {
        return position.x >= this.left
            && position.x <= this.right
            && position.y >= this.top
            && position.y <= this.bottom
            ;
    }

    /**
     * Determine if this rect intersects the given rect
     * @param other
     * @returns True if the rects intersect, false otherwise
     * @see https://stackoverflow.com/a/306332/1048862
     * */
    public intersects(other: RectLike): boolean {
        return this.x < other.x + other.w
            && this.x + this.w > other.x
            && this.y < other.y + other.h
            && this.y + this.h > other.y;
    }

    /**
     * Gets the distance between this rect and the given rect. 
     * If the rects overlap, the distance is 0.
     * 
     * @param other 
     */
    public distance(other: Rect): Vector2D {
        const top = other.bottom - this.top;
        const bottom = other.top - this.bottom;
        const left = other.right - this.left;
        const right = other.left - this.right;
        return new Vector2D(
            (left < 0) ? left : (right > 0 ? right : 0),
            (top < 0) ? top : (bottom > 0 ? bottom : 0),
        );
    }

    /**
     * Change only the position such that the top side is at the given value
     * @param top 
     */
    public moveTop(top: number) {
        const offset = top - this.top;
        this.center.y += offset;
    }
    
    /**
     * Change only the position such that the bottom side is at the given value
     * @param bottom 
     */
    public moveBottom(bottom: number) {
        const offset = bottom - this.bottom;
        this.center.y += offset;
    }

    /**
     * Change only the position such that the left side is at the given value
     * @param left 
     */
    public moveLeft(left: number) {
        const offset = left - this.left;
        this.center.x += offset;
    }
    
    /**
     * Change only the position such that the right side is at the given value
     * @param right 
     */
    public moveRight(right: number) {
        const offset = right - this.right;
        this.center.x += offset;
    }

    public get x() {
        return this.center.x;
    }

    public get y() {
        return this.center.y;
    }

    public set x(x: number) {
        this.center.x = x;
    }

    public set y(y: number) {
        this.center.y = y;
    }

    public get w() {
        return this.size.x;
    }

    public get h() {
        return this.size.y;
    }

    public set w(value: number) {
        this.width = value;
    }

    public set h(value: number) {
        this.height = value;
    }

    public get width() {
        return this.size.x;
    }

    public get height() {
        return this.size.y;
    }

    public set width(value: number) {
        this.size.x = value;
    }

    public set height(value: number) {
        this.size.y = value;
    }

    public get left(): number {
        return this.center.x - this.size.x / 2;
    }

    public get right(): number {
        return this.center.x + this.size.x / 2;
    }

    public get top(): number {
        return this.center.y - this.size.y / 2;
    }

    public get bottom(): number {
        return this.center.y + this.size.y / 2;
    }

    public set left(left: number) {
        const right = this.right;
        this.center.x = (left + right) / 2;
        this.size.x = right - left;
    }

    public set right(right: number) {
        const left = this.left;
        this.center.x = (left + right) / 2;
        this.size.x = right - left;
    }

    public set top(top: number) {
        const bottom = this.bottom;
        this.center.y = (top + bottom) / 2;
        this.size.y =bottom - top;
    }

    public set bottom(bottom: number) {
        const top = this.top;
        this.center.y = (top + bottom) / 2;
        this.size.y = bottom - top;
    }

    public asBoundingBox(): BoundingBox {
        return {
            left: this.left,
            right: this.right,
            top: this.top,
            bottom: this.bottom,
        };
    }
}