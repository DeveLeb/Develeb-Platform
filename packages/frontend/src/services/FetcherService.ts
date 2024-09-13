// Define a generic interface for HTTP options
interface FetcherOptions extends RequestInit {
  headers?: Record<string, string>;
}

export class FetcherService {
  baseUrl: string | undefined;
  constructor(baseUrl: string | undefined) {
    this.baseUrl = baseUrl || 'http://127.0.0.1:3000';
  }

  handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
  };

  async get<T>(url: string, options: FetcherOptions = {}, baseUrl = this.baseUrl): Promise<T> {
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data: unknown, options: FetcherOptions = {}, baseUrl = this.baseUrl): Promise<T> {
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, data: unknown, options: FetcherOptions = {}, baseUrl = this.baseUrl): Promise<T> {
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, options: FetcherOptions = {}, baseUrl = this.baseUrl): Promise<T> {
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return this.handleResponse<T>(response);
  }
}
