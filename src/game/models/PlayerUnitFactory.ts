import { AssetManager, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Direction } from "../consts/Direction";
import { EntityImages } from "./Entity";
import { Player } from "./Player";
import { PlayerUnit } from "./PlayerUnit";

export class PlayerUnitFactory {

    constructor(
        protected game: Game,
        protected player: Player,
    ) {
    }

    public makeSwordsman(
        position: Vector2D,
    ) {
        const entity = new PlayerUnit(
            position,
            this.getImageSet('swordsman'),
            64, 64,
            'swordsman'
        );
        entity.physics.velocity.set(Vector2D.fromAngle(Math.random() * Math.PI * 2, 100));
        this.game.model.addEntity(entity);
        this.player.units.push(new WeakRef(entity));
        return entity;
    }

    public getImageSet(type: keyof typeof image_sets): EntityImages {
        const images = image_sets[type]
            .map(([key, image_name]): [Direction, ImageAsset] => [key, this.game.assets.getImage(image_name)]);
        return new Map<Direction, ImageAsset>(images);
    }
}

const image_sets = {
    swordsman: [
        [Direction.NORTH_EAST, Assets.images.arwin.north_east],
        [Direction.NORTH_WEST, Assets.images.arwin.north_west],
        [Direction.SOUTH_EAST, Assets.images.arwin.south_east],
        [Direction.SOUTH_WEST, Assets.images.arwin.south_west],
    ]
} as const;