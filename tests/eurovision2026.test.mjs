import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('Eurovision 2026 contest data', () => {
  it('includes the complete second semi-final lineup', () => {
    const config = readText('src/config/eurovision2026.ts');
    const semi2Block = config.match(/id: 'semi-2',[\s\S]*?\n  \},\n  \{/)?.[0] ?? '';

    assert.match(semi2Block, /Orden de actuación publicado para la segunda semifinal/);
    assert.match(semi2Block, /runningOrder: '01', country: 'Bulgaria'/);
    assert.match(semi2Block, /artist: 'DARA', song: 'Bangaranga'/);
    assert.match(semi2Block, /runningOrder: '05', country: 'Chequia'/);
    assert.match(semi2Block, /country: 'Francia', flag: 'FR', artist: 'Monroe', song: 'Regarde!', directFinalist: true/);
    assert.match(semi2Block, /runningOrder: '08', country: 'Chipre'/);
    assert.match(semi2Block, /country: 'Austria', flag: 'AT', artist: 'COSMÓ', song: 'TANZSCHEIN', directFinalist: true/);
    assert.match(semi2Block, /artist: 'Søren Torpegaard Lund', song: 'Før Vi Går Hjem'/);
    assert.match(semi2Block, /country: 'Ucrania', flag: 'UA', artist: 'Leléka', song: 'Ridnym'/);
    assert.match(semi2Block, /country: 'Reino Unido', flag: 'GB', artist: 'LOOK MUM NO COMPUTER', song: 'Eins, Zwei, Drei', directFinalist: true/);
    assert.match(semi2Block, /runningOrder: '15', country: 'Noruega'/);
    assert.doesNotMatch(semi2Block, /country: 'Chequia'[^\n]+directFinalist/);
    assert.doesNotMatch(semi2Block, /country: 'Chipre'[^\n]+directFinalist/);
    assert.doesNotMatch(semi2Block, /country: 'Ucrania'[^\n]+directFinalist/);

    const runningOrders = semi2Block.match(/runningOrder: '/g) ?? [];
    const directFinalists = semi2Block.match(/directFinalist: true/g) ?? [];

    assert.equal(runningOrders.length, 15);
    assert.equal(directFinalists.length, 3);
    assert.doesNotMatch(semi2Block, /songs: \[\]/);
  });

  it('includes the 2026 final running order without 2025 songs', () => {
    const config = readText('src/config/eurovision2026.ts');
    const finalBlock = config.match(/id: 'final',[\s\S]*?\n  \},\n\];/)?.[0] ?? '';

    assert.match(finalBlock, /Orden de actuación publicado para la final de Eurovisión 2026/);
    assert.match(finalBlock, /runningOrder: '01', country: 'Dinamarca', flag: 'DK', artist: 'Søren Torpegaard Lund', song: 'Før Vi Går Hjem'/);
    assert.match(finalBlock, /runningOrder: '04', country: 'Bélgica', flag: 'BE', artist: 'ESSYLA', song: 'Dancing on the Ice'/);
    assert.match(finalBlock, /runningOrder: '07', country: 'Ucrania', flag: 'UA', artist: 'LELÉKA', song: 'Ridnym'/);
    assert.match(finalBlock, /runningOrder: '11', country: 'República Checa', flag: 'CZ', artist: 'Daniel Zizka', song: 'CROSSROADS'/);
    assert.match(finalBlock, /runningOrder: '14', country: 'Gran Bretaña', flag: 'GB', artist: 'LOOK MUM NO COMPUTER', song: 'Eins, Zwei, Drei'/);
    assert.match(finalBlock, /runningOrder: '15', country: 'Francia', flag: 'FR', artist: 'Monroe', song: 'Regarde !'/);
    assert.match(finalBlock, /runningOrder: '17', country: 'Finlandia', flag: 'FI', artist: 'Linda Lampenius x Pete Parkkonen', song: 'Liekinheitin'/);
    assert.match(finalBlock, /runningOrder: '25', country: 'Austria', flag: 'AT', artist: 'COSMÓ', song: 'Tanzschein'/);
    assert.doesNotMatch(finalBlock, /Kyle Alessandro/);
    assert.doesNotMatch(finalBlock, /Melody/);
    assert.doesNotMatch(finalBlock, /KAJ/);
    assert.doesNotMatch(finalBlock, /Lucio Corsi/);
    assert.doesNotMatch(finalBlock, /Louane/);
    assert.doesNotMatch(finalBlock, /Gabry Ponte/);

    const runningOrders = finalBlock.match(/runningOrder: '/g) ?? [];
    const directFinalists = finalBlock.match(/directFinalist: true/g) ?? [];

    assert.equal(runningOrders.length, 25);
    assert.equal(directFinalists.length, 0);
    assert.doesNotMatch(finalBlock, /songs: \[\]/);
  });
});
