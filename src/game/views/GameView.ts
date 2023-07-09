import { GameModel } from "../models/GameModel";
import { View } from "../../library/abstract/mvc/View";
import { GameBaseView } from "../../library";
import { Entity } from "../models/Entity";
import { Assets } from "../base/Assets";
import { Vector2D, Vector2DLike } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Player } from "../models/Player";
import { MoveableEntity } from "../models/MovableEntity";
import { Effect } from "../models/Effect";

export class GameView extends GameBaseView implements View {
    protected is_debug_awareness: boolean = false;
    protected is_debug_hitbox: boolean = false;
    public scale = 1.0;
    public camera_x = 0;
    public camera_y = 0;

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
        this.is_debug_awareness = model.is_debug_awareness;
        this.is_debug_hitbox = model.is_debug_hitbox;
        this.resetCanvasState();
        //
        this.context.save();
        this.context.translate(400, 300);
        this.context.translate(this.camera_x, this.camera_y);
        this.context.scale(this.scale, this.scale);
        this.renderBackground(model.world_size);
        const entities = model.entities.sort((a, b) => {
            return a.render_box.bottom - b.render_box.bottom;
        });
        // render normal entities
        entities.filter(entity => !(entity instanceof Effect))
            .forEach((entity) => this.renderEntity(entity));
        // render effects
        entities.filter(entity => entity instanceof Effect)
            .forEach((entity) => this.renderEntity(entity));
        // render debug
        entities
            .forEach((entity) => this.renderEntityDebug(entity));
        //
        this.context.restore();
        //
        this.menu_view.render(model.menu);
        model.buttons.forEach((button) => {
            this.menu_view.render(button);
        });
        this.renderHud(model);
        if (model.isGameOver()) {
            this.renderGameOver();
        }
    }

    /**
     * Render a big red "Game Over" text on a black box with yellow border.
     * Covering half of the screen.
     */
    public renderGameOver() {
        const window_size = { x: 800, y: 600 };
        const rect = Rect.fromCenterAndSize({ x: window_size.x / 2, y: window_size.y / 2 }, { x: window_size.x / 2, y: window_size.y / 2 });
        this.context.globalAlpha = 0.5;
        this.context.fillStyle = "#000";
        this.context.fillRect(
            rect.left, rect.top,
            rect.width, rect.height
        );
        this.context.globalAlpha = 1;
        this.context.strokeStyle = "#ff0";
        this.context.lineWidth = 2;
        this.context.strokeRect(
            rect.left, rect.top,
            rect.width, rect.height
        );
        this.context.font = "bold 128px gothic";
        this.context.textAlign = "center";
        this.context.fillStyle = "#f00";
        this.context.fillText(
            "Game Over",
            window_size.x / 2, window_size.y / 2,
            window_size.x / 2,
        );
    }

    public renderBackground(world_size: Rect): void {
        const image = game.assets.getImage(Assets.images.terrain.gras);
        // const image_size = new Vector2D(image.image.width, image.image.height);
        const image_size = new Vector2D(image.width, image.height);
        const render_size = new Vector2D(128, 128);
        const left = Math.floor(world_size.left / render_size.x) * render_size.x;
        const top = Math.floor(world_size.top / render_size.y) * render_size.y;
        const right = Math.ceil(world_size.right / render_size.x) * render_size.x;
        const bottom = Math.ceil(world_size.bottom / render_size.y) * render_size.y;
        for (let x = left; x < right; x += render_size.x) {
            const rx = Math.max(world_size.left, x);
            const rw = Math.min(x + render_size.x, world_size.right) - rx;
            const sx = (rx - x) / render_size.x * image_size.x;
            const sw = rw / render_size.x * image_size.x;
            for (let y = top; y < bottom; y += render_size.y) {
                const ry = Math.max(world_size.top, y);
                const rh = Math.min(y + render_size.y, world_size.bottom) - ry;
                const sy = (ry - y) / render_size.y * image_size.y;
                const sh = rh / render_size.y * image_size.y;

                this.context.drawImage(
                    image.image,
                    sx, sy, sw, sh,
                    rx, ry, rw, rh
                );
            }
        }
    }

    public renderHud(model: GameModel): void {
        const player = model.player;
        this.renderAsset(Assets.images.hud.heart, { x: 800 - 32 - 10, y: 32 + 10 }, { x: 64, y: 64 });
        this.renderAsset(Assets.images.hud.coin, { x: 800 - 32 - 10, y: 32 + 10 + 64 + 10 }, { x: 64, y: 64 });
        this.renderText(Math.floor(player.castle.deref()?.hit_points ?? 0)?.toString() ?? '---', { x: 800 - 64 - 10 - 10, y: 32 + 10 }, 64);
        this.renderText(player.money.toString(), { x: 800 - 64 - 10 - 10, y: 32 + 10 + 64 + 10 }, 64);
        if (model.in_wave) {
            this.renderText(`Wave: ${model.wave_count}`, { x: 400, y: 32 }, 256, "center");
            this.renderText(`Strength: ${model.wave_strength_to_defeat}`, { x: 400, y: 90 }, 128, "center", 16);
            const seconds = (Math.floor(model.seconds_to_next_wave) % 60).toString().padStart(2, '0');
            const minutes = Math.floor(model.seconds_to_next_wave / 60).toString().padStart(2, '0');
            this.renderText(`${minutes}:${seconds}`, { x: 400, y: 110}, 256, "center", 16);
        } else {
            const seconds = (Math.floor(model.seconds_to_next_wave) % 60).toString().padStart(2, '0');
            const minutes = Math.floor(model.seconds_to_next_wave / 60).toString().padStart(2, '0');
            this.renderText(`${minutes}:${seconds}`, { x: 400, y: 32 }, 256, "center");
        }
    }

    public renderText(
        text: string,
        position: Vector2DLike,
        width?: number,
        textAlign: CanvasTextAlign = "right",
        size: number = 64,
    ) {
        this.context.font = "bold " + size + "px gothic";
        this.context.textAlign = textAlign;
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
        const rect = entity.render_box.cpy();
        rect.width = entity.render_box.w * (1 + Math.sin(entity.animation_offset * 2 * Math.PI) * entity.animation_horizontal);
        rect.height = entity.render_box.h * (1 + Math.cos(entity.animation_offset * 2 * Math.PI) * entity.animation_vertical);
        if (!image) {
            this.context.fillStyle = "#f00";
            this.context.fillRect(
                rect.left, rect.top,
                rect.width, rect.height
            );
        } else {
            this.context.drawImage(
                image.image,
                rect.left, rect.top,
                rect.width, rect.height
            );
        }

    }

    public renderEntityDebug(entity: Entity): void {
        if (this.is_debug_awareness && entity instanceof MoveableEntity) {
            const rect = Rect.fromCenterAndSize(entity.hit_box.center, { x: entity.awareness_range, y: entity.awareness_range });
            this.context.strokeStyle = "#f00";
            this.context.lineWidth = 1;
            this.context.strokeRect(
                rect.left, rect.top,
                rect.width, rect.height
            );
        }
        if (this.is_debug_hitbox) {
            this.context.strokeStyle = "#f00";
            this.context.lineWidth = 1;
            this.context.strokeRect(
                entity.hit_box.left, entity.hit_box.top,
                entity.hit_box.width, entity.hit_box.height
            );
        }
    }
}