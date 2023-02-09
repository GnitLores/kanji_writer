import { HanziWriterOptions } from "./typings/types";
import { useStoreKanji } from "../stores/storeKanji";
// import defaultCharDataLoader from './defaultCharDataLoader';

// Make Hanziwriter load from database by default even for static methods:
// With this method, it is also no longer necessary to pass the data loader to instances.
const loadWritingData = (char: any, onComplete: any) => {
  const storeKanji = useStoreKanji();
  onComplete(storeKanji.writingData);
};

const defaultOptions: HanziWriterOptions = {
  // charDataLoader: defaultCharDataLoader,
  charDataLoader: loadWritingData,
  onLoadCharDataError: null,
  onLoadCharDataSuccess: null,
  showOutline: true,
  showCharacter: true,
  renderer: "svg",

  // positioning options

  width: 0,
  height: 0,
  padding: 20,

  // animation options

  strokeAnimationSpeed: 1,
  strokeFadeDuration: 400,
  strokeHighlightDuration: 200,
  strokeHighlightSpeed: 2,
  delayBetweenStrokes: 1000,
  delayBetweenLoops: 2000,

  // colors

  strokeColor: "#555",
  radicalColor: null,
  highlightColor: "#AAF",
  outlineColor: "#DDD",
  drawingColor: "#333",

  // quiz options

  leniency: 1,
  showHintAfterMisses: 3,
  highlightOnComplete: true,
  highlightCompleteColor: null,
  acceptBackwardsStrokes: false,
  quizStartStrokeNum: 0,

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2,
  rendererOverride: {},
};

export default defaultOptions;
