/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const configPath = path.join(
    process.cwd(),
    "public",
    "config",
    "nodeConfig.json",
  );
  const configPath2 = path.join(
    process.cwd(),
    "public",
    "config",
    "orbitSetupScriptConfig.json",
  );
  try {
    const data = await request.json();
    console.log(data);
    const { batcher, chainId, chainName, validators } = data;
    const configFile = await fs.readFile(configPath, "utf8");
    const configFile2 = await fs.readFile(configPath2, "utf8");
    console.log(configFile);
    console.log(configFile2);
    console.log("things ok up until here???");
    const config = JSON.parse(configFile);
    const config2 = JSON.parse(configFile2);

    const chainInfo = JSON.parse(config.chain["info-json"]);
    config2.chainId = chainId;
    config2.chainName = chainName;
    config2.batchPoster = batcher.address;
    config2.staker = validators.map((v: { address: string }) => v.address);

    chainInfo.forEach((info: any) => {
      info["chain-name"] = chainName;
    });

    config.chain.name = chainName;
    chainInfo[0]["chain-id"] = chainId;
    chainInfo[0]["chain-config"].chainId = chainId;
    config.node["batch-poster"]["parent-chain-wallet"]["private-key"] =
      batcher.privateKey;
    config.node.staker["parent-chain-wallet"]["private-key"] =
      validators[0]?.privateKey;

    config.chain["info-json"] = JSON.stringify(chainInfo);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    await fs.writeFile(configPath2, JSON.stringify(config2, null, 2));

    return NextResponse.json({
      message: "JSON files successfully created",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }
}
