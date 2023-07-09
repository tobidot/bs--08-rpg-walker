import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Collision, PhysicsEngine, PhysicsProxy } from "../../library/physics/Physics";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Direction } from "../consts/Direction";
import { Effect } from "../models/Effect";
import { Entity, EntityImages } from "../models/Entity";


export class EffectFactory {

    constructor(
        protected game: Game,
    ) {
    }

    /**
     * Make a hit effect, that damages enemies once on collision
     * @param area 
     * @param damage 
     * @param is_player 
     * @returns 
     */
    public makeHit(
        area: Rect,
        damage: number,
        is_player: boolean,
    ) {
        const entity = new Effect(
            this.game,
            area,
            this.getImageSet('hit'),
            0.5,
            'hit',
            is_player,
        );
        entity.damage = damage;
        entity.velocity.set({ x: 0, y: 0 });
        this.game.model.addEntity(entity);
        return entity;
    }
    
    /**
     * Make a missle effect, that damages enemies once on collision.
     * While traveling a fixed path.
     * 
     * @param start 
     * @param end 
     * @param width 
     * @param height 
     * @param attack_damage 
     * @param is_player 
     * @returns 
     */
    public makeMissle(start: Vector2D, end: Vector2D, width: number, height: number, attack_damage: number, is_player: boolean) {
        const path = end.cpy().sub(start);
        const speed = 100;
        // const time_to_target = path.length() / speed;
        const entity = new Effect(
            this.game,
            Rect.fromCenterAndSize(start, { x: width, y: height }),
            this.getImageSet('missle'),
            3,
            'missle',
            is_player,
        );
        entity.die_on_hit = true;
        entity.animation_horizontal = 0.2;
        entity.animation_vertical = 0.1;
        entity.damage = attack_damage;
        entity.velocity.set(path.setLength(speed));
        this.game.model.addEntity(entity);
        return entity;
    }

    public getImageSet(type: keyof typeof image_sets): EntityImages {
        const images = image_sets[type]
            .map(([key, image_name]): [Direction, ImageAsset] => [key, this.game.assets.getImage(image_name)]);
        return new Map<Direction, ImageAsset>(images);
    }
}

const image_sets = {
    hit: [
        [Direction.NORTH_EAST, Assets.images.effects.hit],
        [Direction.NORTH_WEST, Assets.images.effects.hit],
        [Direction.SOUTH_EAST, Assets.images.effects.hit],
        [Direction.SOUTH_WEST, Assets.images.effects.hit],
    ],
    missle: [
        [Direction.NORTH_EAST, Assets.images.effects.magic_missle[0]],
        [Direction.NORTH_WEST, Assets.images.effects.magic_missle[0]],
        [Direction.SOUTH_EAST, Assets.images.effects.magic_missle[0]],
        [Direction.SOUTH_WEST, Assets.images.effects.magic_missle[0]],
    ]
} as const;