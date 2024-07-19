import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
const locations = ['Near me', 'Remote job', 'Exact location', 'Within 15 km'];

function SearchJobComponent() {
  return (
    <div className="search-container flex mt-5 flex-col sm:flex-row gap-4 sm:gap-0 ">
      <div className="search-job pl-3 flex gap-1 items-center flex-grow border border-gray-300 shadow-bottom-sm rounded sm:rounded-tr-none sm:rounded-br-none">
        <FaSearch />
        <Input
          placeholder="What position are you looking for ?"
          className="rounded placeholder:text-primary/80 focus:outline-none"
        />
      </div>
      <div className="search-location pl-3 flex gap-1 items-center sm:w-[30%] border border-gray-300 shadow-bottom-sm focus:outline-none sm:border-r-0 sm:border-l-0 rounded sm:rounded-none">
        <FaMapMarkerAlt />
        <Input placeholder="Location" className="rounded placeholder:text-primary/80" />
      </div>

      <Button className="rounded sm:rounded-tl-none sm:rounded-bl-none shadow-bottom-sm">Search job</Button>
      {/* <select className="select-location sm:w-[30%] border sm:border-r-0 sm:border-l-0 rounded sm:rounded-none">
        <option value="" disabled selected>
          Location
        </option>
        {locations.map((location: string, i: number) => (
          <option key={i}>{location}</option>
        ))}
      </select> */}
      {/* <button className="search-job-button rounded sm:rounded-tl-none sm:rounded-bl-none">Search job</button> */}
    </div>
  );
}

export default SearchJobComponent;
