import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Collision, PhysicsEngine, PhysicsProxy } from "../../library/physics/Physics";
import { Game } from "../base/Game";
import { Direction } from "../consts/Direction";
import { Entity } from "./Entity";

export type EntityImages = Map<Direction, ImageAsset>;

export class NeutralBuilding extends Entity {

    constructor(
        protected game: Game,
        position: Vector2D,
        images: EntityImages,
        width: number,
        height: number,
        public visual_width: number,  // visual height
        public visual_height: number,  // visual height
        public type: string,
    ) {
        super(game, position, images, false, width, height);
        this.animation_horizontal = 0;
        this.animation_vertical = 0;
    }

    /**
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {
        super.update(delta_seconds);
        this.render_box.left = this.hit_box.center.x - this.visual_width / 2;
        this.render_box.right =  this.render_box.left + this.visual_width ;
        this.render_box.top = this.hit_box.bottom - this.visual_height;
        this.render_box.bottom = this.hit_box.bottom;
        if (this.is_wood && this.wood <= 0) {
            this.is_dead = true;
        }
    }

    public onCollision?(other: PhysicsProxy, collision: Collision): void;
    public onWorlCollision?(distance: Vector2D): void;
}