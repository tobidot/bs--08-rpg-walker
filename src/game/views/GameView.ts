import { GameModel } from "../models/GameModel";
import { View } from "../../library/abstract/mvc/View";
import { GameBaseView } from "../../library";
import { Entity } from "../models/Entity";
import { Assets } from "../base/Assets";
import { Vector2D, Vector2DLike } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Player } from "../models/Player";

export class GameView extends GameBaseView implements View {


    public constructor(
        public context: CanvasRenderingContext2D,
    ) {
        super(context);
        this.resetCanvasState();
    }

    public update(delta_ms: number): void {
        // do nothing
    }

    public render(model: GameModel): void {
        this.resetCanvasState();
        //
        model.entities.sort((a,b)=>{
            return a.render_box.bottom - b.render_box.bottom;
        }).forEach((entity) => this.renderEntity(entity));
        this.menu_view.render(model.menu);
        this.renderHud(model.player);
    }

    public renderHud(player: Player): void {
        this.renderAsset(Assets.images.hud.heart, { x: 800 - 32 - 10, y: 32 + 10 }, { x: 64, y: 64 });
        this.renderAsset(Assets.images.hud.coin, { x: 800 - 32 - 10, y: 32 + 10 + 64 + 10 }, { x: 64, y: 64 });
        this.renderText(player.live.toString(), { x: 800 -  64 - 10 - 10, y: 32 + 10 }, 64);
        this.renderText(player.money.toString(), { x: 800 - 64 - 10 - 10, y: 32 + 10 + 64 + 10 }, 64);
    }

    public renderText(
        text: string,
        position: Vector2DLike,
        width?: number,
    ) {
        this.context.font = "bold 64px gothic";
        this.context.textAlign = "right";
        this.context.fillStyle = this.settings.color_primary;
        this.context.fillText(
            text,
            position.x, position.y,
            width,
        );
    }

    public renderAsset(
        asset: string,
        position: Vector2DLike,
        size?: Vector2DLike,
    ) {
        const image = game.assets.getImage(asset);
        if (!size) {
            size = { x: image.image.width, y: image.image.height };
        }
        const rect = Rect.fromCenterAndSize(position, size);
        this.context.drawImage(
            image.image,
            rect.left, rect.top,
            rect.w, rect.h
        );
    }

    public renderEntity(entity: Entity): void {
        const offset = { x: entity.render_box.w / 2, y: entity.render_box.h / 2 }
        const position = entity.render_box.center.cpy().sub(offset);
        this.context.globalAlpha = 1;
        const image = entity.images.get(entity.facing);
        if (!image) {
            this.context.fillStyle = "#f00";
            this.context.fillRect(
                position.x, position.y,
                entity.render_box.w, entity.render_box.h
            );
        } else {
            this.context.drawImage(
                image.image,
                position.x, position.y,
                entity.render_box.w, entity.render_box.h
            );
        }
    }

}