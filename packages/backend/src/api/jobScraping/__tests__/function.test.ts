import { describe, it } from 'vitest';

import { filterLanguagesAndFrameworks } from '../scraping';

describe('filter languages and frameworks', () => {
  it('should return c++', () => {
    const paragraph = 'I use  C++  ';
    const result = filterLanguagesAndFrameworks(paragraph);

    expect(result).toEqual({
      frameworks: [],
      languages: ['C++'],
    });
  });
  it('should return C++, Objective-C and C#', () => {
    const paragraph = 'I use  C# C#, Objective-C as well as C++ ';
    const result = filterLanguagesAndFrameworks(paragraph);

    expect(result).toEqual({
      frameworks: [],
      languages: ['C#', 'Objective-C', 'C++'],
    });
  });
  it('should return empty arrays for empty paragraph', () => {
    const paragraph = '';
    const result = filterLanguagesAndFrameworks(paragraph);
    expect(result.languages).toEqual([]);
    expect(result.frameworks).toEqual([]);
  });

  it('should return empty arrays for paragraph with no languages or frameworks', () => {
    const paragraph = 'Hello World!';
    const result = filterLanguagesAndFrameworks(paragraph);
    expect(result.languages).toEqual([]);
    expect(result.frameworks).toEqual([]);
  });

  it('should return single language', () => {
    const paragraph = 'I know JavaScript.';
    const result = filterLanguagesAndFrameworks(paragraph);
    expect(result.languages).toEqual(['JavaScript']);
    expect(result.frameworks).toEqual([]);
  });

  it('should return multiple languages', () => {
    const paragraph = 'I know JavaScript, Python, and Ruby.';
    const result = filterLanguagesAndFrameworks(paragraph);
    expect(result.languages).toEqual(['JavaScript', 'Python', 'Ruby']);
    expect(result.frameworks).toEqual([]);
  });

  it('should return single framework', () => {
    const paragraph = 'I use React.';
    const result = filterLanguagesAndFrameworks(paragraph);
    expect(result.languages).toEqual([]);
    expect(result.frameworks).toEqual(['React']);
  });

  it('should return multiple frameworks', () => {
    const paragraph = 'I use React, Angular, and Vue.js.';
    const result = filterLanguagesAndFrameworks(paragraph);
    expect(result.languages).toEqual([]);
    expect(result.frameworks).toEqual(['React', 'Angular', 'Vue.js']);
  });

  it('should return both languages and frameworks', () => {
    const paragraph = 'I know JavaScript and use React.';
    const result = filterLanguagesAndFrameworks(paragraph);
    expect(result.languages).toEqual(['JavaScript']);
    expect(result.frameworks).toEqual(['React']);
  });

  it('should return languages and frameworks with special characters', () => {
    const paragraph = 'I know C++ and use .NET Core.';
    const result = filterLanguagesAndFrameworks(paragraph);
    expect(result.languages).toEqual(['C++']);
    expect(result.frameworks).toEqual(['.NET Core']);
  });
});
