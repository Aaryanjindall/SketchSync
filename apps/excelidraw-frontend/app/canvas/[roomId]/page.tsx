import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage({
  params,
}: {
  params: Promise<{
    roomId: string;
  }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.roomId;

  return <RoomCanvas roomSlug={slug} />;
}