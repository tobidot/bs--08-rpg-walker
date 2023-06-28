import { assertNotNull } from "../../flow";
import * as tgt from "../../index";
import { ControllerResponse, KeyDownEvent, MouseDownEvent } from "../../index";
import { MenuController } from "../mvc/components/menu/MenuController";
import { MenuView } from "../mvc/components/menu/MenuView";


/**
 * A base template for a game
 */
export abstract class GameTemplate<
    MODEL extends tgt.Model,
    VIEW extends tgt.View,
    CONTROLLER extends tgt.KeyboardController & tgt.MouseController & tgt.Controller,
> {
    // features
    public assets: tgt.AssetManager;
    public keyboard: tgt.KeyboardHandler;
    public mouse: tgt.MouseHandler;
    public audio: tgt.AudioPlayer;
    // mvc
    public model: MODEL;
    public view: VIEW;
    public controller: CONTROLLER;
    // properties
    public last_time_ms: number = 0;
    public loading_promise: Promise<void> = Promise.resolve();

    public constructor(
        public app: HTMLElement,
    ) {
        (<any>window).game = this;
        const canvas = tgt.getElementByQuerySelector(app, "canvas", HTMLCanvasElement);
        const context = canvas.getContext("2d", { alpha: false });
        assertNotNull(context, "No 2d context found");
        this.audio = new tgt.AudioPlayer();
        this.assets = new tgt.AssetManager();
        this.registerAssets(this.assets);
        this.loading_promise = this.loading_promise.then(() => this.assets.loadAll(context));
        this.keyboard = new tgt.KeyboardHandler(app, () => this.getKeyboardController());
        this.mouse = new tgt.MouseHandler(app, canvas, () => this.getMouseController());
        const mvc = this.initMvc(context);
        this.model = mvc.model;
        this.controller = mvc.controller;
        this.view = mvc.view;
    }

    protected getKeyboardController(): tgt.KeyboardController {
        return this.controller;
    };
    protected getMouseController(): tgt.MouseController {
        return this.controller;
    };
    protected abstract registerAssets(assets: tgt.AssetManager): void;
    protected abstract initMvc(context: CanvasRenderingContext2D): this;
    protected abstract newGame(resolve: () => void, reject: (reason?: any) => void): void;

    protected update(delta_ms: number) {
        this.controller.update(delta_ms / 1000);
        this.view.update(delta_ms / 1000);
        this.view.render(this.model);
    }

    protected onFrame = (timestamp_ms: number) => {
        // limit the delta time to 30 fps
        const delta_ms = Math.min(timestamp_ms - this.last_time_ms, 1000 / 30);
        this.update(delta_ms);
        this.last_time_ms = timestamp_ms;
        requestAnimationFrame(this.onFrame);
    }

    /**
     * Initialize the game
     */
    public async init() {
        this.keyboard.init();
        this.mouse.init();
    }

    /**
     * Start the game loop
     * @returns 
     */
    public async run() {
        return this.loading_promise
            .then(() => {
                new Promise<void>((resolve, reject) => {
                    this.newGame(resolve, reject)
                    requestAnimationFrame(this.onFrame);
                })
            });
    }
}

/**
 * The controller for a game already handling menu input
 */
export abstract class GameBaseController {
    public menu_controller: MenuController;

    public constructor(
        protected readonly game: { mouse: tgt.MouseHandler, model: { menu: tgt.MenuGroupModel } },
    ) {
        this.menu_controller = new MenuController(
            this.game.mouse,
            this.game.model.menu
        );
    }

    /**
    * Propagate the update to the menu model.
    * @param delta_seconds 
    * @returns 
    */
    public update(delta_seconds: number): ControllerResponse {
        this.menu_controller.update(delta_seconds);
        return null;
    }

    /**
     * Handle keyboard input for the menu.
     * @param event 
     */
    public onKeyDown(
        event: KeyDownEvent
    ): void {
        this.menu_controller.onKeyDown(event);
    }

    /**
     * Check if a menu item has been clicked
     * @param event 
     */
    public onMouseUp(event: MouseDownEvent): void {
        this.menu_controller.onMouseUp(event);
    }
}

export abstract class GameBaseView {
    public settings: tgt.ViewSettings = {
        color_primary: "#fff",
        color_secondary: "#000",
        color_tertiary: "#444",
        font_family: "monospace",
        font_size_text: 16,
    };
    public menu_view: MenuView;

    public constructor(
        public context: CanvasRenderingContext2D,
    ) {
        this.menu_view = new MenuView(context, this.settings);
    }

    public render(model: { menu: tgt.MenuGroupModel }): void {
        this.resetCanvasState();
        this.menu_view.render(model.menu);
    }

    /**
     * Reset default canvas state and paint the background
     */
    protected resetCanvasState() {
        this.context.fillStyle = this.settings.color_secondary;
        this.context.fillRect(0, 0, 800, 600);
        this.context.fillStyle = this.settings.color_primary;
        this.context.font = this.settings.font_size_text + "px " + this.settings.font_family;
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.imageSmoothingEnabled = false;
    }
}