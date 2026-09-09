import { CareerEntry } from '../models/player.model';
import { MOCK_TEAMS_UEFA } from './teams-uefa.mock';

const BARCA = MOCK_TEAMS_UEFA[0];
const INTER = MOCK_TEAMS_UEFA[1];
const MAGNUS = MOCK_TEAMS_UEFA[2];
const CASCAVEL = MOCK_TEAMS_UEFA[3];
const ITALSERVICE = MOCK_TEAMS_UEFA[4];
const NAPOLI = MOCK_TEAMS_UEFA[5];

export const MOCK_PLAYER_CAREER_UEFA: Record<number, CareerEntry[]> = {
  // Barça players
  3: [
    { team: BARCA, startDate: '2019-07-01', matchesPlayed: 145, goals: 50 },
    { team: MOCK_TEAMS_UEFA[6], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 115, goals: 39 },
  ],
  4: [
    { team: BARCA, startDate: '2019-07-01', matchesPlayed: 115, goals: 48 },
    { team: MOCK_TEAMS_UEFA[7], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 105, goals: 42 },
  ],
  // Inter players
  6: [
    { team: INTER, startDate: '2019-07-01', matchesPlayed: 145, goals: 50 },
    { team: MOCK_TEAMS_UEFA[8], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 115, goals: 39 },
  ],
  7: [
    { team: INTER, startDate: '2019-07-01', matchesPlayed: 115, goals: 48 },
    { team: MOCK_TEAMS_UEFA[9], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 105, goals: 42 },
  ],
  // Magnus players
  53: [
    { team: MAGNUS, startDate: '2019-07-01', matchesPlayed: 145, goals: 50 },
    { team: MOCK_TEAMS_UEFA[6], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 115, goals: 39 },
  ],
  58: [
    { team: CASCAVEL, startDate: '2019-07-01', matchesPlayed: 115, goals: 48 },
    { team: MOCK_TEAMS_UEFA[7], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 105, goals: 42 },
  ],
  // Italservice players
  103: [
    { team: ITALSERVICE, startDate: '2019-07-01', matchesPlayed: 145, goals: 50 },
    { team: MOCK_TEAMS_UEFA[8], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 115, goals: 39 },
  ],
  108: [
    { team: NAPOLI, startDate: '2019-07-01', matchesPlayed: 115, goals: 48 },
    { team: MOCK_TEAMS_UEFA[9], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 105, goals: 42 },
  ],
  // New European team players
  153: [
    { team: MOCK_TEAMS_UEFA[6], startDate: '2020-07-01', matchesPlayed: 120, goals: 55 },
    { team: MOCK_TEAMS_UEFA[1], startDate: '2017-07-01', endDate: '2020-06-30', matchesPlayed: 110, goals: 50 },
  ],
  157: [
    { team: MOCK_TEAMS_UEFA[7], startDate: '2019-07-01', matchesPlayed: 145, goals: 50 },
    { team: MOCK_TEAMS_UEFA[5], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 115, goals: 39 },
  ],
  161: [
    { team: MOCK_TEAMS_UEFA[8], startDate: '2019-07-01', matchesPlayed: 145, goals: 50 },
    { team: MOCK_TEAMS_UEFA[9], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 110, goals: 33 },
  ],
  165: [
    { team: MOCK_TEAMS_UEFA[9], startDate: '2019-07-01', matchesPlayed: 130, goals: 38 },
    { team: MOCK_TEAMS_UEFA[8], startDate: '2016-07-01', endDate: '2019-06-30', matchesPlayed: 95, goals: 24 },
  ],
};
