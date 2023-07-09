import { AssetManager, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Direction } from "../consts/Direction";
import { EntityImages } from "../models/Entity";
import { MonsterUnit } from "../models/MonsterUnit";

export class MonsterFactory {

    constructor(
        protected game: Game,
    ) {
    }

    /**
     * The weakest monster
     * @param position 
     * @returns 
     */
    public makeSlime(
        position?: Vector2D,
    ) {
        const size = 24;
        position ??= this.getRandomPosition(size);
        const entity = new MonsterUnit(
            this.game,
            position,
            this.getImageSet('slime'),
            size,
            size,
            'slime',
        );
        entity.awareness_range = 32;
        entity.attack_damage = 2;
        entity.attack_delay_seconds = 1.1;
        entity.hitpoints = 10;
        entity.strength = 1;
        const speed = 22;
        const world_center = new Vector2D(400, 300);
        entity.velocity.set(world_center.cpy().sub(position).normalize().mul(speed));
        this.game.model.addEntity(entity);
        return entity;
    }

    /**
     * A slightly stronger monster
     * @param position 
     * @returns 
     */
    public makeFireSlime(
        position?: Vector2D,
    ) {
        const size = 32;
        position ??= this.getRandomPosition(size);
        const entity = new MonsterUnit(
            this.game,
            position,
            this.getImageSet('fire_slime'),
            size,
            size,
            'fire_slime',
        );
        entity.awareness_range = 80;
        entity.attack_damage = 2;
        entity.attack_delay_seconds = 0.25;
        entity.hitpoints = 8;
        entity.strength = 10;
        const speed = 30;
        const world_center = new Vector2D(400, 300);
        entity.velocity.set(world_center.cpy().sub(position).normalize().mul(speed));
        this.game.model.addEntity(entity);
        return entity;
    }

    /**
     * The strongest monster
     * @param position
     * @returns
     * */
    public makeSlimeMother(
        position?: Vector2D,
    ) {
        const size = 48;
        position ??= this.getRandomPosition(size);
        const entity = new MonsterUnit(
            this.game,
            position,
            this.getImageSet('slime_mother'),
            size,
            size,
            'slime_mother',
        );
        entity.hitpoints = 200;
        entity.awareness_range = 128;
        entity.attack_damage = 10;
        entity.attack_delay_seconds = 1.5;
        entity.is_spawning_slime = true;
        entity.strength = 50;
        const speed = 15;
        entity.velocity.set(Vector2D.fromAngle(Math.random() * Math.PI).mul(speed));
        this.game.model.addEntity(entity);
        return entity;
    }

    public getRandomPosition(size: number): Vector2D {
        const position = new Vector2D(
            Math.random() * (this.game.model.world_size.size.x - size) - this.game.model.world_size.size.x / 2,
            Math.random() * (this.game.model.world_size.size.y - size) - this.game.model.world_size.size.y / 2,
        );
        const random = Math.random();
        if (random < 0.25) {
            position.x = -this.game.model.world_size.size.x / 2 + size;
        } else if (random < 0.5) {
            position.x = this.game.model.world_size.size.x / 2 - size;
        } else if (random < 0.75) {
            position.y = -this.game.model.world_size.size.y / 2 + size;
        } else {
            position.y = this.game.model.world_size.size.y / 2 - size;
        }
        return position;
    }

    public getImageSet(type: keyof typeof image_sets): EntityImages {
        const images = image_sets[type]
            .map(([key, image_name]): [Direction, ImageAsset] => [key, this.game.assets.getImage(image_name)]);
        return new Map<Direction, ImageAsset>(images);
    }
}

const image_sets = {
    slime: [
        [Direction.NORTH_EAST, Assets.images.slime],
        [Direction.NORTH_WEST, Assets.images.slime],
        [Direction.SOUTH_EAST, Assets.images.slime],
        [Direction.SOUTH_WEST, Assets.images.slime],
    ],
    fire_slime: [
        [Direction.NORTH_EAST, Assets.images.fire_slime],
        [Direction.NORTH_WEST, Assets.images.fire_slime],
        [Direction.SOUTH_EAST, Assets.images.fire_slime],
        [Direction.SOUTH_WEST, Assets.images.fire_slime],
    ],
    slime_mother: [
        [Direction.NORTH_EAST, Assets.images.slime_mother],
        [Direction.NORTH_WEST, Assets.images.slime_mother],
        [Direction.SOUTH_EAST, Assets.images.slime_mother],
        [Direction.SOUTH_WEST, Assets.images.slime_mother],
    ]
} as const;