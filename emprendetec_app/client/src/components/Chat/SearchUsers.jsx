import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SearchUsers({ handleSearch }) {
  return (
    <div className="mx-3 my-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="h-5 w-5 text-gray-500 "
            aria-hidden="true"
          />
        </div>
        <input
          id="search"
          name="search"
          className="focus:ring-sky-500 focus:border-sky-500 block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm text-gray-900 focus:outline-none "
          placeholder="Buscar..."
          type="search"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
