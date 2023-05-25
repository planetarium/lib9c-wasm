import { writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import * as ts from "typescript";
import {
  dotnet,
  getTypedAssemblyExports,
} from "./packages/dotnet-runtime/dotnet.js";

const file = ts.createSourceFile(
  "source.ts",
  "",
  ts.ScriptTarget.ESNext,
  false,
  ts.ScriptKind.TS
);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const importDecl = ts.factory.createImportDeclaration(
  undefined,
  ts.factory.createImportClause(
    false,
    ts.factory.createIdentifier("dotnet"),
    undefined
  ),
  ts.factory.createStringLiteral("./dotnet.js")
);
const exportModifiers = [
  ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
];

async function main() {
  if (!existsSync("./generated")) {
    mkdirSync("./generated");
  }

  const { runtimeId } = await dotnet.withDiagnosticTracing(false).create();

  generateIndexTsFile();
  await generateActionsTsFile(runtimeId);

  copyUtilsTs();
}

function generateIndexTsFile() {
  const bootFunctionImpl = ts.factory.createFunctionDeclaration(
    exportModifiers,
    undefined,
    "create",
    undefined,
    [],
    ts.factory.createTypeReferenceNode("Promise<void>"),
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createIdentifier("dotnet.create"),
            undefined,
            undefined
          )
        ),
      ],
      true
    )
  );

  const nodeArray = ts.factory.createNodeArray([importDecl, bootFunctionImpl]);
  const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

  writeFileSync(
    "./generated/index.ts",
    result.concat('export * from "./actions"\nexport * from "./utils";')
  );
}

async function generateActionsTsFile(runtimeId: number) {
  const { getAssemblyExports } = global.getDotnetRuntime(runtimeId)!;
  const Lib9c = await getTypedAssemblyExports(
    getAssemblyExports("Lib9c.Wasm.dll")
  );
  function generateBuildActionFunctionParameters(
    typeId: string
  ): readonly ts.ParameterDeclaration[] {
    const inputs = Lib9c.Program.GetAvailableInputs(typeId);
    const plainValueType = ts.factory.createTypeReferenceNode(inputs);
    return [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        "plainValue",
        undefined,
        plainValueType
      ),
    ];
  }

  const typesImportDecl = ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Address")
        ),
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Guid")
        ),
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Currency")
        ),
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("serializeObjectAsDotnet")
        ),
      ])
    ),
    ts.factory.createStringLiteral("./utils")
  );

  const returnType = ts.factory.createTypeReferenceNode("Uint8Array");
  const buildActionWrapperImplDecl = ts.factory.createFunctionDeclaration(
    undefined,
    undefined,
    "buildActionWrapper",
    undefined,
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        "typeId",
        undefined,
        ts.factory.createTypeReferenceNode("string")
      ),
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        "plainValue",
        undefined,
        ts.factory.createTypeReferenceNode("object")
      ),
    ],
    returnType,
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createIdentifier("Lib9c.Program.BuildAction"),
            undefined,
            [
              ts.factory.createIdentifier("typeId"),
              ts.factory.createAsExpression(
                ts.factory.createCallExpression(
                  ts.factory.createIdentifier("serializeObjectAsDotnet"),
                  [],
                  [ts.factory.createIdentifier("plainValue")]
                ),
                ts.factory.createTypeReferenceNode("any")
              ),
            ]
          )
        ),
      ],
      true
    )
  );

  const actionsFunctionDecls = Lib9c.Program.GetAllActionTypes().flatMap(
  (typeId: string) => {
      if (Lib9c.Program.GetAvailableInputs(typeId).includes("invalid")) {
        console.log(`${typeId} have invalid type, skipped.`);
        return [];
      }

      return ts.factory.createFunctionDeclaration(
        exportModifiers,
        undefined,
        typeId,
        undefined,
        generateBuildActionFunctionParameters(typeId),
        returnType,
        ts.factory.createBlock(
          [
            ts.factory.createReturnStatement(
              ts.factory.createCallExpression(
                ts.factory.createIdentifier("buildActionWrapper"),
                undefined,
                [
                  ts.factory.createStringLiteral(typeId),
                  ts.factory.createAsExpression(
                    ts.factory.createIdentifier("plainValue"),
                    ts.factory.createTypeReferenceNode("any")
                  ),
                ]
              )
            ),
          ],
          true
        )
      );
    }
  );

  const nodeArray = ts.factory.createNodeArray([
    importDecl,
    typesImportDecl,
    buildActionWrapperImplDecl,
    ...actionsFunctionDecls,
  ]);
  const result = printer.printList(ts.ListFormat.MultiLine, nodeArray, file);

  writeFileSync("./generated/actions.ts", result);
}

function copyLib9cWasmFiles() {
  copyFileSync("./Lib9c.Wasm/bin/dotnet.js", "generated/dotnet.js");
  copyFileSync("./Lib9c.Wasm/bin/dotnet.js.map", "generated/dotnet.js.map");
  copyFileSync("./Lib9c.Wasm/bin/dotnet.d.ts", "generated/dotnet.d.ts");
}

function copyUtilsTs() {
  copyFileSync("./static/utils.ts", "generated/utils.ts");
}

main().catch(console.error);
