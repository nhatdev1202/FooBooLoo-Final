import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock POST /api/games (Create Game)
        mockedAxios.post.mockImplementation((url) => {
            if (url === 'http://localhost:7124/api/games') {
                return Promise.resolve({
                    data: {
                        id: 1,
                        name: 'FooBooLoo',
                            author: 'Alex',
                            rules: [
                                { divisor: 3, replacement: 'Foo' },
                                { divisor: 5, replacement: 'Boo' },
                                { divisor: 7, replacement: 'Loo' },
                            ], 
                    },
                });
            }
            if (url.startsWith('http://localhost:7124/api/play/12345/answer')) {
                return Promise.resolve({ data: { isCorrect: true } });
            }
            return Promise.reject(new Error(`Unhandled POST request to ${url}`));
        });

        // Mock GET /api/games
        mockedAxios.get.mockImplementation((url) => {
            if (url === 'http://localhost:7124/api/games') {
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            name: 'FooBooLoo',
                            author: 'Alex',
                            rules: [
                                { divisor: 3, replacement: 'Foo' },
                                { divisor: 5, replacement: 'Boo' },
                                { divisor: 7, replacement: 'Loo' },
                            ],
                        },
                    ],
                });
            }
            if (url === 'http://localhost:7124/api/play/1/start') {
                return Promise.resolve({ data: { sessionId: '12345' } });
            }
            if (url === 'http://localhost:7124/api/play/12345/next') {
                return Promise.resolve({ data: { number: 7 } }); // Expect "Loo"
            }
            return Promise.reject(new Error(`Unhandled GET request to ${url}`));
        });

        // Mock DELETE /api/games/1 (Delete Game)
        mockedAxios.delete.mockImplementation((url) => {
            if (url === 'http://localhost:7124/api/games/1') {
                return Promise.resolve();
            }
            return Promise.reject(new Error(`Unhandled DELETE request to ${url}`));
        });
    });

    test('renders the game creation form', () => {
        render(<App />);
        expect(screen.getByPlaceholderText('Game Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Author')).toBeInTheDocument();
    });

    test('fetches and displays games on load', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('FooBooLoo')).toBeInTheDocument();
        });
    });

    test('creates a new game', async () => {
        render(<App />);

        fireEvent.change(screen.getByPlaceholderText('Game Name'), { target: { value: 'FooBooLoo' } });
        fireEvent.change(screen.getByPlaceholderText('Author'), { target: { value: 'Alex' } });

        fireEvent.change(screen.getAllByPlaceholderText('Divisor')[0], { target: { value: '3' } });
        fireEvent.change(screen.getAllByPlaceholderText('Divisor')[1], { target: { value: '5' } });
        fireEvent.change(screen.getAllByPlaceholderText('Divisor')[2], { target: { value: '7' } });

        fireEvent.change(screen.getAllByPlaceholderText('Replacement')[0], { target: { value: 'Foo' } });
        fireEvent.change(screen.getAllByPlaceholderText('Replacement')[1], { target: { value: 'Boo' } });
        fireEvent.change(screen.getAllByPlaceholderText('Replacement')[2], { target: { value: 'Loo' } });

        fireEvent.click(screen.getByText('Create Game'));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:7124/api/games',
                expect.objectContaining({
                    name: 'FooBooLoo',
                    author: 'Alex',
                    rules: [
                        { divisor: 3, replacement: 'Foo' },
                        { divisor: 5, replacement: 'Boo' },
                        { divisor: 7, replacement: 'Loo' },
                    ],
                })
            );
        });
    });

    test('starts a game and displays the number', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('FooBooLoo')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('FooBooLoo'));

        await waitFor(() => {
            expect(screen.getByText('Number: 7')).toBeInTheDocument();
        });
    });

    test('submits an answer and updates the score', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('FooBooLoo')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('FooBooLoo'));

        await waitFor(() => {
            expect(screen.getByText('Number: 7')).toBeInTheDocument();
        });

        // Submit the correct answer "Loo" (since 7 maps to Loo in the rules)
        fireEvent.click(screen.getByText('Loo'));

        // Expect correct count to increment
        await waitFor(() => {
            expect(screen.getByText('Correct: 1')).toBeInTheDocument();
        });
    });

    test('deletes a game', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('FooBooLoo')).toBeInTheDocument();
        });

        const deleteButton = screen.getAllByText('Delete')[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:7124/api/games/1');
        });
    });
});
