interface Props {
  index: string;
  label: string;
  center?: boolean;
}

export default function SectionLabel({ index, label, center }: Props) {
  return (
    <p
      className={`font-mono text-[0.67rem] tracking-[0.22em] uppercase text-tan mb-4 flex items-center gap-3 ${
        center ? "justify-center" : ""
      }`}
    >
      {index} — {label}
      {!center && (
        <span className="inline-block w-14 h-px bg-tan" />
      )}
    </p>
  );
}
