
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { sendMessage } from './chatService';

const server = setupServer(
  http.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', () => {
    return HttpResponse.json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'Hello! How can I help you today?',
              },
            ],
          },
        },
      ],
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('sendMessage', () => {
  it('should return a message from the Gemini API on successful request', async () => {
    const messages = [{ role: 'user' as const, parts: [{ text: 'Hello' }] }];
    const response = await sendMessage(messages);
    expect(response).toBe('Hello! How can I help you today?');
  });

  it('should return a default message when the API response is empty', async () => {
    server.use(
      http.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', () => {
        return HttpResponse.json({ candidates: [] });
      })
    );

    const messages = [{ role: 'user' as const, parts: [{ text: 'Hello' }] }];
    const response = await sendMessage(messages);
    expect(response).toBe("I didn't get a response. Could you try again?");
  });

  it('should return an error message when the API request fails', async () => {
    server.use(
      http.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const messages = [{ role: 'user' as const, parts: [{ text: 'Hello' }] }];
    const response = await sendMessage(messages);
    expect(response).toBe("Sorry — I'm having trouble right now. Please try again later.");
  });
});
