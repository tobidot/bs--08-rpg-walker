import { AssetManager, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Direction } from "../consts/Direction";
import { EntityImages } from "./Entity";
import { MonsterUnit } from "./MonsterUnit";
import { Player } from "./Player";
import { PlayerUnit } from "./PlayerUnit";

export class MonsterFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makeSlime(
        position?: Vector2D,
    ) {
        const size = 32;
        if (position === undefined) {
            position = new Vector2D(
                Math.random() * (800 - size * 2) + size,
                Math.random() * (600 - size * 2) + size,
            );
            const random = Math.random();
            if (random < 0.25) {
                position.x = size;
            } else if (random < 0.5) {
                position.x = 800 - size;
            } else if (random < 0.75) {
                position.y = size;
            } else {
                position.y = 600 - size;
            }
        }
        const entity = new MonsterUnit(
            position,
            this.getImageSet('slime'),
            size,
            size,
            'slime',
        );
        const speed = 35;
        const world_center = new Vector2D(400, 300);
        entity.velocity.set(world_center.cpy().sub(position).normalize().mul(speed));
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
    slime: [
        [Direction.NORTH_EAST, Assets.images.slime.east],
        [Direction.NORTH_WEST, Assets.images.slime.west],
        [Direction.SOUTH_EAST, Assets.images.slime.east],
        [Direction.SOUTH_WEST, Assets.images.slime.west],
    ]
} as const;