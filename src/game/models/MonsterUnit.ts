import { AABBPhysicsProxy, Asset, AssetManager, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Collision, PhysicsEngine, PhysicsProxy } from "../../library/physics/Physics";
import { Game } from "../base/Game";
import { Entity, EntityImages } from "./Entity";
import { MoveableEntity } from "./MovableEntity";
import { NeutralBuilding } from "./NeutralBuilding";
import { PlayerBuilding } from "./PlayerBuilding";
import { PlayerUnit } from "./PlayerUnit";

export class MonsterUnit extends MoveableEntity {

    public spawn_delay: number = 0.0;
    public spawn_delay_max: number = 1;
    public is_spawning_slime: boolean = false;
    public damage_building_delay: number = 0.0;
    public damage_building_delay_max: number = 0.5;

    constructor(
        game: Game,
        position: Vector2D,
        images: EntityImages,
        width: number,
        height: number,
        public type: string,
    ) {
        super(game, position, images, width, height, type, false);
    }


    /**
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {
        super.update(delta_seconds);
        this.damage_building_delay = Math.max(0, this.damage_building_delay - delta_seconds);
        // damage buildings and change direction if colliding
        this.entities_aware_of.filter(
            (other): other is PlayerBuilding | NeutralBuilding => other instanceof PlayerBuilding || other instanceof NeutralBuilding
        ).forEach((other: PlayerBuilding | NeutralBuilding) => {
            if (other instanceof PlayerBuilding) {
                if (this.damage_building_delay <= 0) {
                    this.damage_building_delay = this.damage_building_delay_max;
                    other.hit_points -= Math.ceil(this.attack_damage);
                } 
            }
        });
        // spawn
        if (this.is_spawning_slime) {
            this.spawn_delay = this.spawn_delay - delta_seconds;
            if (this.spawn_delay <= 0) {
                this.spawn_delay += this.spawn_delay_max;
                const entity = this.game.model.monster_factory.makeSlime( this.hit_box.center.cpy() );
                entity.velocity.set(Vector2D.fromAngle(Math.random() * Math.PI).mul(entity.velocity.length()));
            }
        }
    }

    public isAttackable(entity: Entity): boolean {
        return entity instanceof PlayerUnit;
    };

    public isBouncable(other: Entity): boolean {
        return other instanceof PlayerBuilding || other instanceof NeutralBuilding;
    } 
    
    public onCollision?(other: PhysicsProxy, collision: Collision): void;
    public onWorlCollision?(distance: Vector2D): void;
}