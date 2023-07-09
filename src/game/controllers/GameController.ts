import { AABBCollision, AABBPhysicsProxy, Asset, GameBaseController, KeyDownEvent, KeyName, MenuButtonModel, MenuGroupModel, MenuModel, MouseDownEvent, MouseUpEvent, assert } from "../../library";
import { Controller } from "../../library/abstract/mvc/Controller";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { MenuController } from "../../library/abstract/mvc/components/menu/MenuController";
import { Vector2D } from "../../library/math";
import { Collision } from "../../library/physics/Physics";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { UnitCosts } from "../consts/UnitCosts";
import { Entity } from "../models/Entity";
import { MonsterUnit } from "../models/MonsterUnit";
import { PlayerBuilding } from "../models/PlayerBuilding";
import { PlayerUnit } from "../models/PlayerUnit";

export class GameController extends GameBaseController implements Controller {
    public drag_start: Vector2D | null = null;
    public drag_offset: Vector2D | null = null;

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

    public update(delta_seconds: number): ControllerResponse {
        super.update(delta_seconds);
        this.game.model.buttons.forEach((button) => {
            button.update(delta_seconds, this.game.mouse);
        });
        for (let i = 0; i < this.game.model.game_speed; i++) {
            this.game.model.update(delta_seconds);
            this.game.model.physics.collisions.forEach(this.onCollision);
        }
        return null;
    }

    public onKeyDown(event: KeyDownEvent): void {
        super.onKeyDown(event);
    }

    public onKeyUp(event: KeyDownEvent): void {
        switch (event.key.name) {
            case KeyName.KeyD:
                this.game.model.is_debug_awareness = !this.game.model.is_debug_awareness;
                this.game.model.is_debug_hitbox = !this.game.model.is_debug_hitbox;
                break;
            case KeyName.KeyQ:
                this.buyWorker();
                break;
            case KeyName.KeyW:
                this.buySwordsman();
                break;
            case KeyName.KeyE:
                this.upgradeTowerSpeed();
                break;
            case KeyName.KeyR:
                this.upgradeTowerDamage();
                break;
            case KeyName.Space:
                this.game.model.is_running = !this.game.model.is_running;
                break;
            case KeyName.Enter:
                this.game.view.camera_x = 0;
                this.game.view.camera_y = 0;
                this.game.view.scale = 800 / this.game.model.world_size.width;
                break;
            case KeyName.Digit1:
                this.game.model.game_speed = 1;
                break;
            case KeyName.Digit2:
                this.game.model.game_speed = 2;
                break;
            case KeyName.Digit3:
                this.game.model.game_speed = 3;
                break;
            case KeyName.Digit4:
                this.game.model.game_speed = 4;
                break;
            case KeyName.ArrowUp:
                this.game.view.camera_x += 0.1;
                break;
            case KeyName.ArrowDown:
                this.game.view.scale -= 0.1;
                break;
        }
    }

    public onMouseDown(event: MouseDownEvent): void {
        this.drag_start = this.game.mouse.position.cpy();
        this.drag_offset = new Vector2D(0, 0);
    }

    public onMouseMove(event: MouseDownEvent): void {
        if (this.drag_start && this.drag_offset) {
            const delta = this.drag_start.cpy().sub(this.game.mouse.position);
            this.game.view.camera_x -= delta.x - this.drag_offset.x;
            this.game.view.camera_y -= delta.y - this.drag_offset.y;
            this.drag_offset = delta;
        }
    }

    public onMouseWheel(event: WheelEvent): void {
        this.game.view.scale = Math.max(0.1, this.game.view.scale - event.deltaY * 0.001);
    }

    /**
    * Check if a button has been clicked
    * @param event 
    */
    public onMouseUp(event: MouseUpEvent): void {
        super.onMouseUp(event);
        this.drag_start = null;
        this.drag_offset = null;
        this.game.model.buttons.forEach((button) => {
            if (button.area.contains(this.game.mouse.position)) {
                button.select();
                return true;
            }
        });
    }

