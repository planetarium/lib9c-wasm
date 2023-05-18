import { RuntimeAPI, dotnet } from "./dotnet.js";
import { Address, Guid, Currency, serializeObjectAsDotnet } from "./utils.js";

function buildActionWrapper(typeId: string, plainValue: object): Uint8Array {
    return globalThis.Lib9c.Wasm.Program.BuildAction(typeId, serializeObjectAsDotnet(plainValue) as any);
}

export function activate_account2(plainValue: {PendingAddress: Address, Signature: Uint8Array}): Uint8Array {
    return buildActionWrapper("activate_account2", plainValue as any);
}
export function activate_account(plainValue: {PendingAddress: Address, Signature: Uint8Array}): Uint8Array {
    return buildActionWrapper("activate_account", plainValue as any);
}
export function add_activated_account2(plainValue: {Address: Address}): Uint8Array {
    return buildActionWrapper("add_activated_account2", plainValue as any);
}
export function add_activated_account(plainValue: {Address: Address}): Uint8Array {
    return buildActionWrapper("add_activated_account", plainValue as any);
}
export function add_redeem_code(plainValue: {redeemCsv: string}): Uint8Array {
    return buildActionWrapper("add_redeem_code", plainValue as any);
}
export function buy12(plainValue: {errors: {item1: Guid;item2: number;}[], purchaseInfos: {orderId: Guid;tradableId: Guid;agentAddress: Address;avatarAddress: Address;type: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";itemPrice: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};}[], buyerAvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("buy12", plainValue as any);
}
export function buy10(plainValue: {errors: {item1: Guid;item2: number;}[], purchaseInfos: {orderId: Guid;tradableId: Guid;agentAddress: Address;avatarAddress: Address;type: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";itemPrice: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};}[], buyerAvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("buy10", plainValue as any);
}
export function buy11(plainValue: {errors: {item1: Guid;item2: number;}[], purchaseInfos: {orderId: Guid;tradableId: Guid;agentAddress: Address;avatarAddress: Address;type: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";itemPrice: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};}[], buyerAvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("buy11", plainValue as any);
}
export function buy8(plainValue: {errors: {item1: Guid;item2: number;}[], purchaseInfos: {orderId: Guid;tradableId: Guid;agentAddress: Address;avatarAddress: Address;type: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";itemPrice: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};}[], buyerAvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("buy8", plainValue as any);
}
export function buy9(plainValue: {errors: {item1: Guid;item2: number;}[], purchaseInfos: {orderId: Guid;tradableId: Guid;agentAddress: Address;avatarAddress: Address;type: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";itemPrice: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};}[], buyerAvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("buy9", plainValue as any);
}
export function buy_product(plainValue: {AvatarAddress: Address, ProductInfos: {ProductId: Guid;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};AgentAddress: Address;AvatarAddress: Address;Type: "Fungible" | "FungibleAssetValue" | "NonFungible";} | {ProductId: Guid;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};AgentAddress: Address;AvatarAddress: Address;Type: "Fungible" | "FungibleAssetValue" | "NonFungible";Legacy: boolean;ItemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";TradableId: Guid;}[]}): Uint8Array {
    return buildActionWrapper("buy_product", plainValue as any);
}
export function cancel_monster_collect(plainValue: {collectRound: number, level: number}): Uint8Array {
    return buildActionWrapper("cancel_monster_collect", plainValue as any);
}
export function cancel_product_registration(plainValue: {AvatarAddress: Address, ProductInfos: {ProductId: Guid;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};AgentAddress: Address;AvatarAddress: Address;Type: "Fungible" | "FungibleAssetValue" | "NonFungible";} | {ProductId: Guid;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};AgentAddress: Address;AvatarAddress: Address;Type: "Fungible" | "FungibleAssetValue" | "NonFungible";Legacy: boolean;ItemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";TradableId: Guid;}[], ChargeAp: boolean}): Uint8Array {
    return buildActionWrapper("cancel_product_registration", plainValue as any);
}
export function charge_action_point3(plainValue: {avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("charge_action_point3", plainValue as any);
}
export function charge_action_point(plainValue: {avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("charge_action_point", plainValue as any);
}
export function charge_action_point2(plainValue: {avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("charge_action_point2", plainValue as any);
}
export function claim_monster_collection_reward3(plainValue: {avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("claim_monster_collection_reward3", plainValue as any);
}
export function claim_monster_collection_reward(plainValue: {avatarAddress: Address, collectionRound: number}): Uint8Array {
    return buildActionWrapper("claim_monster_collection_reward", plainValue as any);
}
export function claim_monster_collection_reward2(plainValue: {avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("claim_monster_collection_reward2", plainValue as any);
}
export function claim_raid_reward(plainValue: {AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("claim_raid_reward", plainValue as any);
}
export function claim_stake_reward2(plainValue: {AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("claim_stake_reward2", plainValue as any);
}
export function claim_stake_reward(plainValue: {AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("claim_stake_reward", plainValue as any);
}
export function claim_stake_reward3(plainValue: {AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("claim_stake_reward3", plainValue as any);
}
export function claim_world_boss_kill_reward(plainValue: {AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("claim_world_boss_kill_reward", plainValue as any);
}
export function combination_consumable8(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number}): Uint8Array {
    return buildActionWrapper("combination_consumable8", plainValue as any);
}
export function combination_consumable(plainValue: {AvatarAddress: Address, recipeId: number, slotIndex: number}): Uint8Array {
    return buildActionWrapper("combination_consumable", plainValue as any);
}
export function combination_consumable2(plainValue: {AvatarAddress: Address, recipeId: number, slotIndex: number}): Uint8Array {
    return buildActionWrapper("combination_consumable2", plainValue as any);
}
export function combination_consumable3(plainValue: {AvatarAddress: Address, recipeId: number, slotIndex: number}): Uint8Array {
    return buildActionWrapper("combination_consumable3", plainValue as any);
}
export function combination_consumable4(plainValue: {AvatarAddress: Address, recipeId: number, slotIndex: number}): Uint8Array {
    return buildActionWrapper("combination_consumable4", plainValue as any);
}
export function combination_consumable5(plainValue: {AvatarAddress: Address, recipeId: number, slotIndex: number}): Uint8Array {
    return buildActionWrapper("combination_consumable5", plainValue as any);
}
export function combination_consumable6(plainValue: {AvatarAddress: Address, recipeId: number, slotIndex: number}): Uint8Array {
    return buildActionWrapper("combination_consumable6", plainValue as any);
}
export function combination_consumable7(plainValue: {AvatarAddress: Address, recipeId: number, slotIndex: number}): Uint8Array {
    return buildActionWrapper("combination_consumable7", plainValue as any);
}
export function combination_equipment16(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number, subRecipeId: {value: number;}, payByCrystal: boolean, useHammerPoint: boolean, petId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment16", plainValue as any);
}
export function combination_equipment(plainValue: {AvatarAddress: Address, RecipeId: number, SlotIndex: number, SubRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment", plainValue as any);
}
export function combination_equipment10(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number, subRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment10", plainValue as any);
}
export function combination_equipment11(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number, subRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment11", plainValue as any);
}
export function combination_equipment12(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number, subRecipeId: {value: number;}, payByCrystal: boolean}): Uint8Array {
    return buildActionWrapper("combination_equipment12", plainValue as any);
}
export function combination_equipment13(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number, subRecipeId: {value: number;}, payByCrystal: boolean, useHammerPoint: boolean}): Uint8Array {
    return buildActionWrapper("combination_equipment13", plainValue as any);
}
export function combination_equipment14(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number, subRecipeId: {value: number;}, payByCrystal: boolean, useHammerPoint: boolean}): Uint8Array {
    return buildActionWrapper("combination_equipment14", plainValue as any);
}
export function combination_equipment15(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number, subRecipeId: {value: number;}, payByCrystal: boolean, useHammerPoint: boolean}): Uint8Array {
    return buildActionWrapper("combination_equipment15", plainValue as any);
}
export function combination_equipment2(plainValue: {AvatarAddress: Address, RecipeId: number, SlotIndex: number, SubRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment2", plainValue as any);
}
export function combination_equipment3(plainValue: {AvatarAddress: Address, RecipeId: number, SlotIndex: number, SubRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment3", plainValue as any);
}
export function combination_equipment4(plainValue: {AvatarAddress: Address, RecipeId: number, SlotIndex: number, SubRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment4", plainValue as any);
}
export function combination_equipment5(plainValue: {AvatarAddress: Address, RecipeId: number, SlotIndex: number, SubRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment5", plainValue as any);
}
export function combination_equipment6(plainValue: {AvatarAddress: Address, RecipeId: number, SlotIndex: number, SubRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment6", plainValue as any);
}
export function combination_equipment7(plainValue: {AvatarAddress: Address, RecipeId: number, SlotIndex: number, SubRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment7", plainValue as any);
}
export function combination_equipment8(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number, subRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment8", plainValue as any);
}
export function combination_equipment9(plainValue: {avatarAddress: Address, slotIndex: number, recipeId: number, subRecipeId: {value: number;}}): Uint8Array {
    return buildActionWrapper("combination_equipment9", plainValue as any);
}
export function create_avatar8(plainValue: {index: number, hair: number, lens: number, ear: number, tail: number, name: string}): Uint8Array {
    return buildActionWrapper("create_avatar8", plainValue as any);
}
export function create_avatar(plainValue: {avatarAddress: Address, index: number, hair: number, lens: number, ear: number, tail: number, name: string}): Uint8Array {
    return buildActionWrapper("create_avatar", plainValue as any);
}
export function create_avatar2(plainValue: {index: number, hair: number, lens: number, ear: number, tail: number, name: string}): Uint8Array {
    return buildActionWrapper("create_avatar2", plainValue as any);
}
export function create_avatar3(plainValue: {index: number, hair: number, lens: number, ear: number, tail: number, name: string}): Uint8Array {
    return buildActionWrapper("create_avatar3", plainValue as any);
}
export function create_avatar4(plainValue: {index: number, hair: number, lens: number, ear: number, tail: number, name: string}): Uint8Array {
    return buildActionWrapper("create_avatar4", plainValue as any);
}
export function create_avatar5(plainValue: {index: number, hair: number, lens: number, ear: number, tail: number, name: string}): Uint8Array {
    return buildActionWrapper("create_avatar5", plainValue as any);
}
export function create_avatar6(plainValue: {index: number, hair: number, lens: number, ear: number, tail: number, name: string}): Uint8Array {
    return buildActionWrapper("create_avatar6", plainValue as any);
}
export function create_avatar7(plainValue: {index: number, hair: number, lens: number, ear: number, tail: number, name: string}): Uint8Array {
    return buildActionWrapper("create_avatar7", plainValue as any);
}
export function create_pending_activation(plainValue: {PendingActivation: {address: Address;Nonce: Uint8Array;PublicKey: {publicKey: number[];};}}): Uint8Array {
    return buildActionWrapper("create_pending_activation", plainValue as any);
}
export function daily_reward7(plainValue: {avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("daily_reward7", plainValue as any);
}
export function daily_reward(plainValue: {avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("daily_reward", plainValue as any);
}
export function daily_reward5(plainValue: {avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("daily_reward5", plainValue as any);
}
export function daily_reward6(plainValue: {avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("daily_reward6", plainValue as any);
}
export function event_consumable_item_crafts(plainValue: {AvatarAddress: Address, EventScheduleId: number, EventConsumableItemRecipeId: number, SlotIndex: number}): Uint8Array {
    return buildActionWrapper("event_consumable_item_crafts", plainValue as any);
}
export function event_dungeon_battle4(plainValue: {AvatarAddress: Address, EventScheduleId: number, EventDungeonId: number, EventDungeonStageId: number, Equipments: Guid[], Costumes: Guid[], Foods: Guid[], BuyTicketIfNeeded: boolean, RuneInfos: {slotIndex: number;runeId: number;}[]}): Uint8Array {
    return buildActionWrapper("event_dungeon_battle4", plainValue as any);
}
export function event_dungeon_battle(plainValue: {AvatarAddress: Address, EventScheduleId: number, EventDungeonId: number, EventDungeonStageId: number, Equipments: Guid[], Costumes: Guid[], Foods: Guid[], BuyTicketIfNeeded: boolean}): Uint8Array {
    return buildActionWrapper("event_dungeon_battle", plainValue as any);
}
export function event_dungeon_battle2(plainValue: {AvatarAddress: Address, EventScheduleId: number, EventDungeonId: number, EventDungeonStageId: number, Equipments: Guid[], Costumes: Guid[], Foods: Guid[], BuyTicketIfNeeded: boolean}): Uint8Array {
    return buildActionWrapper("event_dungeon_battle2", plainValue as any);
}
export function event_dungeon_battle3(plainValue: {AvatarAddress: Address, EventScheduleId: number, EventDungeonId: number, EventDungeonStageId: number, Equipments: Guid[], Costumes: Guid[], Foods: Guid[], BuyTicketIfNeeded: boolean, RuneInfos: {slotIndex: number;runeId: number;}[]}): Uint8Array {
    return buildActionWrapper("event_dungeon_battle3", plainValue as any);
}
export function event_material_item_crafts(plainValue: {AvatarAddress: Address, EventScheduleId: number, EventMaterialItemRecipeId: number, MaterialsToUse: Map<number, number>}): Uint8Array {
    return buildActionWrapper("event_material_item_crafts", plainValue as any);
}
export function grinding(plainValue: {AvatarAddress: Address, EquipmentIds: Guid[], ChargeAp: boolean}): Uint8Array {
    return buildActionWrapper("grinding", plainValue as any);
}
export function hack_and_slash20(plainValue: {Costumes: Guid[], Equipments: Guid[], Foods: Guid[], RuneInfos: {slotIndex: number;runeId: number;}[], WorldId: number, StageId: number, StageBuffId: {value: number;}, AvatarAddress: Address, TotalPlayCount: number, ApStoneCount: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash20", plainValue as any);
}
export function hack_and_slash10(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, playCount: number, avatarAddress: Address, rankingMapAddress: Address}): Uint8Array {
    return buildActionWrapper("hack_and_slash10", plainValue as any);
}
export function hack_and_slash11(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, playCount: number, avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("hack_and_slash11", plainValue as any);
}
export function hack_and_slash12(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, playCount: number, avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("hack_and_slash12", plainValue as any);
}
export function hack_and_slash13(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("hack_and_slash13", plainValue as any);
}
export function hack_and_slash14(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, stageBuffId: {value: number;}, avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("hack_and_slash14", plainValue as any);
}
export function hack_and_slash15(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, stageBuffId: {value: number;}, avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("hack_and_slash15", plainValue as any);
}
export function hack_and_slash16(plainValue: {Costumes: Guid[], Equipments: Guid[], Foods: Guid[], WorldId: number, StageId: number, StageBuffId: {value: number;}, AvatarAddress: Address, PlayCount: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash16", plainValue as any);
}
export function hack_and_slash17(plainValue: {Costumes: Guid[], Equipments: Guid[], Foods: Guid[], WorldId: number, StageId: number, StageBuffId: {value: number;}, AvatarAddress: Address, PlayCount: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash17", plainValue as any);
}
export function hack_and_slash18(plainValue: {Costumes: Guid[], Equipments: Guid[], Foods: Guid[], WorldId: number, StageId: number, StageBuffId: {value: number;}, AvatarAddress: Address, PlayCount: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash18", plainValue as any);
}
export function hack_and_slash19(plainValue: {Costumes: Guid[], Equipments: Guid[], Foods: Guid[], RuneInfos: {slotIndex: number;runeId: number;}[], WorldId: number, StageId: number, StageBuffId: {value: number;}, AvatarAddress: Address, PlayCount: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash19", plainValue as any);
}
export function hack_and_slash7(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, avatarAddress: Address, WeeklyArenaAddress: Address, RankingMapAddress: Address}): Uint8Array {
    return buildActionWrapper("hack_and_slash7", plainValue as any);
}
export function hack_and_slash8(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, avatarAddress: Address, rankingMapAddress: Address}): Uint8Array {
    return buildActionWrapper("hack_and_slash8", plainValue as any);
}
export function hack_and_slash9(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, playCount: number, avatarAddress: Address, rankingMapAddress: Address}): Uint8Array {
    return buildActionWrapper("hack_and_slash9", plainValue as any);
}
export function hack_and_slash_random_buff(plainValue: {AvatarAddress: Address, AdvancedGacha: boolean}): Uint8Array {
    return buildActionWrapper("hack_and_slash_random_buff", plainValue as any);
}
export function hack_and_slash_sweep9(plainValue: {costumes: Guid[], equipments: Guid[], runeInfos: {slotIndex: number;runeId: number;}[], avatarAddress: Address, apStoneCount: number, actionPoint: number, worldId: number, stageId: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash_sweep9", plainValue as any);
}
export function hack_and_slash_sweep(plainValue: {avatarAddress: Address, apStoneCount: number, worldId: number, stageId: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash_sweep", plainValue as any);
}
export function hack_and_slash_sweep2(plainValue: {avatarAddress: Address, apStoneCount: number, worldId: number, stageId: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash_sweep2", plainValue as any);
}
export function hack_and_slash_sweep3(plainValue: {costumes: Guid[], equipments: Guid[], avatarAddress: Address, apStoneCount: number, actionPoint: number, worldId: number, stageId: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash_sweep3", plainValue as any);
}
export function hack_and_slash_sweep4(plainValue: {costumes: Guid[], equipments: Guid[], avatarAddress: Address, apStoneCount: number, actionPoint: number, worldId: number, stageId: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash_sweep4", plainValue as any);
}
export function hack_and_slash_sweep5(plainValue: {costumes: Guid[], equipments: Guid[], avatarAddress: Address, apStoneCount: number, actionPoint: number, worldId: number, stageId: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash_sweep5", plainValue as any);
}
export function hack_and_slash_sweep6(plainValue: {costumes: Guid[], equipments: Guid[], avatarAddress: Address, apStoneCount: number, actionPoint: number, worldId: number, stageId: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash_sweep6", plainValue as any);
}
export function hack_and_slash_sweep7(plainValue: {costumes: Guid[], equipments: Guid[], avatarAddress: Address, apStoneCount: number, actionPoint: number, worldId: number, stageId: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash_sweep7", plainValue as any);
}
export function hack_and_slash_sweep8(plainValue: {costumes: Guid[], equipments: Guid[], runeInfos: {slotIndex: number;runeId: number;}[], avatarAddress: Address, apStoneCount: number, actionPoint: number, worldId: number, stageId: number}): Uint8Array {
    return buildActionWrapper("hack_and_slash_sweep8", plainValue as any);
}
export function item_enhancement11(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement11", plainValue as any);
}
export function item_enhancement(plainValue: {itemId: Guid, materialIds: Guid[], avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement", plainValue as any);
}
export function item_enhancement10(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement10", plainValue as any);
}
export function item_enhancement2(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement2", plainValue as any);
}
export function item_enhancement3(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement3", plainValue as any);
}
export function item_enhancement4(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement4", plainValue as any);
}
export function item_enhancement5(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement5", plainValue as any);
}
export function item_enhancement6(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement6", plainValue as any);
}
export function item_enhancement7(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement7", plainValue as any);
}
export function item_enhancement8(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement8", plainValue as any);
}
export function item_enhancement9(plainValue: {itemId: Guid, materialId: Guid, avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("item_enhancement9", plainValue as any);
}
export function join_arena3(plainValue: {avatarAddress: Address, championshipId: number, round: number, costumes: Guid[], equipments: Guid[], runeInfos: {slotIndex: number;runeId: number;}[]}): Uint8Array {
    return buildActionWrapper("join_arena3", plainValue as any);
}
export function join_arena(plainValue: {avatarAddress: Address, championshipId: number, round: number, costumes: Guid[], equipments: Guid[]}): Uint8Array {
    return buildActionWrapper("join_arena", plainValue as any);
}
export function join_arena2(plainValue: {avatarAddress: Address, championshipId: number, round: number, costumes: Guid[], equipments: Guid[], runeInfos: {slotIndex: number;runeId: number;}[]}): Uint8Array {
    return buildActionWrapper("join_arena2", plainValue as any);
}
export function migrate_monster_collection(plainValue: {AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("migrate_monster_collection", plainValue as any);
}
export function migration_activated_accounts_state(plainValue: {}): Uint8Array {
    return buildActionWrapper("migration_activated_accounts_state", plainValue as any);
}
export function migration_avatar_state(plainValue: {avatarStates: "BencodexValue"[]}): Uint8Array {
    return buildActionWrapper("migration_avatar_state", plainValue as any);
}
export function migration_legacy_shop2(plainValue: {}): Uint8Array {
    return buildActionWrapper("migration_legacy_shop2", plainValue as any);
}
export function migration_legacy_shop(plainValue: {}): Uint8Array {
    return buildActionWrapper("migration_legacy_shop", plainValue as any);
}
export function mimisbrunnr_battle12(plainValue: {Costumes: Guid[], Equipments: Guid[], Foods: Guid[], RuneInfos: {slotIndex: number;runeId: number;}[], WorldId: number, StageId: number, PlayCount: number, AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("mimisbrunnr_battle12", plainValue as any);
}
export function mimisbrunnr_battle10(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, playCount: number, avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("mimisbrunnr_battle10", plainValue as any);
}
export function mimisbrunnr_battle11(plainValue: {Costumes: Guid[], Equipments: Guid[], Foods: Guid[], RuneInfos: {slotIndex: number;runeId: number;}[], WorldId: number, StageId: number, PlayCount: number, AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("mimisbrunnr_battle11", plainValue as any);
}
export function mimisbrunnr_battle4(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, avatarAddress: Address, WeeklyArenaAddress: Address, RankingMapAddress: Address}): Uint8Array {
    return buildActionWrapper("mimisbrunnr_battle4", plainValue as any);
}
export function mimisbrunnr_battle5(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, avatarAddress: Address, rankingMapAddress: Address}): Uint8Array {
    return buildActionWrapper("mimisbrunnr_battle5", plainValue as any);
}
export function mimisbrunnr_battle6(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, playCount: number, avatarAddress: Address, rankingMapAddress: Address}): Uint8Array {
    return buildActionWrapper("mimisbrunnr_battle6", plainValue as any);
}
export function mimisbrunnr_battle7(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, playCount: number, avatarAddress: Address, rankingMapAddress: Address}): Uint8Array {
    return buildActionWrapper("mimisbrunnr_battle7", plainValue as any);
}
export function mimisbrunnr_battle8(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, playCount: number, avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("mimisbrunnr_battle8", plainValue as any);
}
export function mimisbrunnr_battle9(plainValue: {costumes: Guid[], equipments: Guid[], foods: Guid[], worldId: number, stageId: number, playCount: number, avatarAddress: Address}): Uint8Array {
    return buildActionWrapper("mimisbrunnr_battle9", plainValue as any);
}
export function monster_collect3(plainValue: {level: number}): Uint8Array {
    return buildActionWrapper("monster_collect3", plainValue as any);
}
export function monster_collect(plainValue: {level: number, collectionRound: number}): Uint8Array {
    return buildActionWrapper("monster_collect", plainValue as any);
}
export function monster_collect2(plainValue: {level: number}): Uint8Array {
    return buildActionWrapper("monster_collect2", plainValue as any);
}
export function patch_table_sheet(plainValue: {TableName: string, TableCsv: string}): Uint8Array {
    return buildActionWrapper("patch_table_sheet", plainValue as any);
}
export function pet_enhancement(plainValue: {AvatarAddress: Address, PetId: number, TargetLevel: number}): Uint8Array {
    return buildActionWrapper("pet_enhancement", plainValue as any);
}
export function prepare_reward_assets(plainValue: {RewardPoolAddress: Address, Assets: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}[]}): Uint8Array {
    return buildActionWrapper("prepare_reward_assets", plainValue as any);
}
export function raid4(plainValue: {AvatarAddress: Address, EquipmentIds: Guid[], CostumeIds: Guid[], FoodIds: Guid[], RuneInfos: {slotIndex: number;runeId: number;}[], PayNcg: boolean}): Uint8Array {
    return buildActionWrapper("raid4", plainValue as any);
}
export function raid(plainValue: {AvatarAddress: Address, EquipmentIds: Guid[], CostumeIds: Guid[], FoodIds: Guid[], PayNcg: boolean}): Uint8Array {
    return buildActionWrapper("raid", plainValue as any);
}
export function raid2(plainValue: {AvatarAddress: Address, EquipmentIds: Guid[], CostumeIds: Guid[], FoodIds: Guid[], PayNcg: boolean}): Uint8Array {
    return buildActionWrapper("raid2", plainValue as any);
}
export function raid3(plainValue: {AvatarAddress: Address, EquipmentIds: Guid[], CostumeIds: Guid[], FoodIds: Guid[], RuneInfos: {slotIndex: number;runeId: number;}[], PayNcg: boolean}): Uint8Array {
    return buildActionWrapper("raid3", plainValue as any);
}
export function rapid_combination9(plainValue: {avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("rapid_combination9", plainValue as any);
}
export function rapid_combination(plainValue: {avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("rapid_combination", plainValue as any);
}
export function rapid_combination2(plainValue: {avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("rapid_combination2", plainValue as any);
}
export function rapid_combination3(plainValue: {avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("rapid_combination3", plainValue as any);
}
export function rapid_combination4(plainValue: {avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("rapid_combination4", plainValue as any);
}
export function rapid_combination5(plainValue: {avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("rapid_combination5", plainValue as any);
}
export function rapid_combination6(plainValue: {avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("rapid_combination6", plainValue as any);
}
export function rapid_combination7(plainValue: {avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("rapid_combination7", plainValue as any);
}
export function rapid_combination8(plainValue: {avatarAddress: Address, slotIndex: number}): Uint8Array {
    return buildActionWrapper("rapid_combination8", plainValue as any);
}
export function redeem_code3(plainValue: {Code: string, AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("redeem_code3", plainValue as any);
}
export function redeem_code(plainValue: {Code: string, AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("redeem_code", plainValue as any);
}
export function redeem_code2(plainValue: {Code: string, AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("redeem_code2", plainValue as any);
}
export function register_product(plainValue: {AvatarAddress: Address, RegisterInfos: {AvatarAddress: Address;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};Asset: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};Type: "Fungible" | "FungibleAssetValue" | "NonFungible";} | {AvatarAddress: Address;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};TradableId: Guid;ItemCount: number;Type: "Fungible" | "FungibleAssetValue" | "NonFungible";}[], ChargeAp: boolean}): Uint8Array {
    return buildActionWrapper("register_product", plainValue as any);
}
export function renew_admin_state(plainValue: {NewValidUntil: number}): Uint8Array {
    return buildActionWrapper("renew_admin_state", plainValue as any);
}
export function re_register_product(plainValue: {AvatarAddress: Address, ReRegisterInfos: {item1: {ProductId: Guid;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};AgentAddress: Address;AvatarAddress: Address;Type: "Fungible" | "FungibleAssetValue" | "NonFungible";} | {ProductId: Guid;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};AgentAddress: Address;AvatarAddress: Address;Type: "Fungible" | "FungibleAssetValue" | "NonFungible";Legacy: boolean;ItemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";TradableId: Guid;};item2: {AvatarAddress: Address;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};Asset: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};Type: "Fungible" | "FungibleAssetValue" | "NonFungible";} | {AvatarAddress: Address;Price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};TradableId: Guid;ItemCount: number;Type: "Fungible" | "FungibleAssetValue" | "NonFungible";};}[], ChargeAp: boolean}): Uint8Array {
    return buildActionWrapper("re_register_product", plainValue as any);
}
export function runeEnhancement2(plainValue: {AvatarAddress: Address, RuneId: number, TryCount: number}): Uint8Array {
    return buildActionWrapper("runeEnhancement2", plainValue as any);
}
export function runeEnhancement(plainValue: {AvatarAddress: Address, RuneId: number, TryCount: number}): Uint8Array {
    return buildActionWrapper("runeEnhancement", plainValue as any);
}
export function secure_mining_reward(plainValue: {Recipient: Address}): Uint8Array {
    return buildActionWrapper("secure_mining_reward", plainValue as any);
}
export function sell12(plainValue: {sellerAvatarAddress: Address, tradableId: Guid, count: number, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title", orderId: Guid}): Uint8Array {
    return buildActionWrapper("sell12", plainValue as any);
}
export function sell(plainValue: {sellerAvatarAddress: Address, itemId: Guid, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}}): Uint8Array {
    return buildActionWrapper("sell", plainValue as any);
}
export function sell10(plainValue: {sellerAvatarAddress: Address, tradableId: Guid, count: number, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title", orderId: Guid}): Uint8Array {
    return buildActionWrapper("sell10", plainValue as any);
}
export function sell11(plainValue: {sellerAvatarAddress: Address, tradableId: Guid, count: number, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title", orderId: Guid}): Uint8Array {
    return buildActionWrapper("sell11", plainValue as any);
}
export function sell2(plainValue: {sellerAvatarAddress: Address, itemId: Guid, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}}): Uint8Array {
    return buildActionWrapper("sell2", plainValue as any);
}
export function sell3(plainValue: {sellerAvatarAddress: Address, itemId: Guid, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}}): Uint8Array {
    return buildActionWrapper("sell3", plainValue as any);
}
export function sell4(plainValue: {sellerAvatarAddress: Address, itemId: Guid, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title", price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}}): Uint8Array {
    return buildActionWrapper("sell4", plainValue as any);
}
export function sell5(plainValue: {sellerAvatarAddress: Address, tradableId: Guid, count: number, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title"}): Uint8Array {
    return buildActionWrapper("sell5", plainValue as any);
}
export function sell6(plainValue: {sellerAvatarAddress: Address, tradableId: Guid, count: number, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title"}): Uint8Array {
    return buildActionWrapper("sell6", plainValue as any);
}
export function sell7(plainValue: {sellerAvatarAddress: Address, tradableId: Guid, count: number, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title", orderId: Guid}): Uint8Array {
    return buildActionWrapper("sell7", plainValue as any);
}
export function sell8(plainValue: {sellerAvatarAddress: Address, tradableId: Guid, count: number, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title", orderId: Guid}): Uint8Array {
    return buildActionWrapper("sell8", plainValue as any);
}
export function sell9(plainValue: {sellerAvatarAddress: Address, tradableId: Guid, count: number, price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title", orderId: Guid}): Uint8Array {
    return buildActionWrapper("sell9", plainValue as any);
}
export function sell_cancellation9(plainValue: {orderId: Guid, tradableId: Guid, sellerAvatarAddress: Address, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title"}): Uint8Array {
    return buildActionWrapper("sell_cancellation9", plainValue as any);
}
export function sell_cancellation7(plainValue: {orderId: Guid, tradableId: Guid, sellerAvatarAddress: Address, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title"}): Uint8Array {
    return buildActionWrapper("sell_cancellation7", plainValue as any);
}
export function sell_cancellation8(plainValue: {orderId: Guid, tradableId: Guid, sellerAvatarAddress: Address, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title"}): Uint8Array {
    return buildActionWrapper("sell_cancellation8", plainValue as any);
}
export function stake2(plainValue: {Amount: string}): Uint8Array {
    return buildActionWrapper("stake2", plainValue as any);
}
export function stake(plainValue: {Amount: string}): Uint8Array {
    return buildActionWrapper("stake", plainValue as any);
}
export function transfer_asset3(plainValue: {Sender: Address, Recipient: Address, Amount: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, Memo: string}): Uint8Array {
    return buildActionWrapper("transfer_asset3", plainValue as any);
}
export function transfer_asset(plainValue: {Sender: Address, Recipient: Address, Amount: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, Memo: string}): Uint8Array {
    return buildActionWrapper("transfer_asset", plainValue as any);
}
export function transfer_asset2(plainValue: {Sender: Address, Recipient: Address, Amount: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, Memo: string}): Uint8Array {
    return buildActionWrapper("transfer_asset2", plainValue as any);
}
export function transfer_assets(plainValue: {Sender: Address, Recipients: {item1: Address;item2: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};}[], Memo: string}): Uint8Array {
    return buildActionWrapper("transfer_assets", plainValue as any);
}
export function unlock_equipment_recipe2(plainValue: {RecipeIds: number[], AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("unlock_equipment_recipe2", plainValue as any);
}
export function unlock_equipment_recipe(plainValue: {RecipeIds: number[], AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("unlock_equipment_recipe", plainValue as any);
}
export function unlock_rune_slot(plainValue: {AvatarAddress: Address, SlotIndex: number}): Uint8Array {
    return buildActionWrapper("unlock_rune_slot", plainValue as any);
}
export function unlock_world2(plainValue: {WorldIds: number[], AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("unlock_world2", plainValue as any);
}
export function unlock_world(plainValue: {WorldIds: number[], AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("unlock_world", plainValue as any);
}
export function update_sell5(plainValue: {sellerAvatarAddress: Address, updateSellInfos: {orderId: Guid;updateSellOrderId: Guid;tradableId: Guid;itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};count: number;}[]}): Uint8Array {
    return buildActionWrapper("update_sell5", plainValue as any);
}
export function update_sell(plainValue: {orderId: Guid, updateSellOrderId: Guid, tradableId: Guid, sellerAvatarAddress: Address, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title", price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, count: number}): Uint8Array {
    return buildActionWrapper("update_sell", plainValue as any);
}
export function update_sell2(plainValue: {orderId: Guid, updateSellOrderId: Guid, tradableId: Guid, sellerAvatarAddress: Address, itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title", price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;}, count: number}): Uint8Array {
    return buildActionWrapper("update_sell2", plainValue as any);
}
export function update_sell3(plainValue: {sellerAvatarAddress: Address, updateSellInfos: {orderId: Guid;updateSellOrderId: Guid;tradableId: Guid;itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};count: number;}[]}): Uint8Array {
    return buildActionWrapper("update_sell3", plainValue as any);
}
export function update_sell4(plainValue: {sellerAvatarAddress: Address, updateSellInfos: {orderId: Guid;updateSellOrderId: Guid;tradableId: Guid;itemSubType: "Food" | "FullCostume" | "HairCostume" | "EarCostume" | "EyeCostume" | "TailCostume" | "Weapon" | "Armor" | "Belt" | "Necklace" | "Ring" | "EquipmentMaterial" | "FoodMaterial" | "MonsterPart" | "NormalMaterial" | "Hourglass" | "ApStone" | "Chest" | "Title";price: {currency: Currency;sign: number;majorUnit: string;minorUnit: string;};count: number;}[]}): Uint8Array {
    return buildActionWrapper("update_sell4", plainValue as any);
}
export function op_validator_set(plainValue: {Error: string, Operator: "Append" | "Remove" | "Update", Operand: {publicKey: {publicKey: number[];};power: string;}}): Uint8Array {
    return buildActionWrapper("op_validator_set", plainValue as any);
}
export function redeem_coupon(plainValue: {CouponId: Guid, AvatarAddress: Address}): Uint8Array {
    return buildActionWrapper("redeem_coupon", plainValue as any);
}
