import { AABBPhysicsProxy, Asset, AssetManager, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Collision, PhysicsEngine, PhysicsProxy } from "../../library/physics/Physics";
import { Entity, EntityImages } from "./Entity";

export class MonsterUnit extends Entity {

    constructor(
        position: Vector2D,
        images: EntityImages,
        width: number,
        height: number,
        public type: string,
    ) {
        super(position, images, width, height);
    }
    
    /**
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {
        super.update(delta_seconds);
    }

    public onCollision?(other: PhysicsProxy, collision: Collision): void;
    public onWorlCollision?(distance: Vector2D): void;
}