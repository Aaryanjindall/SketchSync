import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }


    }, [canvasRef]);

    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
        ></canvas>
        <Topbar
          setSelectedTool={setSelectedTool}
          selectedTool={selectedTool}
        />
      </div>
    );
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="flex items-center gap-2 rounded-full bg-black/80 border border-emerald-500/40 px-3 py-1 shadow-[0_0_18px_rgba(16,185,129,0.5)]">
          <IconButton
            onClick={() => {
              setSelectedTool("pencil");
            }}
            activated={selectedTool === "pencil"}
            icon={<Pencil />}
          />
          <IconButton
            onClick={() => {
              setSelectedTool("rect");
            }}
            activated={selectedTool === "rect"}
            icon={<RectangleHorizontalIcon />}
          />
          <IconButton
            onClick={() => {
              setSelectedTool("circle");
            }}
            activated={selectedTool === "circle"}
            icon={<Circle />}
          />
        </div>
      </div>
    );
}