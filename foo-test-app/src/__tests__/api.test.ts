import { fetchGames } from "../../../FooBooLoo-frontend/src/api";
import axios from "axios";
import "dotenv/config";


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchGames', () => {
  it('should fetch and return a list of games', async () => {
    const games = [{ id: 1, name: 'Test Game', author: 'Alice' }];
    mockedAxios.get.mockResolvedValue({ data: games });

    const result = await fetchGames();
    expect(result).toEqual(games);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:7124/api/games');
  });

  it('should throw an error if the API call fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    await expect(fetchGames()).rejects.toThrow('Network Error');
  });
});
