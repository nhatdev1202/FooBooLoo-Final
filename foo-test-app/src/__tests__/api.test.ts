import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  fetchGames,
  createGame,
  startGame,
  getNextNumber,
  submitAnswer,
  deleteGame,
} from "./api";

const mock = new MockAdapter(axios);
const API_BASE_URL = "http://localhost:7124/api"; // Match local dev URL

describe("API Functions", () => {
  afterEach(() => {
    mock.reset();
  });

  test("fetchGames should return games", async () => {
    const mockData = [{ id: 1, name: "Test Game", author: "Alice", rules: [] }];
    mock.onGet(`${API_BASE_URL}/games`).reply(200, mockData);

    const data = await fetchGames();
    expect(data).toEqual(mockData);
  });

  test("createGame should create a game", async () => {
    const newGame = { name: "FooBooLoo", author: "Bob", rules: [] };
    mock.onPost(`${API_BASE_URL}/games`).reply(201, newGame);

    const data = await createGame(newGame);
    expect(data).toEqual(newGame);
  });

  test("startGame should return sessionId", async () => {
    mock.onGet(`${API_BASE_URL}/play/1/start`).reply(200, { sessionId: "abc123" });

    const data = await startGame(1);
    expect(data.sessionId).toBe("abc123");
  });

  test("getNextNumber should return next number", async () => {
    mock.onGet(`${API_BASE_URL}/play/abc123/next`).reply(200, { number: 42 });

    const data = await getNextNumber("abc123");
    expect(data.number).toBe(42);
  });

  test("submitAnswer should return if answer is correct", async () => {
    mock
      .onPost(`${API_BASE_URL}/play/abc123/answer`)
      .reply(200, { isCorrect: true });

    const data = await submitAnswer("abc123", 1, 42, "Foo");
    expect(data.isCorrect).toBe(true);
  });

  test("deleteGame should delete game", async () => {
    mock.onDelete(`${API_BASE_URL}/games/1`).reply(200, { success: true });

    const data = await deleteGame(1);
    expect(data.success).toBe(true);
  });
});
