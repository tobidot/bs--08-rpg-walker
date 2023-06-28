import { AABBCollision, AABBPhysicsProxy, Asset, GameBaseController, KeyDownEvent, KeyName, MenuButtonModel, MenuGroupModel, MenuModel, assert } from "../../library";
import { Controller } from "../../library/abstract/mvc/Controller";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { Vector2D } from "../../library/math";
import { Collision } from "../../library/physics/Physics";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Entity } from "../models/Entity";
import { MonsterUnit } from "../models/MonsterUnit";
import { PlayerUnit } from "../models/PlayerUnit";

export class GameController extends GameBaseController implements Controller {

    public constructor(
        protected readonly game: Game,
    ) {
        super(game);
    }

    /**
     * Start a new game
     */
    public newGame(): ControllerResponse {
        this.game.model.restart();
        return null;
    }

    public isGameOver(): boolean {
        return false;
    }

    public update(delta_seconds: number): ControllerResponse {
        super.update(delta_seconds);
        this.game.model.update(delta_seconds);
        this.game.model.physics.collisions.forEach(this.onCollision);
        return null;
    }

    public onKeyDown(event: KeyDownEvent): void {
        super.onKeyDown(event);
        const player = this.game.model.player;
        assert(player instanceof PlayerUnit, "Player is null");
        if (event.key.name === KeyName.ArrowLeft) {
            player.velocity.x = -100;
        }
        if (event.key.name === KeyName.ArrowRight) {
            player.velocity.x = 100;
        }
        if (event.key.name === KeyName.ArrowUp) {
            player.velocity.y = -100;
        }
        if (event.key.name === KeyName.ArrowDown) {
            player.velocity.y = 100;
        }
    }

    public onKeyUp(event: KeyDownEvent): void {
    }

    public onMenuSelect(item: MenuModel) {
        if (item instanceof MenuButtonModel && !(item instanceof MenuGroupModel)) {
            console.log(`Menu item selected: ${item.name} (${item.label})`);
            switch (item.name) {
                case "new_game":
                    this.newGame();
                    break;
                case "buy_swordsman":
                    this.game.model.player.money -= 50;
                    this.game.model.addEntity(this.game.model.player.unit_factory.makeSwordsman(new Vector2D(400, 300)));
                    break;
            }
            this.game.model.menu.close();
        }
    }

    public onCollision = (collision: Collision) => {
        const entity_a = collision.a.reference;
        const entity_b = collision.b.reference;
        assert(entity_a instanceof Entity && entity_b instanceof Entity, "Collisions with invalid references");
        if (entity_a instanceof PlayerUnit && entity_b instanceof MonsterUnit) {
            this.game.model.removeEntity(entity_b);
            this.game.audio.sfx.play(this.game.assets.getSound(Assets.sounds.slime_dead));
            this.game.model.player.money += 1;
        }
        if (entity_b instanceof PlayerUnit && entity_a instanceof MonsterUnit) {
            this.game.model.removeEntity(entity_a);
            this.game.audio.sfx.play(this.game.assets.getSound(Assets.sounds.slime_dead));
            this.game.model.player.money += 1;
        }
    }
}