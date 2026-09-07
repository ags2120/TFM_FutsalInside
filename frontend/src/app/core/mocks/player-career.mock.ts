import { CareerEntry } from '../models/player.model';

export const MOCK_PLAYER_CAREER: Record<number, CareerEntry[]> = {
  3: [
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 120, goals: 55 },
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 110, goals: 50 },
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2014-07-01', endDate: '2017-06-30', matchesPlayed: 80, goals: 37 },
  ],
  8: [
    { team: { id: 2, name: 'Inter Movistar', shortName: 'INT', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 115, goals: 48 },
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 105, goals: 42 },
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2013-07-01', endDate: '2016-06-30', matchesPlayed: 75, goals: 28 },
  ],
  13: [
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', matchesPlayed: 150, goals: 58 },
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2015-07-01', endDate: '2018-06-30', matchesPlayed: 120, goals: 39 },
  ],
  18: [
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 145, goals: 50 },
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 115, goals: 39 },
  ],
  33: [
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 100, goals: 34 },
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 85, goals: 26 },
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2014-07-01', endDate: '2017-06-30', matchesPlayed: 60, goals: 16 },
  ],
  23: [
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 145, goals: 50 },
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 110, goals: 33 },
  ],
  43: [
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 130, goals: 43 },
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 100, goals: 28 },
  ],
  48: [
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 115, goals: 34 },
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 95, goals: 24 },
  ],
  7: [
    { team: { id: 2, name: 'Inter Movistar', shortName: 'INT', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', matchesPlayed: 110, goals: 28 },
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2015-07-01', endDate: '2018-06-30', matchesPlayed: 95, goals: 22 },
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2012-07-01', endDate: '2015-06-30', matchesPlayed: 75, goals: 17 },
  ],
  38: [
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 130, goals: 38 },
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 95, goals: 24 },
  ],
  17: [
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 135, goals: 32 },
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 105, goals: 23 },
  ],
  28: [
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 130, goals: 30 },
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 105, goals: 22 },
  ],
  42: [
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', matchesPlayed: 125, goals: 29 },
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2015-07-01', endDate: '2018-06-30', matchesPlayed: 95, goals: 19 },
  ],
  37: [
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 120, goals: 27 },
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 95, goals: 18 },
  ],
  12: [
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', matchesPlayed: 130, goals: 24 },
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2015-07-01', endDate: '2018-06-30', matchesPlayed: 100, goals: 17 },
  ],
  1: [
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', matchesPlayed: 110, goals: 25 },
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2014-07-01', endDate: '2017-06-30', matchesPlayed: 80, goals: 15 },
  ],
  2: [
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 100, goals: 30 },
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 80, goals: 20 },
  ],
  4: [
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 115, goals: 28 },
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 85, goals: 18 },
  ],
  5: [
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 35 },
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', endDate: '2021-06-30', matchesPlayed: 85, goals: 22 },
  ],
  6: [
    { team: { id: 2, name: 'Inter Movistar', shortName: 'INT', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', matchesPlayed: 120, goals: 40 },
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2012-07-01', endDate: '2016-06-30', matchesPlayed: 100, goals: 30 },
  ],
  9: [
    { team: { id: 2, name: 'Inter Movistar', shortName: 'INT', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 110, goals: 30 },
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 80, goals: 18 },
  ],
  10: [
    { team: { id: 2, name: 'Inter Movistar', shortName: 'INT', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 22 },
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', endDate: '2021-06-30', matchesPlayed: 85, goals: 15 },
  ],
  11: [
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', matchesPlayed: 120, goals: 20 },
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2014-07-01', endDate: '2017-06-30', matchesPlayed: 80, goals: 12 },
  ],
  14: [
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 115, goals: 32 },
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 85, goals: 20 },
  ],
  15: [
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 28 },
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', endDate: '2021-06-30', matchesPlayed: 80, goals: 18 },
  ],
  16: [
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', matchesPlayed: 120, goals: 22 },
    { team: { id: 2, name: 'Inter Movistar', shortName: 'INT', badgeUrl: '', country: 'España' }, startDate: '2013-07-01', endDate: '2016-06-30', matchesPlayed: 80, goals: 10 },
  ],
  19: [
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 110, goals: 30 },
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 85, goals: 18 },
  ],
  20: [
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 25 },
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', endDate: '2021-06-30', matchesPlayed: 80, goals: 15 },
  ],
  21: [
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', matchesPlayed: 120, goals: 35 },
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2015-07-01', endDate: '2018-06-30', matchesPlayed: 80, goals: 20 },
  ],
  22: [
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 105, goals: 22 },
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 80, goals: 15 },
  ],
  24: [
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 110, goals: 30 },
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 85, goals: 18 },
  ],
  25: [
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 28 },
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', endDate: '2021-06-30', matchesPlayed: 65, goals: 12 },
  ],
  26: [
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', matchesPlayed: 115, goals: 25 },
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2014-07-01', endDate: '2017-06-30', matchesPlayed: 85, goals: 15 },
  ],
  27: [
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 100, goals: 22 },
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 85, goals: 18 },
  ],
  29: [
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 105, goals: 30 },
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 80, goals: 20 },
  ],
  30: [
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 25 },
    { team: { id: 2, name: 'Inter Movistar', shortName: 'INT', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', endDate: '2021-06-30', matchesPlayed: 65, goals: 12 },
  ],
  31: [
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', matchesPlayed: 120, goals: 35 },
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2013-07-01', endDate: '2016-06-30', matchesPlayed: 80, goals: 18 },
  ],
  32: [
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2018-07-01', matchesPlayed: 110, goals: 28 },
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2015-07-01', endDate: '2018-06-30', matchesPlayed: 85, goals: 15 },
  ],
  34: [
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 105, goals: 30 },
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 80, goals: 18 },
  ],
  35: [
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 22 },
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', endDate: '2021-06-30', matchesPlayed: 65, goals: 12 },
  ],
  36: [
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', matchesPlayed: 115, goals: 32 },
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2014-07-01', endDate: '2017-06-30', matchesPlayed: 85, goals: 18 },
  ],
  39: [
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 105, goals: 28 },
    { team: { id: 6, name: 'Córdoba Patrimonio de la Humanidad', shortName: 'COR', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 80, goals: 15 },
  ],
  40: [
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 25 },
    { team: { id: 3, name: 'ElPozo Murcia', shortName: 'ELP', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', endDate: '2021-06-30', matchesPlayed: 65, goals: 12 },
  ],
  41: [
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', matchesPlayed: 120, goals: 30 },
    { team: { id: 2, name: 'Inter Movistar', shortName: 'INT', badgeUrl: '', country: 'España' }, startDate: '2013-07-01', endDate: '2016-06-30', matchesPlayed: 80, goals: 15 },
  ],
  44: [
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 110, goals: 32 },
    { team: { id: 5, name: 'Jaén Paraíso Interior', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 85, goals: 18 },
  ],
  45: [
    { team: { id: 9, name: 'Ribera Navarra', shortName: 'RIB', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 22 },
    { team: { id: 8, name: 'Manzanares FS', shortName: 'MAN', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', endDate: '2021-06-30', matchesPlayed: 65, goals: 12 },
  ],
  46: [
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', matchesPlayed: 115, goals: 35 },
    { team: { id: 4, name: 'Palma Futsal', shortName: 'PAL', badgeUrl: '', country: 'España' }, startDate: '2014-07-01', endDate: '2017-06-30', matchesPlayed: 80, goals: 18 },
  ],
  47: [
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', matchesPlayed: 105, goals: 25 },
    { team: { id: 1, name: 'Barça', shortName: 'BAR', badgeUrl: '', country: 'España' }, startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 85, goals: 15 },
  ],
  49: [
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2020-07-01', matchesPlayed: 110, goals: 30 },
    { team: { id: 2, name: 'Inter Movistar', shortName: 'INT', badgeUrl: '', country: 'España' }, startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 85, goals: 18 },
  ],
  50: [
    { team: { id: 10, name: 'Jaén FS', shortName: 'JAE', badgeUrl: '', country: 'España' }, startDate: '2021-07-01', matchesPlayed: 100, goals: 25 },
    { team: { id: 7, name: 'Jimbee Cartagena', shortName: 'CAR', badgeUrl: '', country: 'España' }, startDate: '2019-07-01', endDate: '2021-06-30', matchesPlayed: 65, goals: 12 },
  ],
};
