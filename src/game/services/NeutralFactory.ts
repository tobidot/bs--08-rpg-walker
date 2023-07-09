import { AssetManager, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Direction } from "../consts/Direction";
import { EntityImages } from "../models/Entity";
import { NeutralBuilding } from "../models/NeutralBuilding";

export class NeutralFactory {

    constructor(
        protected game: Game,
    ) {
    }

    public makeTree(
        position: Vector2D,
    ) {
        const entity = new NeutralBuilding(
            this.game,
            position,
            this.getImageSet('tree', Math.floor(Math.random() * 4 | 0)),
            16,
            16,
            32,
            64,
            'tree',
        );
        entity.is_wood = true;
        entity.wood = 5;
        this.game.model.addEntity(entity);
        return entity;
    }

    public getImageSet(type: keyof typeof image_sets, variant: number): EntityImages {
        const images = image_sets[type][variant]
            .map(([key, image_name]): [Direction, ImageAsset] => [key, this.game.assets.getImage(image_name)]);
        return new Map<Direction, ImageAsset>(images);
    }
}

const image_sets = {
    tree: Assets.images.tree.map((image_name): [Direction, string][] =>
        [
            [Direction.NORTH_EAST, image_name],
            [Direction.NORTH_WEST, image_name],
            [Direction.SOUTH_EAST, image_name],
            [Direction.SOUTH_WEST, image_name],
        ]
    ),
} as const;