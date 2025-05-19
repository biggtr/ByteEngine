import { GraphicsContextFactory } from "@/Renderer/GraphicsContextFactory";

export const context = GraphicsContextFactory.Create("canvas");
await context.Init();
