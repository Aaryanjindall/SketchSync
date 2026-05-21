import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, Palette } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil";

const COLORS = ["#ffffff", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

export function Canvas({
    roomId,
    socket,
    onUsersUpdate
}: {
    socket: WebSocket;
    roomId: string;
    onUsersUpdate?: (users: {id: string, name: string}[]) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil")
    const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {
        game?.setColor(selectedColor);
    }, [selectedColor, game]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket, onUsersUpdate);
            g.setColor(selectedColor);
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
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </div>
    );
}

function Topbar({
    selectedTool, 
    setSelectedTool, 
    selectedColor, 
    setSelectedColor
}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void,
    selectedColor: string,
    setSelectedColor: (c: string) => void
}) {
    return (
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-500"
      >
        <div className="flex items-center gap-4 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-1 border-r border-white/10 pr-4">
            <IconButton
              onClick={() => {
                setSelectedTool("pencil");
              }}
              activated={selectedTool === "pencil"}
              icon={<Pencil className="w-5 h-5" />}
            />
            <IconButton
              onClick={() => {
                setSelectedTool("rect");
              }}
              activated={selectedTool === "rect"}
              icon={<RectangleHorizontalIcon className="w-5 h-5" />}
            />
            <IconButton
              onClick={() => {
                setSelectedTool("circle");
              }}
              activated={selectedTool === "circle"}
              icon={<Circle className="w-5 h-5" />}
            />
          </div>
          <div className="flex items-center gap-2 pr-2">
            <Palette className="w-4 h-4 text-slate-400 mr-1" />
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full transition-all border-2 ${selectedColor === color ? "scale-110 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "border-transparent hover:scale-110"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    );
}