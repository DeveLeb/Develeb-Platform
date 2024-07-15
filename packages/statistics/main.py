import argparse
import datetime
import json
import os
import re
import sys

title_regex: str = (
    r'(\d\d\/\d\d\/\d\d\d\d), \d+:\d+ [ap]m - \+[\d ]*: '
    + r'👨‍💻\s?(Mid-Senior|Junior|Mid|Senior|Lead)?\s?([\w/ .-]*?)\s?(Engineer|Developer)?\s?(Internship)?\s?(Opportunity)?:'
)

location_regex: str = (
    r'📍 Location: (On-site|Remote|Hybrid)(?:\s?\|\s?Relocation to (.*))?'
)
languages_regex: str = r'🔹 Languages: ([\w., #+]*)'
frameworks_regex: str = r'🔸 Frameworks: ([\w., ]*)'

message_end_regex: str = r'For more jobs and internships opportunities, join \*DeveLeb Community\* using the below link:'


def decode_surrogate_ascii(txt: str) -> str:
    """
    Decode the surrogate ASCII characters to their original form
        https://stackoverflow.com/questions/58949094/converting-surrogate-pairs-to-emoji-python3

    Args:
        txt (str): Text string

    Returns:
        str: Decoded text string
    """

    return txt.encode('utf-16', 'surrogatepass').decode('utf-16')


def is_valid_date(date_text: str) -> bool:
    """
    Check if the date is in the format DD/MM/YYYY

    Args:
        date_text (str): Date string

    Returns:
        bool: True if the date is in the correct format, False otherwise
    """
    try:
        datetime.datetime.strptime(date_text, '%d/%m/%Y')
        return True
    except ValueError:
        return False


def extract_job_opportunity(message: str) -> dict:
    """
    Extract job opportunity details from the message

    Args:
        message (str): Message string

    Returns:
        dict: Dictionary containing the job opportunity details

    Raises:
        ValueError: If the title string is not found
    """
    output = dict()

    title = re.search(title_regex, message)
    location = re.search(location_regex, message)
    languages = re.search(languages_regex, message)
    frameworks = re.search(frameworks_regex, message)

    if title is None:
        raise ValueError('Title string not found')

    output['date'] = title.group(1)
    output['title'] = title.groups()[1:]

    if location:
        output['location'] = location.groups()

    if languages:
        output['languages'] = languages.group(1).split(', ')

    if frameworks:
        output['frameworks'] = frameworks.group(1).split(', ')

    return output


def parse_postings(input_file: str) -> list[str]:
    """
    Parse the chat file and extract job postings

    Args:
        input_file (str): Path to the chat file

    Returns:
        list[str]: List of job postings split by message_end_regex

    Raises:
        FileNotFoundError: If the input file does not exist
    """
    if not os.path.exists(input_file):
        raise FileNotFoundError('File does not exist')

    with open(input_file, 'r') as file:
        chat = (
            file.read().replace(' ', ' ').replace('*Internship*', 'Internship')
        )

    messages = re.split(message_end_regex, chat)
    messages = [
        message for message in messages if '👨‍💻' in message
    ]   # easiest way to filter out old job postings
    return messages


def filter_postings(
    postings: list[dict],
    start_date: datetime.datetime,
    end_date: datetime.datetime,
) -> list[dict]:
    """
    Filter job postings based on the date range

    Args:
        postings (list[dict]): List of job postings
        start (str): Start date in format YYYY-MM-DD
        end (str): End date in format YYYY-MM-DD

    Returns:
        list[dict]: List of job postings within the date range
    """

    filtered_postings = []
    for posting in postings:
        posting_date = datetime.datetime.strptime(posting['date'], '%d/%m/%Y')
        if start_date <= posting_date <= end_date:
            filtered_postings.append(posting)

    return filtered_postings


def tally_languages(postings: list[dict]) -> dict:
    """
    Tally the programming languages used in the job postings

    Args:
        postings (list[dict]): List of job postings

    Returns:
        dict: Dictionary containing the programming languages and their counts
    """
    languages = dict()
    for posting in postings:
        if 'languages' in posting:
            for language in posting['languages']:
                language = language.strip().lower()
                if language is None or len(language) == 0:
                    continue
                languages[language] = languages.get(language, 0) + 1

    return dict(
        sorted(languages.items(), key=lambda item: item[1], reverse=True)
    )