    public onMenuSelect(item: MenuModel) {
        if (item instanceof MenuButtonModel && !(item instanceof MenuGroupModel)) {
            console.log(`Menu item selected: ${item.name} (${item.label})`);
            switch (item.name) {
                case "new_game":
                    this.newGame();
                    break;
                case "buy_swordsman":
                    this.buySwordsman();
                    break;
                case "buy_worker":
                    this.buyWorker();
                    break;
                case "upgrade_tower_speed":
                    this.upgradeTowerSpeed();
                    break;
                case "upgrade_tower_damage":

                    this.upgradeTowerDamage();
                    break;
                case "toggle_sound":
                    this.game.audio.sfx.is_muted = !this.game.audio.sfx.is_muted;
                    break;
            }
            this.game.model.menu.close();
        }
    }

    public upgradeTowerSpeed() {
        const cost = UnitCosts.tower_speed * (this.game.model.player.tower_speed_level);
        if (this.game.model.player.money >= cost) {
            this.game.model.player.money -= cost;
            this.game.model.player.tower_speed_level++;
            this.game.model.player.buildings.forEach((tower: WeakRef<PlayerBuilding>) => {
                const tower_entity = tower.deref();
                assert(tower_entity instanceof PlayerBuilding, "Invalid tower reference");
                tower_entity.attack_cooldown = 2 * (5) / (5 + this.game.model.player.tower_speed_level);
                tower_entity.hit_points = Math.min(100, tower_entity.hit_points + 5);
                this.game.model.buttons.forEach((button) => {
                    if (button.name === "upgrade_tower_speed") {
                        button.label = "[E] Upgrade Towerspeed (" + UnitCosts.tower_speed * (this.game.model.player.tower_speed_level) + " Gold)";
                    }
                })
            });
        }
    }

    public upgradeTowerDamage() {
        const cost = UnitCosts.tower_damage * (this.game.model.player.tower_damage_level);
        if (this.game.model.player.money >= cost) {
            this.game.model.player.money -= cost;
            this.game.model.player.tower_damage_level++;
            this.game.model.player.buildings.forEach((tower: WeakRef<PlayerBuilding>) => {
                const tower_entity = tower.deref();
                assert(tower_entity instanceof PlayerBuilding, "Invalid tower reference");
                tower_entity.attack_damage = 4 + this.game.model.player.tower_damage_level;
                tower_entity.hit_points = Math.min(100, tower_entity.hit_points + 5);
                this.game.model.buttons.forEach((button) => {
                    if (button.name === "upgrade_tower_damage") {
                        button.label = "[R] Upgrade Towerdamage (" + UnitCosts.tower_damage * (this.game.model.player.tower_damage_level) + " Gold)";
                    }
                })
            });
        }
    }

    public buySwordsman() {
        if (this.game.model.player.money >= UnitCosts.swordsman) {
            this.game.model.player.money -= UnitCosts.swordsman;
            const castle = this.game.model.player.buildings[0].deref();
            assert(castle instanceof PlayerBuilding, "Invalid castle reference");
            this.game.model.addEntity(this.game.model.player.unit_factory.makeSwordsman(castle.hit_box.center.cpy()));
        }
    }

    public buyWorker() {
        if (this.game.model.player.money >= UnitCosts.worker) {
            this.game.model.player.money -= UnitCosts.worker;
            const castle = this.game.model.player.buildings[0].deref();
            assert(castle instanceof PlayerBuilding, "Invalid castle reference");
            this.game.model.addEntity(this.game.model.player.unit_factory.makeWorker(castle.hit_box.center.cpy()));
        }
    }



    public onCollision = (collision: Collision) => {
        // const entity_a = collision.a.reference;
        // const entity_b = collision.b.reference;
        // assert(entity_a instanceof Entity && entity_b instanceof Entity, "Collisions with invalid references");
    }

}