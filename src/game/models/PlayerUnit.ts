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
        if (this.can_hide) {
            const aware_castles = this.entities_aware_of.filter((entity): entity is PlayerBuilding => entity instanceof PlayerBuilding && entity.type === "castle");
            if (aware_castles.length > 0 && this.game.model.player.call_to_home) {
                const castle = aware_castles[0];
                this.hit_box.center.set(castle.hit_box.center);
                this.is_hidden = true;
            } else {
                this.is_hidden = false;
            }
        }
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
