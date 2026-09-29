<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * A single result in a team's recent form run.
 *
 * The letters are the wire format shared with the frontend `FormResult` union
 * in `core/models/standings.model.ts`. They are deliberately not translated:
 * `team_statistics.form` stores them as a compact string such as `WWWDW`, and
 * the client renders its own copy for the letter.
 */
enum FormResult: string
{
    case Win = 'W';
    case Draw = 'D';
    case Loss = 'L';

    /**
     * Column values for schema definitions, in declaration order.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::Win => 'Victoria',
            self::Draw => 'Empate',
            self::Loss => 'Derrota',
        };
    }

    /**
     * Expand the stored compact form (for example `WWWDW`) into its results.
     *
     * Unrecognised characters are dropped rather than throwing: the column is
     * plain text, and one corrupt row must not break a whole standings table.
     *
     * @return list<self>
     */
    public static function fromCompactString(?string $form): array
    {
        if ($form === null || $form === '') {
            return [];
        }

        $results = [];

        foreach (str_split($form) as $character) {
            $result = self::tryFrom($character);

            if ($result !== null) {
                $results[] = $result;
            }
        }

        return $results;
    }
}
