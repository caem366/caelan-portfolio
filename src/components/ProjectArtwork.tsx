export default function ProjectArtwork({ index }: { index: number }) {
  const art = index % 7;
  const shapes = [
    <><i className="time-band" /><i className="time-band" /><i className="time-band" /><i className="time-sun" /><i className="time-dot" /><i className="time-rule" /></>,
    <><i className="form-sheet form-sheet-a" /><i className="form-sheet form-sheet-b" /><i className="form-tab" /><i className="form-mark form-mark-a" /><i className="form-mark form-mark-b" /><i className="form-rule" /></>,
    <><i className="car-step car-step-a" /><i className="car-step car-step-b" /><i className="car-step car-step-c" /><i className="car-arrow" /><i className="car-line" /></>,
    <><i className="vinyl-disc vinyl-disc-a" /><i className="vinyl-disc vinyl-disc-b" /><i className="vinyl-ring" /><i className="vinyl-block" /><i className="vinyl-cut" /></>,
    <><i className="trial-module trial-module-a" /><i className="trial-module trial-module-b" /><i className="trial-module trial-module-c" /><i className="trial-path trial-path-a" /><i className="trial-path trial-path-b" /><i className="trial-node trial-node-a" /><i className="trial-node trial-node-b" /></>,
    <><i className="whoosh-core" /><i className="whoosh-piece whoosh-piece-a" /><i className="whoosh-piece whoosh-piece-b" /><i className="whoosh-piece whoosh-piece-c" /><i className="whoosh-flow whoosh-flow-a" /><i className="whoosh-flow whoosh-flow-b" /></>,
    <><i className="mood-wave mood-wave-a" /><i className="mood-wave mood-wave-b" /><i className="mood-wave mood-wave-c" /><i className="mood-orbit mood-orbit-a" /><i className="mood-orbit mood-orbit-b" /></>,
  ][art];

  return <div className={`project-art editorial-art art-${art}`} aria-hidden="true">{shapes}<span className="art-grain" /></div>;
}
