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
    const semi2Block = config.match(/id: 'semi-2',[\s\S]*?\n  \},\n  \{ id: 'final'/)?.[0] ?? '';

    assert.match(semi2Block, /Orden de actuación publicado para la segunda semifinal/);
    assert.match(semi2Block, /runningOrder: '01', country: 'Bulgaria'/);
    assert.match(semi2Block, /artist: 'DARA', song: 'Bangaranga'/);
    assert.match(semi2Block, /country: 'Francia', flag: 'FR', artist: 'Monroe', song: 'Regarde!', directFinalist: true/);
    assert.match(semi2Block, /artist: 'Søren Torpegaard Lund', song: 'Før Vi Går Hjem'/);
    assert.match(semi2Block, /country: 'Ucrania', flag: 'UA', artist: 'Leléka', song: 'Ridnym', directFinalist: true/);
    assert.match(semi2Block, /country: 'Reino Unido', flag: 'GB', artist: 'LOOK MUM NO COMPUTER', song: 'Eins, Zwei, Drei', directFinalist: true/);
    assert.match(semi2Block, /runningOrder: '15', country: 'Noruega'/);

    const runningOrders = semi2Block.match(/runningOrder: '/g) ?? [];
    const directFinalists = semi2Block.match(/directFinalist: true/g) ?? [];

    assert.equal(runningOrders.length, 15);
    assert.equal(directFinalists.length, 6);
    assert.doesNotMatch(semi2Block, /songs: \[\]/);
  });
});
