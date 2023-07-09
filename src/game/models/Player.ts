import { AssetManager } from "../../library";
import { Vector2D } from "../../library/math";
import { Game } from "../base/Game";
import { PlayerBuilding } from "./PlayerBuilding";
import { PlayerBuildingFactory } from "../services/PlayerBuildingFactory";
import { PlayerUnit } from "./PlayerUnit";
import { PlayerUnitFactory } from "../services/PlayerUnitFactory";

export class Player {
    public units: Array<WeakRef<PlayerUnit>> = [];
    public buildings: Array<WeakRef<PlayerBuilding>> = [];
    public castle!: WeakRef<PlayerBuilding>;
    public money: number = 500;
    //
    public tower_speed_level: number = 1;
    public tower_damage_level: number = 1;
    //
    public unit_factory: PlayerUnitFactory;
    public building_factory: PlayerBuildingFactory;

    constructor(
        game: Game
    ) {
        this.unit_factory = new PlayerUnitFactory(game, this);
        this.building_factory = new PlayerBuildingFactory(game, this);
    }

    public restart() {
        this.units = [];
        this.buildings = [];
        this.money = 50;
        this.castle = new WeakRef(this.building_factory.makeCastle(new Vector2D({ x: 0, y: 0 })));
    }
}