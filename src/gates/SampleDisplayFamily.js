import Config from "src/Config.js"
import DisplayShaders from "src/circuit/DisplayShaders.js"
import Gate from "src/circuit/Gate.js"
import GatePainting from "src/draw/GatePainting.js"
import GateShaders from "src/circuit/GateShaders.js"
import MathPainter from "src/draw/MathPainter.js"
import Matrix from "src/math/Matrix.js"
import Point from "src/math/Point.js"
import Rect from "src/math/Rect.js"
import {seq, Seq} from "src/base/Seq.js"
import ShaderPipeline from "src/circuit/ShaderPipeline.js"
import Shaders from "src/webgl/Shaders.js"
import Util from "src/base/Util.js"
import { makeProbabilitySpanPipeline, probabilityPixelsToColumnVector } from "src/gates/ProbabilityDisplayFamily.js"

/**
 * @param {!GateDrawParams} args
 * @returns {!{i: !number, p: !number}}
 */
function sampleFromDistribution(args) {
    let probabilities = args.customStats;
    let buf = probabilities.rawBuffer();
    let r = args.painter.rng.random();
    let n = probabilities.height();
    //noinspection ForLoopThatDoesntUseLoopVariableJS
    for (let i = 0; ; i++) {
        let p = buf[i*2];
        r -= p;
        if (i === n-1 || r < 0.00001) {
            return {i, p};
        }
    }
}

/**
 * @param {!GateDrawParams} args
 */
function _paintSampleDisplay_result(args) {
    let {painter, rect: {x, y, w, h}} = args;
    let d = Config.WIRE_SPACING;
    let startY = y + h/2 - d*args.gate.height/2;

    let {i: sample, p} = sampleFromDistribution(args);
    for (let i = 0; i < args.gate.height; i++) {
        let bit = ((sample >> i) & 1) !== 0;
        if (bit) {
            painter.fillRect(
                new Rect(x, startY+d*i+5, w, d-10),
                Config.OPERATION_FORE_COLOR);
        }
        painter.print(
            bit ? 'on' : 'off',
            x+w/2,
            startY+d*(i+0.5),
            'center',
            'middle',
            'black',
            '16px sans-serif',
            w,
            d);
    }

    for (let pt of args.focusPoints) {
        let k = Math.floor((pt.y - y) * 2 / d) /2;
        if (args.rect.containsPoint(pt)) {
            MathPainter.paintDeferredValueTooltip(
                painter,
                x + w,
                y + k * d,
                `Chance of |${Util.bin(sample, args.gate.height)}⟩`,
                (p * 100).toFixed(4) + "%",
                undefined,
                Config.OPERATION_BACK_COLOR);
        }
    }
}

function paintSampleDisplay(args) {
    args.painter.fillRect(args.rect, Config.OPERATION_BACK_COLOR);

    let probabilities = args.customStats;
    let noData = probabilities === undefined || probabilities.hasNaN();
    if (noData) {
        args.painter.printParagraph("NaN", args.rect, new Point(0.5, 0.5), 'red');
    } else {
        _paintSampleDisplay_result(args);
    }

    args.painter.strokeRect(args.rect, 'lightgray');
}

function sampleGateMaker(span) {
    return Gate.fromIdentity(
        "Sample",
        "Sampled Results Display",
        "Shows a random sample of possible measurement outcomes.\nUse controls to see conditional samples.").
        withHeight(span).
        withSerializedId("Sample" + span).
        withCustomStatPipelineMaker(args => makeProbabilitySpanPipeline(args.controlsTexture, args.row, span)).
        withCustomStatPostProcessor(probabilityPixelsToColumnVector).
        withCustomDrawer(GatePainting.makeDisplayDrawer(paintSampleDisplay)).
        withStableDuration(Config.SEMI_STABLE_RANDOM_VALUE_LIFETIME_MILLIS / Config.CYCLE_DURATION_MS);
}

let SampleDisplayFamily = Gate.generateFamily(1, 16, sampleGateMaker);
export default SampleDisplayFamily;
