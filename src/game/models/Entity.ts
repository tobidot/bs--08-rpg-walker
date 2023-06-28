import { AABBPhysicsProxy, ImageAsset } from "../../library";
import { Vector2D } from "../../library/math";
import { Rect } from "../../library/math/Rect";
import { Collision, PhysicsEngine, PhysicsProxy } from "../../library/physics/Physics";
import { Direction } from "../consts/Direction";

export type EntityImages = Map<Direction, ImageAsset>;

export class Entity {
    public static next_id = 1;
    public id: number = Entity.next_id++;
    // physics properties
    public hit_box: Rect;
    public velocity: Vector2D = new Vector2D(0, 0);
    public physics: AABBPhysicsProxy;
    public physics_id: number | null = null;
    // rendering properties
    public images: EntityImages;
    public render_box: Rect;
    public facing: Direction = Direction.SOUTH_EAST;
    // 

    constructor(
        position: Vector2D,
        images: EntityImages,
        width?: number,
        height?: number,
    ) {
        const default_size = 16;
        const default_image = images.get(Direction.SOUTH_EAST);
        this.images = images;
        if (width === undefined) {
            width = (default_image?.width) ?? default_size;
        }
        if (height === undefined) {
            height = (default_image?.height) ?? default_size;
        }
        this.hit_box = Rect.fromCenterAndSize(position, { x: width, y: height });
        this.render_box = this.hit_box.cpy();
        this.physics = new AABBPhysicsProxy(
            this.hit_box,
            this.velocity,
            this,
        );
        this.physics.static = true;
    }

    /**
     * 
     * @param delta_seconds 
     */
    public update(delta_seconds: number) {
        // do nothing
        this.render_box.center.set(this.physics.outerBox.center);
        const south_east = new Vector2D(1, 1);
        const south_west = new Vector2D(-1, 1);
        const north_east = new Vector2D(1, -1);
        const north_west = new Vector2D(-1, -1);
        const direction_match = ([
            [south_east, Direction.SOUTH_EAST],
            [south_west, Direction.SOUTH_WEST],
            [north_east, Direction.NORTH_EAST],
            [north_west, Direction.NORTH_WEST],
        ] as const).map(([vector, direction]): [number, Direction] => {
            return [this.velocity.dot(vector), direction];
        });
        const facing = direction_match.reduce((best, [dot, direction]) => {
            if (dot > best.dot) {
                return { dot, direction };
            } else {
                return best;
            }
        }, { dot: 0, direction: Direction.SOUTH_EAST });
        this.facing = facing.direction;

    }

    public onCollision?(other: PhysicsProxy, collision: Collision): void;
    public onWorlCollision?(distance: Vector2D): void;
}