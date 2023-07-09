import { Vector2D } from "../../library/math";
import { Collision, PhysicsEngine, PhysicsProxy } from "../../library/physics/Physics";
import { Game } from "../base/Game";
import { Entity, EntityImages } from "./Entity";
import { MonsterUnit } from "./MonsterUnit";
import { MoveableEntity } from "./MovableEntity";
import { NeutralBuilding } from "./NeutralBuilding";
import { PlayerBuilding } from "./PlayerBuilding";

export class PlayerUnit extends MoveableEntity {

    constructor(
        game: Game,
        position: Vector2D,
        images: EntityImages,
        width: number,
        height: number,
        public type: string,
    ) {
        super(game, position, images, width, height, type, true);
    }

    /**
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {
        super.update(delta_seconds);
    }

    public isAttackable(entity: Entity): boolean {
        return entity instanceof MonsterUnit;
    };

    public isBouncable(other: Entity): boolean {
        return other instanceof NeutralBuilding;
    } 

    public onCollision?(other: PhysicsProxy, collision: Collision): void;
    public onWorlCollision?(distance: Vector2D): void;
}
