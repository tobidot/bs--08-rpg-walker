import { AssetManager, ImageAsset, getElementByClassName } from "../../library";
import { Vector2D } from "../../library/math";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Direction } from "../consts/Direction";
import { EntityImages } from "../models/Entity";
import { Player } from "../models/Player";
import { PlayerUnit } from "../models/PlayerUnit";

export class PlayerUnitFactory {

    constructor(
        protected game: Game,
        protected player: Player,
    ) {
    }

    public makeSwordsman(
        position: Vector2D,
    ) {
        const size = 48;
        const entity = new PlayerUnit(
            this.game,
            position,
            this.getImageSet('swordsman'),
            size, size,
            'swordsman'
        );
        entity.hitpoints = 40;
        entity.attack_delay_seconds = 1.0;
        entity.attack_damage = 15;
        entity.attack_area = 32;
        entity.awareness_range = 128;
        const speed = 30;
        entity.physics.velocity.set(Vector2D.fromAngle(Math.random() * Math.PI * 2, speed));
        this.game.model.addEntity(entity);
        this.player.units.push(new WeakRef(entity));
        return entity;
    }

    public makeWorker(
        position: Vector2D,
    ) {
        const size = 32;
        const entity = new PlayerUnit(
            this.game,
            position,
            this.getImageSet('worker'),
            size, size,
            'worker'
        );
        entity.hitpoints = 4;
        entity.attack_delay_seconds = 0.9;
        entity.attack_damage = 1.5;
        entity.attack_area = 24;
        entity.awareness_range = 42;
        entity.harvest_wood = 1;
        const speed = 40;
        entity.physics.velocity.set(Vector2D.fromAngle(Math.random() * Math.PI * 2, speed));
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
    ],
    worker: [
        [Direction.NORTH_EAST, Assets.images.worker],
        [Direction.NORTH_WEST, Assets.images.worker],
        [Direction.SOUTH_EAST, Assets.images.worker],
        [Direction.SOUTH_WEST, Assets.images.worker],
    ],
} as const;