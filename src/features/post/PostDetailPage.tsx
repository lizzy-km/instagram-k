import { useParams } from "react-router-dom";

export function PostDetailPage() {
  const { uid } = useParams<{ uid: string; pid: string }>();

  return (
    <div className="flex pt-[100px] w-full h-screen justify-center items-center">
      {uid}&apos;s Post Detail
    </div>
  );
}
