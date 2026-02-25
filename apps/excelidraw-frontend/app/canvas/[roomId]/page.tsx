import { RoomCanvas } from "@/components/RoomCanvas";

export default function CanvasPage({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const slug = params.roomId;

  return <RoomCanvas roomSlug={slug} />;
}