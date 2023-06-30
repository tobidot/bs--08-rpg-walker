import { AABBPhysicsEngine, AABBPhysicsProxy, Asset, MenuDefinitionGroup, MenuDefinitionItem, MenuGenerator, MenuGlobals, MenuGroupModel, MenuModel, assert } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { PhysicsEngine } from "../../library/physics/Physics";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { Entity } from "./Entity";
import { MonsterFactory } from "./MonsterFactory";
import { Player } from "./Player";

export class GameModel {
    public menu: MenuGroupModel;
    public physics: AABBPhysicsEngine;
    public entities: Array<Entity> = [];
    //
    public player: Player;
    public monster_factory: MonsterFactory;
    // 
    public is_running: boolean = false;
    public time_since_last_spawn = 0;

    public constructor(
        protected readonly game: Game,
        context: CanvasRenderingContext2D,
    ) {
        this.menu = this.createMenu(context);
        this.physics = new AABBPhysicsEngine({
            world_box: Rect.fromBoundingBox({ left: 0, top: 0, right: 800, bottom: 600 }),
            simple_collisions: false,
        });
        this.player = new Player(game);
        this.monster_factory = new MonsterFactory(game);
    }

    public restart() {
        this.physics = new AABBPhysicsEngine({
            world_box: this.physics.options.world_box,
            simple_collisions: false,
        });
        this.entities = [];

        this.player.restart();
        this.player.unit_factory.makeSwordsman(new Vector2D(400, 300));
        this.player.building_factory.makeCastle(new Vector2D(400, 300));

        this.is_running = true;
        this.time_since_last_spawn = 5;
    }

    /**
     * Create a new entity with the given label
     * @param label 
     * @returns 
     */
    public addEntity<T extends Entity>(
        entity: T,
    ): T {
        this.entities.push(entity);
        entity.physics_id = this.physics.add(entity.physics).id;
        return entity;
    }

    public removeEntity(entity: Entity) {
        if (entity.physics_id) {
            this.physics.remove(entity.physics_id);
        }
        this.entities = this.entities.filter(e => e.id !== entity.id);
    }

    public createMenu(
        context: CanvasRenderingContext2D,
    ): MenuGroupModel {
        const globals = new MenuGlobals(context);
        globals.asset_manager = this.game.assets;
        globals.audio_player = this.game.audio;
        globals.primary_color = "#fff";
        globals.background_color = "#000";
        globals.select_sound = Assets.sounds.select;
        const settings = {
        };
        const generator = new MenuGenerator(globals, settings)
            .set("x", 10)
            .set("y", 10)
            ;
        const menu_definition: MenuDefinitionGroup = {
            // "type": "menu",
            // "title": "Game Menu",

            name: "game_menu",
            label: "Game Menu",
            width: 100,
            
            children: [
                {
                    // "type": "button",
                    // "title": "New Game",
                    // "action": "newGame",
                    name: "new_game",
                    label: "New Game",
                    width: 300,
                },
                {
                    // "type": "button",
                    // "title": "New Game",
                    // "action": "newGame",
                    name: "buy_swordsman",
                    label: "Buy Swordsman",
                    width: 300,
                },
            ]
        };
        const menu = generator.compile(menu_definition);
        menu.refresh();
        assert(menu instanceof MenuGroupModel);
        menu.onSelect((item: MenuModel) => {
            this.game.controller.onMenuSelect(item);
        });
        return menu;
    }

    public update(delta_seconds: number) {
        this.physics.update(delta_seconds);
        this.entities.forEach(entity => { entity.update(delta_seconds) });

        this.time_since_last_spawn += delta_seconds;
        if (this.time_since_last_spawn > 5) {
            this.time_since_last_spawn -= 5;
            this.monster_factory.makeSlime();
        }
    }
}