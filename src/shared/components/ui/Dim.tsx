import { useDimStore } from "../../store/useDimStore";

export const Dim = () => {
  const zIndex = useDimStore((state) => state.zIndex);

  return (
    <div
      className="fixed inset-0 bg-black/50"
      style={{ zIndex }}
    />
  );
};
