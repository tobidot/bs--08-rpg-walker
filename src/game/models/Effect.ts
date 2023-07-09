import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Collision, PhysicsEngine, PhysicsProxy } from "../../library/physics/Physics";
import { Game } from "../base/Game";
import { Direction } from "../consts/Direction";
import { Entity, EntityImages } from "./Entity";
import { MoveableEntity } from "./MovableEntity";


export class Effect extends Entity {
    public collisions: Array<Entity> = [];
    public affected_entities: Array<number> = [];
    public damage: number = 1;
    public die_on_hit: boolean = false;

    constructor(
        game: Game,
        area: Rect,
        images: EntityImages,
        public seconds_to_live: number,
        public type: string,
        is_player: boolean,
    ) {
        super(game, area.center, images, is_player, area.width, area.height);
        this.physics.static = true;
        this.animation_speed = 2;
        this.animation_horizontal = 5;
        this.animation_vertical = 1.2;
        // this.animation_horizontal = 0;
        // this.animation_vertical = 0;
    }

    /**
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {
        super.update(delta_seconds);
        this.collisions.forEach((other: Entity) => {
            if (!this.is_dead && !this.affected_entities.includes(other.id)) {
                this.affectEntity(other);
            }
        });
        this.collisions = [];
        this.seconds_to_live -= delta_seconds;
        if (this.seconds_to_live <= 0) {
            this.is_dead = true;
        }
    }

    public affectEntity(other: Entity) {
        if (this.is_player === other.is_player) {
            // allied don't hurt each other
            return;
        }
        this.affected_entities.push(other.id);
        if (other instanceof MoveableEntity) {
            other.hitpoints -= this.damage;
            if (this.die_on_hit) {
                this.is_dead = true;
            }
        }
    }

    public onCollision(other: PhysicsProxy, collision: Collision) {
        if (!(other.reference instanceof Entity)) return;
        this.collisions.push(other.reference);
    };
    public onWorlCollision?(distance: Vector2D): void;
}