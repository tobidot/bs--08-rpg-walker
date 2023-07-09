import { AABBPhysicsEngine, AABBPhysicsProxy, Asset, MenuButtonModel, MenuDefinitionGroup, MenuDefinitionItem, MenuGenerator, MenuGlobals, MenuGroupModel, MenuModel, assert } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { PhysicsEngine, PhysicsProxiable, PhysicsProxy } from "../../library/physics/Physics";
import { Assets } from "../base/Assets";
import { Game } from "../base/Game";
import { EffectFactory } from "../services/EffectFactory";
import { Entity } from "./Entity";
import { MonsterFactory } from "../services/MonsterFactory";
import { NeutralFactory } from "../services/NeutralFactory";
import { Player } from "./Player";
import { MonsterUnit } from "./MonsterUnit";
import { UnitCosts } from "../consts/UnitCosts";

export class GameModel {
    public menu: MenuGroupModel;
    public buttons: Array<MenuButtonModel> = [];
    public physics: AABBPhysicsEngine;
    public entities: Array<Entity> = [];
    //
    public player: Player;
    public monster_factory: MonsterFactory;
    public effect_factory: EffectFactory;
    public neutral_factory: NeutralFactory;
    // 
    public is_running: boolean = false;
    public time_since_last_spawn = 0;
    public seconds_to_spawn = 5.0;
    public wave_count: number = 0;
    public in_wave: boolean = false;
    public seconds_to_next_wave: number = 30;
    public wave_strength_to_defeat: number = 0;
    //
    public world_size: Rect = Rect.fromCenterAndSize({ x: 400, y: 300 }, { x: 800, y: 600 });
    //
    public is_debug_awareness: boolean = false;
    public is_debug_hitbox: boolean = false;
    public game_speed: number = 1.0;

    public constructor(
        protected readonly game: Game,
        context: CanvasRenderingContext2D,
    ) {
        this.menu = this.createMenu(context);
        this.physics = new AABBPhysicsEngine({
            world_box: this.world_size,
            simple_collisions: false,
        });
        this.player = new Player(game);
        this.monster_factory = new MonsterFactory(game);
        this.effect_factory = new EffectFactory(game);
        this.neutral_factory = new NeutralFactory(game);
    }

    public restart() {
        this.world_size = Rect.fromCenterAndSize({ x: 0, y: 0 }, { x: 800, y: 600 });
        this.physics = new AABBPhysicsEngine({
            world_box: this.world_size,
            simple_collisions: false,
        });
        this.entities = [];

        this.player.restart();

        // block the inner area for the castle
        this.rectsExcept(this.world_size, Rect.fromCenterAndSize(
            { x: 0, y: 50 },
            { x: 250, y: 200}
        )).forEach(area => {
            this.spawnTrees(area, 0.05);
        });

        this.is_running = true;
        this.time_since_last_spawn = 5;
        this.wave_count = 0;
        this.seconds_to_next_wave = 30;
    }

    /**
     * Create a new entity with the given label
     * @param label 
     * @returns 
     */
    public addEntity<T extends Entity>(
        entity: T,
    ): T {
        if (this.entities.length > 250 && entity instanceof MonsterUnit) {
            console.warn("Too many entities");
            return entity;
        }
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
            width: 150,

            children: [
                {
                    // "type": "button",
                    // "title": "New Game",
                    // "action": "newGame",
                    name: "new_game",
                    label: "New Game",
                },
                {
                    // "type": "button",
                    // "title": "New Game",
                    // "action": "newGame",
                    name: "toggle_sound",
                    label: "Toggle Sound",
                },
            ]
        };
        const menu = generator.compile(menu_definition);
        menu.refresh();
        assert(menu instanceof MenuGroupModel);
        menu.onSelect((item: MenuModel) => {
            this.game.controller.onMenuSelect(item);
        });

        const button_generator = new MenuGenerator(globals, settings)
            .set("width", 380)
            .set("height", 25)
            .set("callback", (button: MenuButtonModel) => {
                button.onSelect(() => this.game.controller.onMenuSelect(button));
            })
            .button()
            ;

