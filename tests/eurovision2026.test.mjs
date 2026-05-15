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

  it('includes the complete final running order', () => {
    const config = readText('src/config/eurovision2026.ts');
    const finalBlock = config.match(/id: 'final',[\s\S]*?\n  \},\n\];/)?.[0] ?? '';

    assert.match(finalBlock, /Orden de actuación publicado para la final de Eurovisión 2026/);
    assert.match(finalBlock, /runningOrder: '01', country: 'Noruega'/);
    assert.match(finalBlock, /artist: 'Kyle Alessandro', song: 'Lighter'/);
    assert.match(finalBlock, /runningOrder: '06', country: 'España', flag: 'ES', artist: 'Melody', song: 'Esa Diva'/);
    assert.match(finalBlock, /runningOrder: '08', country: 'Reino Unido', flag: 'GB', artist: 'Remember Monday'/);
    assert.match(finalBlock, /runningOrder: '12', country: 'Países Bajos', flag: 'NL', artist: 'Claude', song: "C'est La Vie"/);
    assert.match(finalBlock, /runningOrder: '19', country: 'Suiza', flag: 'CH', artist: 'Zoë Më', song: 'Voyage'/);
    assert.match(finalBlock, /runningOrder: '25', country: 'San Marino', flag: 'SM', artist: 'Gabry Ponte', song: "Tutta L'Italia"/);
    assert.match(finalBlock, /runningOrder: '26', country: 'Albania', flag: 'AL', artist: 'Shkodra Elektronike', song: 'Zjerm'/);

    const runningOrders = finalBlock.match(/runningOrder: '/g) ?? [];
    const directFinalists = finalBlock.match(/directFinalist: true/g) ?? [];

    assert.equal(runningOrders.length, 26);
    assert.equal(directFinalists.length, 0);
    assert.doesNotMatch(finalBlock, /songs: \[\]/);
  });
});
