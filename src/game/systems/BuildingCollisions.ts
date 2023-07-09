import { Rect } from "../../library/math/Rect";
import { MoveableEntity } from "../models/MovableEntity";
import { NeutralBuilding } from "../models/NeutralBuilding";
import { PlayerBuilding } from "../models/PlayerBuilding";

export function handle_building_collisions(
    entity: MoveableEntity,
) {    
    entity.entities_colliding_with.filter(
        (other): other is PlayerBuilding | NeutralBuilding => other instanceof PlayerBuilding || other instanceof NeutralBuilding
    ).forEach((other: PlayerBuilding | NeutralBuilding) => {
        const overlap = Rect.fromBoundingBox(entity.hit_box.overlap(other.hit_box));
        if (overlap.width < overlap.height) {
            entity.velocity.x = Math.abs(entity.velocity.x) * (entity.hit_box.center.x < overlap.center.x ? -1 : 1);
        } else {
            entity.velocity.y = Math.abs(entity.velocity.y) * (entity.hit_box.center.y < overlap.center.y ? -1 : 1);
        }
    });
}