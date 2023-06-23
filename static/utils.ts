import { Address } from "@planetarium/account";
import { encode } from "@planetarium/bencodex";
import { Currency, encodeCurrency, FungibleAssetValue } from "@planetarium/tx";
import { encodeFungibleAssetValue } from "@planetarium/tx/dist/assets";

interface DotnetType {
    serializeAsDotnet(): any;
}

export class Guid implements DotnetType {
    constructor(private readonly raw: string) {}

    serializeAsDotnet() {
        return this.raw;
    }
}

function isObject(obj: unknown): obj is Object {
    return typeof obj === "object";
} 

function isCurrency(obj: Object): obj is Currency {
    return "ticker" in obj && typeof obj.ticker === "string" &&
        "decimalPlaces" in obj && typeof obj.decimalPlaces === "number" &&
        "minters" in obj && (obj.minters instanceof Set || obj.minters === null) &&
        "totalSupplyTrackable" in obj && typeof obj.totalSupplyTrackable === "boolean" &&
        "maximumSupply" in obj && (
            obj.maximumSupply === null ||
            "major" in obj && typeof obj.major === "bigint" && "minor" in obj && typeof obj.minor === "bigint"
        );
}

function isFungibleAssetValue(obj: Object): obj is FungibleAssetValue {
    return "rawValue" in obj && typeof obj.rawValue === "bigint" &&
        "currency" in obj && isObject(obj.currency) && isCurrency(obj.currency);
}

export function serializeObjectAsDotnet(obj: Object): Object {
    if (!(obj instanceof Object)) {
        return obj;
    }

    if (obj instanceof Address) {
        return obj.toString();
    }

    if (obj instanceof Guid) {
        return obj.serializeAsDotnet();
    }

    if (isCurrency(obj)) {
        return encode(encodeCurrency(obj));
    }

    if (isFungibleAssetValue(obj)) {
        return {
            currency: encode(encodeCurrency(obj.currency)),
            rawValue: obj.rawValue.toString(),
        };
    }

    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, serializeObjectAsDotnet(v)]));
}
