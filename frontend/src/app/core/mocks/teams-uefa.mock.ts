import { Team } from '../models/team.model';
import { MOCK_TEAMS } from './teams.mock';
import { MOCK_TEAMS_BRAZIL } from './teams-brazil.mock';
import { MOCK_TEAMS_ITALY } from './teams-italy.mock';

const MOCK_TEAMS_SPAIN_TOP2 = MOCK_TEAMS.slice(0, 2);
const MOCK_TEAMS_BRAZIL_TOP2 = MOCK_TEAMS_BRAZIL.slice(0, 2);
const MOCK_TEAMS_ITALY_TOP2 = MOCK_TEAMS_ITALY.slice(0, 2);

const MOCK_TEAMS_EUROPE_NEW: Team[] = [
  {
    id: 31, name: 'Sporting CP', shortName: 'SCP', badgeUrl: 'assets/teams/sporting.svg', country: 'Portugal',
    league: 'Liga Placard', founded: 1919, venue: 'Estádio José Alvalade',
    coach: 'Nuno Dias', titles: 8, stadiumCapacity: 6000,
  },
  {
    id: 32, name: 'Benfica', shortName: 'BEN', badgeUrl: 'assets/teams/benfica.svg', country: 'Portugal',
    league: 'Liga Placard', founded: 1904, venue: 'Pavilhão da Luz',
    coach: 'Marcos Groller', titles: 5, stadiumCapacity: 5000,
  },
  {
    id: 33, name: 'Kairat Almaty', shortName: 'KAI', badgeUrl: 'assets/teams/kairat.svg', country: 'Kazajistán',
    league: 'Kazakhstan Premier League', founded: 2002, venue: 'Baltic Arena',
    coach: 'Cacau', titles: 7, stadiumCapacity: 3000,
  },
  {
    id: 34, name: 'Tyumen', shortName: 'TYU', badgeUrl: 'assets/teams/tyumen.svg', country: 'Rusia',
    league: 'Russian Futsal Super League', founded: 2003, venue: 'Gavin Arena',
    coach: 'Sergio Sapo', titles: 1, stadiumCapacity: 2800,
  },
];

export const MOCK_TEAMS_UEFA: Team[] = [
  ...MOCK_TEAMS_SPAIN_TOP2,
  ...MOCK_TEAMS_BRAZIL_TOP2,
  ...MOCK_TEAMS_ITALY_TOP2,
  ...MOCK_TEAMS_EUROPE_NEW,
];
