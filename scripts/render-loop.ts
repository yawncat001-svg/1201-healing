// scripts/render-loop.ts
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
const ROOT_PATH = path.resolve("src/remotion/Root.tsx");

const renderLoop = async (compId: string, outPath: string) => {
    const composition = await selectComposition({
        serveUrl: ROOT_PATH,
        id: compId,
    });

    console.log(`Rendering ${compId}...`);

    await renderMedia({
        composition,
        serveUrl: ROOT_PATH,
        codec: "h264",
        outputLocation: outPath,
    });

    console.log(`Render complete: ${outPath}`);
};

const main = async () => {
    try {
        await renderLoop("DawnLoop", "public/videos/dawn-loop.mp4");
        await renderLoop("NoonLoop", "public/videos/noon-loop.mp4");
        await renderLoop("DuskLoop", "public/videos/dusk-loop.mp4");
    } catch (e) {
        console.error("Rendering failed", e);
    }
};

main();
