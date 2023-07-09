import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Collision, PhysicsProxy } from "../../library/physics/Physics";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { handle_building_collisions } from "../systems/BuildingCollisions";
import { Entity, EntityImages } from "./Entity";


export class MoveableEntity extends Entity {

    public hitpoints: number = 10;
    public attack_damage: number = 0.35;
    public attack_delay_seconds: number = 0.35;
    public attack_charging_seconds: number = 0;
    public entities_aware_of: Array<Entity> = [];
    public entities_colliding_with: Array<Entity> = [];
    public awareness_range: number = 100;
    public attack_area: number = 10;
    public strength: number = 1;

    constructor(
        game: Game,
        position: Vector2D,
        images: EntityImages,
        width: number,
        height: number,
        public type: string,
        public is_player: boolean,
    ) {
        super(game, position, images, is_player, width, height);
    }

    /**
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {
        super.update(delta_seconds);
        if (this.hitpoints <= 0) {
            this.is_dead = true;
            this.game.audio.sfx.play(this.game.assets.getSound(Assets.sounds.slime_dead));
            if (!this.is_player) {
                this.game.model.player.money += 1;
                this.game.model.wave_strength_to_defeat -= this.strength;
            }
            return;
        }
        // determine enemies in range
        const rect = Rect.fromCenterAndSize(this.hit_box.center, { x: this.awareness_range, y: this.awareness_range });
        this.entities_aware_of = this.game.model.physics.pickWithinRect(rect)
            .map(proxy => proxy.reference)
            .filter((other): other is Entity => other instanceof Entity && other !== this);
        this.entities_colliding_with = this.entities_aware_of
            .filter(other => other.hit_box.intersects(this.hit_box));
        // attack
        const attackable = this.entities_aware_of.filter(this.isAttackable);
        if (attackable.length > 0) {
            this.attack_charging_seconds += delta_seconds;
        } else {
            this.attack_charging_seconds = Math.max(this.attack_charging_seconds - delta_seconds, 0);
        }
        while (this.attack_charging_seconds >= this.attack_delay_seconds && attackable.length > 0) {
            const target = attackable[Math.floor(Math.random() * attackable.length)];
            this.attack(target);
        }
        this.entities_colliding_with.filter(this.isBouncable).forEach((other: Entity) => {
            const overlap = Rect.fromBoundingBox(this.hit_box.overlap(other.hit_box));
            if (overlap.width < overlap.height) {
                this.velocity.x = Math.abs(this.velocity.x) * (this.hit_box.center.x < overlap.center.x ? -1 : 1);
            } else {
                this.velocity.y = Math.abs(this.velocity.y) * (this.hit_box.center.y < overlap.center.y ? -1 : 1);
            }
            if (other.is_wood && this.harvest_wood > 0 && this.attack_charging_seconds <= 0) {
                other.wood -= this.harvest_wood;
                this.game.model.player.money += this.harvest_wood;
                this.attack_charging_seconds = this.attack_delay_seconds;
            }
        });
    }

    public attack(target: Entity) {
        this.attack_charging_seconds -= Math.max(0.01, this.attack_delay_seconds);
        const rect = Rect.fromCenterAndSize(target.hit_box.center, { x: 10, y: 10 });
        this.game.model.effect_factory.makeHit(rect, this.attack_damage, this.is_player);
    }

    /**
     * Is the provided entity attackable by this entity?
     * @param target 
     * @returns 
     */
    public isAttackable(target: Entity): boolean { return target.is_player !== this.is_player };
    public isBouncable(other: Entity): boolean { return true; }

    public onCollision?(other: PhysicsProxy, collision: Collision): void;
    public onWorlCollision?(distance: Vector2D): void;
}