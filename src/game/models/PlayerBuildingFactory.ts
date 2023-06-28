import { AssetManager, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Direction } from "../consts/Direction";
import { EntityImages } from "./Entity";
import { Player } from "./Player";
import { PlayerBuilding } from "./PlayerBuilding";
import { PlayerUnit } from "./PlayerUnit";

export class PlayerBuildingFactory {

    constructor(
        protected game: Game,
        protected player: Player,
    ) {
    }

    public makeCastle(
        position: Vector2D,
    ) {
        const entity = new PlayerBuilding(
            position,
            this.getImageSet('tower'),
            128, 64, 256, 
            'tower'
        );
        this.game.model.addEntity(entity);
        this.player.buildings.push(new WeakRef(entity));
        return entity;
    }

    public getImageSet(type: keyof typeof image_sets): EntityImages {
        const images = image_sets[type]
            .map(([key, image_name]): [Direction, ImageAsset] => [key, this.game.assets.getImage(image_name)]);
        return new Map<Direction, ImageAsset>(images);
    }
}

const image_sets = {
    tower: [
        [Direction.NORTH_EAST, Assets.images.tower.default],
        [Direction.NORTH_WEST, Assets.images.tower.default],
        [Direction.SOUTH_EAST, Assets.images.tower.default],
        [Direction.SOUTH_WEST, Assets.images.tower.default],
    ]
} as const;