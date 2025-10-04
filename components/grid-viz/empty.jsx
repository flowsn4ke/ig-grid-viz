export default function Empty() {
  return (
    <ol className="p-28 border border-dashed flex flex-col gap-y-4">
      <li>
        1. <span className="font-semibold">Drag images</span> anywhere in this
        window
      </li>
      <li>
        2. <span className="font-semibold">Drag & drop</span> images to
        reorganize them
      </li>
      <li>
        3. Your feed is saved <span className="font-semibold">locally</span>{" "}
        even if you close this tab !
      </li>
      <li>
        No uploads — files stay <span className="font-semibold">private</span>!
      </li>
    </ol>
  );
}