def tally_frameworks(postings: list[dict]) -> dict:
    """
    Tally the programming frameworks used in the job postings

    Args:
        postings (list[dict]): List of job postings

    Returns:
        dict: Dictionary containing the programming frameworks and their counts
    """
    frameworks = dict()
    for posting in postings:
        if 'frameworks' in posting:
            for framework in posting['frameworks']:
                framework = framework.strip().lower()
                if framework is None or len(framework) == 0:
                    continue
                frameworks[framework] = frameworks.get(framework, 0) + 1

    return dict(
        sorted(frameworks.items(), key=lambda item: item[1], reverse=True)
    )


def tally_locations(postings: list[dict]) -> dict:
    """
    Tally the locations of the job postings

    Args:
        postings (list[dict]): List of job postings

    Returns:
        dict: Dictionary containing the locations and their counts
    """
    locations = dict()
    for posting in postings:
        if 'location' in posting:
            if posting['location'][1] is not None:
                # # Flag emoji
                # country_emoji = decode_surrogate_ascii(posting['location'][1])
                # locations[country_emoji] = locations.get(country_emoji, 0) + 1
                locations['Relocation'] = locations.get('Relocation', 0) + 1
            else:
                if (
                    posting['location'][0] is None
                    or len(posting['location'][0]) == 0
                ):
                    continue
                locations[posting['location'][0]] = (
                    locations.get(posting['location'][0], 0) + 1
                )

    return dict(
        sorted(locations.items(), key=lambda item: item[1], reverse=True)
    )


def tally_titles(postings: list[dict]) -> dict:
    """
    Tally the titles of the job postings

    Args:
        postings (list[dict]): List of job postings

    Returns:
        dict: Dictionary containing the titles and their counts
    """
    titles = dict()
    for posting in postings:
        if posting['title'][1] is None or len(posting['title'][1]) == 0:
            continue
        title = posting['title'][1].strip()
        titles[title] = titles.get(title, 0) + 1

    return dict(sorted(titles.items(), key=lambda item: item[1], reverse=True))


def tally_seniority(postings: list[dict]) -> dict:
    """
    Tally the seniority levels of the job postings

    Args:
        postings (list[dict]): List of job postings

    Returns:
        dict: Dictionary containing the seniority levels and their counts
    """
    seniority = dict()
    for posting in postings:
        if posting['title'][3] is not None:
            seniority['Internship'] = seniority.get('Internship', 0) + 1
            continue
        if posting['title'][0] is None:
            continue
        seniority[posting['title'][0]] = (
            seniority.get(posting['title'][0], 0) + 1
        )

    return dict(
        sorted(seniority.items(), key=lambda item: item[1], reverse=True)
    )


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'chat_file_export',
        help='Path to the chat file',
    )
    parser.add_argument(
        '--start',
        help='Start date in format DD/MM/YYYY',
        required=False,
        default='01/01/2020',
    )
    parser.add_argument(
        '--end',
        help='End date in format DD/MM/YYYY',
        required=False,
        default=datetime.datetime.now().strftime('%d/%m/%Y'),
    )
    parser.add_argument(
        '--output',
        help='Output file path',
        required=False,
        default='output.json',
    )
    args = parser.parse_args()

    if not os.path.exists(args.chat_file_export):
        print('File does not exist')
        sys.exit(1)

    if args.start and not is_valid_date(args.start):
        print('Invalid date format for --start')
        sys.exit(1)

    if args.end and not is_valid_date(args.end):
        print('Invalid date format for --end')
        sys.exit(1)

    if args.output and not args.output.endswith('.json'):
        print('Output file should be a json file')
        sys.exit(1)

    messages = parse_postings(args.chat_file_export)

    postings = []
    for message in messages:
        posting = extract_job_opportunity(message)
        postings.append(posting)

    postings = filter_postings(
        postings,
        datetime.datetime.strptime(args.start, '%d/%m/%Y'),
        datetime.datetime.strptime(args.end, '%d/%m/%Y'),
    )

    languages = tally_languages(postings)
    frameworks = tally_frameworks(postings)
    locations = tally_locations(postings)
    titles = tally_titles(postings)
    seniority = tally_seniority(postings)

    output: dict = {
        'programming_languages': {
            'data': languages,
            'count': sum(languages.values()),
        },
        'programming_frameworks': {
            'data': frameworks,
            'count': sum(frameworks.values()),
        },
        'locations': {
            'data': locations,
            'count': sum(locations.values()),
        },
        'titles': {
            'data': titles,
            'count': sum(titles.values()),
        },
        'seniority': {'data': seniority, 'count': sum(seniority.values())},
    }

    with open(args.output, 'w') as file:
        file.write(json.dumps(output, indent=4))

    print(f'Parsed {len(postings)} job postings')
