import { Vector2D } from "../../library/math";
import { Collision, PhysicsEngine, PhysicsProxy } from "../../library/physics/Physics";
import { Game } from "../base/Game";
import { Entity, EntityImages } from "./Entity";
import { MonsterUnit } from "./MonsterUnit";
import { PlayerUnit } from "./PlayerUnit";

export class PlayerBuilding extends Entity {

    public hit_points = 100;
    public attack_range = 350;
    public attack_damage = 5;
    public attack_cooldown = 1.5;
    public current_attack_cooldown = 0;

    constructor(
        game: Game,
        position: Vector2D,
        images: EntityImages,
        width: number,
        height: number,
        public tall: number,  // visual height
        public type: string,
    ) {
        super(game, position, images, true, width, height);
        this.animation_horizontal = 0;
        this.animation_vertical = 0;
    }

    /**
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {
        super.update(delta_seconds);
        this.render_box.top = this.hit_box.bottom - this.tall;
        this.render_box.bottom = this.hit_box.bottom;
        if (this.current_attack_cooldown <= 0) {
            const in_attack_range = this.game.model.physics
                .pickWithinCircle(this.physics.outerBox.center, this.attack_range)
                .filter((proxy) => proxy.reference instanceof MonsterUnit);
            const in_attack_range_with_distance = in_attack_range
                .map((proxy) => {
                    const distance = this.physics.outerBox.center.cpy().sub(proxy.outerBox.center).length2() ;
                    return { proxy, distance };
                }).sort((a, b) => a.distance - b.distance);
            if (in_attack_range_with_distance.length > 0) {
                const target = in_attack_range_with_distance[0].proxy.reference as MonsterUnit;
                this.current_attack_cooldown = this.attack_cooldown;
                this.attack(target);
            }
        } else {
            let attack_speed_modifier = 1;
            if (this.game.model.player.call_to_home) {
                const units_in_castle = this.game.model.player.units.reduce((count, entity_ref) => {
                    const entity = entity_ref.deref();
                    if (!(entity instanceof PlayerUnit) || !entity.is_hidden) {
                        return count;
                    }
                    return count + 1;
                }, 0);
                attack_speed_modifier += units_in_castle * 0.1;
            }
            this.current_attack_cooldown -= delta_seconds * attack_speed_modifier;
        }
    }

    public attack(target: MonsterUnit) {
        const size = 32;
        this.game.model.effect_factory.makeMissle(
            this.hit_box.center,
            target.hit_box.center,
            size, size,
            this.attack_damage,
            this.is_player
        );
    }

    public onCollision?(other: PhysicsProxy, collision: Collision): void;
    public onWorlCollision?(distance: Vector2D): void;
}
