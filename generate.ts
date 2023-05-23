import { writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import * as ts from "typescript";

// Path when building with `yarn build` command.
import * as dotnet from "./Lib9c.Wasm/bin/dotnet";

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
  ts.factory.createStringLiteral("./dotnet")
);
const exportModifiers = [
  ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
];

async function main() {
  await dotnet.boot();

  if (!existsSync("./generated")) {
    mkdirSync("./generated");
  }

  generateIndexTsFile();
  generateActionsTsFile();

  copyLib9cWasmFiles();
  copyUtilsTs();
}

function generateIndexTsFile() {
  const bootFunctionImpl = ts.factory.createFunctionDeclaration(
    exportModifiers,
    undefined,
    "boot",
    undefined,
    [],
    ts.factory.createTypeReferenceNode("Promise<void>"),
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createIdentifier("dotnet.boot"),
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

  writeFileSync("./generated/index.ts", result);
}

function generateActionsTsFile() {
  function generateBuildActionFunctionParameters(
    typeId: string
  ): readonly ts.ParameterDeclaration[] {
    const inputs = dotnet.Lib9c.Wasm.getAvailableInputs(typeId);
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
            ts.factory.createIdentifier("dotnet.Lib9c.Wasm.buildAction"),
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

  const actionsFunctionDecls = dotnet.Lib9c.Wasm.getAllActionTypes().flatMap(
    (typeId: string) => {
      if (dotnet.Lib9c.Wasm.getAvailableInputs(typeId).includes("invalid")) {
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
  copyFileSync("./utils.ts", "generated/utils.ts");
}

main().catch(console.error);
