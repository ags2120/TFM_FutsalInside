<?php

namespace Database\Seeders;

use App\Enums\DominantFoot;
use App\Enums\PlayerPosition;
use Database\Seeders\Concerns\SeedsFromJson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class PlayerSeeder extends Seeder
{
    use SeedsFromJson;

    /**
     * Target squad size. The canonical dataset seeds five or fewer players per
     * club, so the gap is filled deterministically to reach a full futsal
     * squad: two goalkeepers and eight outfielders per side.
     */
    private const SQUAD_SIZE = 10;

    /**
     * Futsal sides usually dress one extra keeper, so a position roster of
     * [portero, portero, cierre, cierre, ala x3, pivot x2, portero] is the
     * anchor. Concretely: 2 goalkeepers, 2 cierres, 4 alas, 2 pivots.
     *
     * @var array<string, int>
     */
    private const TARGET_POSITIONS = [
        PlayerPosition::Goalkeeper->value => 2,
        PlayerPosition::Closure->value => 2,
        PlayerPosition::Winger->value => 4,
        PlayerPosition::Pivot->value => 2,
    ];

    private const FIRST_NAMES = [
        'Marcos', 'Dani', 'Carlos', 'Iker', 'Rubén', 'Víctor', 'Álex', 'Borja', 'Nacho', 'Sergio',
        'Rafael', 'Thiago', 'Gabriel', 'Caio', 'Bruno', 'Luca', 'Marco', 'Piero', 'Andrea', 'Simone',
        'David', 'Javier', 'Pablo', 'Hugo', 'Álvaro', 'Diego', 'Adrián', 'Samuel', 'Izan', 'Óliver',
    ];

    /** @var array<string, list<string>> Surnames keyed by the club's league country. */
    private const LAST_NAMES = [
        'España' => ['García', 'Martínez', 'López', 'Sánchez', 'Gómez', 'Torres', 'Romero', 'Navarro', 'Castro', 'Ortega', 'Mendoza', 'Vega', 'Ramos', 'Domínguez'],
        'Brasil' => ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Rodrigues', 'Fernandes', 'Almeida', 'Nascimento', 'Cardoso', 'Teixeira'],
        'Italia' => ['Rossi', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Greco', 'Costa', 'Conti', 'Marino', 'Giordano'],
        'Europa' => ['Novak', 'Kovács', 'Nowak', 'Popov', 'Muller', 'Hansen', 'Petrovic', 'Jansen', 'Weber', 'Bianchi'],
    ];

    public function run(): void
    {
        $players = $this->load('players');
        $players = array_merge($players, $this->buildMissingSquadPlayers($players));

        $positions = PlayerPosition::values();
        $feet = DominantFoot::values();

        $rows = array_map(function (array $player) use ($positions, $feet): array {
            if (! in_array($player['position'], $positions, true)) {
                throw new InvalidArgumentException(
                    "Player {$player['id']} has unknown position [{$player['position']}]."
                );
            }

            if ($player['dominant_foot'] !== null && ! in_array($player['dominant_foot'], $feet, true)) {
                throw new InvalidArgumentException(
                    "Player {$player['id']} has unknown dominant foot [{$player['dominant_foot']}]."
                );
            }

            return $player;
        }, $players);

        $this->upsertChunked('players', $rows, ['id']);

        $this->command?->info('Players: '.count($rows));

        $goalkeepers = DB::table('players')
            ->where('position', PlayerPosition::Goalkeeper->value)
            ->count();

        $this->command?->info("Goalkeepers: {$goalkeepers}");
    }

    /**
     * Fill every club roster up to SQUAD_SIZE with deterministic, generated
     * players. ids continue after the highest id shipped in the dataset, the
     * positions follow TARGET_POSITIONS per club, and shirt numbers are drawn
     * from the free set so no two players in a squad share a number.
     *
     * @param  list<array<string, mixed>>  $players
     * @return list<array<string, mixed>>
     */
    private function buildMissingSquadPlayers(array $players): array
    {
        $nextId = count($players) === 0 ? 1 : max(array_column($players, 'id')) + 1;

        $byTeam = [];
        foreach ($players as $player) {
            $byTeam[(int) $player['team_id']][] = $player;
        }

        $teams = DB::table('teams')->orderBy('id')->get(['id', 'country', 'short_name']);

        $generated = [];

        foreach ($teams as $team) {
            $squad = $byTeam[(int) $team->id] ?? [];
            $current = $this->positionCount($squad);
            $numbers = array_map('intval', array_column($squad, 'shirt_number'));

            while (count($squad) < self::SQUAD_SIZE) {
                $position = $this->positionToFill($current);
                $first = $this->firstName($nextId);
                $last = $this->lastName((string) $team->country, $nextId);
                $year = 1989 + ($this->seed($nextId, 90) % 16);
                $month = 1 + ($this->seed($nextId, 91) % 12);
                $day = 1 + ($this->seed($nextId, 92) % 27);

                $number = $numbers === [] ? 1 : $this->freeNumber($numbers);

                $generated[] = [
                    'id' => $nextId,
                    'name' => $first.' '.$last,
                    'first_name' => $first,
                    'last_name' => $last,
                    'photo_url' => null,
                    'birth_date' => sprintf('%04d-%02d-%02d', $year, $month, $day),
                    'nationality' => $team->country,
                    'height' => (float) (166 + ($this->seed($nextId, 1) % 26)),
                    'weight' => (float) (62 + ($this->seed($nextId, 2) % 27)),
                    'dominant_foot' => $this->seed($nextId, 3) % 5 === 0 ? 'both' : ($this->seed($nextId, 4) % 2 === 0 ? 'right' : 'left'),
                    'position' => $position,
                    'shirt_number' => $number,
                    'market_value' => 50000 + ($this->seed($nextId, 5) % 900) * 1000,
                    'team_id' => (int) $team->id,
                ];

                $numbers[] = $number;
                $current[$position]++;
                $squad[] = $generated[count($generated) - 1];
                $nextId++;
            }
        }

        return $generated;
    }

    /**
     * @param  list<array<string, mixed>>  $squad
     * @return array<string, int>
     */
    private function positionCount(array $squad): array
    {
        return array_reduce($squad, function (array $carry, array $player): array {
            $carry[$player['position']] = ($carry[$player['position']] ?? 0) + 1;

            return $carry;
        }, [PlayerPosition::Goalkeeper->value => 0, PlayerPosition::Closure->value => 0, PlayerPosition::Winger->value => 0, PlayerPosition::Pivot->value => 0]);
    }

    /**
     * The position with the biggest shortfall against TARGET_POSITIONS;
     * tie-broken in position order so teams graduate evenly.
     *
     * @param  array<string, int>  $current
     */
    private function positionToFill(array $current): string
    {
        $best = PlayerPosition::Goalkeeper->value;
        $gap = PHP_INT_MIN;

        foreach (self::TARGET_POSITIONS as $position => $target) {
            if ($target - ($current[$position] ?? 0) > $gap) {
                $gap = $target - ($current[$position] ?? 0);
                $best = $position;
            }
        }

        return $best;
    }

    /**
     * @param  list<int>  $numbers
     */
    private function freeNumber(array $numbers): int
    {
        $number = 1;
        while (in_array($number, $numbers, true)) {
            $number++;
            if ($number > 200) {
                break;
            }
        }

        return $number;
    }

    private function firstName(int $seedFromId): string
    {
        return self::FIRST_NAMES[$this->seed($seedFromId, 0) % count(self::FIRST_NAMES)];
    }

    private function lastName(string $country, int $seedFromId): string
    {
        $pool = self::LAST_NAMES[$country] ?? self::LAST_NAMES['Europa'];

        return $pool[$this->seed($seedFromId, 8) % count($pool)];
    }

    /**
     * Stable hash for the generated rows: purely a function of its inputs, so
     * reseeding always lands on the same squad and the same numbers.
     */
    private function seed(int $a, int $b): int
    {
        return crc32("player:{$a}:{$b}");
    }
}
