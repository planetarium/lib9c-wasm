import * as ts from "typescript";

import dotnet from'./Lib9c.Wasm/bin/dotnet';

async function main() {
    await dotnet.boot();

    const file = ts.createSourceFile("source.ts", "", ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    const actionTypeIdUnionTypeNode = ts.factory.createUnionTypeNode(
        dotnet.Lib9c.Wasm.GetAllActionTypes().map((x: string) => ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(x)))
    );

    const actionTypeIdDecl = ts.factory.createTypeAliasDeclaration(
        undefined, // modifiers
        ts.factory.createIdentifier("ActionTypeId"), // name
        undefined, // type parameters 
        actionTypeIdUnionTypeNode // aliased type
    );

    const plainValueTypes: ts.TypeNode[] = [];

    function generateBuildActionFunctionParameters(typeId: string): readonly ts.ParameterDeclaration[] {
        const NUMBER_TYPE = ts.factory.createTypeReferenceNode("number");
        const BIGINT_TYPE = ts.factory.createTypeReferenceNode("bigint");
        const STRING_TYPE = ts.factory.createTypeReferenceNode("string");
        const BOOLEAN_TYPE = ts.factory.createTypeReferenceNode("boolean");
        const STRING_ARRAY_TYPE = ts.factory.createArrayTypeNode(STRING_TYPE);
        const NUMBER_ARRAY_TYPE = ts.factory.createArrayTypeNode(NUMBER_TYPE);
        const UINT8_ARRAY_TYPE = ts.factory.createTypeReferenceNode("Uint8Array");
        const MAP: Map<string, [ts.TypeNode, boolean]> = new Map([
            ["System.Int32", [NUMBER_TYPE, false]],
            ["Libplanet.Address", [STRING_TYPE, false]],
            ["System.Guid", [STRING_TYPE, false]],
            ["System.String", [STRING_TYPE, false]],
            ["System.Boolean", [BOOLEAN_TYPE, false]],
            ["System.Numerics.BigInteger", [BIGINT_TYPE, false]],
            ["System.Byte[]", [UINT8_ARRAY_TYPE, false]],
            ["System.Nullable<System.Int32>", [NUMBER_TYPE, true]],
            ["System.Collections.Generic.List<System.Int32>", [NUMBER_ARRAY_TYPE, false]],
            ["System.Collections.Generic.List<System.Guid>", [STRING_ARRAY_TYPE, false]],
        ]);
        const plainValueType = ts.factory.createTypeReferenceNode(dotnet.Lib9c.Wasm.GetAvailableInputs(typeId));
        plainValueTypes.push(plainValueType);
        return [
            ts.factory.createParameterDeclaration(undefined, undefined, "typeId", undefined, ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(typeId))),
            ts.factory.createParameterDeclaration(undefined, undefined, "plainValue", undefined, plainValueType),
        ];
    }

    const modifiers = [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)];
    const returnType = ts.factory.createTypeReferenceNode("Uint8Array");
    const functionDecls = dotnet.Lib9c.Wasm.GetAllActionTypes().map(typeId => {
        return ts.factory.createFunctionDeclaration(modifiers, undefined, "buildAction", undefined, generateBuildActionFunctionParameters(typeId), returnType, undefined);
    });
    const functionImpl = ts.factory.createFunctionDeclaration(modifiers, undefined, "buildAction", undefined, [
        ts.factory.createParameterDeclaration(undefined, undefined, "typeId", undefined, ts.factory.createTypeReferenceNode(actionTypeIdDecl.name)),
        ts.factory.createParameterDeclaration(undefined, undefined, "plainValue", undefined, ts.factory.createUnionTypeNode(plainValueTypes)),
    ], returnType, ts.factory.createBlock([
        ts.factory.createReturnStatement(
            ts.factory.createCallExpression(
                ts.factory.createIdentifier("dotnet.Lib9c.Wasm.BuildAction"),
                undefined,
                [
                    ts.factory.createIdentifier("typeId"),
                    ts.factory.createAsExpression(ts.factory.createIdentifier("plainValue"), ts.factory.createTypeReferenceNode("any"))
                ]
            )
        )
    ], true));

    const bootFunctionImpl = ts.factory.createFunctionDeclaration(modifiers, undefined, "boot", undefined, [], ts.factory.createTypeReferenceNode("Promise<void>"), ts.factory.createBlock([
        ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("dotnet.boot"), undefined, undefined))
    ], true));

    const buildUnsignedTransactionFunctionImpl = ts.factory.createFunctionDeclaration(modifiers, undefined, "buildUnsignedTransaction", undefined, [
        ts.factory.createParameterDeclaration(undefined, undefined, "nonce", undefined, ts.factory.createTypeReferenceNode("number")),
        ts.factory.createParameterDeclaration(undefined, undefined, "publicKey", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
        ts.factory.createParameterDeclaration(undefined, undefined, "signer", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
        ts.factory.createParameterDeclaration(undefined, undefined, "genesisHash", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
        ts.factory.createParameterDeclaration(undefined, undefined, "action", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
    ], ts.factory.createTypeReferenceNode("Uint8Array"), ts.factory.createBlock([
        ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("dotnet.Lib9c.Wasm.BuildRawTransaction"), undefined, [
            ts.factory.createIdentifier("nonce"),
            ts.factory.createIdentifier("publicKey"),
            ts.factory.createIdentifier("signer"),
            ts.factory.createIdentifier("genesisHash"),
            ts.factory.createIdentifier("action"),
        ]))
    ], true));

    const attachSignatureFunctionImpl = ts.factory.createFunctionDeclaration(modifiers, undefined, "attachSignature", undefined, [
        ts.factory.createParameterDeclaration(undefined, undefined, "unsignedTx", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
        ts.factory.createParameterDeclaration(undefined, undefined, "signature", undefined, ts.factory.createTypeReferenceNode("Uint8Array")),
    ], ts.factory.createTypeReferenceNode("Uint8Array"), ts.factory.createBlock([
        ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("dotnet.Lib9c.Wasm.AttachSignature"), undefined, [
            ts.factory.createIdentifier("unsignedTx"),
            ts.factory.createIdentifier("signature"),
        ]))
    ], true));

    const importDecl = ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, ts.factory.createIdentifier("dotnet"), undefined), ts.factory.createStringLiteral("./Lib9c.Wasm/bin/dotnet"));

    const nodeArray = ts.factory.createNodeArray([importDecl, actionTypeIdDecl, ...functionDecls, functionImpl, bootFunctionImpl, buildUnsignedTransactionFunctionImpl, attachSignatureFunctionImpl]);
    const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);
    console.log(result);
}

main().catch(console.error);