        this.buttons = [
            button_generator.set("x", 10).set("y", 525).make("buy_worker", "[Q] Buy Worker (" + UnitCosts.worker + " Gold)"),
            button_generator.set("x", 10).set("y", 560).make("buy_swordsman", "[W] Buy Swordsman (" + UnitCosts.swordsman + " Gold)"),
            button_generator.set("x", 410).set("y", 525).make("upgrade_tower_speed", "[E] Upgrade Towerspeed (" + UnitCosts.tower_speed + " Gold)"),
            button_generator.set("x", 410).set("y", 560).make("upgrade_tower_damage", "[R] Upgrade Towerdamage (" + UnitCosts.tower_damage + " Gold)"),
        ];
        return menu;
    }

    public update(delta_seconds: number) {
        if (this.is_running === false) {
            return;
        }
        this.physics.update(delta_seconds);
        this.entities.forEach(entity => {
            entity.update(delta_seconds);
        });
        [...this.entities].forEach(entity => {
            if (entity.is_dead) {
                this.removeEntity(entity);
            }
        });

        this.time_since_last_spawn += delta_seconds;
        if (this.time_since_last_spawn > this.seconds_to_spawn) {
            this.time_since_last_spawn -= this.seconds_to_spawn;
            this.seconds_to_spawn = 5.0;
            this.spawnStrengh(this.wave_count + 1);
        }
        this.seconds_to_next_wave -= delta_seconds;
        if (this.seconds_to_next_wave <= 0 && !this.in_wave) {
            this.in_wave = true;
            this.seconds_to_next_wave = 20;
            this.wave_count++;
            const wave_strength =this.wave_strength_to_defeat =  Math.floor(Math.pow(this.wave_count + 1, 1.1) + this.wave_count * 5 + 2)
            this.spawnStrengh(wave_strength);
        }
        if (this.in_wave && this.wave_strength_to_defeat <= 0 || this.seconds_to_next_wave <= 0) {
            this.in_wave = false;
            this.seconds_to_next_wave = Math.min(20, this.seconds_to_next_wave + 5);
            if (this.wave_count % 3 === 0) {
                this.increaseWorld();
            }
        }

        if (this.isGameOver()) {
            this.is_running = false;
        }
    }

    public increaseWorld() {
        const old_world_size = this.world_size.cpy();
        this.world_size.width *= 1.3;
        this.world_size.height *= 1.3;
        this.game.view.scale = 800 / this.world_size.width;
        this.game.view.camera_x = 0;
        this.game.view.camera_y = 0;

        this.rectsExcept(this.world_size, old_world_size).forEach(area => {
            this.spawnTrees(area, 0.15);
        });
    }

    public rectsExcept(area: Rect, except: Rect): Array<Rect> {
        return [
            Rect.fromBoundingBox({ left: area.left, top: area.top, right: except.left, bottom: area.bottom, }),
            Rect.fromBoundingBox({ left: except.right, top: area.top, right: area.right, bottom: area.bottom, }),
            Rect.fromBoundingBox({ left: except.left, top: area.top, right: except.right, bottom: except.top, }),
            Rect.fromBoundingBox({ left: except.left, top: except.bottom, right: except.right, bottom: area.bottom, }),
        ];
    }

    public spawnTrees(area: Rect, density: number) {
        const grid_width = Math.floor(area.width / 16);
        const grid_height = Math.floor(area.height / 16);
        const grid_size = grid_width * grid_height;
        const grid = new Array(grid_size).fill(false);
        // 
        for (let x = 0; x < grid_width; x++) {
            for (let y = 0; y < grid_height; y++) {
                if (grid[x + y * grid_width]) {
                    continue;
                }
                if (Math.random() < density) {
                    grid[x + y * grid_width] = true;
                    const position = (new Vector2D(x * 16, y * 16)).add({ x: area.left, y: area.top });
                    this.neutral_factory.makeTree(position);
                }
            }
        }
    }


    public spawnStrengh(wave_strength: number) {
        const mother = Math.floor(Math.random() * wave_strength / 50);
        const fire = Math.floor(Math.random() * wave_strength / 10);
        const slime = Math.max(0, wave_strength - mother * 50 - fire * 10);
        for (let i = 0; i < slime; i++) {
            this.monster_factory.makeSlime();
        }
        for (let i = 0; i < fire; i++) {
            this.monster_factory.makeFireSlime();
        }
        for (let i = 0; i < mother; i++) {
            this.monster_factory.makeSlimeMother();
        }
    }

    public isGameOver(): boolean {
        return this.player.buildings.filter(br => {
            let b = br.deref();
            return b && b.type === "castle" && b.hit_points > 0;
        }).length === 0;
    }
}