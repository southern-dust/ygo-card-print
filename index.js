const { CardNode } = require('ygo-card');
const fs = require('fs');
const { Card, renderDeckPDF, getMultiData } = CardNode;

const DEFAULT_IMAGE_BASE = 'https://gitee.com/msk86/pics/raw/master/500';
const OUTPUT_PATH = './output';
const YDK_PATH = './resources/deck';
const MOLD_PATH = './node_modules/ygo-card/dist/mold';
const CDB_PATH = './resources/cards.cdb';

function notExist(cards, ids) {
    return cards.map((c, i) => !c ? i : null).filter(i=> i).map(i => ids[i]);
}

function readYdk(ydkFile) {
    console.log(`loading ${YDK_PATH}/${ydkFile}.ydk`);
    const path = `${YDK_PATH}/${ydkFile}.ydk`;
    const ydk = fs.readFileSync(path).toString();
    const ids = ydk.split(/\r?\n/).filter(id => /^\d+$/.test(id));
    return ids;
}

function renderPdfCanvasToFile(canvas, file) {
    console.log(`creating ${file}`);
    return new Promise((resolve ,reject) => {
        const out = fs.createWriteStream(file);
        const stream = canvas.createPDFStream();
        stream.pipe(out);
        out.on('finish', () => {console.log(`${file} was created`);resolve();});
        out.on('error', () => {console.log(`fail to create ${file}`, error);reject(error);});
    });
}

async function run(ydkFile) {
    const ids = readYdk(ydkFile);
    // const ids = [63288573,1482001,3507053,30691817,13143275,24842059,77307161,23689428, 1];
    const proCards = await getMultiData(CDB_PATH, ids);
    const cards = proCards
        .filter(data => data)
        .map(data => new Card({
            data: Card.transData(data),
            moldPath: `${MOLD_PATH}/`, 
            picPath: `${DEFAULT_IMAGE_BASE}/${data.id}.jpg`
        }));
    const pdfCanvas = await renderDeckPDF(cards);
    renderPdfCanvasToFile(pdfCanvas, `${OUTPUT_PATH}/${ydkFile}.pdf`);
    const notCreated = notExist(proCards, ids);
    if(notCreated.length) console.log(notCreated, 'not created');
}

run(process.argv[2]);