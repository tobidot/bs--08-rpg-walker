import { AABBPhysicsProxy, Asset, AssetManager, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Collision, PhysicsEngine, PhysicsProxy } from "../../library/physics/Physics";
import { Assets } from "../base/Assets";
import { Direction } from "../consts/Direction";
import { Entity, EntityImages } from "./Entity";

export class PlayerUnit extends Entity {

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
